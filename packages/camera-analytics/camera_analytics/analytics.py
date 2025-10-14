from __future__ import annotations

import json
import time
from collections import defaultdict, deque
from dataclasses import dataclass, field
from pathlib import Path
from typing import Deque, Dict, Iterable, Optional, Tuple

import cv2
import numpy as np

try:
  from insightface.app import FaceAnalysis
except Exception:  # pragma: no cover - handled at runtime
  FaceAnalysis = None

from ultralytics import YOLO

from .config import AnalyticsConfig, EntranceLine, Zone
from .geometry import heatmap_bin, line_side, point_in_polygon
from .metrics import (
  Alert,
  CameraMetrics,
  QueueSnapshot,
  TableSnapshot,
  bucket_for_age,
  default_age_buckets,
)


@dataclass
class TrackedPerson:
  track_id: int
  first_seen: float
  last_seen: float
  bbox_norm: Tuple[float, float, float, float]
  prev_center_norm: Optional[Tuple[float, float]] = None
  center_norm: Tuple[float, float] = (0.0, 0.0)
  counted_in: bool = False
  counted_out: bool = False
  inside: bool = False
  age: Optional[float] = None
  gender: str = "unknown"
  age_history: Deque[float] = field(default_factory=lambda: deque(maxlen=5))
  gender_history: Deque[str] = field(default_factory=lambda: deque(maxlen=6))
  gender_confidence: float = 0.5
  active_zones: Dict[str, float] = field(default_factory=dict)

  def contains_pixel(self, px: float, py: float) -> bool:
    x1, y1, x2, y2 = self.bbox_norm
    return x1 <= px <= x2 and y1 <= py <= y2


class CameraAnalyticsEngine:
  def __init__(
    self,
    config: AnalyticsConfig,
    source: str | int,
    output_path: Path,
    model_path: str = "yolov8n.pt",
    sample_interval: float = 1.0,
    display: bool = False,
  ) -> None:
    self.config = config
    self.source = source
    self.output_path = output_path
    self.sample_interval = sample_interval
    self.display = display

    self.model = YOLO(model_path)
    if FaceAnalysis is not None:
      try:
        self.face_app = FaceAnalysis(name="buffalo_l", providers=["CPUExecutionProvider"])
        self.face_app.prepare(ctx_id=0, det_size=(640, 640))
      except Exception as err:  # pragma: no cover - runtime-only
        print(f"[WARN] InsightFace initialization failed: {err}. Demographics disabled.")
        self.face_app = None
    else:
      self.face_app = None

    self.tracks: Dict[int, TrackedPerson] = {}
    self.people_in = 0
    self.people_out = 0
    self.heatmap = np.zeros(
      (self.config.heatmap.grid_height, self.config.heatmap.grid_width), dtype=np.int32
    )

    # zone stats keyed by zone id
    self.zone_definitions: Dict[str, Zone] = {}
    self.table_ids: Iterable[str] = []
    for table in self.config.tables:
      self.zone_definitions[table.id] = table
    self.table_ids = [table.id for table in self.config.tables]
    if self.config.queue_zone:
      self.zone_definitions[self.config.queue_zone.id] = self.config.queue_zone
      self.queue_id = self.config.queue_zone.id
    else:
      self.queue_id = None

    self.zone_active_members: Dict[str, Dict[int, float]] = defaultdict(dict)
    self.zone_completed_durations: Dict[str, list[float]] = defaultdict(list)

    # Tracking for alerts
    self.previous_people_count = 0
    self.last_crowd_check = time.time()

  def run(self) -> None:
    last_write = 0.0

    results = self.model.track(
      source=self.source,
      stream=True,
      verbose=False,
      classes=[0],
      tracker="bytetrack.yaml",
      persist=True,
    )

    try:
      for result in results:
        frame = result.orig_img
        frame_h, frame_w = frame.shape[:2]
        timestamp = time.time()
        self._update_tracks(result, frame_w, frame_h, timestamp)
        self._update_demographics(frame)

        if self.display:
          annotated = self._draw_overlay(frame.copy(), frame_w, frame_h)
        else:
          annotated = None

        if timestamp - last_write >= self.sample_interval:
          metrics = self._build_metrics()
          self._write_metrics(metrics)
          last_write = timestamp

        if self.display and annotated is not None:
          cv2.imshow("ObservAI Camera Analytics", annotated)
          key = cv2.waitKey(1) & 0xFF
          if key in (ord("q"), 27):
            break
    finally:
      if self.display:
        cv2.destroyAllWindows()

  def _update_tracks(self, result, frame_w: int, frame_h: int, now: float) -> None:
    active_ids = set()
    if result.boxes.id is None:
      return

    boxes = result.boxes.xyxy.cpu().numpy()
    track_ids = result.boxes.id.int().cpu().numpy()

    for track_id, box in zip(track_ids, boxes):
      x1, y1, x2, y2 = box.tolist()
      x1_norm, y1_norm = x1 / frame_w, y1 / frame_h
      x2_norm, y2_norm = x2 / frame_w, y2 / frame_h
      center_norm = ((x1_norm + x2_norm) / 2.0, (y1_norm + y2_norm) / 2.0)
      active_ids.add(int(track_id))

      person = self.tracks.get(int(track_id))
      if not person:
        person = TrackedPerson(
          track_id=int(track_id),
          first_seen=now,
          last_seen=now,
          bbox_norm=(x1_norm, y1_norm, x2_norm, y2_norm),
          center_norm=center_norm,
        )
        self.tracks[int(track_id)] = person
      else:
        person.prev_center_norm = person.center_norm
        person.center_norm = center_norm
        person.bbox_norm = (x1_norm, y1_norm, x2_norm, y2_norm)
        person.last_seen = now

      self._update_inside_state(person, now)
      self._update_zones(person, now)
      self._update_heatmap(person.center_norm)

    self._drop_stale_tracks(active_ids, now)

  def _update_inside_state(self, person: TrackedPerson, now: float) -> None:
    if not self.config.entrance_line:
      person.inside = True
      return

    entrance: EntranceLine = self.config.entrance_line
    side = line_side(person.center_norm, entrance.start, entrance.end)

    if entrance.inside_on in {"top", "above"}:
      inside = side < 0
    elif entrance.inside_on in {"bottom", "below"}:
      inside = side > 0
    elif entrance.inside_on == "left":
      inside = side > 0
    elif entrance.inside_on == "right":
      inside = side < 0
    else:
      inside = side < 0

    previously_inside = person.inside
    person.inside = inside

    if previously_inside != inside and person.prev_center_norm is not None:
      if inside and not person.counted_in:
        self.people_in += 1
        person.counted_in = True
      elif not inside and person.counted_in and not person.counted_out:
        self.people_out += 1
        person.counted_out = True
        self._finalize_active_zones(person, now)

  def _update_zones(self, person: TrackedPerson, now: float) -> None:
    for zone_id, zone in self.zone_definitions.items():
      inside_zone = point_in_polygon(person.center_norm, zone.polygon)
      is_active = zone_id in person.active_zones

      if inside_zone and not is_active:
        person.active_zones[zone_id] = now
        self.zone_active_members[zone_id][person.track_id] = now
      elif not inside_zone and is_active:
        started = person.active_zones.pop(zone_id)
        duration = now - started
        self.zone_completed_durations[zone_id].append(duration)
        self.zone_active_members[zone_id].pop(person.track_id, None)

  def _finalize_active_zones(self, person: TrackedPerson, now: float) -> None:
    for zone_id, entered_at in list(person.active_zones.items()):
      duration = now - entered_at
      self.zone_completed_durations[zone_id].append(duration)
      self.zone_active_members[zone_id].pop(person.track_id, None)
      person.active_zones.pop(zone_id, None)

  def _update_heatmap(self, center_norm: Tuple[float, float]) -> None:
    row, col = heatmap_bin(
      center_norm, self.config.heatmap.grid_width, self.config.heatmap.grid_height
    )
    self.heatmap[row, col] += 1

  def _drop_stale_tracks(self, active_ids: set[int], now: float, ttl: float = 3.0) -> None:
    for track_id in list(self.tracks.keys()):
      person = self.tracks[track_id]
      if track_id in active_ids:
        continue
      if now - person.last_seen > ttl:
        if person.counted_in and not person.counted_out:
          self.people_out += 1
        self._finalize_active_zones(person, now)
        self.tracks.pop(track_id, None)

  def _update_demographics(self, frame: np.ndarray) -> None:
    if self.face_app is None:
      return

    faces = self.face_app.get(frame)
    if not faces:
      return

    for face in faces:
      bbox = face.bbox.astype(float)
      fx1, fy1, fx2, fy2 = bbox.tolist()
      fcx, fcy = (fx1 + fx2) / 2.0, (fy1 + fy2) / 2.0
      best_track: Optional[TrackedPerson] = None
      best_distance = float("inf")

      for person in self.tracks.values():
        x1, y1, x2, y2 = person.bbox_norm
        px1, py1, px2, py2 = (
          x1 * frame.shape[1],
          y1 * frame.shape[0],
          x2 * frame.shape[1],
          y2 * frame.shape[0],
        )
        if px1 <= fcx <= px2 and py1 <= fcy <= py2:
          center_px = (
            person.center_norm[0] * frame.shape[1],
            person.center_norm[1] * frame.shape[0],
          )
          distance = (fcx - center_px[0]) ** 2 + (fcy - center_px[1]) ** 2
          if distance < best_distance:
            best_track = person
            best_distance = distance

      if best_track:
        best_track.age = float(face.age) if face.age is not None else None
        if hasattr(face, "sex") and face.sex is not None:
          # InsightFace may return sex as string ('M'/'F') or float (0.0-1.0)
          sex_value = face.sex
          if isinstance(sex_value, str):
            best_track.gender = "male" if sex_value.upper() in ('M', 'MALE') else "female"
          else:
            # Float value: > 0.5 typically means male
            best_track.gender = "male" if float(sex_value) > 0.5 else "female"
        else:
          best_track.gender = "unknown"

  def _build_metrics(self) -> CameraMetrics:
    metrics = CameraMetrics()
    metrics.people_in = self.people_in
    metrics.people_out = self.people_out
    metrics.current = sum(1 for person in self.tracks.values() if person.inside)

    age_buckets = default_age_buckets()
    gender_counts = {"male": 0, "female": 0, "unknown": 0}
    for person in self.tracks.values():
      if not person.inside:
        continue
      if person.gender in gender_counts:
        gender_counts[person.gender] += 1
      else:
        gender_counts["unknown"] += 1
      bucket = bucket_for_age(person.age)
      if bucket != "unknown":
        age_buckets[bucket] += 1

    metrics.age_buckets = age_buckets
    metrics.gender = gender_counts

    if self.queue_id:
      durations = self.zone_completed_durations[self.queue_id]
      active_count = len(self.zone_active_members[self.queue_id])
      avg_wait = float(np.mean(durations)) if durations else 0.0
      longest = float(np.max(durations)) if durations else 0.0
      metrics.queue = QueueSnapshot(active_count, avg_wait, longest)

    table_snapshots: list[TableSnapshot] = []
    for table in self.config.tables:
      durations = self.zone_completed_durations[table.id]
      active = len(self.zone_active_members[table.id])
      avg = float(np.mean(durations)) if durations else 0.0
      longest = float(np.max(durations)) if durations else 0.0
      table_snapshots.append(
        TableSnapshot(
          id=table.id,
          name=table.name,
          current_occupants=active,
          avg_stay_seconds=avg,
          longest_stay_seconds=longest,
        )
      )
    metrics.tables = table_snapshots
    metrics.heatmap = self.heatmap.astype(int).tolist()

    # Generate alerts
    metrics.alerts = self._generate_alerts(metrics)

    return metrics

  def _generate_alerts(self, metrics: CameraMetrics) -> list[Alert]:
    """Generate alerts based on current metrics and thresholds"""
    alerts: list[Alert] = []
    now = time.time()
    thresholds = self.config.alert_thresholds

    # Check for long queue wait times
    if metrics.queue.average_wait_seconds > thresholds.queue_long_wait:
      alerts.append(
        Alert(
          type="long_queue",
          severity="high" if metrics.queue.average_wait_seconds > 300 else "medium",
          message=f"Queue wait time is {int(metrics.queue.average_wait_seconds)}s (avg). Consider adding staff.",
          metadata={
            "averageWaitSeconds": round(metrics.queue.average_wait_seconds, 1),
            "queueCount": metrics.queue.current,
          },
        )
      )

    # Check for high queue count
    if metrics.queue.current >= thresholds.queue_high_count:
      alerts.append(
        Alert(
          type="long_queue",
          severity="high" if metrics.queue.current >= 12 else "medium",
          message=f"Queue has {metrics.queue.current} people waiting. Immediate attention needed.",
          metadata={"queueCount": metrics.queue.current},
        )
      )

    # Check for crowd surge (sudden increase in people count)
    if now - self.last_crowd_check >= thresholds.crowd_surge_window:
      people_increase = metrics.current - self.previous_people_count
      if people_increase >= thresholds.crowd_surge_threshold:
        alerts.append(
          Alert(
            type="crowd_surge",
            severity="medium",
            message=f"Sudden crowd increase detected: {people_increase} new customers in {int(thresholds.crowd_surge_window)}s.",
            metadata={
              "increase": people_increase,
              "currentCount": metrics.current,
              "previousCount": self.previous_people_count,
            },
          )
        )
      self.previous_people_count = metrics.current
      self.last_crowd_check = now

    # Check for tables with long occupancy times
    for table in metrics.tables:
      if table.longest_stay_seconds > thresholds.table_long_stay:
        alerts.append(
          Alert(
            type="long_table_occupancy",
            severity="low",
            message=f"Table '{table.name or table.id}' has been occupied for {int(table.longest_stay_seconds / 60)}+ minutes.",
            metadata={
              "tableId": table.id,
              "tableName": table.name,
              "longestStaySeconds": round(table.longest_stay_seconds, 1),
            },
          )
        )

    return alerts

  def _write_metrics(self, metrics: CameraMetrics) -> None:
    self.output_path.parent.mkdir(parents=True, exist_ok=True)
    with self.output_path.open("w", encoding="utf-8") as handle:
      json.dump(metrics.to_dict(), handle, indent=2)

  def _draw_overlay(self, frame: np.ndarray, frame_w: int, frame_h: int) -> np.ndarray:
    """Modern, high-quality overlay with glassmorphism UI"""
    overlay = frame.copy()

    # Draw zones with semi-transparent fill
    for zone in self.zone_definitions.values():
      polygon = [(int(x * frame_w), int(y * frame_h)) for x, y in zone.polygon]
      pts = np.array(polygon, np.int32).reshape((-1, 1, 2))

      # Fill zone with transparent color
      zone_overlay = overlay.copy()
      cv2.fillPoly(zone_overlay, [pts], (100, 50, 200))
      cv2.addWeighted(overlay, 0.9, zone_overlay, 0.1, 0, overlay)

      # Border with glow effect
      cv2.polylines(overlay, [pts], True, (150, 100, 255), 3, cv2.LINE_AA)

      # Zone label with background
      label = zone.name or zone.id
      (text_w, text_h), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_DUPLEX, 0.6, 2)
      label_pos = (polygon[0][0], polygon[0][1] - 10)
      cv2.rectangle(overlay,
                   (label_pos[0] - 5, label_pos[1] - text_h - 5),
                   (label_pos[0] + text_w + 5, label_pos[1] + 5),
                   (40, 40, 60), -1)
      cv2.putText(overlay, label, label_pos, cv2.FONT_HERSHEY_DUPLEX, 0.6, (200, 150, 255), 2, cv2.LINE_AA)

    # Draw entrance line with glow
    if self.config.entrance_line:
      line = self.config.entrance_line
      start = (int(line.start[0] * frame_w), int(line.start[1] * frame_h))
      end = (int(line.end[0] * frame_w), int(line.end[1] * frame_h))

      # Glow effect
      cv2.line(overlay, start, end, (80, 255, 255), 8, cv2.LINE_AA)
      cv2.line(overlay, start, end, (0, 240, 240), 4, cv2.LINE_AA)

      # Label with background
      (text_w, text_h), _ = cv2.getTextSize("ENTRANCE", cv2.FONT_HERSHEY_DUPLEX, 0.7, 2)
      text_pos = (start[0], start[1] - 15)
      cv2.rectangle(overlay,
                   (text_pos[0] - 5, text_pos[1] - text_h - 5),
                   (text_pos[0] + text_w + 5, text_pos[1] + 5),
                   (40, 60, 60), -1)
      cv2.putText(overlay, "ENTRANCE", text_pos, cv2.FONT_HERSHEY_DUPLEX, 0.7, (0, 255, 255), 2, cv2.LINE_AA)

    # Draw tracked people with modern boxes
    for person in self.tracks.values():
      x1, y1, x2, y2 = person.bbox_norm
      p1 = (int(x1 * frame_w), int(y1 * frame_h))
      p2 = (int(x2 * frame_w), int(y2 * frame_h))

      # Color based on status
      if person.inside:
        box_color = (0, 255, 150)  # Cyan-green for inside
        text_color = (0, 255, 200)
      else:
        box_color = (100, 100, 255)  # Red-ish for outside
        text_color = (150, 150, 255)

      # Draw rounded rectangle effect with corners
      thickness = 3
      corner_length = 20

      # Top-left corner
      cv2.line(overlay, p1, (p1[0] + corner_length, p1[1]), box_color, thickness, cv2.LINE_AA)
      cv2.line(overlay, p1, (p1[0], p1[1] + corner_length), box_color, thickness, cv2.LINE_AA)

      # Top-right corner
      cv2.line(overlay, (p2[0], p1[1]), (p2[0] - corner_length, p1[1]), box_color, thickness, cv2.LINE_AA)
      cv2.line(overlay, (p2[0], p1[1]), (p2[0], p1[1] + corner_length), box_color, thickness, cv2.LINE_AA)

      # Bottom-left corner
      cv2.line(overlay, (p1[0], p2[1]), (p1[0] + corner_length, p2[1]), box_color, thickness, cv2.LINE_AA)
      cv2.line(overlay, (p1[0], p2[1]), (p1[0], p2[1] - corner_length), box_color, thickness, cv2.LINE_AA)

      # Bottom-right corner
      cv2.line(overlay, p2, (p2[0] - corner_length, p2[1]), box_color, thickness, cv2.LINE_AA)
      cv2.line(overlay, p2, (p2[0], p2[1] - corner_length), box_color, thickness, cv2.LINE_AA)

      # Person info
      info_parts = [f"ID:{person.track_id}"]
      if person.age:
        info_parts.append(f"{int(person.age)}y")
      if person.gender != "unknown":
        info_parts.append(f"{person.gender[0].upper()}")

      label = " | ".join(info_parts)
      (text_w, text_h), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_DUPLEX, 0.5, 1)

      # Label background with glassmorphism
      label_bg_p1 = (p1[0], max(5, p1[1] - text_h - 15))
      label_bg_p2 = (p1[0] + text_w + 10, max(text_h + 10, p1[1] - 5))
      cv2.rectangle(overlay, label_bg_p1, label_bg_p2, (30, 30, 40), -1)
      cv2.rectangle(overlay, label_bg_p1, label_bg_p2, box_color, 2, cv2.LINE_AA)
      cv2.putText(overlay, label, (p1[0] + 5, max(text_h + 5, p1[1] - 10)),
                 cv2.FONT_HERSHEY_DUPLEX, 0.5, text_color, 1, cv2.LINE_AA)

    # Modern stats panel (top-left)
    metrics = self._build_metrics()
    panel_x, panel_y = 20, 20
    panel_w, panel_h = 280, 150

    # Glassmorphism background
    stats_overlay = overlay.copy()
    cv2.rectangle(stats_overlay, (panel_x, panel_y), (panel_x + panel_w, panel_y + panel_h),
                 (30, 30, 40), -1)
    cv2.addWeighted(overlay, 0.4, stats_overlay, 0.6, 0, overlay)

    # Border with gradient effect
    cv2.rectangle(overlay, (panel_x, panel_y), (panel_x + panel_w, panel_y + panel_h),
                 (100, 200, 255), 3, cv2.LINE_AA)

    # Title
    cv2.putText(overlay, "ObservAI Analytics", (panel_x + 10, panel_y + 30),
               cv2.FONT_HERSHEY_DUPLEX, 0.7, (150, 220, 255), 2, cv2.LINE_AA)

    # Stats with icons (using text symbols)
    stats = [
      (f"↓ In: {metrics.people_in}", (0, 255, 150)),
      (f"↑ Out: {metrics.people_out}", (255, 100, 100)),
      (f"● Current: {metrics.current}", (0, 200, 255)),
      (f"⏱ Queue: {metrics.queue.current}", (255, 200, 0))
    ]

    for idx, (stat_text, color) in enumerate(stats):
      y_pos = panel_y + 60 + idx * 22
      cv2.putText(overlay, stat_text, (panel_x + 15, y_pos),
                 cv2.FONT_HERSHEY_DUPLEX, 0.6, color, 2, cv2.LINE_AA)

    return overlay

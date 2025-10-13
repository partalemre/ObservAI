from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Dict, List, Optional


def default_age_buckets() -> Dict[str, int]:
  return {"0-17": 0, "18-25": 0, "26-35": 0, "36-50": 0, "50+": 0}


@dataclass
class Alert:
  """Represents an alert for abnormal conditions"""
  type: str  # "long_queue", "crowd_surge", "low_inventory", "long_table_occupancy"
  severity: str  # "low", "medium", "high"
  message: str
  timestamp: str = field(default_factory=lambda: datetime.utcnow().isoformat())
  metadata: Dict[str, object] = field(default_factory=dict)


def bucket_for_age(age: Optional[float]) -> str:
  if age is None:
    return "unknown"
  age_val = float(age)
  if age_val < 18:
    return "0-17"
  if age_val < 26:
    return "18-25"
  if age_val < 36:
    return "26-35"
  if age_val < 51:
    return "36-50"
  return "50+"


@dataclass
class TableSnapshot:
  id: str
  name: Optional[str]
  current_occupants: int
  avg_stay_seconds: float
  longest_stay_seconds: float


@dataclass
class QueueSnapshot:
  current: int
  average_wait_seconds: float
  longest_wait_seconds: float


@dataclass
class CameraMetrics:
  people_in: int = 0
  people_out: int = 0
  current: int = 0
  age_buckets: Dict[str, int] = field(default_factory=default_age_buckets)
  gender: Dict[str, int] = field(default_factory=lambda: {"male": 0, "female": 0, "unknown": 0})
  queue: QueueSnapshot = field(default_factory=lambda: QueueSnapshot(0, 0.0, 0.0))
  tables: List[TableSnapshot] = field(default_factory=list)
  heatmap: List[List[int]] = field(default_factory=list)
  alerts: List[Alert] = field(default_factory=list)
  ts: str = field(default_factory=lambda: datetime.utcnow().isoformat())

  def to_dict(self) -> Dict[str, object]:
    return {
      "ts": self.ts,
      "peopleIn": self.people_in,
      "peopleOut": self.people_out,
      "current": self.current,
      "ageBuckets": self.age_buckets,
      "gender": self.gender,
      "queue": {
        "current": self.queue.current,
        "averageWaitSeconds": round(self.queue.average_wait_seconds, 1),
        "longestWaitSeconds": round(self.queue.longest_wait_seconds, 1),
      },
      "tables": [
        {
          "id": table.id,
          "name": table.name,
          "currentOccupants": table.current_occupants,
          "avgStaySeconds": round(table.avg_stay_seconds, 1),
          "longestStaySeconds": round(table.longest_stay_seconds, 1),
        }
        for table in self.tables
      ],
      "heatmap": self.heatmap,
      "alerts": [
        {
          "type": alert.type,
          "severity": alert.severity,
          "message": alert.message,
          "timestamp": alert.timestamp,
          "metadata": alert.metadata,
        }
        for alert in self.alerts
      ],
    }

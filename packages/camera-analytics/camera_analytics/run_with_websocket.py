"""
Camera Analytics with WebSocket Streaming
Runs camera analytics and streams data to WebSocket clients
"""

from __future__ import annotations

import asyncio
import argparse
import json
from pathlib import Path
from typing import Optional

from .analytics import CameraAnalyticsEngine
from .config import load_config
from .websocket_server import AnalyticsWebSocketServer
from .run import get_live_stream_url


class CameraAnalyticsWithWebSocket:
    """Camera analytics engine with WebSocket streaming"""

    def __init__(
        self,
        config_path: Path,
        source: str | int,
        model_path: str = "yolov8n.pt",
        display: bool = False,
        ws_host: str = "0.0.0.0",
        ws_port: int = 5000,
    ):
        self.config = load_config(config_path)
        self.source = source
        self.model_path = model_path
        self.display = display

        # WebSocket server
        self.ws_server = AnalyticsWebSocketServer(host=ws_host, port=ws_port)

        # Analytics engine
        self.engine: Optional[CameraAnalyticsEngine] = None

    async def start(self):
        """Start WebSocket server and analytics engine"""
        # Start WebSocket server
        await self.ws_server.start()
        print(f"✓ WebSocket server started on {self.ws_server.host}:{self.ws_server.port}")

        # Start analytics in background
        asyncio.create_task(self.run_analytics())

        # Keep running
        await asyncio.Event().wait()

    async def run_analytics(self):
        """Run analytics engine and stream data"""
        from ultralytics import YOLO
        import cv2
        import time

        model = YOLO(self.model_path)

        # Handle stream URL extraction
        source = self.source
        if isinstance(source, str):
            if any(domain in source for domain in ['youtube.com', 'youtu.be', 'twitch.tv']):
                print(f"🌐 Extracting stream URL from: {source}")
                source = get_live_stream_url(source)

        results = model.track(
            source=source,
            stream=True,
            verbose=False,
            classes=[0],
            tracker="bytetrack.yaml",
            persist=True,
        )

        # Import engine components
        from .analytics import TrackedPerson
        from .metrics import CameraMetrics, bucket_for_age
        from .geometry import heatmap_bin, line_side, point_in_polygon
        import numpy as np
        from collections import defaultdict

        tracks = {}
        people_in = 0
        people_out = 0
        heatmap = np.zeros((20, 20), dtype=np.int32)

        try:
            for result in results:
                frame = result.orig_img
                frame_h, frame_w = frame.shape[:2]
                timestamp = time.time()

                # Update tracks (simplified version)
                active_ids = set()
                if result.boxes.id is not None:
                    boxes = result.boxes.xyxy.cpu().numpy()
                    track_ids = result.boxes.id.int().cpu().numpy()

                    for track_id, box in zip(track_ids, boxes):
                        x1, y1, x2, y2 = box.tolist()
                        x1_norm = x1 / frame_w
                        y1_norm = y1 / frame_h
                        w_norm = (x2 - x1) / frame_w
                        h_norm = (y2 - y1) / frame_h

                        active_ids.add(int(track_id))

                        if int(track_id) not in tracks:
                            tracks[int(track_id)] = {
                                "first_seen": timestamp,
                                "state": "entering",
                            }
                            people_in += 1

                        track = tracks[int(track_id)]
                        dwell = timestamp - track["first_seen"]

                        if dwell > 2 and track["state"] == "entering":
                            track["state"] = "present"

                        # Build track stream data
                        track_data = {
                            "id": f"track_{track_id}",
                            "bbox": [x1_norm, y1_norm, w_norm, h_norm],
                            "gender": "unknown",
                            "ageBucket": "adult",
                            "dwellSec": dwell,
                            "state": track["state"],
                        }

                        # Update heatmap
                        cx = (x1_norm + w_norm / 2) * 20
                        cy = (y1_norm + h_norm / 2) * 20
                        if 0 <= cx < 20 and 0 <= cy < 20:
                            heatmap[int(cy), int(cx)] += 1

                # Remove stale tracks
                for tid in list(tracks.keys()):
                    if tid not in active_ids:
                        if tracks[tid]["state"] != "exiting":
                            people_out += 1
                        del tracks[tid]

                # Build global stream
                current = len([t for t in tracks.values() if t["state"] in ["entering", "present"]])

                global_data = {
                    "timestamp": int(timestamp * 1000),
                    "entries": people_in,
                    "exits": people_out,
                    "current": current,
                    "queue": max(0, current - 5),  # Mock queue
                    "demographics": {
                        "gender": {"male": 0, "female": 0, "unknown": current},
                        "ages": {"child": 0, "young": 0, "adult": current, "mature": 0, "senior": 0},
                    },
                    "heatmap": {
                        "points": [],
                        "gridWidth": 20,
                        "gridHeight": 20,
                    },
                }

                # Broadcast to WebSocket clients
                await self.ws_server.broadcast_global_stream(global_data)

                # Display if needed
                if self.display:
                    cv2.imshow("ObservAI", frame)
                    if cv2.waitKey(1) & 0xFF == ord('q'):
                        break

                await asyncio.sleep(0.01)  # Small delay to prevent blocking

        finally:
            if self.display:
                cv2.destroyAllWindows()


def parse_args():
    parser = argparse.ArgumentParser(description="Camera Analytics with WebSocket")
    parser.add_argument(
        "--source",
        type=str,
        default="0",
        help="Camera index, video file, or live stream URL",
    )
    parser.add_argument(
        "--config",
        type=Path,
        default=Path(__file__).parent.parent / "config" / "default_zones.yaml",
        help="Path to zones configuration",
    )
    parser.add_argument(
        "--model",
        type=str,
        default="yolov8n.pt",
        help="YOLO model checkpoint",
    )
    parser.add_argument(
        "--display",
        action="store_true",
        help="Show annotated video window",
    )
    parser.add_argument(
        "--ws-host",
        type=str,
        default="0.0.0.0",
        help="WebSocket server host",
    )
    parser.add_argument(
        "--ws-port",
        type=int,
        default=5000,
        help="WebSocket server port",
    )
    return parser.parse_args()


async def main():
    args = parse_args()

    # Parse source
    try:
        source = int(args.source)
    except ValueError:
        source = args.source

    app = CameraAnalyticsWithWebSocket(
        config_path=args.config,
        source=source,
        model_path=args.model,
        display=args.display,
        ws_host=args.ws_host,
        ws_port=args.ws_port,
    )

    print("=" * 50)
    print("  ObservAI Camera Analytics + WebSocket")
    print("=" * 50)
    print(f"  Source: {args.source}")
    print(f"  WebSocket: {args.ws_host}:{args.ws_port}")
    print(f"  Display: {args.display}")
    print("=" * 50)
    print()

    await app.start()


if __name__ == "__main__":
    asyncio.run(main())

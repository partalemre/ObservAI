from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from pathlib import Path
import json
import asyncio
from typing import List

app = FastAPI(title="ObservAI Camera Service")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CameraMetrics(BaseModel):
    ts: str
    peopleIn: int
    peopleOut: int
    current: int
    ageBuckets: dict
    gender: dict
    queue: dict
    tables: list
    heatmap: list

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except:
                pass

manager = ConnectionManager()

@app.get("/health")
def health():
    return {"ok": True, "ts": datetime.utcnow().isoformat()}

@app.get("/metrics", response_model=CameraMetrics)
def metrics():
    """Get latest camera metrics from JSON file"""
    metrics_path = Path(__file__).resolve().parents[2] / "data" / "camera" / "latest_metrics.json"

    if metrics_path.exists():
        try:
            with open(metrics_path, "r") as f:
                data = json.load(f)
                return CameraMetrics(**data)
        except Exception as e:
            print(f"Error reading metrics: {e}")

    # Return mock data if file doesn't exist
    return CameraMetrics(
        ts=datetime.utcnow().isoformat(),
        peopleIn=0, peopleOut=0, current=0,
        ageBuckets={"child":0,"teen":0,"adult":0,"senior":0},
        gender={"male":0,"female":0,"unknown":0},
        queue={"current":0,"averageWaitSeconds":0,"longestWaitSeconds":0},
        tables=[],
        heatmap=[]
    )

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time metrics streaming"""
    await manager.connect(websocket)
    metrics_path = Path(__file__).resolve().parents[2] / "data" / "camera" / "latest_metrics.json"
    subscribed_channel = None

    try:
        last_modified = 0
        while True:
            # Check for incoming messages (subscription requests)
            try:
                message = await asyncio.wait_for(websocket.receive_json(), timeout=0.1)
                if message.get('type') == 'subscribe':
                    subscribed_channel = message.get('channel')
                    print(f"Client subscribed to channel: {subscribed_channel}")
                elif message.get('type') == 'ping':
                    await websocket.send_json({"type": "pong"})
            except asyncio.TimeoutError:
                pass
            
            # Send metrics if client is subscribed to camera channel
            if subscribed_channel == 'camera' and metrics_path.exists():
                current_modified = metrics_path.stat().st_mtime
                if current_modified > last_modified:
                    last_modified = current_modified
                    try:
                        with open(metrics_path, "r") as f:
                            raw_data = json.load(f)
                            
                            # Transform data to match frontend format
                            transformed_data = {
                                "current": raw_data.get("current", 0),
                                "entriesHour": raw_data.get("peopleIn", 0),
                                "exitsHour": raw_data.get("peopleOut", 0),
                                "avgDuration": 45,  # Mock for now
                                "heatmap": [],  # Will transform below
                                "gender": raw_data.get("gender", {}),
                                "age": {
                                    "0-18": raw_data.get("ageBuckets", {}).get("child", 0) + raw_data.get("ageBuckets", {}).get("teen", 0),
                                    "19-30": int(raw_data.get("ageBuckets", {}).get("adult", 0) * 0.4),
                                    "31-45": int(raw_data.get("ageBuckets", {}).get("adult", 0) * 0.4),
                                    "46-60": int(raw_data.get("ageBuckets", {}).get("adult", 0) * 0.2),
                                    "60+": raw_data.get("ageBuckets", {}).get("senior", 0),
                                },
                                "timeline": [],  # Mock for now
                                "lastUpdate": raw_data.get("ts", datetime.utcnow().isoformat())
                            }
                            
                            # Transform heatmap to frontend format
                            heatmap_raw = raw_data.get("heatmap", [])
                            zones = ["Giriş", "Kasa", "Sipariş Bankosu", "Oturma Alanı 1", "Oturma Alanı 2", "Bar", "Bahçe", "Tuvalet", "Çıkış"]
                            for y, row in enumerate(heatmap_raw):
                                for x, intensity in enumerate(row):
                                    zone_index = y * len(row) + x
                                    zone_name = zones[zone_index] if zone_index < len(zones) else f"Zone {zone_index}"
                                    transformed_data["heatmap"].append({
                                        "x": x * 100,
                                        "y": y * 100,
                                        "intensity": int(intensity),
                                        "zone": zone_name
                                    })
                            
                            # Send as WebSocket message with proper format
                            message = {
                                "channel": "camera",
                                "data": transformed_data,
                                "timestamp": int(datetime.utcnow().timestamp() * 1000),
                                "type": "data"
                            }
                            await websocket.send_json(message)
                    except Exception as e:
                        print(f"Error streaming metrics: {e}")

            await asyncio.sleep(0.5)  # Check for updates every 500ms

    except WebSocketDisconnect:
        manager.disconnect(websocket)

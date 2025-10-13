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

    try:
        last_modified = 0
        while True:
            if metrics_path.exists():
                current_modified = metrics_path.stat().st_mtime
                if current_modified > last_modified:
                    last_modified = current_modified
                    try:
                        with open(metrics_path, "r") as f:
                            data = json.load(f)
                            await websocket.send_json(data)
                    except Exception as e:
                        print(f"Error streaming metrics: {e}")

            await asyncio.sleep(0.5)  # Check for updates every 500ms

    except WebSocketDisconnect:
        manager.disconnect(websocket)

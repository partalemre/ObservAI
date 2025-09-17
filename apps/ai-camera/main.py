from fastapi import FastAPI
from pydantic import BaseModel
from datetime import datetime

app = FastAPI(title="ObservAI Camera Service")

class CameraMetrics(BaseModel):
    ts: str
    peopleIn: int
    peopleOut: int
    current: int
    ageBuckets: dict
    gender: dict

@app.get("/health")
def health():
    return {"ok": True, "ts": datetime.utcnow().isoformat()}

@app.get("/metrics", response_model=CameraMetrics)
def metrics():
    # TODO: Plug actual frame processing / model inference here
    return CameraMetrics(
        ts=datetime.utcnow().isoformat(),
        peopleIn=120, peopleOut=100, current=20,
        ageBuckets={"0-17":2,"18-25":8,"26-35":5,"36-50":3,"50+":2},
        gender={"male":11,"female":9,"unknown":0}
    )

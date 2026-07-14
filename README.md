# ObservAI

Real-time camera analytics for physical spaces: visitor counting, demographics, zone tracking, and plain-language querying over the collected metrics.

Three services: a Python computer-vision engine, a Node.js API, and a React dashboard.

## What it does

- Person detection and tracking on live video (YOLO11 + OpenCV), accelerated on Apple Silicon (MPS) and NVIDIA GPUs (CUDA), with CPU fallback
- Demographics per visitor: age bracket and gender estimation (InsightFace)
- Zone analytics: draw zones on the camera view, get entries, exits, occupancy, and dwell time per zone
- Privacy mode: face blurring on the stream and SHA-256-hashed person IDs, so cross-session tracking works without storing PII
- Natural-language questions over the last 24 hours of metrics ("what were the busiest hours today?"), answered by a Gemini-backed endpoint
- Reporting: PDF and CSV export, day-over-day and week-over-week comparisons
- JWT auth with role-based access (admin, manager, analyst, viewer)

## Architecture

```
camera / video file
      |
Python engine ............ YOLO11, InsightFace, OpenCV, PyTorch
      |  WebSocket (metrics + annotated frames), optional Kafka
Node.js API ............... Express, Prisma, JWT; SQLite in dev, PostgreSQL in prod
      |  REST + WebSocket
React dashboard ........... Vite, TypeScript, Tailwind, ECharts
```

## Run

Each service has its own README with full setup. Quick start:

```bash
# vision engine
cd packages/camera-analytics
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt

# API (also launches the Python engine)
cd backend
npm install && npm run db:migrate && npm start

# dashboard
cd frontend
npm install && npm run dev
```

Requires Node 18+, Python 3.9+. A Gemini API key (env: `GEMINI_API_KEY`) enables the Q&A endpoint; Kafka is optional and off by default.

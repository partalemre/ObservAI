# ObservAI - AI-Powered Customer Analytics Platform

![ObservAI](https://img.shields.io/badge/ObservAI-v1.0.0-purple)
![License](https://img.shields.io/badge/license-MIT-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)
![React](https://img.shields.io/badge/React-18.3-cyan)
![Python](https://img.shields.io/badge/Python-3.9+-green)

**ObservAI** is a cutting-edge AI-driven analytics system for cafés and restaurants. It combines computer vision, real-time tracking, and modern data visualization to provide actionable insights about customer behavior, demographics, and operational metrics.

## 🎯 Features

### Core Features
- **Real-Time Video Analytics** - Track customers using YOLOv8 + ByteTrack
- **Demographics Detection** - Gender and age estimation using InsightFace
- **Heatmap Visualization** - Customer movement patterns and hotspots
- **Dwell Time Tracking** - Monitor how long customers stay in different zones
- **Queue Management** - Automatic queue detection and wait time alerts
- **Multi-Camera Support** - MacBook camera, iPhone/external camera, YouTube live streams
- **WebSocket Streaming** - Real-time data broadcast to web dashboards

### UI/UX
- **Kibsi-Style Glass UI** - Modern glassmorphism design with backdrop blur
- **PixiJS Overlay** - High-performance GPU-accelerated video overlay
- **Interactive Dashboards** - Beautiful Apache ECharts visualizations
- **GSAP Animations** - Smooth micro-animations and transitions
- **Real-Time KPIs** - Live metrics with sparklines and gauges
- **Responsive Design** - Works on desktop, tablet, and mobile

## 🏗️ Architecture

```
ObservAI/
├── observai/
│   ├── packages/
│   │   └── camera-analytics/          # Python AI backend
│   │       ├── camera_analytics/
│   │       │   ├── analytics.py       # YOLO + tracking
│   │       │   ├── metrics.py         # Data structures
│   │       │   ├── websocket_server.py # Socket.IO server
│   │       │   └── run_with_websocket.py # Main entry
│   │       └── setup.py
│   └── apps/
│       └── web/                       # React frontend
│           ├── src/
│           │   ├── components/
│           │   │   ├── charts/        # ECharts wrappers
│           │   │   ├── panels/        # KPI, Demographics, etc.
│           │   │   └── ui/            # Glass UI components
│           │   ├── lib/
│           │   │   ├── pixi-overlay.ts    # PixiJS renderer
│           │   │   ├── websocket-client.ts # WS client
│           │   │   └── mock-generator.ts   # Demo data
│           │   ├── store/
│           │   │   └── analyticsStore.ts  # Zustand state
│           │   ├── config/
│           │   │   └── theme.ts       # Design system
│           │   └── types/
│           │       └── streams.ts     # TypeScript types
│           └── package.json
├── start_camera_websocket.sh         # Launch script
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and pnpm
- **Python** 3.9+
- **Webcam** or external camera (iPhone via Continuity Camera)
- Optional: **yt-dlp** for YouTube live streams

### 1. Install Dependencies

```bash
# Install Node.js dependencies
cd observai
pnpm install

# Install Python dependencies
cd packages/camera-analytics
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
```

### 2. Start the System

#### Option A: Web Dashboard Only (Demo Mode)

```bash
cd observai/apps/web
pnpm dev
```

Open http://localhost:5173/dashboard

The dashboard will run in **Demo Mode** with simulated data if no camera backend is running.

#### Option B: Full System with Camera

**Terminal 1 - Camera Backend + WebSocket Server:**
```bash
# MacBook camera
./start_camera_websocket.sh 0

# iPhone camera (Continuity Camera)
./start_camera_websocket.sh 1

# YouTube live stream
./start_camera_websocket.sh "https://www.youtube.com/watch?v=VIDEO_ID"
```

**Terminal 2 - Web Frontend:**
```bash
cd observai/apps/web
pnpm dev
```

**Access Points:**
- Dashboard: http://localhost:5173/dashboard
- Overlay: http://localhost:5173/overlay
- WebSocket: ws://localhost:5000

### 3. Using the System

#### Dashboard View (`/dashboard`)
- View all analytics in a clean, modern dashboard
- Real-time KPIs, demographics, timelines, heatmaps
- ECharts visualizations with smooth animations
- Toggle between Live and Demo modes

#### Overlay View (`/overlay`)
- Live video with PixiJS overlay showing tracked people
- Select camera source: MacBook, iPhone, or YouTube
- Real-time track cards with dwell time, gender, age
- Performance HUD showing FPS and latency

## 📊 Data Flow

```
┌──────────────────┐
│  Camera Source   │
│ (MacBook/iPhone/ │
│   YouTube Live)  │
└────────┬─────────┘
         │
         ▼
┌──────────────────────┐
│  YOLOv8 + ByteTrack  │
│  Person Detection    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   InsightFace        │
│   Age/Gender         │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Analytics Engine    │
│  (Python)            │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  WebSocket Server    │
│  (Socket.IO)         │
└──────────┬───────────┘
           │
     ┌─────┴─────┐
     │           │
     ▼           ▼
┌─────────┐ ┌─────────┐
│ Overlay │ │Dashboard│
│  View   │ │  View   │
└─────────┘ └─────────┘
```

## 🎨 Design System

### Kibsi-Inspired Glass UI

ObservAI uses a modern glassmorphism design system:

**Colors:**
- Surface Dark: `#0b0b10`
- Glass: `rgba(20,20,28,0.35)` with `backdrop-filter: blur(22px)`
- Accent Purple: `#7C4DFF`
- Accent Blue: `#4FC3F7`
- Accent Lime: `#D4FB54`
- Accent Orange: `#FFB74D`
- Accent Red: `#FF5252`

**Typography:**
- Font: Inter, Plus Jakarta Sans
- KPI: 30px bold
- Body: 14px
- Labels: 11-12px

**Animations:**
- Scale: 0.96 → 1.0 (350ms cubic-out)
- Opacity: 0 → 1
- GSAP for complex animations
- Framer Motion for React components

## 🔧 Configuration

### Environment Variables

Create `observai/apps/web/.env`:

```env
VITE_WS_URL=http://localhost:5000
VITE_API_URL=http://localhost:3001
VITE_DEMO_MODE=false
```

### Camera Configuration

Edit `observai/packages/camera-analytics/config/default_zones.yaml`:

```yaml
entrance_line:
  start: [0.3, 0.5]
  end: [0.7, 0.5]
  inside_on: "bottom"

queue_zone:
  id: "queue"
  name: "Queue Area"
  polygon:
    - [0.1, 0.3]
    - [0.3, 0.3]
    - [0.3, 0.7]
    - [0.1, 0.7]

tables:
  - id: "table_1"
    name: "Table 1"
    polygon:
      - [0.5, 0.2]
      - [0.7, 0.2]
      - [0.7, 0.4]
      - [0.5, 0.4]
```

## 📦 Component Reference

### React Components

#### Panels
- **LiveKpiPanel** - Shows entries, exits, current, queue with sparkline
- **DemographicsPanel** - Gender and age distribution bars
- **HeatmapPanel** - Canvas-based heatmap with heatmap.js
- **TrackCard** - Micro card for individual tracks
- **ToastContainer** - Event notifications
- **PerformanceHud** - FPS/latency monitoring

#### Charts (ECharts)
- **GaugeChart** - Circular gauge with gradient
- **SparklineChart** - Mini line chart
- **DonutChart** - Pie chart with hole
- **GroupedBarChart** - Multi-series bars
- **HistogramChart** - Distribution with percentiles
- **TimelineChart** - Dual-axis line chart

#### UI
- **GlassCard** - Glassmorphism card wrapper

### Python Modules

- **analytics.py** - Core tracking engine
- **metrics.py** - Data structures (CameraMetrics, TrackStream)
- **geometry.py** - Polygon utils, heatmap binning
- **websocket_server.py** - Socket.IO server
- **run_with_websocket.py** - Main entry point

## 🧪 Testing

```bash
# Frontend tests
cd observai/apps/web
pnpm test

# Python tests
cd observai/packages/camera-analytics
python -m pytest
```

## 🐛 Troubleshooting

### Camera Not Detected
```bash
# List available cameras
ls /dev/video*  # Linux
system_profiler SPCameraDataType  # macOS
```

### WebSocket Connection Failed
- Check that Python backend is running on port 5000
- Verify `.env` file has correct `VITE_WS_URL`
- Check firewall settings

### Poor Performance
- Lower camera resolution in `getUserMedia` constraints
- Reduce `--interval` in Python backend
- Use `yolov8n.pt` (nano) model instead of larger variants

### Demo Mode Won't Disable
- Ensure WebSocket server is running
- Check browser console for connection errors
- Try manual toggle in Live KPI panel

## 📈 Performance Targets

- **FPS:** ≥55 FPS on overlay
- **Latency:** <100ms end-to-end
- **WebSocket:** <50ms broadcast time
- **Heatmap:** Update every 250-500ms
- **Memory:** <500MB for web client

## 🤝 Contributing

This is an academic project for Bilkent University CTIS 411.

**Team 12:**
- Faik Emre Partal
- Halil İbrahim Atalay
- Mevlüt Yılmaz
- Semih Şengül
- Uğur Ayberk Karakış

## 📝 License

MIT License - see LICENSE file

## 🙏 Acknowledgments

- **Ultralytics YOLOv8** - Object detection
- **InsightFace** - Face analysis
- **Apache ECharts** - Data visualization
- **PixiJS** - WebGL rendering
- **GSAP** - Animation engine
- **Kibsi** - Design inspiration

---

**Made with ❤️ by Team 12 at Bilkent University**

# ObservAI Camera Analytics

Python toolchain that powers the real-time camera features defined in the ObservAI initial plan:

- Visitor counting with in/out tracking
- Demographic estimation (age buckets and gender distribution)
- Queue detection with wait time estimates
- Heatmap generation for hot spots inside the venue
- Table zone dwell-time analytics

## Quick start

Create a Python virtual environment, install the package in editable mode, and run the CLI:

```bash
cd packages/camera-analytics
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -e .
python -m camera_analytics.run --source 0 --output ../../data/camera/latest_metrics.json --display
```

See `python -m camera_analytics.run --help` for all options.

# Flipkart Gridlock 2.0 — Implementation Plan

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Dashboard | HTML/CSS/JS + Leaflet + Chart.js |
| API | FastAPI + WebSocket |
| Data Analysis | Streamlit + Pandas |
| ML | LSTM, XGBoost, GNN (see docs/ML_PIPELINE.md) |
| Database | PostgreSQL + PostGIS (schema/init.sql) |

## 11 Modules — Status: Complete

All modules implemented in `index.html` with backend support in `backend/`.

See `docs/ROADMAP.md` for phase breakdown and `docs/DEMO_STRATEGY.md` for hackathon demo script.

## Quick Start

```bat
launch.bat
```

Option 1: Dashboard only | Option 3: API | Option 4: Full stack

# Hackathon Demo Strategy

## Pre-Demo Setup (2 minutes)

1. Open `launch.bat` → Option 1 (HTML Dashboard) for zero-latency demo
2. Optionally start API: `cd backend && uvicorn main:app --port 8000`
3. Full-screen browser (F11), hide bookmarks bar
4. Verify header shows **LIVE AI** and **11 Modules Active**

## Demo Script — RUN FULL DEMO Button

**Duration:** 75 seconds (11 automated steps)

| Step | Time | Action | Panel | What Judges See |
|------|------|--------|-------|-----------------|
| 1 | 0s | Accident injected at Silk Board | Command | CI spikes to 0.97, map glows red |
| 2 | 7s | AI detects incident | Incidents | 96% confidence alert card |
| 3 | 14s | Congestion spread predicted | Predict | 5 zones in 60-min forecast |
| 4 | 21s | Demand forecast curve | Predict | Chart.js prediction curves |
| 5 | 28s | Ambulance request | Emergency | Vehicle selection + route |
| 6 | 35s | Green corridor created | Emergency | Signal overrides, 11 min saved |
| 7 | 42s | Signal optimization | Signals | 6 junctions, animated lights |
| 8 | 49s | Vehicle rerouting | Live Map | CI drops on alternate routes |
| 9 | 56s | Flipkart fleet optimized | Fleet AI | 42→29 min, SLA protected |
| 10 | 63s | Impact analytics | Analytics | CO₂, fuel, economic savings |
| 11 | 70s | Final report | Command | "2,847 vehicle-hours saved" |

## Manual Highlights (if time permits)

### Flipkart Business Value (30 sec)
Navigate to **Fleet AI** → click **Optimize All Routes** → show Before/After card

### Explainable AI (20 sec)
Navigate to **XAI** → point to rerouting reasons with confidence bars

### Architecture (15 sec)
Navigate to **Architecture** → scroll system flow diagram

## Backup Plan

- Dashboard works **fully offline** (no API required)
- If map tiles fail: markers still render on dark background
- If demo interrupted: click Close, re-run — state resets on page refresh

## Key Talking Points

1. **Problem**: Bengaluru loses ₹18L/day in productivity to gridlock
2. **Solution**: 11 integrated AI modules, not siloed tools
3. **Flipkart angle**: 31% delivery time reduction, ₹2.4L fuel/day saved
4. **Differentiator**: Full-stack — sensors → ML → decisions → dashboard
5. **Demo**: One button proves entire system in 75 seconds

## Post-Demo Q&A Prep

| Question | Answer |
|----------|--------|
| Real data? | Trained on 71K hackathon records; demo uses realistic Bengaluru zones |
| Scalability? | Geohash aggregation + WebSocket feed; PostgreSQL schema ready |
| Why Flipkart? | Module 5 is primary — fleet AI with measurable ROI |
| Production timeline? | Phase 4 roadmap: 4–6 weeks with pilot in 1 corridor |

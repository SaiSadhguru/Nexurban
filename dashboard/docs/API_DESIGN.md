# API Design — Flipkart Gridlock 2.0

Base URL: `http://localhost:8000`

## REST Endpoints

### Zones & Predictions

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/zones/live` | All 18 zones with current CI + 15/30/60 min predictions |
| GET | `/api/predict/{geohash}` | Single zone forecast + 60-min curve |

**Response example — Silk Board (`tdr1v9`):**
```json
{
  "zone": {
    "name": "Silk Board Junction",
    "ci": 0.74,
    "pred_15min": 0.81,
    "pred_30min": 0.89,
    "pred_60min": 0.94,
    "confidence": 94.0,
    "trend": "rising",
    "risk_level": "Severe Gridlock"
  },
  "curve": [{"minute": 0, "ci": 0.74}, {"minute": 5, "ci": 0.76}]
}
```

### Incidents

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/incidents/active` | 8 incident types with severity, delay, radius, action |

### Routing & Signals

| Method | Path | Body | Description |
|--------|------|------|-------------|
| POST | `/api/reroute` | `{origin_geohash, dest_geohash}` | Graph-based optimized route |
| POST | `/api/signals/optimize` | `{junction_ids: []}` | Algorithm B signal timing |

### Emergency

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/emergency/corridor` | Green corridor with signal override |

### Flipkart Logistics

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/fleet/status` | Orders in transit, at-risk, efficiency |
| POST | `/api/fleet/optimize` | Batch route optimization |

### Digital Twin & Analytics

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/twin/simulate` | `{scenario: "rain\|accident\|..."}` |
| GET | `/api/analytics/impact?scale=day\|week\|month\|year` | Executive KPIs |

### Demo

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/demo/inject-accident` | Inject Silk Board accident for demo step 1 |

## WebSocket

**Path:** `ws://localhost:8000/ws/live-feed`

**Message (every 3s):**
```json
{
  "type": "zone_update",
  "timestamp": "2026-06-06T10:30:00",
  "zones": [...],
  "alerts": 7,
  "incidents": 8
}
```

## Error Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 404 | Geohash / zone not found |
| 422 | Validation error (Pydantic) |
| 500 | Internal engine error |

## Authentication (Production)

- JWT bearer tokens for write endpoints
- API keys for sensor ingest
- WebSocket session tokens with 24h expiry

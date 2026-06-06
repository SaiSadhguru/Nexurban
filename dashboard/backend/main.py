"""
Flipkart Gridlock 2.0 — REST + WebSocket API
Run: uvicorn main:app --reload --port 8000
"""

import asyncio
import json
from datetime import datetime

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from engines.fleet import FleetEngine
from engines.incidents import IncidentDetectionEngine
from engines.prediction import PredictionEngine
from engines.routing import RoutingEngine
from models import EmergencyCorridorRequest, RerouteRequest, SignalOptimizeRequest, TwinSimulateRequest

app = FastAPI(
    title="Flipkart Gridlock 2.0 API",
    description="Bengaluru City Intelligence — Traffic, Emergency & Logistics AI",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

prediction = PredictionEngine()
incidents = IncidentDetectionEngine()
routing = RoutingEngine()
fleet = FleetEngine()

SCENARIO_IMPACT = {
    "rain": {"travel_increase": "+26 min", "co2": "+190 kg/hr", "zones": 14},
    "accident": {"travel_increase": "+32 min", "co2": "+150 kg/hr", "zones": 12},
    "closure": {"travel_increase": "+29 min", "co2": "+180 kg/hr", "zones": 13},
    "metro": {"travel_increase": "+20 min", "co2": "+90 kg/hr", "zones": 10},
    "festival": {"travel_increase": "+16 min", "co2": "+60 kg/hr", "zones": 9},
    "const": {"travel_increase": "+10 min", "co2": "+40 kg/hr", "zones": 8},
    "demand": {"travel_increase": "+23 min", "co2": "+110 kg/hr", "zones": 11},
    "emergency": {"travel_increase": "+13 min", "co2": "+50 kg/hr", "zones": 9},
}


@app.get("/")
def root():
    return {"service": "Gridlock 2.0", "status": "online", "modules": 11}


@app.get("/api/zones/live")
def zones_live():
    return {"zones": [z.model_dump() for z in prediction.get_zones()], "timestamp": datetime.now().isoformat()}


@app.get("/api/predict/{geohash}")
def predict_zone(geohash: str):
    zones = prediction.get_zones()
    match = next((z for z in zones if z.geohash == geohash), None)
    if not match:
        return {"error": "Zone not found", "geohash": geohash}
    return {
        "zone": match.model_dump(),
        "curve": prediction.forecast_curve(match.id),
    }


@app.get("/api/incidents/active")
def active_incidents():
    return {"incidents": [i.model_dump() for i in incidents.active()]}


@app.post("/api/reroute")
def reroute(req: RerouteRequest):
    result = routing.route("silk_board", "hebbal")
    return {"request": req.model_dump(), "result": result}


@app.post("/api/signals/optimize")
def optimize_signals(req: SignalOptimizeRequest):
    junctions = ["Silk Board", "Hebbal", "Marathahalli", "KR Puram", "ORR @ BTM", "MG Road"]
    return {
        "optimized": len(junctions),
        "throughput_gain_pct": 31,
        "wait_reduction_sec": 22,
        "junctions": junctions,
        "reasons": [
            "Queue length increased to 47+ vehicles",
            "Demand spike detected — CI rose 0.08",
            "Throughput improvement expected +34%",
        ],
    }


@app.post("/api/emergency/corridor")
def emergency_corridor(req: EmergencyCorridorRequest):
    result = routing.green_corridor("silk_board", "hebbal")
    return {"request": req.model_dump(), "corridor": result}


@app.get("/api/fleet/status")
def fleet_status():
    return {"fleet": fleet.status().model_dump(), "deliveries": fleet.deliveries()}


@app.post("/api/fleet/optimize")
def fleet_optimize():
    return fleet.optimize_all()


@app.post("/api/twin/simulate")
def twin_simulate(req: TwinSimulateRequest):
    impact = SCENARIO_IMPACT.get(req.scenario, SCENARIO_IMPACT["accident"])
    return {"scenario": req.scenario, "impact": impact, "ai_mitigation": "Active — 38% impact reduction"}


@app.get("/api/analytics/impact")
def analytics_impact(scale: str = "day"):
    multipliers = {"day": 1, "week": 7, "month": 30, "year": 365}
    m = multipliers.get(scale, 1)
    return {
        "scale": scale,
        "travel_time_saved_min": 14820 * m,
        "fuel_saved_inr": 240000 * m,
        "co2_reduced_kg": 4800 * m,
        "economic_savings_inr": 1860000 * m,
        "delivery_efficiency_gain_pct": 31,
        "emergency_response_gain_min": 11,
    }


@app.websocket("/ws/live-feed")
async def websocket_feed(ws: WebSocket):
    await ws.accept()
    try:
        while True:
            prediction.tick()
            zones = prediction.get_zones()
            payload = {
                "type": "zone_update",
                "timestamp": datetime.now().isoformat(),
                "zones": [z.model_dump() for z in zones],
                "alerts": len([z for z in zones if z.ci >= 0.75]),
                "incidents": len(incidents.active()),
            }
            await ws.send_text(json.dumps(payload, default=str))
            await asyncio.sleep(3)
    except WebSocketDisconnect:
        pass


@app.post("/api/demo/inject-accident")
def demo_inject():
    prediction.inject_accident("z1", 0.97)
    inc = incidents.detect_from_anomaly(0.97, "Silk Board Junction")
    return {"status": "injected", "zone_ci": 0.97, "incident": inc.model_dump() if inc else None}

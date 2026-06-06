"""Flipkart fleet intelligence and last-mile optimization."""

from models import FleetStatus

FLEET = [
    {"id": "FK-88291", "from": "Whitefield Hub", "to": "Koramangala", "status": "at-risk", "eta": 47, "ai_eta": 29, "ci": 0.87},
    {"id": "FK-72104", "from": "Hebbal FC", "to": "Indiranagar", "status": "ontime", "eta": 22, "ai_eta": 18, "ci": 0.62},
    {"id": "FK-59403", "from": "Bommanahalli", "to": "JP Nagar", "status": "ontime", "eta": 31, "ai_eta": 24, "ci": 0.44},
    {"id": "FK-61872", "from": "KR Puram Hub", "to": "Whitefield", "status": "at-risk", "eta": 54, "ai_eta": 38, "ci": 0.79},
    {"id": "FK-44910", "from": "Peenya Hub", "to": "Rajajinagar", "status": "ontime", "eta": 18, "ai_eta": 15, "ci": 0.22},
    {"id": "FK-33771", "from": "Silk Board", "to": "Electronic City", "status": "at-risk", "eta": 62, "ai_eta": 41, "ci": 0.94},
]


class FleetEngine:
    def status(self) -> FleetStatus:
        at_risk = sum(1 for d in FLEET if d["status"] == "at-risk")
        return FleetStatus(
            orders_in_transit=142,
            orders_at_risk=at_risk,
            on_time_rate=0.937,
            avg_delivery_min=42,
            ai_delivery_min=29,
            fuel_saved_inr=320000,
        )

    def deliveries(self) -> list[dict]:
        return FLEET

    def optimize_all(self) -> dict:
        saved = sum(d["eta"] - d["ai_eta"] for d in FLEET)
        return {
            "optimized": len(FLEET),
            "total_time_saved_min": saved,
            "avg_saved_min": round(saved / len(FLEET), 1),
            "on_time_rate_after": 0.994,
            "at_risk_after": 1,
            "business_value": {
                "sla_protected": 9,
                "fuel_saved_inr": 240000,
                "customer_nps_impact": "+12 points",
            },
        }

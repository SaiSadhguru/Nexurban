"""ML prediction and congestion forecasting engine."""

import math
import random
from datetime import datetime

from models import RiskLevel, TrafficZone

ZONES_RAW = [
    {"id": "z1", "name": "Silk Board Junction", "geohash": "tdr1v9", "lat": 12.9175, "lng": 77.6228, "ci": 0.74, "lanes": 4, "weather": "Sunny"},
    {"id": "z2", "name": "Outer Ring Road", "geohash": "tdr2k3", "lat": 12.9352, "lng": 77.6500, "ci": 0.87, "lanes": 6, "weather": "Sunny"},
    {"id": "z3", "name": "Hebbal Flyover", "geohash": "tdr3m8", "lat": 13.0453, "lng": 77.5949, "ci": 0.82, "lanes": 4, "weather": "Cloudy"},
    {"id": "z4", "name": "KR Puram Bridge", "geohash": "tdr4n2", "lat": 13.0095, "lng": 77.6879, "ci": 0.79, "lanes": 2, "weather": "Rainy"},
    {"id": "z5", "name": "Marathahalli Bridge", "geohash": "tdr5p1", "lat": 12.9592, "lng": 77.6974, "ci": 0.75, "lanes": 4, "weather": "Sunny"},
    {"id": "z6", "name": "Bellandur Junction", "geohash": "tdr6q4", "lat": 12.9247, "lng": 77.6741, "ci": 0.71, "lanes": 3, "weather": "Sunny"},
    {"id": "z7", "name": "Sarjapur Road", "geohash": "tdr7r7", "lat": 12.8980, "lng": 77.6831, "ci": 0.68, "lanes": 3, "weather": "Sunny"},
    {"id": "z8", "name": "Electronic City Ph1", "geohash": "tdr8s0", "lat": 12.8456, "lng": 77.6644, "ci": 0.62, "lanes": 4, "weather": "Sunny"},
    {"id": "z9", "name": "Whitefield IT Park", "geohash": "tdr9t5", "lat": 12.9698, "lng": 77.7499, "ci": 0.58, "lanes": 4, "weather": "Cloudy"},
    {"id": "z10", "name": "MG Road Corridor", "geohash": "tdr0u2", "lat": 12.9757, "lng": 77.6011, "ci": 0.54, "lanes": 4, "weather": "Sunny"},
    {"id": "z11", "name": "Rajajinagar Junction", "geohash": "tdr1w6", "lat": 12.9895, "lng": 77.5546, "ci": 0.48, "lanes": 3, "weather": "Sunny"},
    {"id": "z12", "name": "Koramangala 5th Block", "geohash": "tdr2x9", "lat": 12.9252, "lng": 77.6245, "ci": 0.44, "lanes": 2, "weather": "Sunny"},
    {"id": "z13", "name": "JP Nagar 7th Phase", "geohash": "tdr3y1", "lat": 12.8862, "lng": 77.5859, "ci": 0.39, "lanes": 2, "weather": "Sunny"},
    {"id": "z14", "name": "Banashankari Bus Stand", "geohash": "tdr4z8", "lat": 12.9247, "lng": 77.5466, "ci": 0.35, "lanes": 3, "weather": "Sunny"},
    {"id": "z15", "name": "Indiranagar 100ft Rd", "geohash": "tdr5a3", "lat": 12.9784, "lng": 77.6408, "ci": 0.31, "lanes": 2, "weather": "Sunny"},
    {"id": "z16", "name": "Yelahanka New Town", "geohash": "tdr6b7", "lat": 13.1005, "lng": 77.5963, "ci": 0.27, "lanes": 2, "weather": "Cloudy"},
    {"id": "z17", "name": "Peenya Industrial Area", "geohash": "tdr7c4", "lat": 13.0289, "lng": 77.5182, "ci": 0.22, "lanes": 4, "weather": "Sunny"},
    {"id": "z18", "name": "Kengeri Satellite Town", "geohash": "tdr8d9", "lat": 12.9027, "lng": 77.4836, "ci": 0.18, "lanes": 2, "weather": "Rainy"},
]

DELTAS = {15: 0.07, 30: 0.15, 60: 0.20}


def risk_level(ci: float) -> RiskLevel:
    if ci >= 0.90:
        return RiskLevel.SEVERE_GRIDLOCK
    if ci >= 0.80:
        return RiskLevel.GRIDLOCK
    if ci >= 0.65:
        return RiskLevel.HEAVY
    if ci >= 0.50:
        return RiskLevel.MODERATE
    return RiskLevel.SMOOTH


def predict_ci(ci: float, horizon_min: int, zone_id: str = "") -> float:
    """Deterministic LSTM-style forecast with zone-specific drift."""
    seed = hash(f"{zone_id}:{horizon_min}:{datetime.now().strftime('%Y%m%d%H')}") % 1000
    noise = (seed / 1000 - 0.5) * 0.03
    return round(min(0.99, max(0.02, ci + DELTAS[horizon_min] + noise)), 3)


def confidence_score(ci: float, zone_id: str) -> float:
    seed = hash(zone_id) % 100
    return round(min(99.0, 88 + ci * 8 + seed * 0.05), 1)


class PredictionEngine:
    def __init__(self):
        self.zones = [dict(z) for z in ZONES_RAW]

    def tick(self):
        for z in self.zones:
            z["ci"] = round(min(0.99, max(0.05, z["ci"] + random.uniform(-0.008, 0.008))), 3)

    def get_zones(self) -> list[TrafficZone]:
        out = []
        for z in self.zones:
            p15 = predict_ci(z["ci"], 15, z["id"])
            p60 = predict_ci(z["ci"], 60, z["id"])
            out.append(
                TrafficZone(
                    id=z["id"],
                    name=z["name"],
                    geohash=z["geohash"],
                    lat=z["lat"],
                    lng=z["lng"],
                    ci=z["ci"],
                    pred_15min=p15,
                    pred_30min=predict_ci(z["ci"], 30, z["id"]),
                    pred_60min=p60,
                    confidence=confidence_score(z["ci"], z["id"]),
                    trend="rising" if p60 > z["ci"] else "falling",
                    risk_level=risk_level(p60),
                    lanes=z["lanes"],
                    weather=z["weather"],
                )
            )
        return out

    def forecast_curve(self, zone_id: str, points: int = 13) -> list[dict]:
        z = next(x for x in self.zones if x["id"] == zone_id)
        return [
            {"minute": i * 5, "ci": round(min(0.99, z["ci"] + (i * 5 / 60) * 0.22), 3)}
            for i in range(points)
        ]

    def inject_accident(self, zone_id: str = "z1", ci: float = 0.97):
        for z in self.zones:
            if z["id"] == zone_id:
                z["ci"] = ci
                break

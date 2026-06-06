"""Pydantic schemas for Gridlock 2.0 API."""

from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class RiskLevel(str, Enum):
    SMOOTH = "Smooth"
    MODERATE = "Moderate"
    HEAVY = "Heavy"
    GRIDLOCK = "Gridlock"
    SEVERE_GRIDLOCK = "Severe Gridlock"


class TrafficZone(BaseModel):
    id: str
    name: str
    geohash: str
    lat: float
    lng: float
    ci: float = Field(ge=0, le=1)
    pred_15min: float
    pred_30min: float
    pred_60min: float
    confidence: float
    trend: str
    risk_level: RiskLevel
    lanes: int
    weather: str


class IncidentType(str, Enum):
    ACCIDENT = "Accident"
    BREAKDOWN = "Vehicle Breakdown"
    CLOSURE = "Road Closure"
    FLOODING = "Flooding"
    CONSTRUCTION = "Construction Work"
    FESTIVAL = "Festival Traffic"
    RALLY = "Political Rally"
    EVENT = "Public Event Surge"


class Incident(BaseModel):
    id: str
    type: IncidentType
    location: str
    lat: float
    lng: float
    severity: str
    confidence: float
    estimated_delay_min: int
    impact_radius_km: float
    recommended_action: str


class RerouteRequest(BaseModel):
    origin_geohash: str
    dest_geohash: str
    avoid_zones: list[str] = []


class RerouteResponse(BaseModel):
    normal_eta_min: float
    optimized_eta_min: float
    time_saved_min: float
    route_reliability: float
    reasons: list[str]


class SignalOptimizeRequest(BaseModel):
    junction_ids: list[str] = []


class EmergencyCorridorRequest(BaseModel):
    vehicle_type: str
    origin_lat: float
    origin_lng: float
    dest_lat: float
    dest_lng: float


class TwinSimulateRequest(BaseModel):
    scenario: str


class FleetStatus(BaseModel):
    orders_in_transit: int
    orders_at_risk: int
    on_time_rate: float
    avg_delivery_min: float
    ai_delivery_min: float
    fuel_saved_inr: float

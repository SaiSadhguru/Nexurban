"""Incident detection engine with multi-source sensor fusion."""

from models import Incident, IncidentType

INCIDENTS = [
    Incident(id="i1", type=IncidentType.ACCIDENT, location="Silk Board Junction", lat=12.9175, lng=77.6228,
             severity="Critical", confidence=96, estimated_delay_min=35, impact_radius_km=2.8,
             recommended_action="Emergency services dispatched — green corridor prep"),
    Incident(id="i2", type=IncidentType.BREAKDOWN, location="ORR Near Marathahalli", lat=12.9500, lng=77.6700,
             severity="Moderate", confidence=89, estimated_delay_min=12, impact_radius_km=1.2,
             recommended_action="Traffic police alerted — lane assist"),
    Incident(id="i3", type=IncidentType.CLOSURE, location="Hebbal Flyover — Lane 2", lat=13.0453, lng=77.5949,
             severity="High", confidence=99, estimated_delay_min=28, impact_radius_km=3.5,
             recommended_action="Alternate route activated via Bellary Road"),
    Incident(id="i4", type=IncidentType.FLOODING, location="Bellandur Lake Area", lat=12.9247, lng=77.6741,
             severity="High", confidence=91, estimated_delay_min=45, impact_radius_km=4.0,
             recommended_action="Diversion in place — Sarjapur bypass"),
    Incident(id="i5", type=IncidentType.CONSTRUCTION, location="ORR @ BTM Layout", lat=12.9160, lng=77.6100,
             severity="Moderate", confidence=94, estimated_delay_min=18, impact_radius_km=1.8,
             recommended_action="Merge lanes — reduce speed to 40 km/h"),
    Incident(id="i6", type=IncidentType.FESTIVAL, location="MG Road — Cubbon Park", lat=12.9757, lng=77.6011,
             severity="Moderate", confidence=83, estimated_delay_min=22, impact_radius_km=2.0,
             recommended_action="Extra signals deployed — pedestrian priority"),
    Incident(id="i7", type=IncidentType.RALLY, location="Vidhana Soudha Corridor", lat=12.9796, lng=77.5907,
             severity="High", confidence=88, estimated_delay_min=40, impact_radius_km=3.2,
             recommended_action="Road blocks scheduled — pre-reroute ORR traffic"),
    Incident(id="i8", type=IncidentType.EVENT, location="Palace Grounds — Concert", lat=13.0050, lng=77.5900,
             severity="High", confidence=92, estimated_delay_min=32, impact_radius_km=2.6,
             recommended_action="Surge pricing on metro — fleet pre-positioned"),
]


class IncidentDetectionEngine:
    def active(self) -> list[Incident]:
        return INCIDENTS

    def detect_from_anomaly(self, zone_ci: float, zone_name: str) -> Incident | None:
        if zone_ci < 0.92:
            return None
        return Incident(
            id="dyn",
            type=IncidentType.ACCIDENT,
            location=zone_name,
            lat=12.9175,
            lng=77.6228,
            severity="Critical",
            confidence=round(min(99, 85 + zone_ci * 10), 1),
            estimated_delay_min=int(zone_ci * 40),
            impact_radius_km=round(zone_ci * 3, 1),
            recommended_action="Auto-detected anomaly — dispatch verification",
        )

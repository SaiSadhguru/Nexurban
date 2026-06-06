-- Flipkart Gridlock 2.0 — PostgreSQL Schema
-- Geohash-centric spatial traffic intelligence

CREATE EXTENSION IF NOT EXISTS postgis;

-- Traffic zones (geohash aggregation layer)
CREATE TABLE traffic_zones (
    id              VARCHAR(16) PRIMARY KEY,
    geohash         VARCHAR(12) NOT NULL UNIQUE,
    name            VARCHAR(128) NOT NULL,
    lat             DOUBLE PRECISION NOT NULL,
    lng             DOUBLE PRECISION NOT NULL,
    geom            GEOGRAPHY(POINT, 4326),
    road_type       VARCHAR(32),
    lanes           SMALLINT DEFAULT 2,
    ci              REAL CHECK (ci >= 0 AND ci <= 1),
    demand          REAL,
    weather         VARCHAR(16),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_zones_geohash ON traffic_zones (geohash);
CREATE INDEX idx_zones_ci ON traffic_zones (ci DESC);

-- ML predictions (time-series)
CREATE TABLE congestion_predictions (
    id              BIGSERIAL PRIMARY KEY,
    zone_id         VARCHAR(16) REFERENCES traffic_zones(id),
    horizon_min     SMALLINT NOT NULL CHECK (horizon_min IN (15, 30, 60)),
    predicted_ci    REAL NOT NULL,
    confidence      REAL NOT NULL,
    trend           VARCHAR(16),
    risk_level      VARCHAR(32),
    model_version   VARCHAR(32) DEFAULT 'lstm-v2.1',
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pred_zone_time ON congestion_predictions (zone_id, created_at DESC);

-- Incidents
CREATE TABLE incidents (
    id              VARCHAR(16) PRIMARY KEY,
    type            VARCHAR(32) NOT NULL,
    location        VARCHAR(256) NOT NULL,
    lat             DOUBLE PRECISION,
    lng             DOUBLE PRECISION,
    severity        VARCHAR(16),
    confidence      REAL,
    estimated_delay_min INTEGER,
    impact_radius_km REAL,
    recommended_action TEXT,
    status          VARCHAR(16) DEFAULT 'active',
    detected_at     TIMESTAMPTZ DEFAULT NOW(),
    resolved_at     TIMESTAMPTZ
);

-- Signal junctions
CREATE TABLE signal_junctions (
    id              VARCHAR(16) PRIMARY KEY,
    name            VARCHAR(128) NOT NULL,
    zone_id         VARCHAR(16) REFERENCES traffic_zones(id),
    queue_length    INTEGER,
    vehicle_density REAL,
    wait_time_sec   INTEGER,
    green_phase_sec INTEGER,
    red_phase_sec   INTEGER,
    efficiency_score REAL,
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- AI decisions (explainable AI audit log)
CREATE TABLE ai_decisions (
    id              BIGSERIAL PRIMARY KEY,
    module          VARCHAR(64) NOT NULL,
    decision_type   VARCHAR(64) NOT NULL,
    confidence      REAL,
    reasons         JSONB NOT NULL,
    input_snapshot  JSONB,
    output_snapshot JSONB,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Flipkart fleet
CREATE TABLE fleet_vehicles (
    id              VARCHAR(16) PRIMARY KEY,
    order_id        VARCHAR(32),
    hub_id          VARCHAR(32),
    driver_name     VARCHAR(128),
    origin_lat      DOUBLE PRECISION,
    origin_lng      DOUBLE PRECISION,
    dest_lat        DOUBLE PRECISION,
    dest_lng        DOUBLE PRECISION,
    status          VARCHAR(16),
    eta_min         REAL,
    ai_eta_min      REAL,
    route_ci        REAL,
    optimized       BOOLEAN DEFAULT FALSE,
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Impact analytics (aggregated KPIs)
CREATE TABLE impact_metrics (
    id              BIGSERIAL PRIMARY KEY,
    period          VARCHAR(16) NOT NULL,
    period_start    DATE NOT NULL,
    travel_saved_min BIGINT,
    fuel_saved_inr  BIGINT,
    co2_reduced_kg  REAL,
    economic_inr    BIGINT,
    delivery_gain_pct REAL,
    emergency_gain_min REAL,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Sensor raw feed (geohash aggregation input)
CREATE TABLE sensor_readings (
    id              BIGSERIAL PRIMARY KEY,
    geohash         VARCHAR(12) NOT NULL,
    source          VARCHAR(32),
    vehicle_count   INTEGER,
    avg_speed_kmh   REAL,
    queue_length    INTEGER,
    recorded_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sensor_geohash_time ON sensor_readings (geohash, recorded_at DESC);

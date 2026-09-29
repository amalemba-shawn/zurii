-- ========================================================
-- Solum FarmOS Database Schema
-- Run this in PostgreSQL, Supabase, Neon, or SQLite
-- ========================================================

-- 1. Farm Operators Table
CREATE TABLE IF NOT EXISTS farm_operators (
    id VARCHAR(64) PRIMARY KEY,
    passcode VARCHAR(12) NOT NULL UNIQUE,
    name VARCHAR(120) NOT NULL,
    role VARCHAR(100) NOT NULL,
    sector VARCHAR(120) NOT NULL,
    avatar_initials VARCHAR(4) NOT NULL,
    active_shift VARCHAR(64) NOT NULL,
    badge_id VARCHAR(32) NOT NULL UNIQUE,
    clearance_level VARCHAR(32) DEFAULT 'Specialist',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for instant passcode lookup
CREATE INDEX IF NOT EXISTS idx_operators_passcode ON farm_operators(passcode);

-- 2. Agricultural Sectors & Soil Telemetry
CREATE TABLE IF NOT EXISTS farm_sectors (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    crop VARCHAR(100) NOT NULL,
    soil_moisture NUMERIC(5, 2) DEFAULT 0.0,
    soil_temp NUMERIC(5, 2) DEFAULT 0.0,
    ambient_temp NUMERIC(5, 2) DEFAULT 0.0,
    humidity NUMERIC(5, 2) DEFAULT 0.0,
    sunlight_hours NUMERIC(4, 2) DEFAULT 0.0,
    irrigation_status VARCHAR(20) DEFAULT 'idle', -- 'idle' | 'active' | 'scheduled'
    health_score INT DEFAULT 100,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Farm Shift Tasks
CREATE TABLE IF NOT EXISTS farm_tasks (
    id VARCHAR(64) PRIMARY KEY,
    operator_id VARCHAR(64) REFERENCES farm_operators(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    scheduled_time VARCHAR(64) NOT NULL,
    location VARCHAR(120) NOT NULL,
    priority VARCHAR(16) DEFAULT 'normal', -- 'low' | 'normal' | 'urgent'
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

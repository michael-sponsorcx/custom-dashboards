-- Migration: 003_add_dashboard_schedules_table
-- Description: Creates the dashboard_schedules table for sending entire dashboard reports
--   to recipients on a schedule.

CREATE TABLE dashboard_schedules (
    id bigserial PRIMARY KEY,
    cron_job_id TEXT NOT NULL UNIQUE REFERENCES cron_jobs(id) ON DELETE CASCADE,
    organization_id bigint NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    dashboard_id bigint NOT NULL REFERENCES dashboards(id) ON DELETE CASCADE,
    created_by_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Schedule identification
    schedule_name VARCHAR(255) NOT NULL,
    comment TEXT,

    -- Frequency configuration
    frequency_interval VARCHAR(20) NOT NULL CHECK (frequency_interval IN ('n_minute', 'hour', 'day', 'week', 'month')),

    -- Interval values (used based on frequency_interval)
    minute_interval INTEGER CHECK (minute_interval IS NULL OR (minute_interval >= 5 AND minute_interval <= 45 AND minute_interval % 5 = 0)),
    hour_interval INTEGER CHECK (hour_interval IS NULL OR (hour_interval >= 1 AND hour_interval <= 12)),

    -- Scheduled time (for DAY, WEEK, MONTH frequencies)
    schedule_hour INTEGER CHECK (schedule_hour IS NULL OR (schedule_hour >= 0 AND schedule_hour <= 23)),
    schedule_minute INTEGER CHECK (schedule_minute IS NULL OR (schedule_minute >= 0 AND schedule_minute <= 59)),

    -- Day selection
    selected_days TEXT[] DEFAULT '{}',
    exclude_weekends BOOLEAN DEFAULT false,
    month_dates INTEGER[] DEFAULT '{}',

    -- Time zone
    time_zone VARCHAR(100) DEFAULT 'UTC',

    -- Gating condition
    has_gating_condition BOOLEAN DEFAULT false,
    gating_condition JSONB DEFAULT NULL,

    -- Delivery configuration
    attachment_type VARCHAR(10) CHECK (attachment_type IS NULL OR attachment_type IN ('PDF', 'Excel', 'CSV')),
    recipients TEXT[] DEFAULT '{}',

    -- Status and cron
    is_active BOOLEAN DEFAULT true,
    cron_expression VARCHAR(100),

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_dashboard_schedules_organization_id ON dashboard_schedules(organization_id);
CREATE INDEX idx_dashboard_schedules_dashboard_id ON dashboard_schedules(dashboard_id);
CREATE INDEX idx_dashboard_schedules_created_by_id ON dashboard_schedules(created_by_id);
CREATE INDEX idx_dashboard_schedules_is_active ON dashboard_schedules(is_active);

-- Auto-update updated_at timestamp
CREATE TRIGGER update_dashboard_schedules_updated_at
    BEFORE UPDATE ON dashboard_schedules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

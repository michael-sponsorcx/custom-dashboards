-- Migration: 002_add_kpi_alerts_tables
-- Description: Creates the KPI alerting system with four-table inheritance hierarchy:
--   - cron_jobs: Top level - execution scheduling (already exists)
--   - kpi_alerts: 1:1 with cron_jobs - KPI-specific data
--   - kpi_schedules: 1:1 with kpi_alerts - schedule-specific data
--   - kpi_thresholds: 1:1 with kpi_alerts - threshold-specific data

-- ============================================================================
-- Table: kpi_alerts (1:1 with cron_jobs)
-- Contains KPI-specific data that's common to all alert types
-- ============================================================================

CREATE TABLE kpi_alerts (
    id bigserial PRIMARY KEY,
    cron_job_id TEXT NOT NULL UNIQUE REFERENCES cron_jobs(id) ON DELETE CASCADE,
    organization_id bigint NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    graph_id bigint REFERENCES graphs(id) ON DELETE SET NULL,
    dashboard_id bigint NOT NULL REFERENCES dashboards(id) ON DELETE CASCADE,
    created_by_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    alert_name VARCHAR(255) NOT NULL,
    alert_type VARCHAR(20) NOT NULL CHECK (alert_type IN ('schedule', 'threshold')),
    comment TEXT,
    recipients TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_kpi_alerts_cron_job_id ON kpi_alerts(cron_job_id);
CREATE INDEX idx_kpi_alerts_organization_id ON kpi_alerts(organization_id);
CREATE INDEX idx_kpi_alerts_graph_id ON kpi_alerts(graph_id);
CREATE INDEX idx_kpi_alerts_dashboard_id ON kpi_alerts(dashboard_id);
CREATE INDEX idx_kpi_alerts_created_by_id ON kpi_alerts(created_by_id);
CREATE INDEX idx_kpi_alerts_is_active ON kpi_alerts(is_active);
CREATE INDEX idx_kpi_alerts_alert_type ON kpi_alerts(alert_type);

CREATE TRIGGER update_kpi_alerts_updated_at
    BEFORE UPDATE ON kpi_alerts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE kpi_alerts IS 'KPI-specific data for alerts. 1:1 relationship with cron_jobs for execution scheduling.';
COMMENT ON COLUMN kpi_alerts.cron_job_id IS 'Reference to parent cron_jobs record (1:1 relationship)';
COMMENT ON COLUMN kpi_alerts.alert_type IS 'Discriminator: schedule or threshold';

-- ============================================================================
-- Table: kpi_schedules (1:1 with kpi_alerts)
-- Contains schedule-specific data for time-based reports
-- ============================================================================

CREATE TABLE kpi_schedules (
    id bigserial PRIMARY KEY,
    kpi_alert_id bigint NOT NULL UNIQUE REFERENCES kpi_alerts(id) ON DELETE CASCADE,
    frequency_interval VARCHAR(20) NOT NULL CHECK (frequency_interval IN ('n_minute', 'hour', 'day', 'week', 'month')),
    minute_interval INTEGER CHECK (minute_interval >= 5 AND minute_interval <= 45 AND minute_interval % 5 = 0),
    hour_interval INTEGER CHECK (hour_interval >= 1 AND hour_interval <= 12),
    schedule_hour INTEGER CHECK (schedule_hour >= 0 AND schedule_hour <= 23),
    schedule_minute INTEGER CHECK (schedule_minute >= 0 AND schedule_minute <= 55 AND schedule_minute % 5 = 0),
    selected_days TEXT[] DEFAULT '{}',
    exclude_weekends BOOLEAN DEFAULT false,
    month_dates INTEGER[] DEFAULT '{}',
    time_zone VARCHAR(100) DEFAULT 'UTC',
    has_gating_condition BOOLEAN DEFAULT false,
    gating_condition JSONB DEFAULT NULL,
    attachment_type VARCHAR(10) CHECK (attachment_type IN ('PDF', 'Excel', 'CSV')),
    cron_expression VARCHAR(100)
);

CREATE UNIQUE INDEX idx_kpi_schedules_kpi_alert_id ON kpi_schedules(kpi_alert_id);
CREATE INDEX idx_kpi_schedules_frequency ON kpi_schedules(frequency_interval);

COMMENT ON TABLE kpi_schedules IS 'Schedule-specific fields for time-based KPI alerts. 1:1 relationship with kpi_alerts.';
COMMENT ON COLUMN kpi_schedules.kpi_alert_id IS 'Reference to parent kpi_alerts record (1:1 relationship)';
COMMENT ON COLUMN kpi_schedules.frequency_interval IS 'Schedule frequency: n_minute, hour, day, week, or month';
COMMENT ON COLUMN kpi_schedules.selected_days IS 'Days of week: M, T, W, Th, F, S, Su';
COMMENT ON COLUMN kpi_schedules.month_dates IS 'Array of day numbers for monthly schedules (1-31)';

-- ============================================================================
-- Table: kpi_thresholds (1:1 with kpi_alerts)
-- Contains threshold-specific data for condition-based alerts
-- ============================================================================

CREATE TABLE kpi_thresholds (
    id bigserial PRIMARY KEY,
    kpi_alert_id bigint NOT NULL UNIQUE REFERENCES kpi_alerts(id) ON DELETE CASCADE,
    condition VARCHAR(30) NOT NULL CHECK (condition IN ('GREATER_THAN', 'GREATER_THAN_OR_EQUAL', 'LESS_THAN', 'LESS_THAN_OR_EQUAL', 'EQUAL_TO', 'NOT_EQUAL_TO')),
    threshold_value NUMERIC NOT NULL,
    time_zone VARCHAR(100) DEFAULT 'UTC'
);

CREATE UNIQUE INDEX idx_kpi_thresholds_kpi_alert_id ON kpi_thresholds(kpi_alert_id);

COMMENT ON TABLE kpi_thresholds IS 'Threshold-specific fields for condition-based KPI alerts. 1:1 relationship with kpi_alerts.';
COMMENT ON COLUMN kpi_thresholds.kpi_alert_id IS 'Reference to parent kpi_alerts record (1:1 relationship)';
COMMENT ON COLUMN kpi_thresholds.condition IS 'Comparison operator for threshold evaluation';

-- Migration: 002_add_kpi_schedules_table
-- Description: Creates the kpi_schedules table for storing scheduled report configurations
-- This table stores schedule configurations that will be used to generate cron jobs

-- KPI Schedules table
-- Stores scheduled report configurations for dashboards/graphs
CREATE TABLE IF NOT EXISTS kpi_schedules (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    -- Organization reference
    organization_id bigint REFERENCES organizations(id) ON DELETE CASCADE,

    -- Optional reference to a specific graph (if schedule is for a single graph)
    graph_id bigint REFERENCES graphs(id) ON DELETE SET NULL,

    -- Optional reference to a dashboard (if schedule is for entire dashboard)
    dashboard_id bigint REFERENCES dashboards(id) ON DELETE SET NULL,

    -- User who created this schedule (deleted when user is deleted)
    created_by bigint REFERENCES users(id) ON DELETE CASCADE,

    -- Schedule identification
    schedule_name VARCHAR(255) NOT NULL,

    -- Comment (optional note about the schedule)
    comment TEXT,

    -- Frequency configuration
    -- Values: 'n_minute', 'hour', 'day', 'week', 'month'
    frequency_interval VARCHAR(20) NOT NULL CHECK (frequency_interval IN ('n_minute', 'hour', 'day', 'week', 'month')),

    -- For n_minute frequency: interval in minutes (5, 10, 15, ..., 45)
    minute_interval INTEGER CHECK (minute_interval >= 5 AND minute_interval <= 45 AND minute_interval % 5 = 0),

    -- For hour frequency: interval in hours (1-12)
    hour_interval INTEGER CHECK (hour_interval >= 1 AND hour_interval <= 12),

    -- For day/week/month: specific time of day (00-23 for hour, 00-55 for minute)
    schedule_hour INTEGER CHECK (schedule_hour >= 0 AND schedule_hour <= 23),
    schedule_minute INTEGER CHECK (schedule_minute >= 0 AND schedule_minute <= 55 AND schedule_minute % 5 = 0),

    -- Days of week for n_minute, hour, and week frequencies
    -- Stored as array: ['M', 'T', 'W', 'Th', 'F', 'S', 'Su']
    selected_days TEXT[] DEFAULT '{}',

    -- For day frequency: whether to exclude weekends
    exclude_weekends BOOLEAN DEFAULT false,

    -- For month frequency: days of month (stored as array of integers, e.g., [2, 10, 15])
    month_dates INTEGER[] DEFAULT '{}',

    -- Timezone for scheduling (IANA timezone identifier)
    time_zone VARCHAR(100) DEFAULT 'UTC',

    -- Gating condition (for conditional execution)
    has_gating_condition BOOLEAN DEFAULT false,
    gating_condition JSONB DEFAULT NULL,

    -- Attachment configuration
    -- Values: 'PDF', 'Excel', 'CSV'
    attachment_type VARCHAR(10) CHECK (attachment_type IN ('PDF', 'Excel', 'CSV')),

    -- Recipients (stored as array of email addresses)
    recipients TEXT[] DEFAULT '{}',

    -- Schedule status
    is_active BOOLEAN DEFAULT true,

    -- Cron expression (generated from frequency settings for cron job scheduling)
    cron_expression VARCHAR(100),

    -- Tracking
    last_executed_at TIMESTAMP WITH TIME ZONE,
    next_execution_at TIMESTAMP WITH TIME ZONE,
    execution_count INTEGER DEFAULT 0,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for common query patterns
CREATE INDEX idx_kpi_schedules_organization_id ON kpi_schedules(organization_id);
CREATE INDEX idx_kpi_schedules_graph_id ON kpi_schedules(graph_id);
CREATE INDEX idx_kpi_schedules_dashboard_id ON kpi_schedules(dashboard_id);
CREATE INDEX idx_kpi_schedules_is_active ON kpi_schedules(is_active);
CREATE INDEX idx_kpi_schedules_next_execution ON kpi_schedules(next_execution_at) WHERE is_active = true;
CREATE INDEX idx_kpi_schedules_frequency ON kpi_schedules(frequency_interval);
CREATE INDEX idx_kpi_schedules_created_by ON kpi_schedules(created_by);

-- Apply the updated_at trigger
CREATE TRIGGER update_kpi_schedules_updated_at
    BEFORE UPDATE ON kpi_schedules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comment to table
COMMENT ON TABLE kpi_schedules IS 'Stores scheduled report configurations for KPI dashboards and graphs';
COMMENT ON COLUMN kpi_schedules.frequency_interval IS 'Schedule frequency type: n_minute, hour, day, week, or month';
COMMENT ON COLUMN kpi_schedules.cron_expression IS 'Generated cron expression for job scheduling';
COMMENT ON COLUMN kpi_schedules.selected_days IS 'Days of week: M, T, W, Th, F, S, Su';
COMMENT ON COLUMN kpi_schedules.month_dates IS 'Array of day numbers for monthly schedules (1-31)';
COMMENT ON COLUMN kpi_schedules.created_by IS 'User ID who created this schedule';

-- Migration 001: Full Schema for SponsorCX
-- Consolidated from migrations 001-012

-- ============================================================================
-- Trigger function (used by all tables)
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================================================
-- Table: graphs
-- ============================================================================

CREATE TABLE IF NOT EXISTS graphs (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    organization_id bigint REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    view_name VARCHAR(255) NOT NULL,
    chart_type VARCHAR(50) NOT NULL,
    chart_title VARCHAR(255) NOT NULL,

    -- Arrays for measures, dimensions, dates
    measures TEXT[] NOT NULL DEFAULT '{}',
    dimensions TEXT[] NOT NULL DEFAULT '{}',
    dates TEXT[] NOT NULL DEFAULT '{}',

    -- Filter rules stored as JSONB
    filters JSONB NOT NULL DEFAULT '[]',

    -- Order by configuration
    order_by_field VARCHAR(255) NOT NULL DEFAULT '',
    order_by_direction VARCHAR(4) NOT NULL DEFAULT 'desc' CHECK (order_by_direction IN ('asc', 'desc')),

    -- Chart configuration options
    number_format VARCHAR(20) NOT NULL DEFAULT 'number' CHECK (number_format IN ('currency', 'percentage', 'number', 'abbreviated')),
    number_precision INTEGER NOT NULL DEFAULT 2,
    color_palette VARCHAR(100) NOT NULL DEFAULT 'sponsorcx',
    primary_color VARCHAR(50) NOT NULL DEFAULT '#3b82f6',
    sort_order VARCHAR(4) NOT NULL DEFAULT 'desc' CHECK (sort_order IN ('asc', 'desc')),
    legend_position VARCHAR(10) NOT NULL DEFAULT 'bottom' CHECK (legend_position IN ('top', 'bottom', 'none')),

    -- KPI specific fields
    kpi_value NUMERIC,
    kpi_label VARCHAR(255),
    kpi_secondary_value NUMERIC,
    kpi_secondary_label VARCHAR(255),
    kpi_show_trend BOOLEAN NOT NULL DEFAULT false,
    kpi_trend_percentage NUMERIC,

    -- Grid and axis configuration
    show_x_axis_grid_lines BOOLEAN NOT NULL DEFAULT true,
    show_y_axis_grid_lines BOOLEAN NOT NULL DEFAULT true,
    show_grid_lines BOOLEAN NOT NULL DEFAULT true,
    show_regression_line BOOLEAN NOT NULL DEFAULT false,
    x_axis_label VARCHAR(255),
    y_axis_label VARCHAR(255),

    -- Additional configuration
    max_data_points INTEGER NOT NULL DEFAULT 50,
    primary_dimension VARCHAR(255) NOT NULL DEFAULT '',
    secondary_dimension VARCHAR(255),
    selected_measure VARCHAR(255) NOT NULL DEFAULT '',

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_graphs_organization_id ON graphs(organization_id);
CREATE INDEX IF NOT EXISTS idx_graphs_created_at ON graphs(created_at DESC);

CREATE TRIGGER update_graphs_updated_at BEFORE UPDATE ON graphs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Table: dashboards
-- ============================================================================

CREATE TABLE IF NOT EXISTS dashboards (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    organization_id bigint REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    layout VARCHAR(20) NOT NULL CHECK (layout IN ('grid', 'list')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(organization_id)
);

CREATE INDEX IF NOT EXISTS idx_dashboards_organization_id ON dashboards(organization_id);

CREATE TRIGGER update_dashboards_updated_at BEFORE UPDATE ON dashboards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Table: dashboard_grid_items
-- ============================================================================

CREATE TABLE IF NOT EXISTS dashboard_grid_items (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    dashboard_id bigint REFERENCES dashboards(id) ON DELETE CASCADE,
    graph_id bigint REFERENCES graphs(id) ON DELETE CASCADE,

    -- Grid layout positioning (nullable — React Grid Layout handles positioning)
    grid_column INTEGER DEFAULT 1 CHECK (grid_column >= 1 AND grid_column <= 6),
    grid_row INTEGER DEFAULT 1 CHECK (grid_row >= 1),
    grid_width INTEGER DEFAULT 3 CHECK (grid_width >= 1 AND grid_width <= 6),
    grid_height INTEGER DEFAULT 3 CHECK (grid_height >= 1),

    -- Order in the dashboard
    display_order INTEGER DEFAULT 0,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(dashboard_id, graph_id)
);

CREATE INDEX IF NOT EXISTS idx_dashboard_grid_items_dashboard_id ON dashboard_grid_items(dashboard_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_grid_items_graph_id ON dashboard_grid_items(graph_id);

CREATE TRIGGER update_dashboard_grid_items_updated_at BEFORE UPDATE ON dashboard_grid_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Table: dashboard_filters
-- ============================================================================

CREATE TABLE IF NOT EXISTS dashboard_filters (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    dashboard_id bigint REFERENCES dashboards(id) ON DELETE CASCADE,

    -- Selected views (data sources)
    selected_views TEXT[] DEFAULT '{}',

    -- Available fields for filtering
    available_fields JSONB DEFAULT '[]',

    -- Active filter rules
    active_filters JSONB DEFAULT '[]',

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(dashboard_id)
);

CREATE INDEX IF NOT EXISTS idx_dashboard_filters_dashboard_id ON dashboard_filters(dashboard_id);

CREATE TRIGGER update_dashboard_filters_updated_at BEFORE UPDATE ON dashboard_filters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Table: kpi_alerts
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
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
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
-- Table: kpi_schedules (no cron_expression, no gating columns — removed by 011/012)
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
    attachment_type VARCHAR(10) CHECK (attachment_type IN ('PDF', 'Excel', 'CSV'))
);

CREATE UNIQUE INDEX idx_kpi_schedules_kpi_alert_id ON kpi_schedules(kpi_alert_id);
CREATE INDEX idx_kpi_schedules_frequency ON kpi_schedules(frequency_interval);

COMMENT ON TABLE kpi_schedules IS 'Schedule-specific fields for time-based KPI alerts. 1:1 relationship with kpi_alerts.';
COMMENT ON COLUMN kpi_schedules.kpi_alert_id IS 'Reference to parent kpi_alerts record (1:1 relationship)';
COMMENT ON COLUMN kpi_schedules.frequency_interval IS 'Schedule frequency: n_minute, hour, day, week, or month';
COMMENT ON COLUMN kpi_schedules.selected_days IS 'Days of week: M, T, W, Th, F, S, Su';
COMMENT ON COLUMN kpi_schedules.month_dates IS 'Array of day numbers for monthly schedules (1-31)';

-- ============================================================================
-- Table: kpi_thresholds
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

-- ============================================================================
-- Table: dashboard_schedules (no cron_expression — removed by 012)
-- ============================================================================

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

    -- Status
    is_active BOOLEAN DEFAULT true,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dashboard_schedules_organization_id ON dashboard_schedules(organization_id);
CREATE INDEX idx_dashboard_schedules_dashboard_id ON dashboard_schedules(dashboard_id);
CREATE INDEX idx_dashboard_schedules_created_by_id ON dashboard_schedules(created_by_id);
CREATE INDEX idx_dashboard_schedules_is_active ON dashboard_schedules(is_active);

CREATE TRIGGER update_dashboard_schedules_updated_at
    BEFORE UPDATE ON dashboard_schedules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

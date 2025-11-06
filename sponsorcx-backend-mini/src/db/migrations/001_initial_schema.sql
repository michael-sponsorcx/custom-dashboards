-- Migration 001: Initial Schema for SponsorCX
-- Creates tables to replace localStorage functionality
-- Note: Assumes 'organizations' table already exists

-- Graphs table (replaces localStorage 'sponsorcx_saved_graphs')
CREATE TABLE IF NOT EXISTS graphs (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    organization_id bigint REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    view_name VARCHAR(255) NOT NULL,
    chart_type VARCHAR(50) NOT NULL,
    chart_title VARCHAR(255) NOT NULL,

    -- Arrays for measures, dimensions, dates
    measures TEXT[] DEFAULT '{}',
    dimensions TEXT[] DEFAULT '{}',
    dates TEXT[] DEFAULT '{}',

    -- Filter rules stored as JSONB
    filters JSONB DEFAULT '[]',

    -- Order by configuration
    order_by_field VARCHAR(255),
    order_by_direction VARCHAR(4) CHECK (order_by_direction IN ('asc', 'desc')),

    -- Chart configuration options
    number_format VARCHAR(20) CHECK (number_format IN ('currency', 'percentage', 'number', 'abbreviated')),
    number_precision INTEGER,
    color_palette VARCHAR(100),
    primary_color VARCHAR(50),
    sort_order VARCHAR(4) CHECK (sort_order IN ('asc', 'desc')),
    legend_position VARCHAR(10) CHECK (legend_position IN ('top', 'bottom', 'none')),

    -- KPI specific fields
    kpi_value NUMERIC,
    kpi_label VARCHAR(255),
    kpi_secondary_value NUMERIC,
    kpi_secondary_label VARCHAR(255),
    kpi_show_trend BOOLEAN DEFAULT false,
    kpi_trend_percentage NUMERIC,

    -- Grid and axis configuration
    show_x_axis_grid_lines BOOLEAN DEFAULT true,
    show_y_axis_grid_lines BOOLEAN DEFAULT true,
    show_grid_lines BOOLEAN DEFAULT true,
    show_regression_line BOOLEAN DEFAULT false,
    x_axis_label VARCHAR(255),
    y_axis_label VARCHAR(255),

    -- Additional configuration
    max_data_points INTEGER,
    primary_dimension VARCHAR(255),
    secondary_dimension VARCHAR(255),
    selected_measure VARCHAR(255),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Dashboards table (replaces localStorage 'sponsorcx_dashboard')
-- One dashboard per organization
CREATE TABLE IF NOT EXISTS dashboards (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    organization_id bigint REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    layout VARCHAR(20) NOT NULL CHECK (layout IN ('grid', 'list')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(organization_id)
);

-- Dashboard grid items table (replaces localStorage 'sponsorcx_dashboard_items')
-- Maps graphs to dashboards with grid layout positioning
CREATE TABLE IF NOT EXISTS dashboard_grid_items (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    dashboard_id bigint REFERENCES dashboards(id) ON DELETE CASCADE,
    graph_id bigint REFERENCES graphs(id) ON DELETE CASCADE,

    -- Grid layout positioning
    grid_column INTEGER CHECK (grid_column >= 1 AND grid_column <= 6),
    grid_row INTEGER CHECK (grid_row >= 1),
    grid_width INTEGER CHECK (grid_width >= 1 AND grid_width <= 6),
    grid_height INTEGER CHECK (grid_height >= 1),

    -- Order in the dashboard
    display_order INTEGER DEFAULT 0,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(dashboard_id, graph_id)
);

-- Dashboard filters table (replaces localStorage 'sponsorcx_dashboard_filters')
CREATE TABLE IF NOT EXISTS dashboard_filters (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    dashboard_id bigint REFERENCES dashboards(id) ON DELETE CASCADE,

    -- Selected views (data sources)
    selected_views TEXT[] DEFAULT '{}',

    -- Available fields for filtering
    available_fields JSONB DEFAULT '[]',

    -- Active filter rules
    active_filters JSONB DEFAULT '[]',

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(dashboard_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_graphs_organization_id ON graphs(organization_id);
CREATE INDEX IF NOT EXISTS idx_graphs_created_at ON graphs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dashboards_organization_id ON dashboards(organization_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_grid_items_dashboard_id ON dashboard_grid_items(dashboard_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_grid_items_graph_id ON dashboard_grid_items(graph_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_filters_dashboard_id ON dashboard_filters(dashboard_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_graphs_updated_at BEFORE UPDATE ON graphs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dashboards_updated_at BEFORE UPDATE ON dashboards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dashboard_grid_items_updated_at BEFORE UPDATE ON dashboard_grid_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dashboard_filters_updated_at BEFORE UPDATE ON dashboard_filters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

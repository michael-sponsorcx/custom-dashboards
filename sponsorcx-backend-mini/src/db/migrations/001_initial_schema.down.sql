-- Rollback Migration 001: Full Schema for SponsorCX
-- Drops all tables, triggers, indexes, and functions

-- Drop triggers
DROP TRIGGER IF EXISTS update_dashboard_schedules_updated_at ON dashboard_schedules;
DROP TRIGGER IF EXISTS update_kpi_alerts_updated_at ON kpi_alerts;
DROP TRIGGER IF EXISTS update_dashboard_filters_updated_at ON dashboard_filters;
DROP TRIGGER IF EXISTS update_dashboard_grid_items_updated_at ON dashboard_grid_items;
DROP TRIGGER IF EXISTS update_dashboards_updated_at ON dashboards;
DROP TRIGGER IF EXISTS update_graphs_updated_at ON graphs;

-- Drop trigger function
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS dashboard_schedules;
DROP TABLE IF EXISTS kpi_thresholds;
DROP TABLE IF EXISTS kpi_schedules;
DROP TABLE IF EXISTS kpi_alerts;
DROP TABLE IF EXISTS dashboard_filters;
DROP TABLE IF EXISTS dashboard_grid_items;
DROP TABLE IF EXISTS dashboards;
DROP TABLE IF EXISTS graphs;

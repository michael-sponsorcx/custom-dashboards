-- Rollback Migration 001: Initial Schema for SponsorCX
-- Removes all tables, triggers, and functions created in the up migration

-- Drop triggers first
DROP TRIGGER IF EXISTS update_dashboard_filters_updated_at ON dashboard_filters;
DROP TRIGGER IF EXISTS update_dashboard_grid_items_updated_at ON dashboard_grid_items;
DROP TRIGGER IF EXISTS update_dashboards_updated_at ON dashboards;
DROP TRIGGER IF EXISTS update_graphs_updated_at ON graphs;

-- Drop the trigger function
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop indexes (they'll be dropped with tables, but explicit for clarity)
DROP INDEX IF EXISTS idx_dashboard_filters_dashboard_id;
DROP INDEX IF EXISTS idx_dashboard_grid_items_graph_id;
DROP INDEX IF EXISTS idx_dashboard_grid_items_dashboard_id;
DROP INDEX IF EXISTS idx_dashboards_organization_id;
DROP INDEX IF EXISTS idx_graphs_created_at;
DROP INDEX IF EXISTS idx_graphs_organization_id;

-- Drop tables in reverse order of creation (respecting foreign key dependencies)
DROP TABLE IF EXISTS dashboard_filters;
DROP TABLE IF EXISTS dashboard_grid_items;
DROP TABLE IF EXISTS dashboards;
DROP TABLE IF EXISTS graphs;

-- Rollback: 002_add_kpi_schedules_table
-- Description: Removes the kpi_schedules table and related objects

-- Drop the trigger first
DROP TRIGGER IF EXISTS update_kpi_schedules_updated_at ON kpi_schedules;

-- Drop indexes
DROP INDEX IF EXISTS idx_kpi_schedules_organization_id;
DROP INDEX IF EXISTS idx_kpi_schedules_graph_id;
DROP INDEX IF EXISTS idx_kpi_schedules_dashboard_id;
DROP INDEX IF EXISTS idx_kpi_schedules_is_active;
DROP INDEX IF EXISTS idx_kpi_schedules_next_execution;
DROP INDEX IF EXISTS idx_kpi_schedules_frequency;

-- Drop the table
DROP TABLE IF EXISTS kpi_schedules;

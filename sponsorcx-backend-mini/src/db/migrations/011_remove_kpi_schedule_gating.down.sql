-- Rollback: 011_remove_kpi_schedule_gating
-- Re-add gating condition columns to kpi_schedules

ALTER TABLE kpi_schedules ADD COLUMN has_gating_condition BOOLEAN DEFAULT false;
ALTER TABLE kpi_schedules ADD COLUMN gating_condition JSONB DEFAULT NULL;

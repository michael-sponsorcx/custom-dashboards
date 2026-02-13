-- Migration: 011_remove_kpi_schedule_gating
-- Description: Remove unused gating condition columns from kpi_schedules table.
-- The gating condition feature was never implemented (evaluateGatingCondition always returned true).

ALTER TABLE kpi_schedules DROP COLUMN has_gating_condition;
ALTER TABLE kpi_schedules DROP COLUMN gating_condition;

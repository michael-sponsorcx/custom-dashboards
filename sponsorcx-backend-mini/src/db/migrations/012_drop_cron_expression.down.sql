-- Revert: 012_drop_cron_expression
-- Re-add the cron_expression column to kpi_schedules and dashboard_schedules.

ALTER TABLE kpi_schedules ADD COLUMN cron_expression VARCHAR(100);
ALTER TABLE dashboard_schedules ADD COLUMN cron_expression VARCHAR(100);

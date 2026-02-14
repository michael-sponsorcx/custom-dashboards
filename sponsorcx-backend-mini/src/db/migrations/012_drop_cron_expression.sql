-- Migration: 012_drop_cron_expression
-- Description: Removes the unused cron_expression column from kpi_schedules and dashboard_schedules.
--   The cron expression is always computed at runtime from the schedule fields, never read from the DB.

ALTER TABLE kpi_schedules DROP COLUMN cron_expression;
ALTER TABLE dashboard_schedules DROP COLUMN cron_expression;

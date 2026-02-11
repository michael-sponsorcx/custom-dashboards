import type { AlertRowColumns, KpiAlert } from './kpiAlert';
import { rowToKpiAlert } from './kpiAlert';

/** Database row type for kpi_schedules joined query (snake_case) */
export interface KpiScheduleRow extends AlertRowColumns {
    schedule_id: string;
    kpi_alert_id: string;
    frequency_interval: string;
    minute_interval: number | null;
    hour_interval: number | null;
    schedule_hour: number | null;
    schedule_minute: number | null;
    selected_days: string[];
    exclude_weekends: boolean;
    month_dates: number[];
    time_zone: string;
    has_gating_condition: boolean;
    gating_condition: unknown;
    attachment_type: string | null;
    cron_expression: string | null;
}

/** Resolved type for KpiSchedule (camelCase for GraphQL) */
export interface KpiSchedule {
    id: string;
    kpiAlertId: string;
    frequencyInterval: string;
    minuteInterval: number | null;
    hourInterval: number | null;
    scheduleHour: number | null;
    scheduleMinute: number | null;
    selectedDays: string[];
    excludeWeekends: boolean;
    monthDates: number[];
    timeZone: string;
    hasGatingCondition: boolean;
    gatingCondition: unknown;
    attachmentType: string | null;
    cronExpression: string | null;
    alert: KpiAlert;
}

/** Convert a kpi_schedule joined row to camelCase for GraphQL */
export const kpiScheduleToCamelCase = (row: KpiScheduleRow): KpiSchedule => ({
    id: row.schedule_id,
    kpiAlertId: row.kpi_alert_id,
    frequencyInterval: row.frequency_interval,
    minuteInterval: row.minute_interval,
    hourInterval: row.hour_interval,
    scheduleHour: row.schedule_hour,
    scheduleMinute: row.schedule_minute,
    selectedDays: row.selected_days,
    excludeWeekends: row.exclude_weekends,
    monthDates: row.month_dates,
    timeZone: row.time_zone,
    hasGatingCondition: row.has_gating_condition,
    gatingCondition: row.gating_condition,
    attachmentType: row.attachment_type,
    cronExpression: row.cron_expression,
    alert: rowToKpiAlert(row),
});

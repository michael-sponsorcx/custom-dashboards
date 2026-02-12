import type { FrequencyInterval, AttachmentType } from '../../generated/graphql';
import type { AlertRowColumns, KpiAlert, KpiAlertRow } from '../kpiAlert';

/** Database row type for kpi_schedules joined query (snake_case) */
export interface KpiScheduleRow extends AlertRowColumns {
    schedule_id: string;
    kpi_alert_id: string;
    frequency_interval: FrequencyInterval;
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
    attachment_type: AttachmentType | null;
    cron_expression: string | null;
}

/** Resolved KpiSchedule type (camelCase for GraphQL) */
export interface KpiSchedule {
    id: string;
    kpiAlertId: string;
    alert: KpiAlert;
    frequencyInterval: FrequencyInterval;
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
    attachmentType: AttachmentType | null;
    cronExpression: string | null;
}

/** Schedule + alert row from kpi_schedules/kpi_alerts join queries */
export interface KpiScheduleAlertRow extends KpiAlertRow {
    frequency_interval: FrequencyInterval;
    minute_interval: number | null;
    hour_interval: number | null;
    schedule_hour: number | null;
    schedule_minute: number | null;
    selected_days: string[];
    exclude_weekends: boolean;
    month_dates: number[];
    time_zone: string;
    has_gating_condition: boolean;
    gating_condition: Record<string, unknown> | null;
    attachment_type: AttachmentType | null;
}

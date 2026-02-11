import type { KpiSchedule as CodegenKpiSchedule } from '../../generated/graphql';
import type { AlertRowColumns, KpiAlert } from '../kpiAlert';

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

/**
 * Resolved KpiSchedule type (camelCase for GraphQL).
 * Overrides: enum fields (string vs codegen enum), non-null arrays/booleans,
 * gatingCondition (unknown vs Record), alert (model KpiAlert vs codegen KpiAlert)
 */
type KpiScheduleOverrides = {
    frequencyInterval: string;
    selectedDays: string[];
    excludeWeekends: boolean;
    monthDates: number[];
    timeZone: string;
    hasGatingCondition: boolean;
    gatingCondition: unknown;
    attachmentType: string | null;
    alert: KpiAlert;
};

export type KpiSchedule = Omit<CodegenKpiSchedule, '__typename' | keyof KpiScheduleOverrides> & KpiScheduleOverrides;

import type { FrequencyInterval, AttachmentType } from '../../generated/graphql';

/** Database row type for dashboard_schedules (snake_case) */
export interface DashboardScheduleRow {
    id: string;
    cron_job_id: string;
    organization_id: string;
    dashboard_id: string;
    created_by_id: string;
    created_by_name: string;
    created_by_email: string;
    schedule_name: string;
    comment: string | null;
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
    recipients: string[];
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

/** Resolved DashboardSchedule type (camelCase for GraphQL) */
export interface DashboardSchedule {
    id: string;
    cronJobId: string;
    organizationId: string;
    dashboardId: string;
    createdById: string;
    createdByName: string;
    createdByEmail: string;
    scheduleName: string;
    comment: string | null;
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
    gatingCondition: Record<string, unknown> | null;
    attachmentType: AttachmentType | null;
    recipients: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

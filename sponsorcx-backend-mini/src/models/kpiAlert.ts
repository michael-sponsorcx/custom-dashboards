/** Base alert input fields common to schedules and thresholds */
export interface BaseAlertInput {
    graphId?: string | null;
    dashboardId?: string | null;
    createdById?: string | null;
    alertName: string;
    comment?: string | null;
    recipients?: (string | null)[] | null;
    isActive?: boolean | null;
}

/** Normalized alert input with all fields defined */
export interface NormalizedAlertInput {
    [key: string]: unknown;
    graphId: string | null;
    dashboardId: string | null;
    createdById: string | null;
    alertName: string;
    alertType: 'schedule' | 'threshold';
    comment: string | null;
    recipients: string[];
    isActive: boolean;
}

/** Alert columns from a joined database row (snake_case from PostgreSQL) */
export interface AlertRowColumns {
    alert_id: string;
    cron_job_id: string;
    organization_id: string | null;
    graph_id: string | null;
    dashboard_id: string | null;
    created_by_id: string | null;
    alert_name: string;
    alert_type: string;
    comment: string | null;
    recipients: string[];
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}

/** KPI Alert resolved type (camelCase for GraphQL) */
export interface KpiAlert {
    id: string;
    cronJobId: string;
    organizationId: string | null;
    graphId: string | null;
    dashboardId: string | null;
    createdById: string | null;
    alertName: string;
    alertType: string;
    comment: string | null;
    recipients: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Normalize base alert input with defaults.
 * Ensures all optional fields have explicit values for SQL insertion.
 */
export const normalizeAlertInput = (
    input: BaseAlertInput,
    alertType: 'schedule' | 'threshold'
): NormalizedAlertInput => ({
    graphId: input.graphId ?? null,
    dashboardId: input.dashboardId ?? null,
    createdById: input.createdById ?? null,
    alertName: input.alertName,
    alertType,
    comment: input.comment ?? null,
    recipients: (input.recipients ?? []).filter((r): r is string => r !== null),
    isActive: input.isActive ?? true,
});

/**
 * Convert the alert columns from a joined row to camelCase.
 * Used by both kpiSchedule and kpiThreshold models.
 */
export const rowToKpiAlert = (row: AlertRowColumns): KpiAlert => ({
    id: row.alert_id,
    cronJobId: row.cron_job_id,
    organizationId: row.organization_id,
    graphId: row.graph_id,
    dashboardId: row.dashboard_id,
    createdById: row.created_by_id,
    alertName: row.alert_name,
    alertType: row.alert_type,
    comment: row.comment,
    recipients: row.recipients,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
});

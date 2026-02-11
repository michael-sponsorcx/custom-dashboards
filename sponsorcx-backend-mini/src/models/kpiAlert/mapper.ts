import type { BaseAlertInput, NormalizedAlertInput, AlertRowColumns, KpiAlert } from './types';

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

import type { KpiAlert as CodegenKpiAlert } from '../../generated/graphql';

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

/**
 * Resolved KpiAlert type (camelCase for GraphQL).
 * Overrides: date fields, nullable IDs, alertType (string vs enum),
 * recipients (non-null array), isActive (non-null boolean)
 */
type KpiAlertOverrides = {
    organizationId: string | null;
    graphId: string | null;
    dashboardId: string | null;
    createdById: string | null;
    alertType: string;
    recipients: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export type KpiAlert = Omit<CodegenKpiAlert, '__typename' | keyof KpiAlertOverrides> & KpiAlertOverrides;

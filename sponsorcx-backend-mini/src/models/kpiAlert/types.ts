import type { AlertType } from '../../generated/graphql';

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
    alertType: AlertType;
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
    alert_type: AlertType;
    comment: string | null;
    recipients: string[];
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}

/** Resolved KpiAlert type (camelCase for GraphQL) */
export interface KpiAlert {
    id: string;
    cronJobId: string;
    organizationId: string | null;
    graphId: string | null;
    dashboardId: string | null;
    createdById: string | null;
    alertName: string;
    alertType: AlertType;
    comment: string | null;
    recipients: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

/** Base kpi_alerts DB row (snake_case, uses kpi_alert_id alias) */
export interface KpiAlertRow {
    cron_job_id: string;
    kpi_alert_id: string;
    organization_id: string | null;
    graph_id: string | null;
    dashboard_id: string | null;
    created_by_id: string | null;
    alert_name: string;
    alert_type: AlertType;
    comment: string | null;
    recipients: string[];
    is_active: boolean;
}

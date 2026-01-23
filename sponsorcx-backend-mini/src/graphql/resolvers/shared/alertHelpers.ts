/**
 * Shared helper functions for KPI alert resolvers
 *
 * Contains common utilities used by both kpiScheduleResolvers and kpiThresholdResolvers
 */

// ============================================================================
// Types
// ============================================================================

/** Base alert input fields common to schedules and thresholds */
export interface BaseAlertInput {
    graphId?: string | null;
    dashboardId?: string | null;
    createdById?: string | null;
    alertName: string;
    comment?: string | null;
    recipients?: string[];
    isActive?: boolean;
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

/** Base KPI Alert record from database (after camelCase conversion) */
export interface KpiAlertRecord {
    id: string;
    organizationId: number | null;
    graphId: string | null;
    dashboardId: string | null;
    createdById: string | null;
    alertName: string;
    alertType: string;
    comment: string | null;
    recipients: string[];
    isActive: boolean;
    lastExecutedAt: Date | null;
    nextExecutionAt: Date | null;
    executionCount: number;
    createdAt: Date;
    updatedAt: Date;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Normalize base alert input with defaults
 * @param input - Raw input from GraphQL mutation
 * @param alertType - Type of alert ('schedule' or 'threshold')
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
    recipients: input.recipients ?? [],
    isActive: input.isActive ?? true,
});

/**
 * Transform a flat database row with "alert." prefixed columns into a nested object
 *
 * The JOIN queries return columns like:
 *   - s.id, s.frequency_interval (child table columns)
 *   - a.id AS "alert.id", a.alert_name AS "alert.alertName" (parent table columns)
 *
 * After query() conversion, we get: { id, frequencyInterval, "alert.id", "alert.alertName" }
 * This function extracts "alert." prefixed keys into a nested `alert` object.
 *
 * @param row - Flat row from database query (after camelCase conversion)
 * @returns Object with child fields at top level and alert fields nested
 */
export const transformRowWithAlert = (
    row: Record<string, unknown>
): { alert: KpiAlertRecord } & Record<string, unknown> => {
    const child: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(row)) {
        if (!key.startsWith('alert.')) {
            child[key] = value;
        }
    }

    // Explicitly construct the alert object with proper typing
    const alert: KpiAlertRecord = {
        id: row['alert.id'] as string,
        organizationId: row['alert.organizationId'] as number | null,
        graphId: row['alert.graphId'] as string | null,
        dashboardId: row['alert.dashboardId'] as string | null,
        createdById: row['alert.createdById'] as string | null,
        alertName: row['alert.alertName'] as string,
        alertType: row['alert.alertType'] as string,
        comment: row['alert.comment'] as string | null,
        recipients: row['alert.recipients'] as string[],
        isActive: row['alert.isActive'] as boolean,
        lastExecutedAt: row['alert.lastExecutedAt'] as Date | null,
        nextExecutionAt: row['alert.nextExecutionAt'] as Date | null,
        executionCount: row['alert.executionCount'] as number,
        createdAt: row['alert.createdAt'] as Date,
        updatedAt: row['alert.updatedAt'] as Date,
    };

    return {
        ...child,
        alert,
    };
};

/**
 * SQL fragment for selecting all kpi_alerts columns with "alert." prefix
 * Use this in JOIN queries to consistently select alert fields
 */
export const ALERT_SELECT_FIELDS = `
    a.id AS "alert.id",
    a.organization_id AS "alert.organizationId",
    a.graph_id AS "alert.graphId",
    a.dashboard_id AS "alert.dashboardId",
    a.created_by_id AS "alert.createdById",
    a.alert_name AS "alert.alertName",
    a.alert_type AS "alert.alertType",
    a.comment AS "alert.comment",
    a.recipients AS "alert.recipients",
    a.is_active AS "alert.isActive",
    a.last_executed_at AS "alert.lastExecutedAt",
    a.next_execution_at AS "alert.nextExecutionAt",
    a.execution_count AS "alert.executionCount",
    a.created_at AS "alert.createdAt",
    a.updated_at AS "alert.updatedAt"
`;

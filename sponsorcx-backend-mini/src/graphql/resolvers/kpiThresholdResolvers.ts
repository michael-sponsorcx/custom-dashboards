import { GraphQLNonNull, GraphQLID, GraphQLList, GraphQLBoolean } from 'graphql';
import { query } from '../../db/connection';
import { KpiThresholdType, CreateKpiThresholdInput } from '../types';

// ============================================================================
// Database Row Type (snake_case from PostgreSQL joined query)
// ============================================================================

interface KpiThresholdRow {
    // From kpi_thresholds table
    threshold_id: string;
    kpi_alert_id: string;
    condition: string;
    threshold_value: string; // NUMERIC returns as string from pg driver
    time_zone: string;
    // From kpi_alerts table
    alert_id: string;
    organization_id: string | null;
    graph_id: string | null;
    dashboard_id: string | null;
    created_by_id: string | null;
    alert_name: string;
    alert_type: string;
    comment: string | null;
    recipients: string[];
    is_active: boolean;
    last_executed_at: Date | null;
    next_execution_at: Date | null;
    execution_count: number;
    created_at: Date;
    updated_at: Date;
}

// ============================================================================
// Resolved Types (camelCase for GraphQL)
// ============================================================================

interface KpiAlert {
    id: string;
    organizationId: string | null;
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

interface KpiThreshold {
    id: string;
    kpiAlertId: string;
    condition: string;
    thresholdValue: number;
    timeZone: string;
    alert: KpiAlert;
}

// ============================================================================
// Resolver Argument Types
// ============================================================================

interface KpiThresholdsByGraphArgs {
    graphId: string;
}

interface CreateKpiThresholdInputData {
    graphId?: string | null;
    dashboardId: string;
    createdById: string;
    alertName: string;
    comment?: string | null;
    recipients?: string[];
    isActive?: boolean;
    condition: string;
    thresholdValue: number;
    timeZone?: string;
}

interface CreateKpiThresholdArgs {
    organizationId: string;
    input: CreateKpiThresholdInputData;
}

interface DeleteKpiThresholdArgs {
    id: string;
}

interface ToggleKpiThresholdActiveArgs {
    id: string;
    isActive: boolean;
}

// ============================================================================
// Row-to-Object Converter
// ============================================================================

const kpiThresholdToCamelCase = (row: KpiThresholdRow): KpiThreshold => ({
    id: row.threshold_id,
    kpiAlertId: row.kpi_alert_id,
    condition: row.condition,
    thresholdValue: parseFloat(row.threshold_value),
    timeZone: row.time_zone,
    alert: {
        id: row.alert_id,
        organizationId: row.organization_id,
        graphId: row.graph_id,
        dashboardId: row.dashboard_id,
        createdById: row.created_by_id,
        alertName: row.alert_name,
        alertType: row.alert_type,
        comment: row.comment,
        recipients: row.recipients,
        isActive: row.is_active,
        lastExecutedAt: row.last_executed_at,
        nextExecutionAt: row.next_execution_at,
        executionCount: row.execution_count,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    },
});

// ============================================================================
// SQL Helpers
// ============================================================================

const SELECT_THRESHOLD_SQL = `
    SELECT
        t.id as threshold_id,
        t.kpi_alert_id,
        t.condition,
        t.threshold_value,
        t.time_zone,
        a.id as alert_id,
        a.organization_id,
        a.graph_id,
        a.dashboard_id,
        a.created_by_id,
        a.alert_name,
        a.alert_type,
        a.comment,
        a.recipients,
        a.is_active,
        a.last_executed_at,
        a.next_execution_at,
        a.execution_count,
        a.created_at,
        a.updated_at
    FROM kpi_thresholds t
    JOIN kpi_alerts a ON a.id = t.kpi_alert_id
    WHERE a.alert_type = 'threshold'
`;

// ============================================================================
// Queries
// ============================================================================

export const kpiThresholdQueries = {
    kpiThresholdsByGraph: {
        type: new GraphQLList(KpiThresholdType),
        args: {
            graphId: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: unknown, args: KpiThresholdsByGraphArgs): Promise<KpiThreshold[]> => {
            const sql = `${SELECT_THRESHOLD_SQL} AND a.graph_id = $1 ORDER BY a.created_at DESC`;
            const result = await query(sql, [args.graphId]);
            return result.rows.map((row: unknown) => kpiThresholdToCamelCase(row as KpiThresholdRow));
        },
    },
};

// ============================================================================
// Mutations
// ============================================================================

export const kpiThresholdMutations = {
    createKpiThreshold: {
        type: KpiThresholdType,
        args: {
            organizationId: { type: new GraphQLNonNull(GraphQLID) },
            input: { type: new GraphQLNonNull(CreateKpiThresholdInput) },
        },
        resolve: async (_: unknown, args: CreateKpiThresholdArgs): Promise<KpiThreshold> => {
            // Insert into kpi_alerts first
            const alertSql = `
                INSERT INTO kpi_alerts (
                    organization_id, graph_id, dashboard_id, created_by_id,
                    alert_name, alert_type, comment, recipients, is_active, next_execution_at
                ) VALUES ($1, $2, $3, $4, $5, 'threshold', $6, $7, $8, NOW())
                RETURNING id
            `;
            const alertParams = [
                args.organizationId,
                args.input.graphId ?? null,
                args.input.dashboardId,
                args.input.createdById,
                args.input.alertName,
                args.input.comment ?? null,
                args.input.recipients ?? [],
                args.input.isActive ?? true,
            ];

            const alertResult = await query(alertSql, alertParams);
            const alertId = alertResult.rows[0].id;

            // Insert into kpi_thresholds
            const thresholdSql = `
                INSERT INTO kpi_thresholds (kpi_alert_id, condition, threshold_value, time_zone)
                VALUES ($1, $2, $3, $4)
            `;
            const thresholdParams = [
                alertId,
                args.input.condition,
                args.input.thresholdValue,
                args.input.timeZone ?? 'UTC',
            ];

            await query(thresholdSql, thresholdParams);

            // Fetch and return the complete threshold with nested alert
            const sql = `${SELECT_THRESHOLD_SQL} AND a.id = $1`;
            const result = await query(sql, [alertId]);
            return kpiThresholdToCamelCase(result.rows[0] as KpiThresholdRow);
        },
    },

    deleteKpiThreshold: {
        type: GraphQLBoolean,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: unknown, args: DeleteKpiThresholdArgs): Promise<boolean> => {
            // Get the kpi_alert_id from the threshold first
            const thresholdResult = await query(
                'SELECT kpi_alert_id FROM kpi_thresholds WHERE id = $1',
                [args.id]
            );

            if (thresholdResult.rows.length === 0) {
                return false;
            }

            const alertId = thresholdResult.rows[0].kpi_alert_id;

            // Deleting from kpi_alerts will cascade to kpi_thresholds
            const result = await query('DELETE FROM kpi_alerts WHERE id = $1 RETURNING id', [alertId]);
            return (result.rowCount ?? 0) > 0;
        },
    },

    toggleKpiThresholdActive: {
        type: KpiThresholdType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            isActive: { type: new GraphQLNonNull(GraphQLBoolean) },
        },
        resolve: async (_: unknown, args: ToggleKpiThresholdActiveArgs): Promise<KpiThreshold | null> => {
            // Get the kpi_alert_id from the threshold first
            const thresholdResult = await query(
                'SELECT kpi_alert_id FROM kpi_thresholds WHERE id = $1',
                [args.id]
            );

            if (thresholdResult.rows.length === 0) {
                return null;
            }

            const alertId = thresholdResult.rows[0].kpi_alert_id;

            await query(
                'UPDATE kpi_alerts SET is_active = $2 WHERE id = $1',
                [alertId, args.isActive]
            );

            const sql = `${SELECT_THRESHOLD_SQL} AND t.id = $1`;
            const result = await query(sql, [args.id]);
            return result.rows[0] ? kpiThresholdToCamelCase(result.rows[0] as KpiThresholdRow) : null;
        },
    },
};

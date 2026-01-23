import { GraphQLNonNull, GraphQLID, GraphQLList, GraphQLBoolean } from 'graphql';
import { query } from '../../db/connection';
import { KpiThresholdType, CreateKpiThresholdInput } from '../types';

// ============================================================================
// Database Row Type (snake_case from PostgreSQL joined query)
// ============================================================================

interface KpiThresholdRow {
    // From kpi_alerts table
    id: string;
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
    // From kpi_thresholds table
    threshold_id: string;
    condition: string;
    threshold_value: string; // NUMERIC returns as string from pg driver
    time_zone: string;
}

// ============================================================================
// Resolved Type (camelCase for GraphQL)
// ============================================================================

interface KpiThreshold {
    id: string;
    organizationId: string | null;
    graphId: string | null;
    dashboardId: string | null;
    createdById: string | null;
    alertName: string;
    comment: string | null;
    recipients: string[];
    isActive: boolean;
    lastExecutedAt: Date | null;
    nextExecutionAt: Date | null;
    executionCount: number;
    condition: string;
    thresholdValue: number;
    timeZone: string;
    createdAt: Date;
    updatedAt: Date;
}

// ============================================================================
// Resolver Argument Types
// ============================================================================

interface KpiThresholdsByGraphArgs {
    graphId: string;
}

interface CreateKpiThresholdInputData {
    graphId?: string | null;
    dashboardId?: string | null;
    createdById?: string | null;
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
    id: row.id,
    organizationId: row.organization_id,
    graphId: row.graph_id,
    dashboardId: row.dashboard_id,
    createdById: row.created_by_id,
    alertName: row.alert_name,
    comment: row.comment,
    recipients: row.recipients,
    isActive: row.is_active,
    lastExecutedAt: row.last_executed_at,
    nextExecutionAt: row.next_execution_at,
    executionCount: row.execution_count,
    condition: row.condition,
    thresholdValue: parseFloat(row.threshold_value),
    timeZone: row.time_zone,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
});

// ============================================================================
// SQL Helpers
// ============================================================================

const SELECT_THRESHOLD_SQL = `
    SELECT
        a.id,
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
        a.updated_at,
        t.id as threshold_id,
        t.condition,
        t.threshold_value,
        t.time_zone
    FROM kpi_alerts a
    JOIN kpi_thresholds t ON t.kpi_alert_id = a.id
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
                    alert_name, alert_type, comment, recipients, is_active
                ) VALUES ($1, $2, $3, $4, $5, 'threshold', $6, $7, $8)
                RETURNING id
            `;
            const alertParams = [
                args.organizationId,
                args.input.graphId ?? null,
                args.input.dashboardId ?? null,
                args.input.createdById ?? null,
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

            // Fetch and return the complete threshold
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
            // Deleting from kpi_alerts will cascade to kpi_thresholds
            const result = await query('DELETE FROM kpi_alerts WHERE id = $1 RETURNING id', [args.id]);
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
            await query(
                'UPDATE kpi_alerts SET is_active = $2 WHERE id = $1',
                [args.id, args.isActive]
            );

            const sql = `${SELECT_THRESHOLD_SQL} AND a.id = $1`;
            const result = await query(sql, [args.id]);
            return result.rows[0] ? kpiThresholdToCamelCase(result.rows[0] as KpiThresholdRow) : null;
        },
    },
};

import { GraphQLNonNull, GraphQLID, GraphQLList, GraphQLBoolean } from 'graphql';
import { pool, query } from '../../db/connection';
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

// ============================================================================
// Resolved Types (camelCase for GraphQL)
// ============================================================================

interface KpiAlert {
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
        a.cron_job_id,
        a.organization_id,
        a.graph_id,
        a.dashboard_id,
        a.created_by_id,
        a.alert_name,
        a.alert_type,
        a.comment,
        a.recipients,
        a.is_active,
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
            const client = await pool.connect();
            try {
                await client.query('BEGIN');

                // 1. Insert into cron_jobs first (top of hierarchy)
                // Note: Using random bigint for id (future system will auto-increment)
                const cronJobName = `kpi_threshold_${args.organizationId}_${args.input.alertName}`;
                const cronJobSql = `
                    INSERT INTO cron_jobs (id, job_name, locked, master_locked, last_ran_at_date, last_ran_at_hour, last_ran_at_minute)
                    VALUES ((floor(random() * 9000000000) + 1000000000)::bigint::text, $1, false, false, '1970-01-01', '00', '00')
                    RETURNING id
                `;
                const cronJobResult = await client.query(cronJobSql, [cronJobName]);
                const cronJobId = cronJobResult.rows[0].id;

                // 2. Insert into kpi_alerts (references cron_jobs)
                const alertSql = `
                    INSERT INTO kpi_alerts (
                        cron_job_id, organization_id, graph_id, dashboard_id, created_by_id,
                        alert_name, alert_type, comment, recipients, is_active
                    ) VALUES ($1, $2, $3, $4, $5, $6, 'threshold', $7, $8, $9)
                    RETURNING id
                `;
                const alertParams = [
                    cronJobId,
                    args.organizationId,
                    args.input.graphId ?? null,
                    args.input.dashboardId,
                    args.input.createdById,
                    args.input.alertName,
                    args.input.comment ?? null,
                    args.input.recipients ?? [],
                    args.input.isActive ?? true,
                ];
                const alertResult = await client.query(alertSql, alertParams);
                const alertId = alertResult.rows[0].id;

                // 3. Insert into kpi_thresholds (references kpi_alerts)
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
                await client.query(thresholdSql, thresholdParams);

                await client.query('COMMIT');

                // Fetch and return the complete threshold with nested alert
                const sql = `${SELECT_THRESHOLD_SQL} AND a.id = $1`;
                const result = await query(sql, [alertId]);
                return kpiThresholdToCamelCase(result.rows[0] as KpiThresholdRow);
            } catch (e) {
                await client.query('ROLLBACK');
                throw e;
            } finally {
                client.release();
            }
        },
    },

    deleteKpiThreshold: {
        type: GraphQLBoolean,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: unknown, args: DeleteKpiThresholdArgs): Promise<boolean> => {
            const client = await pool.connect();
            try {
                await client.query('BEGIN');

                // Get the cron_job_id by joining through kpi_thresholds -> kpi_alerts
                const result = await client.query(
                    `SELECT a.cron_job_id
                     FROM kpi_thresholds t
                     JOIN kpi_alerts a ON a.id = t.kpi_alert_id
                     WHERE t.id = $1`,
                    [args.id]
                );

                if (result.rows.length === 0) {
                    await client.query('ROLLBACK');
                    return false;
                }

                const cronJobId = result.rows[0].cron_job_id;

                // Delete from cron_jobs - cascades to kpi_alerts -> kpi_thresholds
                const deleteResult = await client.query('DELETE FROM cron_jobs WHERE id = $1 RETURNING id', [cronJobId]);

                await client.query('COMMIT');
                return (deleteResult.rowCount ?? 0) > 0;
            } catch (e) {
                await client.query('ROLLBACK');
                throw e;
            } finally {
                client.release();
            }
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

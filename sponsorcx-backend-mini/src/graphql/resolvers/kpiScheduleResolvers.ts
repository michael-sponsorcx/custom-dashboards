import { GraphQLNonNull, GraphQLID, GraphQLList, GraphQLBoolean } from 'graphql';
import { pool, query } from '../../db/connection';
import { KpiScheduleType, CreateKpiScheduleInput } from '../types';
import type { KpiAlert, AlertRowColumns, BaseAlertInput } from '../../types/kpi_alert';
import { normalizeAlertInput, rowToKpiAlert } from './shared/alertHelpers';
import {
    generateCronExpression,
    KpiScheduleRecord,
} from '../../services/schedules/calculateNextExecution';

// ============================================================================
// Database Row Type (snake_case from PostgreSQL joined query)
// ============================================================================

interface KpiScheduleRow extends AlertRowColumns {
    // From kpi_schedules table
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

// ============================================================================
// Resolved Types (camelCase for GraphQL)
// ============================================================================

interface KpiSchedule {
    id: string;
    kpiAlertId: string;
    frequencyInterval: string;
    minuteInterval: number | null;
    hourInterval: number | null;
    scheduleHour: number | null;
    scheduleMinute: number | null;
    selectedDays: string[];
    excludeWeekends: boolean;
    monthDates: number[];
    timeZone: string;
    hasGatingCondition: boolean;
    gatingCondition: unknown;
    attachmentType: string | null;
    cronExpression: string | null;
    alert: KpiAlert;
}

// ============================================================================
// Resolver Argument Types
// ============================================================================

interface KpiSchedulesByGraphArgs {
    graphId: string;
}

interface CreateKpiScheduleInputData extends BaseAlertInput {
    frequencyInterval: string;
    minuteInterval?: number | null;
    hourInterval?: number | null;
    scheduleHour?: number | null;
    scheduleMinute?: number | null;
    selectedDays?: string[];
    excludeWeekends?: boolean;
    monthDates?: number[];
    timeZone?: string;
    hasGatingCondition?: boolean;
    gatingCondition?: unknown;
    attachmentType?: string | null;
}

interface CreateKpiScheduleArgs {
    organizationId: string;
    input: CreateKpiScheduleInputData;
}

interface DeleteKpiScheduleArgs {
    id: string;
}

interface ToggleKpiScheduleActiveArgs {
    id: string;
    isActive: boolean;
}

// ============================================================================
// Row-to-Object Converter
// ============================================================================

const kpiScheduleToCamelCase = (row: KpiScheduleRow): KpiSchedule => ({
    id: row.schedule_id,
    kpiAlertId: row.kpi_alert_id,
    frequencyInterval: row.frequency_interval,
    minuteInterval: row.minute_interval,
    hourInterval: row.hour_interval,
    scheduleHour: row.schedule_hour,
    scheduleMinute: row.schedule_minute,
    selectedDays: row.selected_days,
    excludeWeekends: row.exclude_weekends,
    monthDates: row.month_dates,
    timeZone: row.time_zone,
    hasGatingCondition: row.has_gating_condition,
    gatingCondition: row.gating_condition,
    attachmentType: row.attachment_type,
    cronExpression: row.cron_expression,
    alert: rowToKpiAlert(row),
});

/** Create a KpiScheduleRecord for next execution calculation */
const toScheduleRecord = (input: CreateKpiScheduleInputData): KpiScheduleRecord => ({
    frequency_interval: input.frequencyInterval as KpiScheduleRecord['frequency_interval'],
    minute_interval: input.minuteInterval ?? null,
    hour_interval: input.hourInterval ?? null,
    schedule_hour: input.scheduleHour ?? null,
    schedule_minute: input.scheduleMinute ?? null,
    selected_days: input.selectedDays ?? [],
    exclude_weekends: input.excludeWeekends ?? false,
    month_dates: input.monthDates ?? [],
    time_zone: input.timeZone ?? 'UTC',
    last_executed_at: null,
});

// ============================================================================
// SQL Helpers
// ============================================================================

const SELECT_SCHEDULE_SQL = `
    SELECT
        s.id as schedule_id,
        s.kpi_alert_id,
        s.frequency_interval,
        s.minute_interval,
        s.hour_interval,
        s.schedule_hour,
        s.schedule_minute,
        s.selected_days,
        s.exclude_weekends,
        s.month_dates,
        s.time_zone,
        s.has_gating_condition,
        s.gating_condition,
        s.attachment_type,
        s.cron_expression,
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
    FROM kpi_schedules s
    JOIN kpi_alerts a ON a.id = s.kpi_alert_id
    WHERE a.alert_type = 'schedule'
`;

// ============================================================================
// Queries
// ============================================================================

export const kpiScheduleQueries = {
    kpiSchedulesByGraph: {
        type: new GraphQLList(KpiScheduleType),
        args: {
            graphId: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: unknown, args: KpiSchedulesByGraphArgs): Promise<KpiSchedule[]> => {
            const sql = `${SELECT_SCHEDULE_SQL} AND a.graph_id = $1 ORDER BY a.created_at DESC`;
            const result = await query(sql, [args.graphId]);
            return result.rows.map((row: unknown) => kpiScheduleToCamelCase(row as KpiScheduleRow));
        },
    },
};

// ============================================================================
// Mutations
// ============================================================================

export const kpiScheduleMutations = {
    createKpiSchedule: {
        type: KpiScheduleType,
        args: {
            organizationId: { type: new GraphQLNonNull(GraphQLID) },
            input: { type: new GraphQLNonNull(CreateKpiScheduleInput) },
        },
        resolve: async (_: unknown, args: CreateKpiScheduleArgs): Promise<KpiSchedule> => {
            const client = await pool.connect();
            try {
                await client.query('BEGIN');

                // Calculate cron expression
                const scheduleRecord = toScheduleRecord(args.input);
                const cronExpression = generateCronExpression(scheduleRecord);

                // 1. Insert into cron_jobs first (top of hierarchy)
                // Note: Using random bigint for id (future system will auto-increment)
                // TODO: update this when we migrate to the full sponsorcx app
                const cronJobName = `kpi_schedule_${args.organizationId}_${args.input.alertName}`;
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
                    ) VALUES ($1, $2, $3, $4, $5, $6, 'schedule', $7, $8, $9)
                    RETURNING id
                `;
                const normalized = normalizeAlertInput(args.input, 'schedule');
                const alertParams = [
                    cronJobId,
                    args.organizationId,
                    normalized.graphId,
                    normalized.dashboardId,
                    normalized.createdById,
                    normalized.alertName,
                    normalized.comment,
                    normalized.recipients,
                    normalized.isActive,
                ];
                const alertResult = await client.query(alertSql, alertParams);
                const alertId = alertResult.rows[0].id;

                // 3. Insert into kpi_schedules (references kpi_alerts)
                const scheduleSql = `
                    INSERT INTO kpi_schedules (
                        kpi_alert_id, frequency_interval, minute_interval, hour_interval,
                        schedule_hour, schedule_minute, selected_days, exclude_weekends,
                        month_dates, time_zone, has_gating_condition, gating_condition,
                        attachment_type, cron_expression
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
                `;
                const scheduleParams = [
                    alertId,
                    args.input.frequencyInterval,
                    args.input.minuteInterval ?? null,
                    args.input.hourInterval ?? null,
                    args.input.scheduleHour ?? null,
                    args.input.scheduleMinute ?? null,
                    args.input.selectedDays ?? [],
                    args.input.excludeWeekends ?? false,
                    args.input.monthDates ?? [],
                    args.input.timeZone ?? 'UTC',
                    args.input.hasGatingCondition ?? false,
                    args.input.gatingCondition ? JSON.stringify(args.input.gatingCondition) : null,
                    args.input.attachmentType ?? null,
                    cronExpression,
                ];
                await client.query(scheduleSql, scheduleParams);

                await client.query('COMMIT');

                // Fetch and return the complete schedule with nested alert
                const sql = `${SELECT_SCHEDULE_SQL} AND a.id = $1`;
                const result = await query(sql, [alertId]);
                return kpiScheduleToCamelCase(result.rows[0] as KpiScheduleRow);
            } catch (e) {
                await client.query('ROLLBACK');
                throw e;
            } finally {
                client.release();
            }
        },
    },

    deleteKpiSchedule: {
        type: GraphQLBoolean,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: unknown, args: DeleteKpiScheduleArgs): Promise<boolean> => {
            const client = await pool.connect();
            try {
                await client.query('BEGIN');

                // Get the cron_job_id by joining through kpi_schedules -> kpi_alerts
                const result = await client.query(
                    `SELECT a.cron_job_id
                     FROM kpi_schedules s
                     JOIN kpi_alerts a ON a.id = s.kpi_alert_id
                     WHERE s.id = $1`,
                    [args.id]
                );

                if (result.rows.length === 0) {
                    await client.query('ROLLBACK');
                    return false;
                }

                const cronJobId = result.rows[0].cron_job_id;

                // Delete from cron_jobs - cascades to kpi_alerts -> kpi_schedules
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

    toggleKpiScheduleActive: {
        type: KpiScheduleType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            isActive: { type: new GraphQLNonNull(GraphQLBoolean) },
        },
        resolve: async (_: unknown, args: ToggleKpiScheduleActiveArgs): Promise<KpiSchedule | null> => {
            // Get the schedule to find alert_id
            const sql = `${SELECT_SCHEDULE_SQL} AND s.id = $1`;
            const existingResult = await query(sql, [args.id]);

            if (existingResult.rows.length === 0) {
                return null;
            }

            const row = existingResult.rows[0] as KpiScheduleRow;
            const alertId = row.kpi_alert_id;

            // Update is_active flag (execution scheduling is handled by cron_jobs table)
            await query(
                'UPDATE kpi_alerts SET is_active = $2 WHERE id = $1',
                [alertId, args.isActive]
            );

            // Fetch and return the updated schedule
            const resultSql = `${SELECT_SCHEDULE_SQL} AND s.id = $1`;
            const result = await query(resultSql, [args.id]);
            return result.rows[0] ? kpiScheduleToCamelCase(result.rows[0] as KpiScheduleRow) : null;
        },
    },
};

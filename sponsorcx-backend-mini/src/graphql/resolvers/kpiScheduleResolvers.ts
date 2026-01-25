import { GraphQLNonNull, GraphQLID, GraphQLList, GraphQLBoolean } from 'graphql';
import { query } from '../../db/connection';
import { KpiScheduleType, CreateKpiScheduleInput } from '../types';
import {
    calculateNextExecution,
    generateCronExpression,
    KpiScheduleRecord,
} from '../../services/schedules/calculateNextExecution';

// ============================================================================
// Database Row Type (snake_case from PostgreSQL joined query)
// ============================================================================

interface KpiScheduleRow {
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

interface CreateKpiScheduleInputData {
    graphId?: string | null;
    dashboardId?: string | null;
    createdById?: string | null;
    alertName: string;
    comment?: string | null;
    recipients?: string[];
    isActive?: boolean;
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

/** Create a KpiScheduleRecord from a database row for next execution calculation */
const rowToScheduleRecord = (row: KpiScheduleRow): KpiScheduleRecord => ({
    frequency_interval: row.frequency_interval as KpiScheduleRecord['frequency_interval'],
    minute_interval: row.minute_interval,
    hour_interval: row.hour_interval,
    schedule_hour: row.schedule_hour,
    schedule_minute: row.schedule_minute,
    selected_days: row.selected_days,
    exclude_weekends: row.exclude_weekends,
    month_dates: row.month_dates,
    time_zone: row.time_zone,
    last_executed_at: row.last_executed_at,
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
            // Calculate cron expression and next execution time
            const scheduleRecord = toScheduleRecord(args.input);
            const cronExpression = generateCronExpression(scheduleRecord);
            const nextExecutionAt = calculateNextExecution(scheduleRecord);

            // Insert into kpi_alerts first
            const alertSql = `
                INSERT INTO kpi_alerts (
                    organization_id, graph_id, dashboard_id, created_by_id,
                    alert_name, alert_type, comment, recipients, is_active,
                    next_execution_at
                ) VALUES ($1, $2, $3, $4, $5, 'schedule', $6, $7, $8, $9)
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
                nextExecutionAt,
            ];

            const alertResult = await query(alertSql, alertParams);
            const alertId = alertResult.rows[0].id;

            // Insert into kpi_schedules
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

            await query(scheduleSql, scheduleParams);

            // Fetch and return the complete schedule with nested alert
            const sql = `${SELECT_SCHEDULE_SQL} AND a.id = $1`;
            const result = await query(sql, [alertId]);
            return kpiScheduleToCamelCase(result.rows[0] as KpiScheduleRow);
        },
    },

    deleteKpiSchedule: {
        type: GraphQLBoolean,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: unknown, args: DeleteKpiScheduleArgs): Promise<boolean> => {
            // Get the kpi_alert_id from the schedule first
            const scheduleResult = await query(
                'SELECT kpi_alert_id FROM kpi_schedules WHERE id = $1',
                [args.id]
            );

            if (scheduleResult.rows.length === 0) {
                return false;
            }

            const alertId = scheduleResult.rows[0].kpi_alert_id;

            // Deleting from kpi_alerts will cascade to kpi_schedules
            const result = await query('DELETE FROM kpi_alerts WHERE id = $1 RETURNING id', [alertId]);
            return (result.rowCount ?? 0) > 0;
        },
    },

    toggleKpiScheduleActive: {
        type: KpiScheduleType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            isActive: { type: new GraphQLNonNull(GraphQLBoolean) },
        },
        resolve: async (_: unknown, args: ToggleKpiScheduleActiveArgs): Promise<KpiSchedule | null> => {
            // Get the schedule to find alert_id and recalculate next execution if needed
            const sql = `${SELECT_SCHEDULE_SQL} AND s.id = $1`;
            const existingResult = await query(sql, [args.id]);

            if (existingResult.rows.length === 0) {
                return null;
            }

            const row = existingResult.rows[0] as KpiScheduleRow;
            const alertId = row.kpi_alert_id;

            if (args.isActive) {
                // Recalculate next execution time when activating
                const scheduleRecord = rowToScheduleRecord(row);
                const nextExecutionAt = calculateNextExecution(scheduleRecord);

                await query(
                    'UPDATE kpi_alerts SET is_active = $2, next_execution_at = $3 WHERE id = $1',
                    [alertId, args.isActive, nextExecutionAt]
                );
            } else {
                await query(
                    'UPDATE kpi_alerts SET is_active = $2 WHERE id = $1',
                    [alertId, args.isActive]
                );
            }

            // Fetch and return the updated schedule
            const resultSql = `${SELECT_SCHEDULE_SQL} AND s.id = $1`;
            const result = await query(resultSql, [args.id]);
            return result.rows[0] ? kpiScheduleToCamelCase(result.rows[0] as KpiScheduleRow) : null;
        },
    },
};

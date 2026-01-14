import { GraphQLNonNull, GraphQLID, GraphQLList, GraphQLBoolean } from 'graphql';
import { query } from '../../db/connection';
import { KpiScheduleType, KpiScheduleInput } from '../types';
import {
    calculateNextExecution,
    generateCronExpression,
    KpiScheduleRecord,
} from '../../services/schedules/calculateNextExecution';

// ============================================================================
// Database Row Type (snake_case from PostgreSQL)
// ============================================================================

interface KpiScheduleRow {
    id: string;
    organization_id: string | null;
    graph_id: string | null;
    dashboard_id: string | null;
    created_by: string | null;
    schedule_name: string;
    comment: string | null;
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
    recipients: string[];
    is_active: boolean;
    cron_expression: string | null;
    last_executed_at: Date | null;
    next_execution_at: Date | null;
    execution_count: number;
    created_at: Date;
    updated_at: Date;
}

// ============================================================================
// Resolved Type (camelCase for GraphQL)
// ============================================================================

interface KpiSchedule {
    id: string;
    organizationId: string | null;
    graphId: string | null;
    dashboardId: string | null;
    createdBy: string | null;
    scheduleName: string;
    comment: string | null;
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
    recipients: string[];
    isActive: boolean;
    cronExpression: string | null;
    lastExecutedAt: Date | null;
    nextExecutionAt: Date | null;
    executionCount: number;
    createdAt: Date;
    updatedAt: Date;
}

// ============================================================================
// Resolver Argument Types
// ============================================================================

interface KpiSchedulesArgs {
    organizationId?: string;
    isActive?: boolean;
}

interface KpiScheduleArgs {
    id: string;
}

interface KpiSchedulesByGraphArgs {
    graphId: string;
}

interface KpiSchedulesByDashboardArgs {
    dashboardId: string;
}

interface KpiScheduleInputData {
    graphId?: string | null;
    dashboardId?: string | null;
    createdBy?: string | null;
    scheduleName: string;
    comment?: string | null;
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
    recipients?: string[];
    isActive?: boolean;
}

interface CreateKpiScheduleArgs {
    organizationId: string;
    input: KpiScheduleInputData;
}

interface UpdateKpiScheduleArgs {
    id: string;
    input: KpiScheduleInputData;
}

interface DeleteKpiScheduleArgs {
    id: string;
}

interface ToggleKpiScheduleActiveArgs {
    id: string;
    isActive: boolean;
}

interface UpdateKpiScheduleExecutionArgs {
    id: string;
}

// ============================================================================
// Database Row Format Type (for insert/update)
// ============================================================================

interface KpiScheduleDbInput {
    graph_id: string | null;
    dashboard_id: string | null;
    created_by: string | null;
    schedule_name: string;
    comment: string | null;
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
    recipients: string[];
    is_active: boolean;
}

// ============================================================================
// Row-to-Object Converters
// ============================================================================

/** Convert database row to camelCase for GraphQL */
const kpiScheduleToCamelCase = (row: KpiScheduleRow): KpiSchedule => ({
    id: row.id,
    organizationId: row.organization_id,
    graphId: row.graph_id,
    dashboardId: row.dashboard_id,
    createdBy: row.created_by,
    scheduleName: row.schedule_name,
    comment: row.comment,
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
    recipients: row.recipients,
    isActive: row.is_active,
    cronExpression: row.cron_expression,
    lastExecutedAt: row.last_executed_at,
    nextExecutionAt: row.next_execution_at,
    executionCount: row.execution_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
});

/** Convert GraphQL input to database row format */
const inputToDbRow = (input: KpiScheduleInputData): KpiScheduleDbInput => ({
    graph_id: input.graphId ?? null,
    dashboard_id: input.dashboardId ?? null,
    created_by: input.createdBy ?? null,
    schedule_name: input.scheduleName,
    comment: input.comment ?? null,
    frequency_interval: input.frequencyInterval,
    minute_interval: input.minuteInterval ?? null,
    hour_interval: input.hourInterval ?? null,
    schedule_hour: input.scheduleHour ?? null,
    schedule_minute: input.scheduleMinute ?? null,
    selected_days: input.selectedDays ?? [],
    exclude_weekends: input.excludeWeekends ?? false,
    month_dates: input.monthDates ?? [],
    time_zone: input.timeZone ?? 'UTC',
    has_gating_condition: input.hasGatingCondition ?? false,
    gating_condition: input.gatingCondition ?? null,
    attachment_type: input.attachmentType ?? null,
    recipients: input.recipients ?? [],
    is_active: input.isActive ?? true,
});

/** Create a KpiScheduleRecord for next execution calculation */
const toScheduleRecord = (dbRow: KpiScheduleDbInput): KpiScheduleRecord => ({
    frequency_interval: dbRow.frequency_interval as KpiScheduleRecord['frequency_interval'],
    minute_interval: dbRow.minute_interval,
    hour_interval: dbRow.hour_interval,
    schedule_hour: dbRow.schedule_hour,
    schedule_minute: dbRow.schedule_minute,
    selected_days: dbRow.selected_days,
    exclude_weekends: dbRow.exclude_weekends,
    month_dates: dbRow.month_dates,
    time_zone: dbRow.time_zone,
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
// Queries
// ============================================================================

export const kpiScheduleQueries = {
    /** List all schedules for an organization (used by Manage Schedules modal) */
    kpiSchedules: {
        type: new GraphQLList(KpiScheduleType),
        args: {
            organizationId: { type: GraphQLID },
            isActive: { type: GraphQLBoolean },
        },
        resolve: async (_: unknown, args: KpiSchedulesArgs): Promise<KpiSchedule[]> => {
            const conditions: string[] = [];
            const params: unknown[] = [];
            let paramIndex = 1;

            if (args.organizationId) {
                conditions.push(`organization_id = $${paramIndex++}`);
                params.push(args.organizationId);
            }

            if (args.isActive !== undefined) {
                conditions.push(`is_active = $${paramIndex++}`);
                params.push(args.isActive);
            }

            const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
            const sql = `SELECT * FROM kpi_schedules ${whereClause} ORDER BY created_at DESC`;

            const result = await query(sql, params);
            return result.rows.map((row: unknown) => kpiScheduleToCamelCase(row as KpiScheduleRow));
        },
    },

    /** Get a single schedule by ID (used by Edit Schedule modal) */
    kpiSchedule: {
        type: KpiScheduleType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: unknown, args: KpiScheduleArgs): Promise<KpiSchedule | null> => {
            const result = await query('SELECT * FROM kpi_schedules WHERE id = $1', [args.id]);
            return result.rows[0] ? kpiScheduleToCamelCase(result.rows[0] as KpiScheduleRow) : null;
        },
    },

    /** Get schedules for a specific graph (show "This KPI has 2 scheduled reports") */
    kpiSchedulesByGraph: {
        type: new GraphQLList(KpiScheduleType),
        args: {
            graphId: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: unknown, args: KpiSchedulesByGraphArgs): Promise<KpiSchedule[]> => {
            const result = await query(
                'SELECT * FROM kpi_schedules WHERE graph_id = $1 ORDER BY created_at DESC',
                [args.graphId]
            );
            return result.rows.map((row: unknown) => kpiScheduleToCamelCase(row as KpiScheduleRow));
        },
    },

    /** Get schedules for a dashboard (dashboard-level scheduled reports) */
    kpiSchedulesByDashboard: {
        type: new GraphQLList(KpiScheduleType),
        args: {
            dashboardId: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: unknown, args: KpiSchedulesByDashboardArgs): Promise<KpiSchedule[]> => {
            const result = await query(
                'SELECT * FROM kpi_schedules WHERE dashboard_id = $1 ORDER BY created_at DESC',
                [args.dashboardId]
            );
            return result.rows.map((row: unknown) => kpiScheduleToCamelCase(row as KpiScheduleRow));
        },
    },
};

// ============================================================================
// Mutations
// ============================================================================

export const kpiScheduleMutations = {
    /** Create a new schedule (Create Schedule modal) */
    createKpiSchedule: {
        type: KpiScheduleType,
        args: {
            organizationId: { type: new GraphQLNonNull(GraphQLID) },
            input: { type: new GraphQLNonNull(KpiScheduleInput) },
        },
        resolve: async (_: unknown, args: CreateKpiScheduleArgs): Promise<KpiSchedule> => {
            const dbRow = inputToDbRow(args.input);

            // Calculate cron expression and next execution time
            const scheduleRecord = toScheduleRecord(dbRow);
            const cronExpression = generateCronExpression(scheduleRecord);
            const nextExecutionAt = calculateNextExecution(scheduleRecord);

            const sql = `
                INSERT INTO kpi_schedules (
                    organization_id, graph_id, dashboard_id, created_by, schedule_name, comment,
                    frequency_interval, minute_interval, hour_interval, schedule_hour, schedule_minute,
                    selected_days, exclude_weekends, month_dates, time_zone,
                    has_gating_condition, gating_condition, attachment_type, recipients,
                    is_active, cron_expression, next_execution_at
                ) VALUES (
                    $1, $2, $3, $4, $5, $6,
                    $7, $8, $9, $10, $11,
                    $12, $13, $14, $15,
                    $16, $17, $18, $19,
                    $20, $21, $22
                )
                RETURNING *
            `;

            const params = [
                args.organizationId,
                dbRow.graph_id,
                dbRow.dashboard_id,
                dbRow.created_by,
                dbRow.schedule_name,
                dbRow.comment,
                dbRow.frequency_interval,
                dbRow.minute_interval,
                dbRow.hour_interval,
                dbRow.schedule_hour,
                dbRow.schedule_minute,
                dbRow.selected_days,
                dbRow.exclude_weekends,
                dbRow.month_dates,
                dbRow.time_zone,
                dbRow.has_gating_condition,
                dbRow.gating_condition ? JSON.stringify(dbRow.gating_condition) : null,
                dbRow.attachment_type,
                dbRow.recipients,
                dbRow.is_active,
                cronExpression,
                nextExecutionAt,
            ];

            const result = await query(sql, params);
            return kpiScheduleToCamelCase(result.rows[0] as KpiScheduleRow);
        },
    },

    /** Update an existing schedule (Edit Schedule modal) */
    updateKpiSchedule: {
        type: KpiScheduleType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            input: { type: new GraphQLNonNull(KpiScheduleInput) },
        },
        resolve: async (_: unknown, args: UpdateKpiScheduleArgs): Promise<KpiSchedule | null> => {
            const dbRow = inputToDbRow(args.input);

            // Calculate cron expression and next execution time
            const scheduleRecord = toScheduleRecord(dbRow);
            const cronExpression = generateCronExpression(scheduleRecord);
            const nextExecutionAt = calculateNextExecution(scheduleRecord);

            const sql = `
                UPDATE kpi_schedules SET
                    graph_id = $2,
                    dashboard_id = $3,
                    schedule_name = $4,
                    comment = $5,
                    frequency_interval = $6,
                    minute_interval = $7,
                    hour_interval = $8,
                    schedule_hour = $9,
                    schedule_minute = $10,
                    selected_days = $11,
                    exclude_weekends = $12,
                    month_dates = $13,
                    time_zone = $14,
                    has_gating_condition = $15,
                    gating_condition = $16,
                    attachment_type = $17,
                    recipients = $18,
                    is_active = $19,
                    cron_expression = $20,
                    next_execution_at = $21
                WHERE id = $1
                RETURNING *
            `;

            const params = [
                args.id,
                dbRow.graph_id,
                dbRow.dashboard_id,
                dbRow.schedule_name,
                dbRow.comment,
                dbRow.frequency_interval,
                dbRow.minute_interval,
                dbRow.hour_interval,
                dbRow.schedule_hour,
                dbRow.schedule_minute,
                dbRow.selected_days,
                dbRow.exclude_weekends,
                dbRow.month_dates,
                dbRow.time_zone,
                dbRow.has_gating_condition,
                dbRow.gating_condition ? JSON.stringify(dbRow.gating_condition) : null,
                dbRow.attachment_type,
                dbRow.recipients,
                dbRow.is_active,
                cronExpression,
                nextExecutionAt,
            ];

            const result = await query(sql, params);
            return result.rows[0] ? kpiScheduleToCamelCase(result.rows[0] as KpiScheduleRow) : null;
        },
    },

    /** Delete a schedule (Delete button in Manage Schedules) */
    deleteKpiSchedule: {
        type: GraphQLBoolean,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: unknown, args: DeleteKpiScheduleArgs): Promise<boolean> => {
            const result = await query('DELETE FROM kpi_schedules WHERE id = $1 RETURNING id', [args.id]);
            return (result.rowCount ?? 0) > 0;
        },
    },

    /** Pause/Resume toggle (quick action without opening edit form) */
    toggleKpiScheduleActive: {
        type: KpiScheduleType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            isActive: { type: new GraphQLNonNull(GraphQLBoolean) },
        },
        resolve: async (_: unknown, args: ToggleKpiScheduleActiveArgs): Promise<KpiSchedule | null> => {
            // If activating, recalculate next execution time
            let sql: string;
            let params: unknown[];

            if (args.isActive) {
                // First get the current schedule to calculate next execution
                const existing = await query('SELECT * FROM kpi_schedules WHERE id = $1', [args.id]);
                if (!existing.rows[0]) return null;

                const scheduleRecord = rowToScheduleRecord(existing.rows[0] as KpiScheduleRow);
                const nextExecutionAt = calculateNextExecution(scheduleRecord);

                sql = `
                    UPDATE kpi_schedules
                    SET is_active = $2, next_execution_at = $3
                    WHERE id = $1
                    RETURNING *
                `;
                params = [args.id, args.isActive, nextExecutionAt];
            } else {
                sql = `
                    UPDATE kpi_schedules
                    SET is_active = $2
                    WHERE id = $1
                    RETURNING *
                `;
                params = [args.id, args.isActive];
            }

            const result = await query(sql, params);
            return result.rows[0] ? kpiScheduleToCamelCase(result.rows[0] as KpiScheduleRow) : null;
        },
    },

    /** Called by cron job after executing a schedule */
    updateKpiScheduleExecution: {
        type: KpiScheduleType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: unknown, args: UpdateKpiScheduleExecutionArgs): Promise<KpiSchedule | null> => {
            // Get current schedule
            const existing = await query('SELECT * FROM kpi_schedules WHERE id = $1', [args.id]);
            if (!existing.rows[0]) return null;

            // Calculate next execution time
            const scheduleRecord = rowToScheduleRecord(existing.rows[0] as KpiScheduleRow);
            const nextExecutionAt = calculateNextExecution(scheduleRecord);

            // Update last_executed_at, next_execution_at, and increment execution_count
            const sql = `
                UPDATE kpi_schedules
                SET
                    last_executed_at = NOW(),
                    next_execution_at = $2,
                    execution_count = execution_count + 1
                WHERE id = $1
                RETURNING *
            `;

            const result = await query(sql, [args.id, nextExecutionAt]);
            return result.rows[0] ? kpiScheduleToCamelCase(result.rows[0] as KpiScheduleRow) : null;
        },
    },
};

import { typedQuery, withTransaction } from '../../db/connection';
import type { DashboardScheduleRow, DashboardSchedule } from './types';
import { dashboardScheduleToCamelCase } from './mapper';
import type { DashboardScheduleInput } from '../../generated/graphql';

const SELECT_SCHEDULE_SQL = `
    SELECT
        ds.id,
        ds.cron_job_id,
        ds.organization_id,
        ds.dashboard_id,
        ds.created_by_id,
        u.first_name || ' ' || u.last_name AS created_by_name,
        u.email AS created_by_email,
        ds.schedule_name,
        ds.comment,
        ds.frequency_interval,
        ds.minute_interval,
        ds.hour_interval,
        ds.schedule_hour,
        ds.schedule_minute,
        ds.selected_days,
        ds.exclude_weekends,
        ds.month_dates,
        ds.time_zone,
        ds.has_gating_condition,
        ds.gating_condition,
        ds.attachment_type,
        ds.recipients,
        ds.is_active,
        ds.created_at,
        ds.updated_at
    FROM dashboard_schedules ds
    JOIN users u ON u.id = ds.created_by_id
`;

export const findAllDashboardSchedules = async (
    organizationId?: string,
    isActive?: boolean
): Promise<DashboardSchedule[]> => {
    const conditions: string[] = [];
    const params: (string | boolean)[] = [];

    if (organizationId) {
        params.push(organizationId);
        conditions.push(`ds.organization_id = $${params.length}`);
    }
    if (isActive !== undefined && isActive !== null) {
        params.push(isActive);
        conditions.push(`ds.is_active = $${params.length}`);
    }

    const where = conditions.length > 0 ? ` WHERE ${conditions.join(' AND ')}` : '';
    const sql = `${SELECT_SCHEDULE_SQL}${where} ORDER BY ds.created_at DESC`;
    const result = await typedQuery<DashboardScheduleRow>(sql, params);
    return result.rows.map(dashboardScheduleToCamelCase);
};

export const findDashboardScheduleById = async (id: string): Promise<DashboardSchedule | null> => {
    const sql = `${SELECT_SCHEDULE_SQL} WHERE ds.id = $1`;
    const result = await typedQuery<DashboardScheduleRow>(sql, [id]);
    return result.rows[0] ? dashboardScheduleToCamelCase(result.rows[0]) : null;
};

export const findDashboardSchedulesByDashboard = async (dashboardId: string): Promise<DashboardSchedule[]> => {
    const sql = `${SELECT_SCHEDULE_SQL} WHERE ds.dashboard_id = $1 ORDER BY ds.created_at DESC`;
    const result = await typedQuery<DashboardScheduleRow>(sql, [dashboardId]);
    return result.rows.map(dashboardScheduleToCamelCase);
};

export const createDashboardSchedule = async (
    organizationId: string,
    input: DashboardScheduleInput
): Promise<DashboardSchedule> => {
    const scheduleId = await withTransaction(async (client) => {
        // 1. Insert into cron_jobs
        const cronJobName = `dashboard_schedule_${organizationId}_${input.dashboardId}`;
        const cronJobSql = `
            INSERT INTO cron_jobs (id, job_name, locked, master_locked, last_ran_at_date, last_ran_at_hour, last_ran_at_minute)
            VALUES ((floor(random() * 9000000000) + 1000000000)::bigint::text, $1, false, false, '1970-01-01', '00', '00')
            RETURNING id
        `;
        const cronJobResult = await client.query<{ id: string }>(cronJobSql, [cronJobName]);
        const cronJobId = cronJobResult.rows[0].id;

        // 2. Insert into dashboard_schedules
        const scheduleSql = `
            INSERT INTO dashboard_schedules (
                cron_job_id, organization_id, dashboard_id, created_by_id,
                schedule_name, comment, frequency_interval, minute_interval,
                hour_interval, schedule_hour, schedule_minute, selected_days,
                exclude_weekends, month_dates, time_zone, has_gating_condition,
                gating_condition, attachment_type, recipients, is_active
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
            RETURNING id
        `;
        const scheduleParams = [
            cronJobId,
            organizationId,
            input.dashboardId,
            input.createdById,
            input.scheduleName,
            input.comment ?? null,
            input.frequencyInterval,
            input.minuteInterval ?? null,
            input.hourInterval ?? null,
            input.scheduleHour ?? null,
            input.scheduleMinute ?? null,
            (input.selectedDays ?? []).filter((d): d is string => d !== null),
            input.excludeWeekends ?? false,
            (input.monthDates ?? []).filter((d): d is number => d !== null),
            input.timeZone ?? 'UTC',
            input.hasGatingCondition ?? false,
            input.gatingCondition ?? null,
            input.attachmentType ?? null,
            (input.recipients ?? []).filter((r): r is string => r !== null),
            input.isActive ?? true,
        ];
        const scheduleResult = await client.query<{ id: string }>(scheduleSql, scheduleParams);
        return scheduleResult.rows[0].id;
    });

    // Fetch complete record after commit
    const sql = `${SELECT_SCHEDULE_SQL} WHERE ds.id = $1`;
    const result = await typedQuery<DashboardScheduleRow>(sql, [scheduleId]);
    return dashboardScheduleToCamelCase(result.rows[0]);
};

export const updateDashboardSchedule = async (
    id: string,
    input: DashboardScheduleInput
): Promise<DashboardSchedule | null> => {
    const sql = `
        UPDATE dashboard_schedules SET
            dashboard_id = $2,
            created_by_id = $3,
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
            is_active = $19
        WHERE id = $1
        RETURNING id
    `;
    const params = [
        id,
        input.dashboardId,
        input.createdById,
        input.scheduleName,
        input.comment ?? null,
        input.frequencyInterval,
        input.minuteInterval ?? null,
        input.hourInterval ?? null,
        input.scheduleHour ?? null,
        input.scheduleMinute ?? null,
        (input.selectedDays ?? []).filter((d): d is string => d !== null),
        input.excludeWeekends ?? false,
        (input.monthDates ?? []).filter((d): d is number => d !== null),
        input.timeZone ?? 'UTC',
        input.hasGatingCondition ?? false,
        input.gatingCondition ?? null,
        input.attachmentType ?? null,
        (input.recipients ?? []).filter((r): r is string => r !== null),
        input.isActive ?? true,
    ];

    const updateResult = await typedQuery<{ id: string }>(sql, params);
    if (updateResult.rows.length === 0) {
        return null;
    }

    const selectSql = `${SELECT_SCHEDULE_SQL} WHERE ds.id = $1`;
    const result = await typedQuery<DashboardScheduleRow>(selectSql, [id]);
    return result.rows[0] ? dashboardScheduleToCamelCase(result.rows[0]) : null;
};

export const toggleDashboardScheduleActive = async (id: string, isActive: boolean): Promise<DashboardSchedule | null> => {
    const updateResult = await typedQuery<{ id: string }>(
        'UPDATE dashboard_schedules SET is_active = $2 WHERE id = $1 RETURNING id',
        [id, isActive]
    );

    if (updateResult.rows.length === 0) {
        return null;
    }

    const sql = `${SELECT_SCHEDULE_SQL} WHERE ds.id = $1`;
    const result = await typedQuery<DashboardScheduleRow>(sql, [id]);
    return result.rows[0] ? dashboardScheduleToCamelCase(result.rows[0]) : null;
};

export const deleteDashboardSchedule = async (id: string): Promise<boolean> => {
    return withTransaction(async (client) => {
        // Look up the cron_job_id first
        const result = await client.query<{ cron_job_id: string }>(
            'SELECT cron_job_id FROM dashboard_schedules WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return false;
        }

        // Deleting cron_jobs cascades to dashboard_schedules
        const cronJobId = result.rows[0].cron_job_id;
        const deleteResult = await client.query('DELETE FROM cron_jobs WHERE id = $1 RETURNING id', [cronJobId]);
        return (deleteResult.rowCount ?? 0) > 0;
    });
};

import { typedQuery, withTransaction } from '../../db/connection';
import type { KpiScheduleRow, KpiSchedule } from './types';
import { kpiScheduleToCamelCase } from './mapper';
import { normalizeAlertInput } from '../kpiAlert';
import { AlertType } from '../../generated/graphql';
import type { CreateKpiScheduleInput } from '../../generated/graphql';
import {
    generateCronExpression,
    KpiScheduleRecord,
} from '../../services/schedules/calculateNextExecution';

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
    WHERE a.alert_type = '${AlertType.Schedule}'
`;

/** Create a KpiScheduleRecord for next execution calculation */
const toScheduleRecord = (input: CreateKpiScheduleInput): KpiScheduleRecord => ({
    frequency_interval: input.frequencyInterval as unknown as KpiScheduleRecord['frequency_interval'],
    minute_interval: input.minuteInterval ?? null,
    hour_interval: input.hourInterval ?? null,
    schedule_hour: input.scheduleHour ?? null,
    schedule_minute: input.scheduleMinute ?? null,
    selected_days: (input.selectedDays ?? []).filter((d): d is string => d !== null),
    exclude_weekends: input.excludeWeekends ?? false,
    month_dates: (input.monthDates ?? []).filter((d): d is number => d !== null),
    time_zone: input.timeZone ?? 'UTC',
    last_executed_at: null,
});

export const findSchedulesByGraph = async (graphId: string): Promise<KpiSchedule[]> => {
    const sql = `${SELECT_SCHEDULE_SQL} AND a.graph_id = $1 ORDER BY a.created_at DESC`;
    const result = await typedQuery<KpiScheduleRow>(sql, [graphId]);
    return result.rows.map(kpiScheduleToCamelCase);
};

export const createKpiSchedule = async (
    organizationId: string,
    input: CreateKpiScheduleInput
): Promise<KpiSchedule> => {
    const scheduleRecord = toScheduleRecord(input);
    const cronExpression = generateCronExpression(scheduleRecord);

    const alertId = await withTransaction(async (client) => {
        // 1. Insert into cron_jobs
        const cronJobName = `kpi_schedule_${organizationId}_${input.alertName}`;
        const cronJobSql = `
            INSERT INTO cron_jobs (id, job_name, locked, master_locked, last_ran_at_date, last_ran_at_hour, last_ran_at_minute)
            VALUES ((floor(random() * 9000000000) + 1000000000)::bigint::text, $1, false, false, '1970-01-01', '00', '00')
            RETURNING id
        `;
        const cronJobResult = await client.query<{ id: string }>(cronJobSql, [cronJobName]);
        const cronJobId = cronJobResult.rows[0].id;

        // 2. Insert into kpi_alerts
        const alertSql = `
            INSERT INTO kpi_alerts (
                cron_job_id, organization_id, graph_id, dashboard_id, created_by_id,
                alert_name, alert_type, comment, recipients, is_active
            ) VALUES ($1, $2, $3, $4, $5, $6, 'schedule', $7, $8, $9)
            RETURNING id
        `;
        const normalized = normalizeAlertInput(input, AlertType.Schedule);
        const alertParams = [
            cronJobId,
            organizationId,
            normalized.graphId,
            normalized.dashboardId,
            normalized.createdById,
            normalized.alertName,
            normalized.comment,
            normalized.recipients,
            normalized.isActive,
        ];
        const alertResult = await client.query<{ id: string }>(alertSql, alertParams);
        const id = alertResult.rows[0].id;

        // 3. Insert into kpi_schedules
        const scheduleSql = `
            INSERT INTO kpi_schedules (
                kpi_alert_id, frequency_interval, minute_interval, hour_interval,
                schedule_hour, schedule_minute, selected_days, exclude_weekends,
                month_dates, time_zone, attachment_type, cron_expression
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        `;
        const scheduleParams = [
            id,
            input.frequencyInterval,
            input.minuteInterval ?? null,
            input.hourInterval ?? null,
            input.scheduleHour ?? null,
            input.scheduleMinute ?? null,
            (input.selectedDays ?? []).filter((d): d is string => d !== null),
            input.excludeWeekends ?? false,
            (input.monthDates ?? []).filter((d): d is number => d !== null),
            input.timeZone ?? 'UTC',
            input.attachmentType ?? null,
            cronExpression,
        ];
        await client.query(scheduleSql, scheduleParams);

        return id;
    });

    // Fetch complete record after commit
    const sql = `${SELECT_SCHEDULE_SQL} AND a.id = $1`;
    const result = await typedQuery<KpiScheduleRow>(sql, [alertId]);
    return kpiScheduleToCamelCase(result.rows[0]);
};

export const deleteKpiSchedule = async (id: string): Promise<boolean> => {
    return withTransaction(async (client) => {
        const result = await client.query<{ cron_job_id: string }>(
            `SELECT a.cron_job_id
             FROM kpi_schedules s
             JOIN kpi_alerts a ON a.id = s.kpi_alert_id
             WHERE s.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return false;
        }

        const cronJobId = result.rows[0].cron_job_id;
        const deleteResult = await client.query('DELETE FROM cron_jobs WHERE id = $1 RETURNING id', [cronJobId]);
        return (deleteResult.rowCount ?? 0) > 0;
    });
};

export const toggleKpiScheduleActive = async (id: string, isActive: boolean): Promise<KpiSchedule | null> => {
    const sql = `${SELECT_SCHEDULE_SQL} AND s.id = $1`;
    const existingResult = await typedQuery<KpiScheduleRow>(sql, [id]);

    if (existingResult.rows.length === 0) {
        return null;
    }

    const alertId = existingResult.rows[0].kpi_alert_id;
    await typedQuery<{ id: string }>(
        'UPDATE kpi_alerts SET is_active = $2 WHERE id = $1',
        [alertId, isActive]
    );

    const result = await typedQuery<KpiScheduleRow>(sql, [id]);
    return result.rows[0] ? kpiScheduleToCamelCase(result.rows[0]) : null;
};

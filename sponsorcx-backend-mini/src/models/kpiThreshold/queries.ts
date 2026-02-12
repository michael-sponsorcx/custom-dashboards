import { typedQuery, withTransaction } from '../../db/connection';
import type { KpiThresholdRow, KpiThreshold } from './types';
import { kpiThresholdToCamelCase } from './mapper';
import { normalizeAlertInput } from '../kpiAlert';
import { AlertType } from '../../generated/graphql';
import type { CreateKpiThresholdInput } from '../../generated/graphql';

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

export const findThresholdsByGraph = async (graphId: string): Promise<KpiThreshold[]> => {
    const sql = `${SELECT_THRESHOLD_SQL} AND a.graph_id = $1 ORDER BY a.created_at DESC`;
    const result = await typedQuery<KpiThresholdRow>(sql, [graphId]);
    return result.rows.map(kpiThresholdToCamelCase);
};

export const createKpiThreshold = async (
    organizationId: string,
    input: CreateKpiThresholdInput
): Promise<KpiThreshold> => {
    const alertId = await withTransaction(async (client) => {
        // 1. Insert into cron_jobs
        const cronJobName = `kpi_threshold_${organizationId}_${input.alertName}`;
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
            ) VALUES ($1, $2, $3, $4, $5, $6, 'threshold', $7, $8, $9)
            RETURNING id
        `;
        const normalized = normalizeAlertInput(input, AlertType.Threshold);
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

        // 3. Insert into kpi_thresholds
        const thresholdSql = `
            INSERT INTO kpi_thresholds (kpi_alert_id, condition, threshold_value, time_zone)
            VALUES ($1, $2, $3, $4)
        `;
        const thresholdParams = [
            id,
            input.condition,
            input.thresholdValue,
            input.timeZone ?? 'UTC',
        ];
        await client.query(thresholdSql, thresholdParams);

        return id;
    });

    // Fetch complete record after commit
    const sql = `${SELECT_THRESHOLD_SQL} AND a.id = $1`;
    const result = await typedQuery<KpiThresholdRow>(sql, [alertId]);
    return kpiThresholdToCamelCase(result.rows[0]);
};

export const deleteKpiThreshold = async (id: string): Promise<boolean> => {
    return withTransaction(async (client) => {
        const result = await client.query<{ cron_job_id: string }>(
            `SELECT a.cron_job_id
             FROM kpi_thresholds t
             JOIN kpi_alerts a ON a.id = t.kpi_alert_id
             WHERE t.id = $1`,
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

export const toggleKpiThresholdActive = async (id: string, isActive: boolean): Promise<KpiThreshold | null> => {
    const thresholdResult = await typedQuery<{ kpi_alert_id: string }>(
        'SELECT kpi_alert_id FROM kpi_thresholds WHERE id = $1',
        [id]
    );

    if (thresholdResult.rows.length === 0) {
        return null;
    }

    const alertId = thresholdResult.rows[0].kpi_alert_id;
    await typedQuery<{ id: string }>(
        'UPDATE kpi_alerts SET is_active = $2 WHERE id = $1',
        [alertId, isActive]
    );

    const sql = `${SELECT_THRESHOLD_SQL} AND t.id = $1`;
    const result = await typedQuery<KpiThresholdRow>(sql, [id]);
    return result.rows[0] ? kpiThresholdToCamelCase(result.rows[0]) : null;
};

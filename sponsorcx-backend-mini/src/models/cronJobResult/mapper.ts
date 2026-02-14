import type { CronJobResultRow, CronJobResult } from './types';

/** Convert a cron_job_results row to camelCase for GraphQL */
export const cronJobResultToCamelCase = (row: CronJobResultRow): CronJobResult => ({
    id: row.id,
    cronJobId: row.cron_job_id,
    notes: row.notes,
    completed: row.completed,
    jobStartTimestamp: row.job_start_timestamp,
    trigger: row.trigger,
    organizationId: row.organization_id,
});

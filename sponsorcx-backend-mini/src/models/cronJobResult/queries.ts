import { typedQuery } from '../../db/connection';
import type { CronJobResultRow, CronJobResult } from './types';
import { cronJobResultToCamelCase } from './mapper';

const SELECT_RESULT_SQL = `
    SELECT
        id,
        cron_job_id,
        notes,
        completed,
        job_start_timestamp,
        trigger,
        organization_id
    FROM cron_job_results
`;

export const findCronJobResultsByCronJobId = async (cronJobId: string): Promise<CronJobResult[]> => {
    const sql = `${SELECT_RESULT_SQL} WHERE cron_job_id = $1 ORDER BY job_start_timestamp DESC`;
    const result = await typedQuery<CronJobResultRow>(sql, [cronJobId]);
    return result.rows.map(cronJobResultToCamelCase);
};

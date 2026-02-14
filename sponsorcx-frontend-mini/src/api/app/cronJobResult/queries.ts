/**
 * Cron Job Result Query Operations
 *
 * Read operations for cron job execution history.
 */

import { executeBackendGraphQL } from '../../core/client';
import type { CronJobResult } from '../../../types/backend-graphql';
import { CRON_JOB_RESULT_FIELDS } from './fragments';

/**
 * Fetch cron job results by cron job ID
 */
export const fetchCronJobResults = async (cronJobId: string): Promise<CronJobResult[]> => {
  const query = `
    query FetchCronJobResults($cronJobId: ID!) {
      cronJobResultsByCronJobId(cronJobId: $cronJobId) {
        ${CRON_JOB_RESULT_FIELDS}
      }
    }
  `;

  const response = await executeBackendGraphQL<{ cronJobResultsByCronJobId: CronJobResult[] }>(query, {
    cronJobId,
  });

  return response.data?.cronJobResultsByCronJobId || [];
};

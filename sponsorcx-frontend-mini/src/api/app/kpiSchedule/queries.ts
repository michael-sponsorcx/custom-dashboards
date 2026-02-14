/**
 * KPI Schedule Query Operations
 *
 * Read operations for KPI schedules.
 */

import { executeBackendGraphQL } from '../../core/client';
import type { KpiSchedule } from '../../../types/backend-graphql';
import { KPI_SCHEDULE_FIELDS } from './fragments';

/**
 * Fetch KPI schedules for a graph
 */
export const fetchKpiSchedulesByGraph = async (graphId: string): Promise<KpiSchedule[]> => {
  const query = `
    query KpiSchedulesByGraph($graphId: ID!) {
      kpiSchedulesByGraph(graphId: $graphId) {
        ${KPI_SCHEDULE_FIELDS}
      }
    }
  `;

  const response = await executeBackendGraphQL<{ kpiSchedulesByGraph: KpiSchedule[] }>(query, {
    graphId,
  });

  return response.data?.kpiSchedulesByGraph || [];
};

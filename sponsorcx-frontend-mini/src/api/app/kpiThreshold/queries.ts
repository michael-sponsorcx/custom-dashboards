/**
 * KPI Threshold Query Operations
 *
 * Read operations for KPI thresholds.
 */

import { executeBackendGraphQL } from '../../core/client';
import type { KpiThreshold } from '../../../types/backend-graphql';
import { KPI_THRESHOLD_FIELDS } from './fragments';

/**
 * Fetch KPI thresholds for a graph
 */
export const fetchKpiThresholdsByGraph = async (graphId: string): Promise<KpiThreshold[]> => {
  const query = `
    query KpiThresholdsByGraph($graphId: ID!) {
      kpiThresholdsByGraph(graphId: $graphId) {
        ${KPI_THRESHOLD_FIELDS}
      }
    }
  `;

  const response = await executeBackendGraphQL<{ kpiThresholdsByGraph: KpiThreshold[] }>(query, {
    graphId,
  });

  return response.data?.kpiThresholdsByGraph || [];
};

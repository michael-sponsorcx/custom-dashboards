/**
 * KPI Thresholds API Service
 *
 * Handles KPI threshold CRUD operations via backend GraphQL API.
 * KPI thresholds trigger alerts when a KPI value crosses a set limit.
 */

import { executeBackendGraphQL } from '../../core/client';
import type { KPIFormData, ThresholdAlertDetails } from '../../../types/kpi-alerts';
import type { KpiThreshold, CreateKpiThresholdInput } from '../../../types/backend-graphql';
import { ThresholdCondition } from '../../../types/backend-graphql';
import { KPI_THRESHOLD_FIELDS } from './fragments';

/**
 * Convert frontend KPIFormData to CreateKpiThresholdInput
 */
const toThresholdInput = (
  graphId: string,
  formData: KPIFormData,
  dashboardId: string,
  createdById: string
): CreateKpiThresholdInput => {
  const alertDetails = formData.alertDetails as ThresholdAlertDetails | undefined;

  return {
    graphId,
    dashboardId,
    createdById,
    alertName: alertDetails?.alertName || 'Threshold Alert',
    comment: formData.alertBodyContent,
    recipients: formData.recipients,
    isActive: true,
    condition: alertDetails?.condition || ThresholdCondition.GreaterThan,
    thresholdValue: alertDetails?.thresholdValue ?? 0,
    timeZone: 'UTC',
  };
};

/**
 * Create a new KPI Threshold
 */
export const createKpiThreshold = async (
  graphId: string,
  formData: KPIFormData,
  organizationId: string,
  dashboardId: string,
  createdById: string
): Promise<KpiThreshold> => {
  const input = toThresholdInput(graphId, formData, dashboardId, createdById);

  const mutation = `
    mutation CreateKpiThreshold($organizationId: ID!, $input: CreateKpiThresholdInput!) {
      createKpiThreshold(organizationId: $organizationId, input: $input) {
        ${KPI_THRESHOLD_FIELDS}
      }
    }
  `;

  const response = await executeBackendGraphQL<{ createKpiThreshold: KpiThreshold }>(mutation, {
    organizationId,
    input,
  });

  if (!response.data?.createKpiThreshold) {
    throw new Error('Failed to create KPI threshold');
  }

  return response.data.createKpiThreshold;
};

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

/**
 * Delete a KPI Threshold
 */
export const deleteKpiThreshold = async (id: string): Promise<boolean> => {
  const mutation = `
    mutation DeleteKpiThreshold($id: ID!) {
      deleteKpiThreshold(id: $id)
    }
  `;

  const response = await executeBackendGraphQL<{ deleteKpiThreshold: boolean }>(mutation, { id });

  return response.data?.deleteKpiThreshold || false;
};

/**
 * Toggle a KPI Threshold's active status
 */
export const toggleKpiThresholdActive = async (
  id: string,
  isActive: boolean
): Promise<KpiThreshold | null> => {
  const mutation = `
    mutation ToggleKpiThresholdActive($id: ID!, $isActive: Boolean!) {
      toggleKpiThresholdActive(id: $id, isActive: $isActive) {
        ${KPI_THRESHOLD_FIELDS}
      }
    }
  `;

  const response = await executeBackendGraphQL<{ toggleKpiThresholdActive: KpiThreshold }>(
    mutation,
    { id, isActive }
  );

  return response.data?.toggleKpiThresholdActive || null;
};

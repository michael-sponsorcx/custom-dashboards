/**
 * KPI Schedule Mutation Operations
 *
 * Write operations for KPI schedules.
 */

import { executeBackendGraphQL } from '../../core/client';
import type { KPIFormData, ScheduledAlertDetails } from '../../../types/kpi-alerts';
import type { KpiSchedule, CreateKpiScheduleInput } from '../../../types/backend-graphql';
import { FrequencyInterval } from '../../../types/backend-graphql';
import { KPI_SCHEDULE_FIELDS } from './fragments';

/**
 * Convert frontend KPIFormData to CreateKpiScheduleInput
 */
const toScheduleInput = (
  graphId: string,
  formData: KPIFormData,
  dashboardId: string,
  createdById: string
): CreateKpiScheduleInput => {
  const alertDetails = formData.alertDetails as ScheduledAlertDetails | undefined;

  return {
    graphId,
    dashboardId,
    createdById,
    alertName: alertDetails?.alertName || 'Scheduled Report',
    comment: formData.alertBodyContent,
    recipients: formData.recipients,
    isActive: true,
    frequencyInterval: alertDetails?.frequency || FrequencyInterval.Day,
    scheduleHour: alertDetails?.hour ? parseInt(alertDetails.hour, 10) : undefined,
    scheduleMinute: alertDetails?.minute ? parseInt(alertDetails.minute, 10) : undefined,
    excludeWeekends: alertDetails?.excludeWeekends,
    timeZone: alertDetails?.timeZone || 'UTC',
  };
};

/**
 * Create a new KPI Schedule
 */
export const createKpiSchedule = async (
  graphId: string,
  formData: KPIFormData,
  organizationId: string,
  dashboardId: string,
  createdById: string
): Promise<KpiSchedule> => {
  const input = toScheduleInput(graphId, formData, dashboardId, createdById);

  const mutation = `
    mutation CreateKpiSchedule($organizationId: ID!, $input: CreateKpiScheduleInput!) {
      createKpiSchedule(organizationId: $organizationId, input: $input) {
        ${KPI_SCHEDULE_FIELDS}
      }
    }
  `;

  const response = await executeBackendGraphQL<{ createKpiSchedule: KpiSchedule }>(mutation, {
    organizationId,
    input,
  });

  if (!response.data?.createKpiSchedule) {
    throw new Error('Failed to create KPI schedule');
  }

  return response.data.createKpiSchedule;
};

/**
 * Delete a KPI Schedule
 */
export const deleteKpiSchedule = async (id: string): Promise<boolean> => {
  const mutation = `
    mutation DeleteKpiSchedule($id: ID!) {
      deleteKpiSchedule(id: $id)
    }
  `;

  const response = await executeBackendGraphQL<{ deleteKpiSchedule: boolean }>(mutation, { id });

  return response.data?.deleteKpiSchedule || false;
};

/**
 * Toggle a KPI Schedule's active status
 */
export const toggleKpiScheduleActive = async (
  id: string,
  isActive: boolean
): Promise<KpiSchedule | null> => {
  const mutation = `
    mutation ToggleKpiScheduleActive($id: ID!, $isActive: Boolean!) {
      toggleKpiScheduleActive(id: $id, isActive: $isActive) {
        ${KPI_SCHEDULE_FIELDS}
      }
    }
  `;

  const response = await executeBackendGraphQL<{ toggleKpiScheduleActive: KpiSchedule }>(
    mutation,
    { id, isActive }
  );

  return response.data?.toggleKpiScheduleActive || null;
};

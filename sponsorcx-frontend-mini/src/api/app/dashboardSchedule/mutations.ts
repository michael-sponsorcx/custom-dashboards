/**
 * Dashboard Schedule Mutation Operations
 *
 * Write operations for dashboard schedules.
 */

import { executeBackendGraphQL } from '../../core/client';
import type { DashboardSchedule } from '../../../types/backend-graphql';
import type { DashboardScheduleFormData } from '../../../types/dashboard-schedules';
import { DASHBOARD_SCHEDULE_FIELDS } from './fragments';
import { toDashboardScheduleInput } from './mappers';

/**
 * Create a new dashboard schedule
 */
export const createDashboardSchedule = async (
  formData: DashboardScheduleFormData,
  organizationId: string,
  dashboardId: string,
  createdById: string
): Promise<DashboardSchedule> => {
  const query = `
    mutation CreateDashboardSchedule($organizationId: ID!, $input: DashboardScheduleInput!) {
      createDashboardSchedule(organizationId: $organizationId, input: $input) {
        ${DASHBOARD_SCHEDULE_FIELDS}
      }
    }
  `;

  const input = toDashboardScheduleInput(formData, dashboardId, createdById);

  const response = await executeBackendGraphQL<{ createDashboardSchedule: DashboardSchedule }>(query, {
    organizationId,
    input,
  });

  if (!response.data?.createDashboardSchedule) {
    throw new Error('Failed to create dashboard schedule');
  }

  return response.data.createDashboardSchedule;
};

/**
 * Update an existing dashboard schedule
 */
export const updateDashboardSchedule = async (
  id: string,
  formData: DashboardScheduleFormData,
  dashboardId: string,
  createdById: string
): Promise<DashboardSchedule> => {
  const query = `
    mutation UpdateDashboardSchedule($id: ID!, $input: DashboardScheduleInput!) {
      updateDashboardSchedule(id: $id, input: $input) {
        ${DASHBOARD_SCHEDULE_FIELDS}
      }
    }
  `;

  const input = toDashboardScheduleInput(formData, dashboardId, createdById);

  const response = await executeBackendGraphQL<{ updateDashboardSchedule: DashboardSchedule }>(query, {
    id,
    input,
  });

  if (!response.data?.updateDashboardSchedule) {
    throw new Error('Failed to update dashboard schedule');
  }

  return response.data.updateDashboardSchedule;
};

/**
 * Delete a dashboard schedule
 */
export const deleteDashboardSchedule = async (id: string): Promise<boolean> => {
  const query = `
    mutation DeleteDashboardSchedule($id: ID!) {
      deleteDashboardSchedule(id: $id)
    }
  `;

  const response = await executeBackendGraphQL<{ deleteDashboardSchedule: boolean }>(query, { id });

  return response.data?.deleteDashboardSchedule ?? false;
};

/**
 * Toggle a dashboard schedule's active status
 */
export const toggleDashboardScheduleActive = async (
  id: string,
  isActive: boolean
): Promise<DashboardSchedule | null> => {
  const query = `
    mutation ToggleDashboardScheduleActive($id: ID!, $isActive: Boolean!) {
      toggleDashboardScheduleActive(id: $id, isActive: $isActive) {
        ${DASHBOARD_SCHEDULE_FIELDS}
      }
    }
  `;

  const response = await executeBackendGraphQL<{ toggleDashboardScheduleActive: DashboardSchedule | null }>(
    query,
    {
      id,
      isActive,
    }
  );

  return response.data?.toggleDashboardScheduleActive || null;
};

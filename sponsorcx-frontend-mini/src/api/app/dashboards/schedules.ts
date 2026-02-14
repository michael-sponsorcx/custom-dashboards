/**
 * Dashboard Schedules API Service
 *
 * Handles all dashboard schedule CRUD operations via backend GraphQL API.
 * Dashboard schedules send entire dashboard reports to recipients on a cadence.
 *
 * NOTE: This is separate from KPI schedules which send individual KPI values.
 *
 * TODO: Backend implementation required - create migration and resolvers for dashboard_schedules table
 */

import { executeBackendGraphQL } from '../../core/client';
import { FrequencyInterval } from '../../../types/backend-graphql';
import type { DashboardSchedule, DashboardScheduleInput } from '../../../types/backend-graphql';
import type { DashboardScheduleFormData } from '../../../types/dashboard-schedules';

// GraphQL fragments for reusability
const DASHBOARD_SCHEDULE_FIELDS = `
  id
  cronJobId
  organizationId
  dashboardId
  createdById
  scheduleName
  comment
  frequencyInterval
  minuteInterval
  hourInterval
  scheduleHour
  scheduleMinute
  selectedDays
  excludeWeekends
  monthDates
  timeZone
  hasGatingCondition
  gatingCondition
  attachmentType
  recipients
  isActive
  createdAt
  updatedAt
`;

/**
 * Convert frontend DashboardScheduleFormData to backend DashboardScheduleInput
 */
const toDashboardScheduleInput = (
  formData: DashboardScheduleFormData,
  dashboardId: string,
  createdById: string
): DashboardScheduleInput => {
  // Parse month dates from comma-separated string to number array
  const monthDates = formData.monthDates
    ? formData.monthDates
        .split(',')
        .map((d: string) => parseInt(d.trim(), 10))
        .filter((n: number) => !isNaN(n))
    : undefined;

  return {
    dashboardId,
    createdById,
    scheduleName: formData.scheduleName || '',
    comment: formData.comment || undefined,
    frequencyInterval: formData.frequencyInterval ?? FrequencyInterval.Day,
    minuteInterval: formData.minuteInterval ? parseInt(formData.minuteInterval, 10) : undefined,
    hourInterval: formData.hourInterval ? parseInt(formData.hourInterval, 10) : undefined,
    scheduleHour: formData.hour ? parseInt(formData.hour, 10) : undefined,
    scheduleMinute: formData.minute ? parseInt(formData.minute, 10) : undefined,
    selectedDays: formData.selectedDays,
    excludeWeekends: formData.excludeWeekends,
    monthDates,
    timeZone: formData.timeZone,
    attachmentType: formData.attachmentType,
    recipients: formData.recipients,
    isActive: true,
  };
};

/**
 * Fetch all dashboard schedules for an organization
 */
export const fetchDashboardSchedules = async (
  organizationId?: string,
  isActive?: boolean
): Promise<DashboardSchedule[]> => {
  const query = `
    query FetchDashboardSchedules($organizationId: ID, $isActive: Boolean) {
      dashboardSchedules(organizationId: $organizationId, isActive: $isActive) {
        ${DASHBOARD_SCHEDULE_FIELDS}
      }
    }
  `;

  const response = await executeBackendGraphQL<{ dashboardSchedules: DashboardSchedule[] }>(query, {
    organizationId,
    isActive,
  });

  return response.data?.dashboardSchedules || [];
};

/**
 * Fetch a single dashboard schedule by ID
 */
export const fetchDashboardSchedule = async (id: string): Promise<DashboardSchedule | null> => {
  const query = `
    query FetchDashboardSchedule($id: ID!) {
      dashboardSchedule(id: $id) {
        ${DASHBOARD_SCHEDULE_FIELDS}
      }
    }
  `;

  const response = await executeBackendGraphQL<{ dashboardSchedule: DashboardSchedule | null }>(query, { id });

  return response.data?.dashboardSchedule || null;
};

/**
 * Fetch dashboard schedules for a specific dashboard
 */
export const fetchDashboardSchedulesByDashboard = async (dashboardId: string): Promise<DashboardSchedule[]> => {
  const query = `
    query FetchDashboardSchedulesByDashboard($dashboardId: ID!) {
      dashboardSchedulesByDashboard(dashboardId: $dashboardId) {
        ${DASHBOARD_SCHEDULE_FIELDS}
      }
    }
  `;

  const response = await executeBackendGraphQL<{ dashboardSchedulesByDashboard: DashboardSchedule[] }>(query, {
    dashboardId,
  });

  return response.data?.dashboardSchedulesByDashboard || [];
};

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

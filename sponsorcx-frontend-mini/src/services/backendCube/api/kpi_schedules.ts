/**
 * KPI Schedules API Service
 *
 * Handles all KPI schedule CRUD operations via backend GraphQL API.
 * KPI schedules send individual KPI values to recipients on a cadence.
 *
 * NOTE: This is separate from dashboard schedules which send entire dashboard reports.
 */

import { executeBackendGraphQL } from '../core/backendClient';
import type { KpiScheduleFormData } from '../../../types/kpi-alerts';
import type { FrequencyInterval } from '../../../types/backend-graphql';

/**
 * KPI Schedule type returned from the API
 */
export interface KpiSchedule {
  id: string;
  cronJobId: string;
  organizationId: string;
  graphId?: string;
  dashboardId: string;
  createdById: string;
  scheduleName: string;
  comment?: string;
  frequencyInterval: FrequencyInterval;
  minuteInterval?: number;
  hourInterval?: number;
  scheduleHour?: number;
  scheduleMinute?: number;
  selectedDays?: string[];
  excludeWeekends?: boolean;
  monthDates?: number[];
  timeZone?: string;
  hasGatingCondition?: boolean;
  gatingCondition?: Record<string, unknown>;
  attachmentType?: string;
  recipients?: string[];
  isActive?: boolean;
  cronExpression?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Input type for creating/updating a KPI schedule
 */
export interface KpiScheduleInput {
  graphId?: string;
  dashboardId: string;
  createdById: string;
  scheduleName: string;
  comment?: string;
  frequencyInterval: string;
  minuteInterval?: number;
  hourInterval?: number;
  scheduleHour?: number;
  scheduleMinute?: number;
  selectedDays?: string[];
  excludeWeekends?: boolean;
  monthDates?: number[];
  timeZone?: string;
  hasGatingCondition?: boolean;
  gatingCondition?: Record<string, unknown>;
  attachmentType?: string;
  recipients?: string[];
  isActive?: boolean;
}

// GraphQL fragments for reusability
const KPI_SCHEDULE_FIELDS = `
  id
  cronJobId
  organizationId
  graphId
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
  cronExpression
  createdAt
  updatedAt
`;

/**
 * Convert frontend ScheduleFormData to backend KpiScheduleInput
 */
const toKpiScheduleInput = (formData: KpiScheduleFormData, dashboardId: string, createdById: string): KpiScheduleInput => {
  // Parse month dates from comma-separated string to number array
  const monthDates = formData.monthDates
    ? formData.monthDates
        .split(',')
        .map((d: string) => parseInt(d.trim(), 10))
        .filter((n: number) => !isNaN(n))
    : undefined;

  // Map frontend frequency interval to backend enum format
  const frequencyIntervalMap: Record<string, string> = {
    n_minute: 'N_MINUTE',
    hour: 'HOUR',
    day: 'DAY',
    week: 'WEEK',
    month: 'MONTH',
  };

  return {
    dashboardId,
    createdById,
    scheduleName: formData.scheduleName || '',
    comment: formData.addComment ? formData.comment : undefined,
    frequencyInterval: formData.frequencyInterval
      ? frequencyIntervalMap[formData.frequencyInterval] || formData.frequencyInterval.toUpperCase()
      : 'DAY',
    minuteInterval: formData.minuteInterval ? parseInt(formData.minuteInterval, 10) : undefined,
    hourInterval: formData.hourInterval ? parseInt(formData.hourInterval, 10) : undefined,
    scheduleHour: formData.hour ? parseInt(formData.hour, 10) : undefined,
    scheduleMinute: formData.minute ? parseInt(formData.minute, 10) : undefined,
    selectedDays: formData.selectedDays,
    excludeWeekends: formData.excludeWeekends,
    monthDates,
    timeZone: formData.timeZone,
    hasGatingCondition: formData.addGatingCondition,
    recipients: formData.recipients,
    isActive: true,
  };
};

/**
 * Fetch all KPI schedules for an organization
 */
export const fetchKpiSchedules = async (
  organizationId?: string,
  isActive?: boolean
): Promise<KpiSchedule[]> => {
  const query = `
    query FetchKpiSchedules($organizationId: ID, $isActive: Boolean) {
      kpiSchedules(organizationId: $organizationId, isActive: $isActive) {
        ${KPI_SCHEDULE_FIELDS}
      }
    }
  `;

  const response = await executeBackendGraphQL<{ kpiSchedules: KpiSchedule[] }>(query, {
    organizationId,
    isActive,
  });

  return response.data?.kpiSchedules || [];
};

/**
 * Fetch a single KPI schedule by ID
 */
export const fetchKpiSchedule = async (id: string): Promise<KpiSchedule | null> => {
  const query = `
    query FetchKpiSchedule($id: ID!) {
      kpiSchedule(id: $id) {
        ${KPI_SCHEDULE_FIELDS}
      }
    }
  `;

  const response = await executeBackendGraphQL<{ kpiSchedule: KpiSchedule | null }>(query, { id });

  return response.data?.kpiSchedule || null;
};

/**
 * Fetch KPI schedules for a specific graph
 */
export const fetchKpiSchedulesByGraph = async (graphId: string): Promise<KpiSchedule[]> => {
  const query = `
    query FetchKpiSchedulesByGraph($graphId: ID!) {
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

/**
 * Fetch KPI schedules for a dashboard
 */
export const fetchKpiSchedulesByDashboard = async (dashboardId: string): Promise<KpiSchedule[]> => {
  const query = `
    query FetchKpiSchedulesByDashboard($dashboardId: ID!) {
      kpiSchedulesByDashboard(dashboardId: $dashboardId) {
        ${KPI_SCHEDULE_FIELDS}
      }
    }
  `;

  const response = await executeBackendGraphQL<{ kpiSchedulesByDashboard: KpiSchedule[] }>(query, {
    dashboardId,
  });

  return response.data?.kpiSchedulesByDashboard || [];
};

/**
 * Create a new KPI schedule
 */
export const createKpiSchedule = async (
  formData: KpiScheduleFormData,
  organizationId: string,
  dashboardId: string,
  createdById: string
): Promise<KpiSchedule> => {
  const query = `
    mutation CreateKpiSchedule($organizationId: ID!, $input: KpiScheduleInput!) {
      createKpiSchedule(organizationId: $organizationId, input: $input) {
        ${KPI_SCHEDULE_FIELDS}
      }
    }
  `;

  const input = toKpiScheduleInput(formData, dashboardId, createdById);

  const response = await executeBackendGraphQL<{ createKpiSchedule: KpiSchedule }>(query, {
    organizationId,
    input,
  });

  if (!response.data?.createKpiSchedule) {
    throw new Error('Failed to create KPI schedule');
  }

  return response.data.createKpiSchedule;
};

/**
 * Update an existing KPI schedule
 */
export const updateKpiSchedule = async (
  id: string,
  formData: KpiScheduleFormData,
  dashboardId: string,
  createdById: string
): Promise<KpiSchedule> => {
  const query = `
    mutation UpdateKpiSchedule($id: ID!, $input: KpiScheduleInput!) {
      updateKpiSchedule(id: $id, input: $input) {
        ${KPI_SCHEDULE_FIELDS}
      }
    }
  `;

  const input = toKpiScheduleInput(formData, dashboardId, createdById);

  const response = await executeBackendGraphQL<{ updateKpiSchedule: KpiSchedule }>(query, {
    id,
    input,
  });

  if (!response.data?.updateKpiSchedule) {
    throw new Error('Failed to update KPI schedule');
  }

  return response.data.updateKpiSchedule;
};

/**
 * Delete a KPI schedule
 */
export const deleteKpiSchedule = async (id: string): Promise<boolean> => {
  const query = `
    mutation DeleteKpiSchedule($id: ID!) {
      deleteKpiSchedule(id: $id)
    }
  `;

  const response = await executeBackendGraphQL<{ deleteKpiSchedule: boolean }>(query, { id });

  return response.data?.deleteKpiSchedule ?? false;
};

/**
 * Toggle a KPI schedule's active status
 */
export const toggleKpiScheduleActive = async (
  id: string,
  isActive: boolean
): Promise<KpiSchedule | null> => {
  const query = `
    mutation ToggleKpiScheduleActive($id: ID!, $isActive: Boolean!) {
      toggleKpiScheduleActive(id: $id, isActive: $isActive) {
        ${KPI_SCHEDULE_FIELDS}
      }
    }
  `;

  const response = await executeBackendGraphQL<{ toggleKpiScheduleActive: KpiSchedule | null }>(
    query,
    {
      id,
      isActive,
    }
  );

  return response.data?.toggleKpiScheduleActive || null;
};

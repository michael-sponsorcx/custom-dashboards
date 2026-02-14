/**
 * Dashboard Schedule Query Operations
 *
 * Read operations for dashboard schedules.
 */

import { executeBackendGraphQL } from '../../core/client';
import type { DashboardSchedule } from '../../../types/backend-graphql';
import { DASHBOARD_SCHEDULE_FIELDS } from './fragments';

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

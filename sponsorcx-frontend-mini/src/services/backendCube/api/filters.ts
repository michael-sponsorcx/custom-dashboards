/**
 * Dashboard Filter API Service
 *
 * Handles dashboard filter persistence via backend GraphQL API
 */

import { executeBackendGraphQL } from '../core/backendClient';
import type { FilterRule } from '../../../types/filters';

export interface DashboardFilterField {
  fieldName: string;
  fieldTitle: string;
  fieldType: 'measure' | 'dimension' | 'date';
}

export interface DashboardFilterState {
  selectedViews: string[];
  availableFields: DashboardFilterField[];
  activeFilters: FilterRule[];
}

interface DashboardFilterResponse {
  id: string;
  dashboardId: string;
  selectedViews: string[];
  availableFields: Record<string, unknown>[];
  activeFilters: Record<string, unknown>[];
  createdAt: string;
  updatedAt: string;
}

const DASHBOARD_FILTER_FIELDS = `
  id
  dashboardId
  selectedViews
  availableFields
  activeFilters
  createdAt
  updatedAt
`;

/**
 * Fetch dashboard filters
 */
export async function fetchDashboardFilter(
  dashboardId: string
): Promise<DashboardFilterState | null> {
  const query = `
    query FetchDashboardFilter($dashboardId: ID!) {
      dashboardFilter(dashboardId: $dashboardId) {
        ${DASHBOARD_FILTER_FIELDS}
      }
    }
  `;

  const response = await executeBackendGraphQL<{
    dashboardFilter: DashboardFilterResponse | null;
  }>(query, { dashboardId });

  const filter = response.data?.dashboardFilter;
  if (!filter) return null;

  return {
    selectedViews: filter.selectedViews || [],
    availableFields: (filter.availableFields as unknown as DashboardFilterField[]) || [],
    activeFilters: (filter.activeFilters as unknown as FilterRule[]) || [],
  };
}

/**
 * Save dashboard filters
 */
export async function saveDashboardFilter(
  dashboardId: string,
  state: DashboardFilterState
): Promise<DashboardFilterState> {
  const query = `
    mutation SaveDashboardFilter($dashboardId: ID!, $input: DashboardFilterInput!) {
      saveDashboardFilter(dashboardId: $dashboardId, input: $input) {
        ${DASHBOARD_FILTER_FIELDS}
      }
    }
  `;

  const input = {
    selectedViews: state.selectedViews || [],
    availableFields: state.availableFields || [],
    activeFilters: state.activeFilters || [],
  };

  const response = await executeBackendGraphQL<{
    saveDashboardFilter: DashboardFilterResponse;
  }>(query, {
    dashboardId,
    input,
  });

  const filter = response.data?.saveDashboardFilter;
  if (!filter) {
    throw new Error('Failed to save dashboard filters');
  }

  return {
    selectedViews: filter.selectedViews || [],
    availableFields: (filter.availableFields as unknown as DashboardFilterField[]) || [],
    activeFilters: (filter.activeFilters as unknown as FilterRule[]) || [],
  };
}

/**
 * Clear dashboard filters
 */
export async function clearDashboardFilter(dashboardId: string): Promise<boolean> {
  const query = `
    mutation ClearDashboardFilter($dashboardId: ID!) {
      clearDashboardFilter(dashboardId: $dashboardId) {
        id
      }
    }
  `;

  const response = await executeBackendGraphQL<{
    clearDashboardFilter: { id: string } | null;
  }>(query, { dashboardId });

  return !!response.data?.clearDashboardFilter;
}

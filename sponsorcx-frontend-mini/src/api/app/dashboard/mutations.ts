/**
 * Dashboard Mutation Operations
 *
 * Write operations for dashboards, grid items, and filters.
 */

import { executeBackendGraphQL } from '../../core/client';
import { LayoutType, type DashboardGridItem } from '../../../types/backend-graphql';
import type { DashboardUI, GridLayout } from '../../../types/dashboard';
import type { DashboardFilter } from '../../../types/backend-graphql';
import type { FilterRule } from '../../../types/filters';
import { DASHBOARD_FIELDS, DASHBOARD_GRID_ITEM_FIELDS } from './fragments';
import { fetchDashboardGridItems, fetchDashboards } from './queries';
import type { DashboardFilterField, DashboardFilterState } from './queries';

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
 * Create a new dashboard
 */
export const createDashboard = async (
  name: string,
  layout: 'grid' | 'list' = 'grid',
  organizationId?: string
): Promise<DashboardUI> => {
  const query = `
    mutation CreateDashboard($input: DashboardInput!, $organizationId: ID) {
      createDashboard(input: $input, organizationId: $organizationId) {
        ${DASHBOARD_FIELDS}
      }
    }
  `;

  // Map frontend layout to backend LayoutType enum
  const backendLayout = layout === 'grid' ? LayoutType.Grid : LayoutType.List;

  const response = await executeBackendGraphQL<{ createDashboard: DashboardUI }>(query, {
    input: { name, layout: backendLayout },
    organizationId,
  });

  if (!response.data?.createDashboard) {
    throw new Error('Failed to create dashboard');
  }

  return { ...response.data.createDashboard, graphIds: [] };
};

/**
 * Update an existing dashboard
 */
export const updateDashboard = async (
  id: string,
  name: string,
  layout: 'grid' | 'list'
): Promise<DashboardUI> => {
  const query = `
    mutation UpdateDashboard($id: ID!, $input: DashboardInput!) {
      updateDashboard(id: $id, input: $input) {
        ${DASHBOARD_FIELDS}
      }
    }
  `;

  // Map frontend layout to backend LayoutType enum
  const backendLayout = layout === 'grid' ? LayoutType.Grid : LayoutType.List;

  const response = await executeBackendGraphQL<{ updateDashboard: DashboardUI }>(query, {
    id,
    input: { name, layout: backendLayout },
  });

  if (!response.data?.updateDashboard) {
    throw new Error('Failed to update dashboard');
  }

  // Populate graphIds from grid items
  const gridItems = await fetchDashboardGridItems(id);
  return {
    ...response.data.updateDashboard,
    graphIds: gridItems.map((item) => item.graphId),
  };
};

/**
 * Delete a dashboard
 */
export const deleteDashboard = async (id: string): Promise<boolean> => {
  const query = `
    mutation DeleteDashboard($id: ID!) {
      deleteDashboard(id: $id) {
        id
      }
    }
  `;

  const response = await executeBackendGraphQL<{ deleteDashboard: { id: string } | null }>(
    query,
    { id }
  );

  return !!response.data?.deleteDashboard;
};

/**
 * Add a graph to a dashboard (creates a dashboard grid item)
 */
export const addGraphToDashboard = async (
  dashboardId: string,
  graphId: string,
  gridLayout?: GridLayout
): Promise<DashboardGridItem> => {
  const query = `
    mutation AddDashboardGridItem($dashboardId: ID!, $input: DashboardGridItemInput!) {
      addDashboardGridItem(dashboardId: $dashboardId, input: $input) {
        ${DASHBOARD_GRID_ITEM_FIELDS}
      }
    }
  `;

  const input = {
    graphId,
    gridColumn: gridLayout?.gridColumn || null,
    gridRow: gridLayout?.gridRow || null,
    gridWidth: gridLayout?.gridWidth || null,
    gridHeight: gridLayout?.gridHeight || null,
    displayOrder: 0,
  };

  const response = await executeBackendGraphQL<{
    addDashboardGridItem: DashboardGridItem;
  }>(query, {
    dashboardId,
    input,
  });

  if (!response.data?.addDashboardGridItem) {
    throw new Error('Failed to add graph to dashboard');
  }

  return response.data.addDashboardGridItem;
};

/**
 * Update grid layout for a dashboard item
 */
export const updateDashboardGridItem = async (
  gridItemId: string,
  graphId: string,
  gridLayout: Partial<GridLayout>
): Promise<DashboardGridItem> => {
  const query = `
    mutation UpdateDashboardGridItem($id: ID!, $input: DashboardGridItemInput!) {
      updateDashboardGridItem(id: $id, input: $input) {
        ${DASHBOARD_GRID_ITEM_FIELDS}
      }
    }
  `;

  const input = {
    graphId,
    ...gridLayout,
  };

  const response = await executeBackendGraphQL<{
    updateDashboardGridItem: DashboardGridItem;
  }>(query, {
    id: gridItemId,
    input,
  });

  if (!response.data?.updateDashboardGridItem) {
    throw new Error('Failed to update dashboard grid item');
  }

  return response.data.updateDashboardGridItem;
};

/**
 * Remove a graph from a dashboard (deletes the dashboard grid item)
 */
export const removeGraphFromDashboard = async (gridItemId: string): Promise<boolean> => {
  const query = `
    mutation RemoveDashboardGridItem($id: ID!) {
      removeDashboardGridItem(id: $id) {
        id
      }
    }
  `;

  const response = await executeBackendGraphQL<{
    removeDashboardGridItem: { id: string } | null;
  }>(query, { id: gridItemId });

  return !!response.data?.removeDashboardGridItem;
};

/**
 * Helper: Get or create default dashboard
 * If no dashboard exists, creates one with name "Main Dashboard"
 */
export const getOrCreateDefaultDashboard = async (
  organizationId?: string
): Promise<DashboardUI> => {
  const dashboards = await fetchDashboards(organizationId);

  if (dashboards.length > 0) {
    // Return the first dashboard and populate its graphIds
    const dashboard = dashboards[0];
    const gridItems = await fetchDashboardGridItems(dashboard.id);
    return {
      ...dashboard,
      graphIds: gridItems.map((item) => item.graphId),
    };
  }

  // Create a default dashboard
  return await createDashboard('Main Dashboard', 'grid', organizationId);
};

/**
 * Save dashboard filters
 */
export const saveDashboardFilter = async (
  dashboardId: string,
  state: DashboardFilterState
): Promise<DashboardFilterState> => {
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
    saveDashboardFilter: DashboardFilter;
  }>(query, {
    dashboardId,
    input,
  });

  const filter = response.data?.saveDashboardFilter;
  if (!filter) {
    throw new Error('Failed to save dashboard filters');
  }

  return {
    selectedViews: (filter.selectedViews ?? []).filter((v): v is string => v != null),
    availableFields: (filter.availableFields as unknown as DashboardFilterField[]) || [],
    activeFilters: (filter.activeFilters as unknown as FilterRule[]) || [],
  };
};

/**
 * Clear dashboard filters
 */
export const clearDashboardFilter = async (dashboardId: string): Promise<boolean> => {
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
};

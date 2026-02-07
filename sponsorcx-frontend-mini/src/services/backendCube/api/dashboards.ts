/**
 * Dashboard API Service
 *
 * Handles all dashboard and dashboard grid item operations via backend GraphQL API
 */

import { executeBackendGraphQL } from '../core/backendClient';
import { LayoutType } from '../../../types/backend-graphql';
import type { DashboardUI, GridItem, GridLayout } from '../../../types/dashboard';
import type { GraphUI } from '../../../types/graph';
import { mapBackendChartType } from '../utils/graphInputMapper';

// GraphQL fragments
const DASHBOARD_FIELDS = `
  id
  organizationId
  name
  layout
  createdAt
  updatedAt
`;

const DASHBOARD_GRID_ITEM_FIELDS = `
  id
  dashboardId
  graphId
  gridColumn
  gridRow
  gridWidth
  gridHeight
  displayOrder
`;

const GRAPH_FIELDS = `
  id
  organizationId
  name
  viewName
  chartType
  chartTitle
  measures
  dimensions
  dates
  filters
  orderByField
  orderByDirection
  numberFormat
  numberPrecision
  colorPalette
  primaryColor
  sortOrder
  legendPosition
  kpiValue
  kpiLabel
  kpiSecondaryValue
  kpiSecondaryLabel
  kpiShowTrend
  kpiTrendPercentage
  showXAxisGridLines
  showYAxisGridLines
  showGridLines
  showRegressionLine
  xAxisLabel
  yAxisLabel
  maxDataPoints
  primaryDimension
  secondaryDimension
  selectedMeasure
  createdAt
  updatedAt
`;

interface DashboardGridItemResponse {
  id: string;
  dashboardId: string;
  graphId: string;
  gridColumn?: number;
  gridRow?: number;
  gridWidth?: number;
  gridHeight?: number;
  displayOrder?: number;
  graph?: GraphUI;
}

/**
 * Fetch all dashboards for an organization
 */
export async function fetchDashboards(organizationId?: string): Promise<DashboardUI[]> {
  const query = `
    query FetchDashboards($organizationId: ID) {
      dashboards(organizationId: $organizationId) {
        ${DASHBOARD_FIELDS}
      }
    }
  `;

  const response = await executeBackendGraphQL<{ dashboards: DashboardUI[] }>(query, {
    organizationId,
  });

  // Note: Backend doesn't return graphIds array, so we need to fetch grid items separately
  // to populate the graphIds
  const dashboards = response.data?.dashboards || [];

  // For now, return empty graphIds - the caller should use fetchDashboardGridItems
  return dashboards.map((d) => ({ ...d, graphIds: [] }));
}

/**
 * Fetch a single dashboard by ID
 */
export async function fetchDashboard(id: string): Promise<DashboardUI | null> {
  const query = `
    query FetchDashboard($id: ID!) {
      dashboard(id: $id) {
        ${DASHBOARD_FIELDS}
      }
    }
  `;

  const response = await executeBackendGraphQL<{ dashboard: DashboardUI | null }>(query, {
    id,
  });

  const dashboard = response.data?.dashboard;
  if (!dashboard) return null;

  // Populate graphIds from grid items
  const gridItems = await fetchDashboardGridItems(id);
  return {
    ...dashboard,
    graphIds: gridItems.map((item) => item.graphId),
  };
}

/**
 * Create a new dashboard
 */
export async function createDashboard(
  name: string,
  layout: 'grid' | 'list' = 'grid',
  organizationId?: string
): Promise<DashboardUI> {
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
}

/**
 * Update an existing dashboard
 */
export async function updateDashboard(
  id: string,
  name: string,
  layout: 'grid' | 'list'
): Promise<DashboardUI> {
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
}

/**
 * Delete a dashboard
 */
export async function deleteDashboard(id: string): Promise<boolean> {
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
}

/**
 * Fetch all grid items for a dashboard (with full graph details)
 */
export async function fetchDashboardGridItems(dashboardId: string): Promise<DashboardGridItemResponse[]> {
  const query = `
    query FetchDashboardGridItems($dashboardId: ID!) {
      dashboardGridItems(dashboardId: $dashboardId) {
        ${DASHBOARD_GRID_ITEM_FIELDS}
        graph {
          ${GRAPH_FIELDS}
        }
      }
    }
  `;

  const response = await executeBackendGraphQL<{
    dashboardGridItems: DashboardGridItemResponse[];
  }>(query, { dashboardId });

  return response.data?.dashboardGridItems || [];
}

/**
 * Fetch all grid items (graphs with grid layout) for a dashboard
 * This combines graph data with grid layout information
 */
export async function fetchGridItems(dashboardId: string): Promise<GridItem[]> {
  const gridItems = await fetchDashboardGridItems(dashboardId);

  return gridItems
    .filter((item) => item.graph) // Only include items with valid graphs
    .map((item) => ({
      ...item.graph!,
      // Convert backend enum values to frontend format
      chartType: mapBackendChartType(item.graph!.chartType as any),
      gridColumn: item.gridColumn,
      gridRow: item.gridRow,
      gridWidth: item.gridWidth,
      gridHeight: item.gridHeight,
    }));
}

/**
 * Add a graph to a dashboard (creates a dashboard grid item)
 */
export async function addGraphToDashboard(
  dashboardId: string,
  graphId: string,
  gridLayout?: GridLayout
): Promise<DashboardGridItemResponse> {
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
    addDashboardGridItem: DashboardGridItemResponse;
  }>(query, {
    dashboardId,
    input,
  });

  if (!response.data?.addDashboardGridItem) {
    throw new Error('Failed to add graph to dashboard');
  }

  return response.data.addDashboardGridItem;
}

/**
 * Update grid layout for a dashboard item
 */
export async function updateDashboardGridItem(
  gridItemId: string,
  graphId: string,
  gridLayout: GridLayout
): Promise<DashboardGridItemResponse> {
  const query = `
    mutation UpdateDashboardGridItem($id: ID!, $input: DashboardGridItemInput!) {
      updateDashboardGridItem(id: $id, input: $input) {
        ${DASHBOARD_GRID_ITEM_FIELDS}
      }
    }
  `;

  const input = {
    graphId,
    gridColumn: gridLayout.gridColumn || null,
    gridRow: gridLayout.gridRow || null,
    gridWidth: gridLayout.gridWidth || null,
    gridHeight: gridLayout.gridHeight || null,
    displayOrder: 0,
  };

  const response = await executeBackendGraphQL<{
    updateDashboardGridItem: DashboardGridItemResponse;
  }>(query, {
    id: gridItemId,
    input,
  });

  if (!response.data?.updateDashboardGridItem) {
    throw new Error('Failed to update dashboard grid item');
  }

  return response.data.updateDashboardGridItem;
}

/**
 * Remove a graph from a dashboard (deletes the dashboard grid item)
 */
export async function removeGraphFromDashboard(gridItemId: string): Promise<boolean> {
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
}

/**
 * Helper: Get or create default dashboard
 * If no dashboard exists, creates one with name "Main Dashboard"
 */
export async function getOrCreateDefaultDashboard(
  organizationId?: string
): Promise<DashboardUI> {
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
}

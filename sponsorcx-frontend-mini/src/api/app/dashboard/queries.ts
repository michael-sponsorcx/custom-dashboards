/**
 * Dashboard Query Operations
 *
 * Read operations for dashboards and dashboard grid items.
 */

import { executeBackendGraphQL } from '../../core/client';
import type { DashboardGridItem } from '../../../types/backend-graphql';
import type { DashboardUI, GridItem } from '../../../types/dashboard';
import type { FilterRule } from '../../../types/filters';
import type { DashboardFilter } from '../../../types/backend-graphql';
import { DASHBOARD_FIELDS, DASHBOARD_GRID_ITEM_FIELDS, DASHBOARD_GRAPH_FIELDS } from './fragments';

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
 * Fetch all dashboards for an organization
 */
export const fetchDashboards = async (organizationId?: string): Promise<DashboardUI[]> => {
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
};

/**
 * Fetch a single dashboard by ID
 */
export const fetchDashboard = async (id: string): Promise<DashboardUI | null> => {
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
};

/**
 * Fetch all grid items for a dashboard (with full graph details)
 */
export const fetchDashboardGridItems = async (dashboardId: string): Promise<DashboardGridItem[]> => {
  const query = `
    query FetchDashboardGridItems($dashboardId: ID!) {
      dashboardGridItems(dashboardId: $dashboardId) {
        ${DASHBOARD_GRID_ITEM_FIELDS}
        graph {
          ${DASHBOARD_GRAPH_FIELDS}
        }
      }
    }
  `;

  const response = await executeBackendGraphQL<{
    dashboardGridItems: DashboardGridItem[];
  }>(query, { dashboardId });

  return response.data?.dashboardGridItems || [];
};

/**
 * Fetch all grid items (graphs with grid layout) for a dashboard
 * This combines graph data with grid layout information
 */
export const fetchGridItems = async (dashboardId: string): Promise<GridItem[]> => {
  const gridItems = await fetchDashboardGridItems(dashboardId);

  return gridItems.flatMap((item) => {
    if (!item.graph) return [];
    const graph = item.graph;
    const gridItem: GridItem = {
      id: graph.id,
      name: graph.name,
      viewName: graph.viewName,
      chartType: graph.chartType,
      chartTitle: graph.chartTitle,
      measures: graph.measures,
      dimensions: graph.dimensions,
      dates: graph.dates,
      filters: graph.filters as unknown as FilterRule[],
      orderByField: graph.orderByField,
      orderByDirection: graph.orderByDirection,
      numberFormat: graph.numberFormat,
      numberPrecision: graph.numberPrecision,
      colorPalette: graph.colorPalette,
      primaryColor: graph.primaryColor,
      sortOrder: graph.sortOrder,
      legendPosition: graph.legendPosition,
      kpiValue: graph.kpiValue,
      kpiLabel: graph.kpiLabel,
      kpiSecondaryValue: graph.kpiSecondaryValue,
      kpiSecondaryLabel: graph.kpiSecondaryLabel,
      kpiShowTrend: graph.kpiShowTrend,
      kpiTrendPercentage: graph.kpiTrendPercentage,
      showXAxisGridLines: graph.showXAxisGridLines,
      showYAxisGridLines: graph.showYAxisGridLines,
      showGridLines: graph.showGridLines,
      showRegressionLine: graph.showRegressionLine,
      xAxisLabel: graph.xAxisLabel,
      yAxisLabel: graph.yAxisLabel,
      maxDataPoints: graph.maxDataPoints,
      primaryDimension: graph.primaryDimension,
      secondaryDimension: graph.secondaryDimension,
      selectedMeasure: graph.selectedMeasure,
      createdAt: graph.createdAt,
      updatedAt: graph.updatedAt,
      gridColumn: item.gridColumn ?? 1,
      gridRow: item.gridRow ?? 1,
      gridWidth: item.gridWidth ?? 1,
      gridHeight: item.gridHeight ?? 1,
    };
    return [gridItem];
  });
};

/**
 * Fetch dashboard filters
 */
export const fetchDashboardFilter = async (
  dashboardId: string
): Promise<DashboardFilterState | null> => {
  const query = `
    query FetchDashboardFilter($dashboardId: ID!) {
      dashboardFilter(dashboardId: $dashboardId) {
        ${DASHBOARD_FILTER_FIELDS}
      }
    }
  `;

  const response = await executeBackendGraphQL<{
    dashboardFilter: DashboardFilter | null;
  }>(query, { dashboardId });

  const filter = response.data?.dashboardFilter;
  if (!filter) return null;

  return {
    selectedViews: (filter.selectedViews ?? []).filter((v): v is string => v != null),
    availableFields: (filter.availableFields as unknown as DashboardFilterField[]) || [],
    activeFilters: (filter.activeFilters as unknown as FilterRule[]) || [],
  };
};

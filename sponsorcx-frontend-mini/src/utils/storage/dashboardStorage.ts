import { DashboardUI, GridItem, GridLayout } from '../../types/dashboard';
import { getGraph } from './graphStorage';

const DASHBOARD_KEY = 'sponsorcx_dashboard';
export const GRID_ITEMS_KEY = 'sponsorcx_dashboard_items';

/**
 * Save dashboard configuration
 */
export const saveDashboard = (dashboard: DashboardUI): void => {
  localStorage.setItem(DASHBOARD_KEY, JSON.stringify(dashboard));
};

/**
 * Get dashboard configuration
 */
export const getDashboard = (): DashboardUI => {
  const data = localStorage.getItem(DASHBOARD_KEY);

  if (!data) {
    // Return default dashboard
    return {
      id: 'default',
      name: 'My Dashboard',
      layout: 'grid',
      graphIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  try {
    return JSON.parse(data);
  } catch (error) {
    return {
      id: 'default',
      name: 'My Dashboard',
      layout: 'grid',
      graphIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
};

/**
 * Add a graph to the dashboard
 */
export const addGraphToDashboard = (graphId: string): void => {
  const dashboard = getDashboard();
  if (!dashboard.graphIds.includes(graphId)) {
    dashboard.graphIds.push(graphId);
    dashboard.updatedAt = new Date().toISOString();
    saveDashboard(dashboard);
  }
};

/**
 * Remove a graph from the dashboard
 */
export const removeGraphFromDashboard = (graphId: string): void => {
  const dashboard = getDashboard();
  dashboard.graphIds = dashboard.graphIds.filter((id) => id !== graphId);
  dashboard.updatedAt = new Date().toISOString();
  saveDashboard(dashboard);
};

/**
 * Save grid layout for a specific graph
 */
export const saveGridLayout = (graphId: string, layout: GridLayout): void => {
  const layouts = getAllGridLayouts();
  // Merge with existing layout to preserve other properties
  layouts[graphId] = {
    ...layouts[graphId],
    ...layout,
  };

  localStorage.setItem(GRID_ITEMS_KEY, JSON.stringify(layouts));
};

/**
 * Get grid layout for a specific graph
 */
export const getGridLayout = (graphId: string): GridLayout | null => {
  const layouts = getAllGridLayouts();
  return layouts[graphId] || null;
};

/**
 * Get all grid layouts
 */
const getAllGridLayouts = (): Record<string, GridLayout> => {
  const data = localStorage.getItem(GRID_ITEMS_KEY);
  if (!data) return {};

  try {
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
};

/**
 * Get a grid item (graph + grid layout)
 */
export const getGridItem = (graphId: string): GridItem | null => {
  const graph = getGraph(graphId);
  if (!graph) return null;

  const layout = getGridLayout(graphId);
  return {
    ...graph,
    ...layout,
  };
};

/**
 * Get all grid items (graphs with their grid layouts)
 */
export const getAllGridItems = (): GridItem[] => {
  const dashboard = getDashboard();
  const items: GridItem[] = [];

  for (const graphId of dashboard.graphIds) {
    const item = getGridItem(graphId);
    if (item) {
      items.push(item);
    }
  }

  return items;
};

/**
 * Delete grid layout when a graph is deleted
 */
export const deleteGridLayout = (graphId: string): void => {
  const layouts = getAllGridLayouts();
  delete layouts[graphId];
  localStorage.setItem(GRID_ITEMS_KEY, JSON.stringify(layouts));
};

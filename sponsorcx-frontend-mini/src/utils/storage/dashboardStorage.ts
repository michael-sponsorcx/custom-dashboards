import { DashboardTemplate, DashboardItem, GridLayout } from '../../types/dashboard';
import { getGraphTemplate } from './graphStorage';

const DASHBOARD_KEY = 'sponsorcx_dashboard';
export const DASHBOARD_ITEMS_KEY = 'sponsorcx_dashboard_items';

/**
 * Save dashboard configuration
 */
export function saveDashboard(dashboard: DashboardTemplate): void {
  localStorage.setItem(DASHBOARD_KEY, JSON.stringify(dashboard));
}

/**
 * Get dashboard configuration
 */
export function getDashboard(): DashboardTemplate {
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
}

/**
 * Add a graph to the dashboard
 */
export function addGraphToDashboard(graphId: string): void {
  const dashboard = getDashboard();
  if (!dashboard.graphIds.includes(graphId)) {
    dashboard.graphIds.push(graphId);
    dashboard.updatedAt = new Date().toISOString();
    saveDashboard(dashboard);
  }
}

/**
 * Remove a graph from the dashboard
 */
export function removeGraphFromDashboard(graphId: string): void {
  const dashboard = getDashboard();
  dashboard.graphIds = dashboard.graphIds.filter((id) => id !== graphId);
  dashboard.updatedAt = new Date().toISOString();
  saveDashboard(dashboard);
}

/**
 * Save grid layout for a specific graph
 */
export function saveGridLayout(graphId: string, layout: GridLayout): void {
  const layouts = getAllGridLayouts();
  // Merge with existing layout to preserve other properties
  layouts[graphId] = {
    ...layouts[graphId],
    ...layout,
  };

  localStorage.setItem(DASHBOARD_ITEMS_KEY, JSON.stringify(layouts));
}

/**
 * Get grid layout for a specific graph
 */
export function getGridLayout(graphId: string): GridLayout | null {
  const layouts = getAllGridLayouts();
  return layouts[graphId] || null;
}

/**
 * Get all grid layouts
 */
function getAllGridLayouts(): Record<string, GridLayout> {
  const data = localStorage.getItem(DASHBOARD_ITEMS_KEY);
  if (!data) return {};

  try {
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

/**
 * Get a dashboard item (graph template + grid layout)
 */
export function getDashboardItem(graphId: string): DashboardItem | null {
  const template = getGraphTemplate(graphId);
  if (!template) return null;

  const layout = getGridLayout(graphId);
  return {
    ...template,
    ...layout,
  };
}

/**
 * Get all dashboard items (graphs with their grid layouts)
 */
export function getAllDashboardItems(): DashboardItem[] {
  const dashboard = getDashboard();
  const items: DashboardItem[] = [];

  for (const graphId of dashboard.graphIds) {
    const item = getDashboardItem(graphId);
    if (item) {
      items.push(item);
    }
  }

  return items;
}

/**
 * Delete grid layout when a graph is deleted
 */
export function deleteGridLayout(graphId: string): void {
  const layouts = getAllGridLayouts();
  delete layouts[graphId];
  localStorage.setItem(DASHBOARD_ITEMS_KEY, JSON.stringify(layouts));
}

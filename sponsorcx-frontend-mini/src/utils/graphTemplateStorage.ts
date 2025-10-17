import { GraphTemplate, DashboardTemplate } from '../types/graphTemplate';

const GRAPHS_KEY = 'sponsorcx_saved_graphs';
const DASHBOARD_KEY = 'sponsorcx_dashboard';

/**
 * Save a graph template to localStorage
 */
export function saveGraphTemplate(template: GraphTemplate): void {
  const existing = getAllGraphTemplates();
  const index = existing.findIndex(t => t.id === template.id);

  if (index >= 0) {
    existing[index] = template;
  } else {
    existing.push(template);
  }

  localStorage.setItem(GRAPHS_KEY, JSON.stringify(existing));
}

/**
 * Get all saved graph templates
 */
export function getAllGraphTemplates(): GraphTemplate[] {
  const data = localStorage.getItem(GRAPHS_KEY);
  if (!data) return [];

  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to parse saved graphs:', error);
    return [];
  }
}

/**
 * Get a single graph template by ID
 */
export function getGraphTemplate(id: string): GraphTemplate | null {
  const all = getAllGraphTemplates();
  return all.find(t => t.id === id) || null;
}

/**
 * Delete a graph template
 */
export function deleteGraphTemplate(id: string): void {
  const existing = getAllGraphTemplates();
  const filtered = existing.filter(t => t.id !== id);
  localStorage.setItem(GRAPHS_KEY, JSON.stringify(filtered));
}

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
    console.error('Failed to parse dashboard config:', error);
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
  dashboard.graphIds = dashboard.graphIds.filter(id => id !== graphId);
  dashboard.updatedAt = new Date().toISOString();
  saveDashboard(dashboard);
}

/**
 * Generate a unique ID for a graph
 */
export function generateGraphId(): string {
  return `graph_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

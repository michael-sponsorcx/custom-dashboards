/**
 * Dashboard API
 *
 * CRUD operations for dashboards, grid items, and filters.
 */

export {
  fetchDashboards,
  fetchDashboard,
  fetchDashboardGridItems,
  fetchGridItems,
  fetchDashboardFilter,
} from './queries';
export type { DashboardFilterField, DashboardFilterState } from './queries';

export {
  createDashboard,
  updateDashboard,
  deleteDashboard,
  addGraphToDashboard,
  updateDashboardGridItem,
  removeGraphFromDashboard,
  getOrCreateDefaultDashboard,
  saveDashboardFilter,
  clearDashboardFilter,
} from './mutations';

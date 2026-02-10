/**
 * Dashboards API
 *
 * CRUD operations for dashboards, grid items, filters, and schedules.
 */

// Dashboard CRUD
export {
  fetchDashboards,
  fetchDashboard,
  createDashboard,
  updateDashboard,
  deleteDashboard,
  fetchDashboardGridItems,
  fetchGridItems,
  addGraphToDashboard,
  updateDashboardGridItem,
  removeGraphFromDashboard,
  getOrCreateDefaultDashboard,
} from './crud';

// Dashboard Filters
export {
  fetchDashboardFilter,
  saveDashboardFilter,
  clearDashboardFilter,
} from './filters';
export type { DashboardFilterField, DashboardFilterState } from './filters';

// Dashboard Schedules
export {
  fetchDashboardSchedules,
  fetchDashboardSchedule,
  fetchDashboardSchedulesByDashboard,
  createDashboardSchedule,
  updateDashboardSchedule,
  deleteDashboardSchedule,
  toggleDashboardScheduleActive,
} from './schedules';
export type { DashboardSchedule, DashboardScheduleInput } from './schedules';

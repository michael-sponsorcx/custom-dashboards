/**
 * Storage Module
 *
 * Centralized storage management for graphs and dashboards.
 * All localStorage operations are encapsulated here.
 */

// Graph storage
export {
  saveGraphTemplate,
  getAllGraphTemplates,
  getGraphTemplate,
  deleteGraphTemplate,
  generateGraphId,
} from './graphStorage';

// Dashboard storage
export {
  saveDashboard,
  getDashboard,
  addGraphToDashboard,
  removeGraphFromDashboard,
  saveGridLayout,
  getGridLayout,
  deleteGridLayout,
  getDashboardItem,
  getAllDashboardItems,
} from './dashboardStorage';

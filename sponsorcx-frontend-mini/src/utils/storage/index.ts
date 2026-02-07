/**
 * Storage Module
 *
 * Centralized storage management for graphs and dashboards.
 * All localStorage operations are encapsulated here.
 */

// Graph storage
export { saveGraph, getAllGraphs, getGraph, deleteGraph, generateGraphId } from './graphStorage';

// Dashboard storage
export {
  saveDashboard,
  getDashboard,
  addGraphToDashboard,
  removeGraphFromDashboard,
  saveGridLayout,
  getGridLayout,
  deleteGridLayout,
  getGridItem,
  getAllGridItems,
  GRID_ITEMS_KEY,
} from './dashboardStorage';

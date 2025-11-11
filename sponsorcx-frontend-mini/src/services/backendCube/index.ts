/**
 * Backend Cube API Service
 *
 * Main entry point for all Cube API interactions through the backend proxy.
 * This replaces direct calls to Cube Cloud API.
 */

// Core utilities
export { executeBackendGraphQL } from './core/backendClient';
export { getCached, setCache, deleteCache, clearCache, getCacheStats } from './core/cache';
export { handleApiError } from './core/errorHandler';

// API functions
export { executeCubeGraphQL, flattenTimeDimensions } from './api/query';
export { fetchCubeMetadata } from './api/metadata';
export { fetchDistinctDimensionValues } from './api/dimensions';
export { getValidFilterOperators, clearSchemaCache } from './api/schema';

// Graph API
export {
  fetchGraphs,
  fetchGraph,
  createGraph,
  updateGraph,
  deleteGraph,
} from './api/graphs';

// Dashboard API
export {
  fetchDashboards,
  fetchDashboard,
  createDashboard,
  updateDashboard,
  deleteDashboard,
  fetchDashboardGridItems,
  fetchDashboardItems,
  addGraphToDashboard,
  updateDashboardGridItem,
  removeGraphFromDashboard,
  getOrCreateDefaultDashboard,
} from './api/dashboards';

// Dashboard Filter API
export {
  fetchDashboardFilter,
  saveDashboardFilter,
  clearDashboardFilter,
} from './api/filters';
export type { DashboardFilterField, DashboardFilterState } from './api/filters';

// Types
export type {
  CubeConfig,
  RequestOptions,
  ApiResponse,
  CubeQueryResult,
  CubeMetadata,
  CacheEntry,
} from './types';

export { CubeApiError } from './types';

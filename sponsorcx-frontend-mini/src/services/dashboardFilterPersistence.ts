import { DashboardFilterState } from '../components/dashboard/hooks/useDashboardFilters';

const DASHBOARD_FILTERS_KEY = 'sponsorcx_dashboard_filters';

/**
 * Dashboard Filter Persistence Layer
 *
 * This module handles persistence of dashboard filter configuration.
 * Currently uses localStorage, but will be replaced with backend API calls.
 *
 * TODO: Replace with actual API calls when backend is ready:
 * - loadDashboardFilters() -> GET /api/dashboard/filters
 * - saveDashboardFilters() -> PUT /api/dashboard/filters
 * - clearDashboardFilters() -> DELETE /api/dashboard/filters
 */

/**
 * Load dashboard filter configuration from storage
 * TODO: Replace with API call
 */
export async function loadDashboardFilters(): Promise<DashboardFilterState | null> {
  try {
    const data = localStorage.getItem(DASHBOARD_FILTERS_KEY);
    if (!data) return null;

    return JSON.parse(data) as DashboardFilterState;
  } catch (error) {
    console.error('Failed to load dashboard filters:', error);
    return null;
  }
}

/**
 * Save dashboard filter configuration to storage
 * TODO: Replace with API call
 */
export async function saveDashboardFilters(state: DashboardFilterState): Promise<void> {
  try {
    localStorage.setItem(DASHBOARD_FILTERS_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save dashboard filters:', error);
    throw error;
  }
}

/**
 * Clear dashboard filter configuration from storage
 * TODO: Replace with API call
 */
export async function clearDashboardFilters(): Promise<void> {
  try {
    localStorage.removeItem(DASHBOARD_FILTERS_KEY);
  } catch (error) {
    console.error('Failed to clear dashboard filters:', error);
    throw error;
  }
}

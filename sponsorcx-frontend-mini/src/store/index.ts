/**
 * Store Index
 *
 * Central export point for all Zustand stores.
 * Import stores from here for cleaner imports throughout the app.
 *
 * @example
 * import { useOrganizationStore } from '@/store';
 */

export { useOrganizationStore } from './organizationStore';
export {
  useDashboardFilterStore,
  type DashboardFilterField,
  type DashboardFilterState,
} from './dashboardFilterStore';

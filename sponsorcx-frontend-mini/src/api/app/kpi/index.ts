/**
 * KPI API
 *
 * API functions for KPI alerts, schedules, and thresholds.
 */

// Alert router
export { createKpiAlert } from './alerts';

// Schedules
export {
  createKpiSchedule,
  fetchKpiSchedulesByGraph,
  deleteKpiSchedule,
  toggleKpiScheduleActive,
} from './schedules';

// Thresholds
export {
  createKpiThreshold,
  fetchKpiThresholdsByGraph,
  deleteKpiThreshold,
  toggleKpiThresholdActive,
} from './thresholds';

// Re-export types
export type { KpiAlert, KpiSchedule, KpiThreshold } from '../../../types/backend-graphql';

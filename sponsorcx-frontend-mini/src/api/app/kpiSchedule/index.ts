/**
 * KPI Schedule API
 *
 * CRUD operations for KPI schedules.
 */

export { fetchKpiSchedulesByGraph } from './queries';

export {
  createKpiSchedule,
  deleteKpiSchedule,
  toggleKpiScheduleActive,
} from './mutations';

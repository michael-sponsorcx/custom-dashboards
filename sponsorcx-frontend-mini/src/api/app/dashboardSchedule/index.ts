/**
 * Dashboard Schedule API
 *
 * CRUD operations for dashboard schedules.
 */

export {
  fetchDashboardSchedules,
  fetchDashboardSchedule,
  fetchDashboardSchedulesByDashboard,
} from './queries';

export {
  createDashboardSchedule,
  updateDashboardSchedule,
  deleteDashboardSchedule,
  toggleDashboardScheduleActive,
} from './mutations';

export { toDashboardScheduleInput } from './mappers';

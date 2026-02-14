/**
 * Dashboard Schedule Mappers
 *
 * Converts frontend form data to backend input types.
 */

import { FrequencyInterval } from '../../../types/backend-graphql';
import type { DashboardScheduleInput } from '../../../types/backend-graphql';
import type { DashboardScheduleFormData } from '../../../types/dashboard-schedules';

/**
 * Convert frontend DashboardScheduleFormData to backend DashboardScheduleInput
 */
export const toDashboardScheduleInput = (
  formData: DashboardScheduleFormData,
  dashboardId: string,
  createdById: string
): DashboardScheduleInput => {
  // Parse month dates from comma-separated string to number array
  const monthDates = formData.monthDates
    ? formData.monthDates
        .split(',')
        .map((d: string) => parseInt(d.trim(), 10))
        .filter((n: number) => !isNaN(n))
    : undefined;

  return {
    dashboardId,
    createdById,
    scheduleName: formData.scheduleName || '',
    comment: formData.comment || undefined,
    frequencyInterval: formData.frequencyInterval ?? FrequencyInterval.Day,
    minuteInterval: formData.minuteInterval ? parseInt(formData.minuteInterval, 10) : undefined,
    hourInterval: formData.hourInterval ? parseInt(formData.hourInterval, 10) : undefined,
    scheduleHour: formData.hour ? parseInt(formData.hour, 10) : undefined,
    scheduleMinute: formData.minute ? parseInt(formData.minute, 10) : undefined,
    selectedDays: formData.selectedDays,
    excludeWeekends: formData.excludeWeekends,
    monthDates,
    timeZone: formData.timeZone,
    attachmentType: formData.attachmentType,
    recipients: formData.recipients,
    isActive: true,
  };
};

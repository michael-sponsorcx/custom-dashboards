/**
 * Dashboard Schedule Types
 *
 * Type definitions for the dashboard schedule system.
 * Dashboard schedules send entire dashboard reports to recipients on a cadence.
 *
 * NOTE: This is separate from KPI schedules which send individual KPI values.
 * KPI schedule types are in kpi-alerts.ts.
 */

import type { DayOfWeek } from './schedule-common';
import { AttachmentType, type FrequencyInterval } from './backend-graphql';

// Re-export for convenience
export { AttachmentType };
export type { DayOfWeek, FrequencyInterval };

/**
 * Dashboard Schedule Form Data structure
 * Used by CreateScheduleModal to create schedules for entire dashboards
 */
export interface DashboardScheduleFormData {
  /** User-defined name for the schedule */
  scheduleName?: string;
  /** Comment text */
  comment?: string;
  /** Frequency interval type */
  frequencyInterval?: FrequencyInterval;
  /** Minute interval (5, 10, 15, ..., 45) - for n_minute type */
  minuteInterval?: string;
  /** Hour interval (1-12) - for hour type */
  hourInterval?: string;
  /** Hour of day (00-23) */
  hour?: string;
  /** Minute of hour (00-55, in 5-minute increments) */
  minute?: string;
  /** Selected days of the week */
  selectedDays?: DayOfWeek[];
  /** Exclude weekends - for day type */
  excludeWeekends?: boolean;
  /** Dates of month (comma-separated, e.g., "2,10,15") - for month type */
  monthDates?: string;
  /** IANA timezone identifier (e.g., 'America/New_York') */
  timeZone?: string;
  /** Attachment file format */
  attachmentType?: AttachmentType;
  /** List of recipient email addresses */
  recipients?: string[];
}

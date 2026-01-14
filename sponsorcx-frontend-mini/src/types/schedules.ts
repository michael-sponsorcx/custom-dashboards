/**
 * Schedule Types
 *
 * Type definitions for the schedule system.
 * These types define the structure of schedules and their configurations.
 */

/**
 * Days of the week
 */
export type DayOfWeek = 'M' | 'T' | 'W' | 'Th' | 'F' | 'S' | 'Su';

/**
 * Attachment file format options
 */
export type AttachmentType = 'PDF' | 'Excel' | 'CSV';

/**
 * Frequency interval type
 */
export type FrequencyInterval = 'n_minute' | 'hour' | 'day' | 'week' | 'month';

/**
 * Schedule Form Data structure
 */
export interface ScheduleFormData {
  /** User-defined name for the schedule */
  scheduleName?: string;
  /** Whether to add a comment */
  addComment?: boolean;
  /** Comment text - shown when addComment is true */
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
  /** Whether to add a gating condition */
  addGatingCondition?: boolean;
  /** Attachment file format */
  attachmentType?: AttachmentType;
  /** List of recipient email addresses */
  recipients?: string[];
}

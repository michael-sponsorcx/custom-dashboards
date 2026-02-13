/**
 * KPI Alert Types
 *
 * Type definitions for the KPI alert system.
 * These types define the structure of alerts, their configurations,
 * and related data structures.
 */

import { AlertType, FrequencyInterval, ThresholdCondition } from './backend-graphql';
import type { DayOfWeek } from './schedule-common';

/**
 * Alert details for threshold-based alerts
 */
export interface ThresholdAlertDetails {
  /** User-defined name for the alert */
  alertName: string;
  /** Comparison operator */
  condition: ThresholdCondition;
  /** Threshold value to compare against */
  thresholdValue: number;
}

/**
 * Alert details for scheduled alerts
 */
export interface ScheduledAlertDetails {
  /** User-defined name for the alert */
  alertName: string;
  /** How often to send the alert */
  frequency: FrequencyInterval;
  /** Hour of day (0-23) */
  hour: string;
  /** Minute of hour (0-55, in 5-minute increments) */
  minute: string;
  /** Whether to skip sending alerts on weekends */
  excludeWeekends: boolean;
  /** IANA timezone identifier (e.g., 'America/New_York') */
  timeZone: string;
}

/**
 * UI-specific types for KPI Alert Modal
 */

/**
 * KPI Alert Type Definition for UI selection
 */
export interface AlertTypeDefinition {
  /** Unique identifier for the alert type */
  id: AlertType;
  /** Display title for the alert type */
  title: string;
  /** Example description of what this alert does */
  example: string;
}

/**
 * Props for KPI Alert Modal
 */
export interface KPIAlertModalProps {
  /** Whether the modal is open */
  opened: boolean;
  /** Handler to close the modal */
  onClose: () => void;
  /** ID of the graph this alert is for */
  graphId: string | null;
  /** ID of the organization this alert belongs to */
  organizationId: string;
  /** ID of the dashboard this alert belongs to */
  dashboardId: string;
  /** ID of the user creating this alert */
  userId: string;
}

/**
 * Props for KPI Alert Tile component
 */
export interface KPIAlertTileProps {
  /** The type/title of the KPI alert */
  title: string;
  /** Example description of what this alert does */
  example: string;
  /** Whether this tile is currently selected */
  isSelected?: boolean;
  /** Optional click handler for when the tile is selected */
  onClick?: () => void;
  /** Whether this tile is disabled */
  disabled?: boolean;
}

/**
 * KPI Form Data structure for the alert modal
 */
export interface KPIFormData {
  /** Type of alert being configured */
  alertType?: AlertType;
  /** Alert-specific details (varies by alert type) */
  alertDetails?: ThresholdAlertDetails | ScheduledAlertDetails;
  /** Optional custom message to include in alert notifications */
  alertBodyContent?: string;
  /** List of recipient email addresses */
  recipients?: string[];
  /** KPI details/metrics being monitored */
  kpiDetails?: string[];
}

/**
 * KPI Schedule Form Data structure
 * Used for creating/updating KPI scheduled alerts (sends KPI value on a cadence)
 *
 * NOTE: This is separate from DashboardScheduleFormData which sends entire dashboard reports.
 */
export interface KpiScheduleFormData {
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
  /** List of recipient email addresses */
  recipients?: string[];
}

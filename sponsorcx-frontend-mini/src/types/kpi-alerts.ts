/**
 * KPI Alert Types
 *
 * Type definitions for the KPI alert system.
 * These types define the structure of alerts, their configurations,
 * and related data structures.
 */

/**
 * Type of KPI alert
 */
export type KPIAlertType =
  | 'threshold'
  | 'scheduled';
  // | 'attribute-threshold'
  // | 'attribute-scheduled'
  // | 'anomaly';

/**
 * Comparison operators for threshold-based alerts
 */
export type ThresholdComparisonOperator =
  | 'greater-than'
  | 'greater-than-or-equal'
  | 'less-than'
  | 'less-than-or-equal'
  | 'equal-to'
  | 'not-equal-to';

/**
 * Frequency options for scheduled alerts
 */
export type AlertFrequency = 'hourly' | 'daily' | 'weekly' | 'monthly';

/**
 * Alert details for threshold-based alerts
 */
export interface ThresholdAlertDetails {
  /** User-defined name for the alert */
  alertName: string;
  /** Comparison operator */
  condition: ThresholdComparisonOperator;
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
  frequency: AlertFrequency;
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
export interface KPIAlertTypeDefinition {
  /** Unique identifier for the alert type */
  id: KPIAlertType;
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
  alertType?: KPIAlertType;
  /** Alert-specific details (varies by alert type) */
  alertDetails?: ThresholdAlertDetails | ScheduledAlertDetails;
  /** Optional custom message to include in alert notifications */
  alertBodyContent?: string;
  /** List of recipient email addresses */
  recipients?: string[];
  /** KPI details/metrics being monitored */
  kpiDetails?: string[];
}

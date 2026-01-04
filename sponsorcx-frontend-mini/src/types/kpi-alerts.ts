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
export type ComparisonOperator =
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
 * Base KPI alert configuration
 */
export interface KPIAlertBase {
  /** Unique identifier for the alert */
  id: string;
  /** User-defined name for the alert */
  name: string;
  /** Type of alert */
  type: KPIAlertType;
  /** ID of the graph this alert is associated with */
  graphId: string;
  /** Optional custom message to include in alert notifications */
  customMessage?: string;
  /** List of recipient email addresses */
  recipients: string[];
  /** Whether the alert is currently active */
  isActive: boolean;
  /** Timestamp when the alert was created */
  createdAt: string;
  /** Timestamp when the alert was last updated */
  updatedAt: string;
}

/**
 * Configuration for threshold-based alerts
 * Triggers when a KPI crosses a specific threshold
 */
export interface ThresholdAlertConfig {
  /** Comparison operator */
  condition: ComparisonOperator;
  /** Threshold value to compare against */
  thresholdValue: number;
}

/**
 * Configuration for scheduled alerts
 * Sends regular updates at specified intervals
 */
export interface ScheduledAlertConfig {
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
 * Configuration for attribute selection
 * Used in attribute-based alerts to specify which dimension and values to monitor
 */
export interface AttributeConfig {
  /** Name of the attribute/dimension (e.g., 'account_name', 'region') */
  attributeName: string;
  /** Specific values of the attribute to monitor */
  attributeValues: string[];
}

/**
 * Threshold alert - KPI crosses a set limit
 */
export interface ThresholdAlert extends KPIAlertBase {
  type: 'threshold';
  config: ThresholdAlertConfig;
}

/**
 * Scheduled alert - Regular KPI updates
 */
export interface ScheduledAlert extends KPIAlertBase {
  type: 'scheduled';
  config: ScheduledAlertConfig;
}

/**
 * Attribute threshold alert - Values of an attribute cross a set limit
 */
// export interface AttributeThresholdAlert extends KPIAlertBase {
//   type: 'attribute-threshold';
//   config: AttributeConfig & ThresholdAlertConfig;
// }

/**
 * Attribute scheduled alert - Regular updates on values of an attribute
 */
// export interface AttributeScheduledAlert extends KPIAlertBase {
//   type: 'attribute-scheduled';
//   config: AttributeConfig & ScheduledAlertConfig;
// }

/**
 * Anomaly alert - Unexpected changes in KPI
 */
// export interface AnomalyAlert extends KPIAlertBase {
//   type: 'anomaly';
//   config: {
//     /** Sensitivity level for anomaly detection */
//     sensitivity: 'low' | 'medium' | 'high';
//   };
// }

/**
 * Union type of all possible alert types
 */
export type KPIAlert =
  | ThresholdAlert
  | ScheduledAlert;
  // | AttributeThresholdAlert
  // | AttributeScheduledAlert
  // | AnomalyAlert;

/**
 * Alert details for threshold-based alerts
 */
export interface ThresholdAlertDetails {
  /** User-defined name for the alert */
  alertName: string;
  /** Comparison operator */
  condition: ComparisonOperator;
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
 * Alert details for attribute threshold alerts
 */
// export interface AttributeThresholdAlertDetails {
//   /** User-defined name for the alert */
//   alertName: string;
//   /** Name of the attribute/dimension (e.g., 'account_name', 'region') */
//   attributeName: string;
//   /** Specific values of the attribute to monitor */
//   attributeValues: string[];
//   /** Comparison operator */
//   condition: ComparisonOperator;
//   /** Threshold value to compare against */
//   thresholdValue: number;
// }

/**
 * Alert details for attribute scheduled alerts
 */
// export interface AttributeScheduledAlertDetails {
//   /** User-defined name for the alert */
//   alertName: string;
//   /** Name of the attribute/dimension (e.g., 'account_name', 'region') */
//   attributeName: string;
//   /** Specific values of the attribute to monitor */
//   attributeValues: string[];
//   /** How often to send the alert */
//   frequency: AlertFrequency;
//   /** Hour of day (0-23) */
//   hour: string;
//   /** Minute of hour (0-55, in 5-minute increments) */
//   minute: string;
//   /** Whether to skip sending alerts on weekends */
//   excludeWeekends: boolean;
//   /** IANA timezone identifier (e.g., 'America/New_York') */
//   timeZone: string;
// }

/**
 * Input type for creating a threshold alert
 */
export interface CreateThresholdAlertInput {
  /** Type of alert */
  type: 'threshold';
  /** ID of the graph this alert is associated with */
  graphId: string;
  /** Alert-specific details */
  alertDetails: ThresholdAlertDetails;
  /** Optional custom message to include in alert notifications */
  alertBodyContent?: string;
  /** List of recipient email addresses */
  recipients: string[];
  /** KPI details/metrics being monitored */
  kpiDetails: string[];
}

/**
 * Input type for creating a scheduled alert
 */
export interface CreateScheduledAlertInput {
  /** Type of alert */
  type: 'scheduled';
  /** ID of the graph this alert is associated with */
  graphId: string;
  /** Alert-specific details */
  alertDetails: ScheduledAlertDetails;
  /** Optional custom message to include in alert notifications */
  alertBodyContent?: string;
  /** List of recipient email addresses */
  recipients: string[];
  /** KPI details/metrics being monitored */
  kpiDetails: string[];
}

/**
 * Input type for creating an attribute threshold alert
 */
// export interface CreateAttributeThresholdAlertInput {
//   /** Type of alert */
//   type: 'attribute-threshold';
//   /** ID of the graph this alert is associated with */
//   graphId: string;
//   /** Alert-specific details */
//   alertDetails: AttributeThresholdAlertDetails;
//   /** Optional custom message to include in alert notifications */
//   alertBodyContent?: string;
//   /** List of recipient email addresses */
//   recipients: string[];
//   /** KPI details/metrics being monitored */
//   kpiDetails: string[];
// }

/**
 * Input type for creating an attribute scheduled alert
 */
// export interface CreateAttributeScheduledAlertInput {
//   /** Type of alert */
//   type: 'attribute-scheduled';
//   /** ID of the graph this alert is associated with */
//   graphId: string;
//   /** Alert-specific details */
//   alertDetails: AttributeScheduledAlertDetails;
//   /** Optional custom message to include in alert notifications */
//   alertBodyContent?: string;
//   /** List of recipient email addresses */
//   recipients: string[];
//   /** KPI details/metrics being monitored */
//   kpiDetails: string[];
// }

/**
 * Union type for all create alert inputs
 */
export type CreateKPIAlertInput =
  | CreateThresholdAlertInput
  | CreateScheduledAlertInput;
  // | CreateAttributeThresholdAlertInput
  // | CreateAttributeScheduledAlertInput;

/**
 * Input type for updating an existing KPI alert
 */
export type UpdateKPIAlertInput = {
  /** Unique identifier for the alert to update */
  id: string;
  /** Whether the alert is currently active */
  isActive?: boolean;
} & Partial<CreateKPIAlertInput>;

/**
 * Attribute option for selection dropdowns
 */
export interface AttributeOption {
  /** Value identifier for the attribute */
  value: string;
  /** Display label for the attribute */
  label: string;
}

/**
 * Attribute value option for selection dropdowns
 */
export interface AttributeValueOption {
  /** Value identifier */
  value: string;
  /** Display label */
  label: string;
}

/**
 * Alert notification that was sent
 */
export interface AlertNotification {
  /** Unique identifier for the notification */
  id: string;
  /** ID of the alert that triggered this notification */
  alertId: string;
  /** Timestamp when notification was sent */
  sentAt: string;
  /** List of recipients who received the notification */
  recipients: string[];
  /** Whether the notification was successfully delivered */
  delivered: boolean;
  /** Optional error message if delivery failed */
  error?: string;
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
  /** Name of the graph for display */
  graphName: string;
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
 * Props for KPI Alert Modal Configure Tab
 */
export interface KPIAlertModalConfigureTabProps {
  /** ID of the selected alert type */
  alertTypeId: KPIAlertType;
  /** Title of the selected alert type */
  alertTypeTitle: string;
  /** Example description of the selected alert type */
  alertTypeExample: string;
  /** KPI form data object to store alert configuration */
  kpiFormData: KPIFormData;
  /** Function to update KPI form data */
  setKpiFormData: (data: KPIFormData | ((prev: KPIFormData) => KPIFormData)) => void;
}

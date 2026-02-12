import type { ThresholdCondition } from '../../generated/graphql';
import type { AlertRowColumns, KpiAlert } from '../kpiAlert';

/** Database row type for kpi_thresholds joined query (snake_case) */
export interface KpiThresholdRow extends AlertRowColumns {
    threshold_id: string;
    kpi_alert_id: string;
    condition: ThresholdCondition;
    threshold_value: string; // NUMERIC returns as string from pg driver
    time_zone: string;
}

/** Resolved KpiThreshold type (camelCase for GraphQL) */
export interface KpiThreshold {
    id: string;
    kpiAlertId: string;
    alert: KpiAlert;
    condition: ThresholdCondition;
    thresholdValue: number;
    timeZone: string;
}

/** Row from kpi_thresholds table (without alert join) */
export interface KpiThresholdTableRow {
    id: string;
    kpi_alert_id: string;
    condition: ThresholdCondition;
    threshold_value: string;
    time_zone: string;
}

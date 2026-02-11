import type { AlertRowColumns, KpiAlert } from './kpiAlert';
import { rowToKpiAlert } from './kpiAlert';

/** Database row type for kpi_thresholds joined query (snake_case) */
export interface KpiThresholdRow extends AlertRowColumns {
    threshold_id: string;
    kpi_alert_id: string;
    condition: string;
    threshold_value: string; // NUMERIC returns as string from pg driver
    time_zone: string;
}

/** Resolved type for KpiThreshold (camelCase for GraphQL) */
export interface KpiThreshold {
    id: string;
    kpiAlertId: string;
    condition: string;
    thresholdValue: number;
    timeZone: string;
    alert: KpiAlert;
}

/** Convert a kpi_threshold joined row to camelCase for GraphQL */
export const kpiThresholdToCamelCase = (row: KpiThresholdRow): KpiThreshold => ({
    id: row.threshold_id,
    kpiAlertId: row.kpi_alert_id,
    condition: row.condition,
    thresholdValue: parseFloat(row.threshold_value),
    timeZone: row.time_zone,
    alert: rowToKpiAlert(row),
});

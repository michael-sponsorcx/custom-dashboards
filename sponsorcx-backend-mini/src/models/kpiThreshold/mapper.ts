import type { KpiThresholdRow, KpiThreshold } from './types';
import { rowToKpiAlert } from '../kpiAlert';

/** Convert a kpi_threshold joined row to camelCase for GraphQL */
export const kpiThresholdToCamelCase = (row: KpiThresholdRow): KpiThreshold => ({
    id: row.threshold_id,
    kpiAlertId: row.kpi_alert_id,
    condition: row.condition,
    thresholdValue: parseFloat(row.threshold_value),
    timeZone: row.time_zone,
    alert: rowToKpiAlert(row),
});

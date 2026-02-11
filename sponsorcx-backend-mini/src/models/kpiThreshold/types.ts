import type { KpiThreshold as CodegenKpiThreshold } from '../../generated/graphql';
import type { AlertRowColumns, KpiAlert } from '../kpiAlert';

/** Database row type for kpi_thresholds joined query (snake_case) */
export interface KpiThresholdRow extends AlertRowColumns {
    threshold_id: string;
    kpi_alert_id: string;
    condition: string;
    threshold_value: string; // NUMERIC returns as string from pg driver
    time_zone: string;
}

/**
 * Resolved KpiThreshold type (camelCase for GraphQL).
 * Overrides: condition (string vs ThresholdCondition enum),
 * timeZone (non-null from DB), alert (model KpiAlert vs codegen KpiAlert)
 */
type KpiThresholdOverrides = {
    condition: string;
    timeZone: string;
    alert: KpiAlert;
};

export type KpiThreshold = Omit<CodegenKpiThreshold, '__typename' | keyof KpiThresholdOverrides> & KpiThresholdOverrides;

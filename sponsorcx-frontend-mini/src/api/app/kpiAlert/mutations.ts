/**
 * KPI Alert Mutation Operations
 *
 * Router for creating KPI alerts (schedules or thresholds).
 * Routes to the appropriate service based on alert type.
 */

import type { KPIFormData } from '../../../types/kpi-alerts';
import { AlertType } from '../../../types/backend-graphql';
import type { KpiSchedule, KpiThreshold } from '../../../types/backend-graphql';
import { createKpiSchedule } from '../kpiSchedule';
import { createKpiThreshold } from '../kpiThreshold';

/**
 * Create a new KPI alert (schedule or threshold based on alertType)
 */
export const createKpiAlert = async (
  graphId: string,
  formData: KPIFormData,
  organizationId: string,
  dashboardId: string,
  createdById: string
): Promise<KpiSchedule | KpiThreshold> => {
  const alertType = formData.alertType || AlertType.Threshold;

  if (alertType === AlertType.Schedule) {
    return createKpiSchedule(graphId, formData, organizationId, dashboardId, createdById);
  } else {
    return createKpiThreshold(graphId, formData, organizationId, dashboardId, createdById);
  }
};

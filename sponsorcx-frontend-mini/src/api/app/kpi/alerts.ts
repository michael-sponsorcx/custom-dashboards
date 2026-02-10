/**
 * KPI Alerts API Service
 *
 * Router for creating KPI alerts (schedules or thresholds).
 * Routes to the appropriate service based on alert type.
 */

import type { KPIFormData, KPIAlertType } from '../../../types/kpi-alerts';
import type { KpiSchedule, KpiThreshold } from '../../../types/backend-graphql';
import { createKpiSchedule } from './schedules';
import { createKpiThreshold } from './thresholds';

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
  const alertType: KPIAlertType = formData.alertType || 'threshold';

  if (alertType === 'scheduled') {
    return createKpiSchedule(graphId, formData, organizationId, dashboardId, createdById);
  } else {
    return createKpiThreshold(graphId, formData, organizationId, dashboardId, createdById);
  }
};

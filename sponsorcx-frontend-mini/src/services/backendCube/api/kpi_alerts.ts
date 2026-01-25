/**
 * KPI Alerts API Service
 *
 * Handles KPI alert CRUD operations via backend GraphQL API.
 * The backend uses separate mutations for schedules and thresholds:
 * - createKpiSchedule / updateKpiSchedule / deleteKpiSchedule
 * - createKpiThreshold / updateKpiThreshold / deleteKpiThreshold
 */

import { executeBackendGraphQL } from '../core/backendClient';
import type {
    KPIFormData,
    KPIAlertType,
    ThresholdAlertDetails,
    ScheduledAlertDetails,
} from '../../../types/kpi-alerts';
import {
    toBackendFrequency,
    toBackendCondition,
    type BackendFrequencyInterval,
    type BackendThresholdCondition,
    type BackendAttachmentType,
} from '../utils/enumMappers';

// ============================================================================
// Types matching backend GraphQL schema
// ============================================================================

/** Base alert fields shared by schedules and thresholds */
export interface KpiAlert {
    id: string;
    organizationId: string;
    graphId?: string;
    dashboardId: string;
    createdById: string;
    alertName: string;
    alertType: 'schedule' | 'threshold';
    comment?: string;
    recipients?: string[];
    isActive?: boolean;
    lastExecutedAt?: string;
    nextExecutionAt: string;
    executionCount?: number;
    createdAt?: string;
    updatedAt?: string;
}

/** KPI Schedule with nested alert */
export interface KpiSchedule {
    id: string;
    kpiAlertId: string;
    frequencyInterval: BackendFrequencyInterval;
    minuteInterval?: number;
    hourInterval?: number;
    scheduleHour?: number;
    scheduleMinute?: number;
    selectedDays?: string[];
    excludeWeekends?: boolean;
    monthDates?: number[];
    timeZone?: string;
    hasGatingCondition?: boolean;
    gatingCondition?: unknown;
    attachmentType?: BackendAttachmentType;
    cronExpression?: string;
    alert: KpiAlert;
}

/** KPI Threshold with nested alert */
export interface KpiThreshold {
    id: string;
    kpiAlertId: string;
    condition: BackendThresholdCondition;
    thresholdValue: number;
    timeZone?: string;
    alert: KpiAlert;
}

// ============================================================================
// Input Types for Mutations
// ============================================================================

/** Input for createKpiSchedule mutation */
interface CreateKpiScheduleInput {
    graphId?: string;
    dashboardId: string;
    createdById: string;
    alertName: string;
    comment?: string;
    recipients?: string[];
    isActive?: boolean;
    frequencyInterval: BackendFrequencyInterval;
    minuteInterval?: number;
    hourInterval?: number;
    scheduleHour?: number;
    scheduleMinute?: number;
    selectedDays?: string[];
    excludeWeekends?: boolean;
    monthDates?: number[];
    timeZone?: string;
    hasGatingCondition?: boolean;
    gatingCondition?: unknown;
    attachmentType?: BackendAttachmentType;
}

/** Input for createKpiThreshold mutation */
interface CreateKpiThresholdInput {
    graphId?: string;
    dashboardId: string;
    createdById: string;
    alertName: string;
    comment?: string;
    recipients?: string[];
    isActive?: boolean;
    condition: BackendThresholdCondition;
    thresholdValue: number;
    timeZone?: string;
}

// ============================================================================
// GraphQL Fragments
// ============================================================================

const KPI_ALERT_FIELDS = `
    id
    organizationId
    graphId
    dashboardId
    createdById
    alertName
    alertType
    comment
    recipients
    isActive
    lastExecutedAt
    nextExecutionAt
    executionCount
    createdAt
    updatedAt
`;

const KPI_SCHEDULE_FIELDS = `
    id
    kpiAlertId
    frequencyInterval
    minuteInterval
    hourInterval
    scheduleHour
    scheduleMinute
    selectedDays
    excludeWeekends
    monthDates
    timeZone
    hasGatingCondition
    gatingCondition
    attachmentType
    cronExpression
    alert {
        ${KPI_ALERT_FIELDS}
    }
`;

const KPI_THRESHOLD_FIELDS = `
    id
    kpiAlertId
    condition
    thresholdValue
    timeZone
    alert {
        ${KPI_ALERT_FIELDS}
    }
`;

// ============================================================================
// Conversion Helpers
// ============================================================================

/**
 * Convert frontend KPIFormData to CreateKpiScheduleInput
 */
const toScheduleInput = (
    graphId: string,
    formData: KPIFormData,
    dashboardId: string,
    createdById: string
): CreateKpiScheduleInput => {
    const alertDetails = formData.alertDetails as ScheduledAlertDetails | undefined;

    const frequency = alertDetails?.frequency || 'daily';
    const frequencyInterval = toBackendFrequency(frequency);

    return {
        graphId,
        dashboardId,
        createdById,
        alertName: alertDetails?.alertName || 'Scheduled Report',
        comment: formData.alertBodyContent,
        recipients: formData.recipients,
        isActive: true,
        frequencyInterval,
        scheduleHour: alertDetails?.hour ? parseInt(alertDetails.hour, 10) : undefined,
        scheduleMinute: alertDetails?.minute ? parseInt(alertDetails.minute, 10) : undefined,
        excludeWeekends: alertDetails?.excludeWeekends,
        timeZone: alertDetails?.timeZone || 'UTC',
    };
};

/**
 * Convert frontend KPIFormData to CreateKpiThresholdInput
 */
const toThresholdInput = (
    graphId: string,
    formData: KPIFormData,
    dashboardId: string,
    createdById: string
): CreateKpiThresholdInput => {
    const alertDetails = formData.alertDetails as ThresholdAlertDetails | undefined;

    const condition = alertDetails?.condition || 'greater-than';
    const mappedCondition = toBackendCondition(condition);

    return {
        graphId,
        dashboardId,
        createdById,
        alertName: alertDetails?.alertName || 'Threshold Alert',
        comment: formData.alertBodyContent,
        recipients: formData.recipients,
        isActive: true,
        condition: mappedCondition,
        thresholdValue: alertDetails?.thresholdValue ?? 0,
        timeZone: 'UTC',
    };
};

// ============================================================================
// API Functions
// ============================================================================

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

/**
 * Create a new KPI Schedule
 */
export const createKpiSchedule = async (
    graphId: string,
    formData: KPIFormData,
    organizationId: string,
    dashboardId: string,
    createdById: string
): Promise<KpiSchedule> => {
    const input = toScheduleInput(graphId, formData, dashboardId, createdById);

    const mutation = `
        mutation CreateKpiSchedule($organizationId: ID!, $input: CreateKpiScheduleInput!) {
            createKpiSchedule(organizationId: $organizationId, input: $input) {
                ${KPI_SCHEDULE_FIELDS}
            }
        }
    `;

    const response = await executeBackendGraphQL<{ createKpiSchedule: KpiSchedule }>(mutation, {
        organizationId,
        input,
    });

    if (!response.data?.createKpiSchedule) {
        throw new Error('Failed to create KPI schedule');
    }

    return response.data.createKpiSchedule;
};

/**
 * Create a new KPI Threshold
 */
export const createKpiThreshold = async (
    graphId: string,
    formData: KPIFormData,
    organizationId: string,
    dashboardId: string,
    createdById: string
): Promise<KpiThreshold> => {
    const input = toThresholdInput(graphId, formData, dashboardId, createdById);

    const mutation = `
        mutation CreateKpiThreshold($organizationId: ID!, $input: CreateKpiThresholdInput!) {
            createKpiThreshold(organizationId: $organizationId, input: $input) {
                ${KPI_THRESHOLD_FIELDS}
            }
        }
    `;

    const response = await executeBackendGraphQL<{ createKpiThreshold: KpiThreshold }>(mutation, {
        organizationId,
        input,
    });

    if (!response.data?.createKpiThreshold) {
        throw new Error('Failed to create KPI threshold');
    }

    return response.data.createKpiThreshold;
};

/**
 * Fetch KPI schedules for a graph
 */
export const fetchKpiSchedulesByGraph = async (graphId: string): Promise<KpiSchedule[]> => {
    const query = `
        query KpiSchedulesByGraph($graphId: ID!) {
            kpiSchedulesByGraph(graphId: $graphId) {
                ${KPI_SCHEDULE_FIELDS}
            }
        }
    `;

    const response = await executeBackendGraphQL<{ kpiSchedulesByGraph: KpiSchedule[] }>(query, {
        graphId,
    });

    return response.data?.kpiSchedulesByGraph || [];
};

/**
 * Fetch KPI thresholds for a graph
 */
export const fetchKpiThresholdsByGraph = async (graphId: string): Promise<KpiThreshold[]> => {
    const query = `
        query KpiThresholdsByGraph($graphId: ID!) {
            kpiThresholdsByGraph(graphId: $graphId) {
                ${KPI_THRESHOLD_FIELDS}
            }
        }
    `;

    const response = await executeBackendGraphQL<{ kpiThresholdsByGraph: KpiThreshold[] }>(query, {
        graphId,
    });

    return response.data?.kpiThresholdsByGraph || [];
};

/**
 * Delete a KPI Schedule
 */
export const deleteKpiSchedule = async (id: string): Promise<boolean> => {
    const mutation = `
        mutation DeleteKpiSchedule($id: ID!) {
            deleteKpiSchedule(id: $id)
        }
    `;

    const response = await executeBackendGraphQL<{ deleteKpiSchedule: boolean }>(mutation, { id });

    return response.data?.deleteKpiSchedule || false;
};

/**
 * Delete a KPI Threshold
 */
export const deleteKpiThreshold = async (id: string): Promise<boolean> => {
    const mutation = `
        mutation DeleteKpiThreshold($id: ID!) {
            deleteKpiThreshold(id: $id)
        }
    `;

    const response = await executeBackendGraphQL<{ deleteKpiThreshold: boolean }>(mutation, { id });

    return response.data?.deleteKpiThreshold || false;
};

/**
 * Toggle a KPI Schedule's active status
 */
export const toggleKpiScheduleActive = async (
    id: string,
    isActive: boolean
): Promise<KpiSchedule | null> => {
    const mutation = `
        mutation ToggleKpiScheduleActive($id: ID!, $isActive: Boolean!) {
            toggleKpiScheduleActive(id: $id, isActive: $isActive) {
                ${KPI_SCHEDULE_FIELDS}
            }
        }
    `;

    const response = await executeBackendGraphQL<{ toggleKpiScheduleActive: KpiSchedule }>(
        mutation,
        { id, isActive }
    );

    return response.data?.toggleKpiScheduleActive || null;
};

/**
 * Toggle a KPI Threshold's active status
 */
export const toggleKpiThresholdActive = async (
    id: string,
    isActive: boolean
): Promise<KpiThreshold | null> => {
    const mutation = `
        mutation ToggleKpiThresholdActive($id: ID!, $isActive: Boolean!) {
            toggleKpiThresholdActive(id: $id, isActive: $isActive) {
                ${KPI_THRESHOLD_FIELDS}
            }
        }
    `;

    const response = await executeBackendGraphQL<{ toggleKpiThresholdActive: KpiThreshold }>(
        mutation,
        { id, isActive }
    );

    return response.data?.toggleKpiThresholdActive || null;
};

/**
 * Enum Mappers
 *
 * Maps frontend enum values to backend GraphQL enum values.
 * The backend uses uppercase values (e.g., 'GREATER_THAN') while
 * the frontend uses lowercase kebab-case (e.g., 'greater-than').
 */

import type { AlertFrequency, ThresholdComparisonOperator } from '../../../types/kpi-alerts';

// ============================================================================
// Backend Enum Types
// ============================================================================

export type BackendFrequencyInterval = 'N_MINUTE' | 'HOUR' | 'DAY' | 'WEEK' | 'MONTH';

export type BackendThresholdCondition =
    | 'GREATER_THAN'
    | 'GREATER_THAN_OR_EQUAL'
    | 'LESS_THAN'
    | 'LESS_THAN_OR_EQUAL'
    | 'EQUAL_TO'
    | 'NOT_EQUAL_TO';

export type BackendAttachmentType = 'PDF' | 'EXCEL' | 'CSV';

// ============================================================================
// Frequency Mappers
// ============================================================================

/**
 * Map frontend AlertFrequency to backend FrequencyInterval enum
 */
export const toBackendFrequency = (frequency: AlertFrequency): BackendFrequencyInterval => {
    const mapping: Record<AlertFrequency, BackendFrequencyInterval> = {
        hourly: 'HOUR',
        daily: 'DAY',
        weekly: 'WEEK',
        monthly: 'MONTH',
    };
    return mapping[frequency];
};

/**
 * Map backend FrequencyInterval to frontend AlertFrequency
 */
export const toFrontendFrequency = (frequency: BackendFrequencyInterval): AlertFrequency => {
    const mapping: Record<BackendFrequencyInterval, AlertFrequency> = {
        N_MINUTE: 'hourly', // Approximate mapping
        HOUR: 'hourly',
        DAY: 'daily',
        WEEK: 'weekly',
        MONTH: 'monthly',
    };
    return mapping[frequency];
};

// ============================================================================
// Threshold Condition Mappers
// ============================================================================

/**
 * Map frontend ThresholdComparisonOperator to backend ThresholdCondition enum
 */
export const toBackendCondition = (
    condition: ThresholdComparisonOperator
): BackendThresholdCondition => {
    const mapping: Record<ThresholdComparisonOperator, BackendThresholdCondition> = {
        'greater-than': 'GREATER_THAN',
        'greater-than-or-equal': 'GREATER_THAN_OR_EQUAL',
        'less-than': 'LESS_THAN',
        'less-than-or-equal': 'LESS_THAN_OR_EQUAL',
        'equal-to': 'EQUAL_TO',
        'not-equal-to': 'NOT_EQUAL_TO',
    };
    return mapping[condition];
};

/**
 * Map backend ThresholdCondition to frontend ThresholdComparisonOperator
 */
export const toFrontendCondition = (
    condition: BackendThresholdCondition
): ThresholdComparisonOperator => {
    const mapping: Record<BackendThresholdCondition, ThresholdComparisonOperator> = {
        GREATER_THAN: 'greater-than',
        GREATER_THAN_OR_EQUAL: 'greater-than-or-equal',
        LESS_THAN: 'less-than',
        LESS_THAN_OR_EQUAL: 'less-than-or-equal',
        EQUAL_TO: 'equal-to',
        NOT_EQUAL_TO: 'not-equal-to',
    };
    return mapping[condition];
};

// ============================================================================
// Attachment Type Mappers
// ============================================================================

/**
 * Map frontend AttachmentType to backend AttachmentType enum
 */
export const toBackendAttachmentType = (
    attachmentType: 'PDF' | 'Excel' | 'CSV'
): BackendAttachmentType => {
    const mapping: Record<'PDF' | 'Excel' | 'CSV', BackendAttachmentType> = {
        PDF: 'PDF',
        Excel: 'EXCEL',
        CSV: 'CSV',
    };
    return mapping[attachmentType];
};

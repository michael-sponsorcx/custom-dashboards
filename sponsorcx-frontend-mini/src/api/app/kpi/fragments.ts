/**
 * KPI GraphQL Fragments
 *
 * Shared GraphQL fragments for KPI alerts, schedules, and thresholds
 */

export const KPI_ALERT_FIELDS = `
    id
    cronJobId
    organizationId
    graphId
    dashboardId
    createdById
    alertName
    alertType
    comment
    recipients
    isActive
    createdAt
    updatedAt
`;

export const KPI_SCHEDULE_FIELDS = `
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
    attachmentType
    alert {
        ${KPI_ALERT_FIELDS}
    }
`;

export const KPI_THRESHOLD_FIELDS = `
    id
    kpiAlertId
    condition
    thresholdValue
    timeZone
    alert {
        ${KPI_ALERT_FIELDS}
    }
`;

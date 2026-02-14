/**
 * KPI Schedule GraphQL Fragments
 */

const KPI_ALERT_FIELDS = `
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

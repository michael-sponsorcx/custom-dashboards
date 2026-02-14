/**
 * KPI Threshold GraphQL Fragments
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

/**
 * Dashboard Schedule GraphQL Fragments
 */

export const DASHBOARD_SCHEDULE_FIELDS = `
  id
  cronJobId
  organizationId
  dashboardId
  createdById
  createdByName
  createdByEmail
  scheduleName
  comment
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
  recipients
  isActive
  createdAt
  updatedAt
`;

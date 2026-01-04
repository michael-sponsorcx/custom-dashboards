import { Stack } from '@mantine/core';
import { SchedulingConfiguration } from './SchedulingConfiguration';

/**
 * ScheduledAlertDetails Component
 *
 * Alert detail fields specific to the "scheduled" alert type.
 * Used when the alert type is "Regular KPI updates".
 *
 * Fields:
 * - Frequency: How often to send (hourly, daily, weekly, monthly)
 * - Time: Hour (00-23) and Minute (00, 05, 10, ..., 55) selection
 * - Exclude Weekends: Checkbox option
 * - Time Zone: Selector for time zone
 */
export const ScheduledAlertDetails = () => {
  return (
    <Stack gap="md">
      <SchedulingConfiguration />
    </Stack>
  );
};

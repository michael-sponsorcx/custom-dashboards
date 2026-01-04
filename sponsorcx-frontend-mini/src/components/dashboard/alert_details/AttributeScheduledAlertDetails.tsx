import { Stack } from '@mantine/core';
import { AttributeValueSelector } from './AttributeValueSelector';
import { SchedulingConfiguration } from './SchedulingConfiguration';

/**
 * AttributeScheduledAlertDetails Component
 *
 * Alert detail fields specific to the "attribute-scheduled" alert type.
 * Used when the alert type is "Regular updates on values of an attribute".
 *
 * Fields:
 * - Select Attribute: Dropdown to select a dimension/attribute from the graph's cube view
 * - Select Values: Multi-select to choose specific values of the selected attribute
 * - Frequency: How often to send (hourly, daily, weekly, monthly)
 * - Time: Hour (00-23) and Minute (00, 05, 10, ..., 55) selection
 * - Exclude Weekends: Checkbox option
 * - Time Zone: Selector for time zone
 */
export const AttributeScheduledAlertDetails = () => {
  return (
    <Stack gap="md">
      <AttributeValueSelector />
      <SchedulingConfiguration />
    </Stack>
  );
};

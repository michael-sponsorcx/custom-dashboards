import { Stack } from '@mantine/core';
import { AttributeValueSelector } from './AttributeValueSelector';
import { ConditionThresholdInput } from './ConditionThresholdInput';

/**
 * AttributeThresholdAlertDetails Component
 *
 * Alert detail fields specific to the "attribute-threshold" alert type.
 * Used when the alert type is "Values of an attribute crosses a set limit".
 *
 * Fields:
 * - Select Attribute: Dropdown to select a dimension/attribute from the graph's cube view
 * - Select Values: Multi-select to choose specific values of the selected attribute
 * - Condition: Comparison operator (greater than, less than, etc.)
 * - Threshold Value: The value to compare against
 */
export const AttributeThresholdAlertDetails = () => {
  return (
    <Stack gap="md">
      <AttributeValueSelector />
      <ConditionThresholdInput />
    </Stack>
  );
};

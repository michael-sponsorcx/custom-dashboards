import { Stack, Text, Select, Flex, TextInput } from '@mantine/core';
import type { ComparisonOperator } from '../../../types/kpi-alerts';

/**
 * ConditionThresholdInput Component
 *
 * Reusable input group for selecting a comparison condition and threshold value.
 * Used in both ThresholdAlertDetails and AttributeThresholdAlertDetails components.
 *
 * Fields:
 * - Condition: Comparison operator (greater than, less than, etc.)
 * - Threshold Value: The value to compare against
 */

interface ConditionThresholdInputProps {
  /** Current condition value */
  condition?: string;
  /** Current threshold value */
  thresholdValue?: string;
  /** Callback when condition changes */
  onConditionChange?: (condition: ComparisonOperator) => void;
  /** Callback when threshold value changes */
  onThresholdValueChange?: (value: string) => void;
}

export const ConditionThresholdInput = ({
  condition,
  thresholdValue,
  onConditionChange,
  onThresholdValueChange
}: ConditionThresholdInputProps) => {
  return (
    <Flex gap="md" align="flex-end">
      <Stack gap="xs" style={{ flex: 1 }}>
        <Text size="sm" fw={500}>
          Condition
        </Text>
        <Select
          placeholder="Select condition"
          value={condition}
          onChange={(value) => {
            if (value && onConditionChange) {
              onConditionChange(value as ComparisonOperator);
            }
          }}
          data={[
            { value: 'greater-than', label: 'Greater than' },
            { value: 'greater-than-or-equal', label: 'Greater than or equal to' },
            { value: 'less-than', label: 'Less than' },
            { value: 'less-than-or-equal', label: 'Less than or equal to' },
            { value: 'equal-to', label: 'Equal to' },
            { value: 'not-equal-to', label: 'Not equal to' },
          ]}
        />
      </Stack>
      <Stack gap="xs" style={{ flex: 1 }}>
        <Text size="sm" fw={500}>
          Threshold Value
        </Text>
        <TextInput
          placeholder="Enter threshold value"
          value={thresholdValue}
          onChange={(event) => {
            if (onThresholdValueChange) {
              onThresholdValueChange(event.currentTarget.value);
            }
          }}
        />
      </Stack>
    </Flex>
  );
};

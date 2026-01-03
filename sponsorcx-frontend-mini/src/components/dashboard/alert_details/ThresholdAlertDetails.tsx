import { Stack, Text, TextInput, Select, Flex } from '@mantine/core';

/**
 * ThresholdAlertDetails Component
 *
 * Alert detail fields specific to the "threshold" alert type.
 * Used when the alert type is "KPI crosses a set limit".
 *
 * Fields:
 * - Condition: Comparison operator (greater than, less than, etc.)
 * - Threshold Value: The value to compare against
 */
export function ThresholdAlertDetails() {
  return (
    <Flex gap="md" align="flex-end">
      <Stack gap="xs" style={{ flex: 1 }}>
        <Text size="sm" fw={500}>
          Condition
        </Text>
        <Select
          placeholder="Select condition"
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
        <TextInput placeholder="Enter threshold value" />
      </Stack>
    </Flex>
  );
}

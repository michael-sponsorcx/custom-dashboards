import { useState } from 'react';
import { Stack, Text, Select, Flex, TextInput } from '@mantine/core';
import { ThresholdCondition } from '../../../types/backend-graphql';
import type { KPIFormData, ThresholdAlertDetails as ThresholdAlertDetailsType } from '../../../types/kpi-alerts';

// Comparison operator options
const CONDITION_OPTIONS = [
  { value: ThresholdCondition.GreaterThan, label: 'Greater than' },
  { value: ThresholdCondition.GreaterThanOrEqual, label: 'Greater than or equal to' },
  { value: ThresholdCondition.LessThan, label: 'Less than' },
  { value: ThresholdCondition.LessThanOrEqual, label: 'Less than or equal to' },
  { value: ThresholdCondition.EqualTo, label: 'Equal to' },
  { value: ThresholdCondition.NotEqualTo, label: 'Not equal to' },
];

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

interface ThresholdAlertDetailsProps {
  /** Function to update KPI form data */
  setKpiFormData: (data: KPIFormData | ((prev: KPIFormData) => KPIFormData)) => void;
}

export const ThresholdAlertDetails = ({ setKpiFormData }: ThresholdAlertDetailsProps) => {
  const [condition, setCondition] = useState<string>('');
  const [thresholdValue, setThresholdValue] = useState<string>('');

  const handleConditionChange = (newCondition: ThresholdCondition) => {
    setCondition(newCondition);

    // Update KPI form data with alert details
    setKpiFormData((prev) => ({
      ...prev,
      alertDetails: {
        ...prev.alertDetails,
        condition: newCondition,
      } as ThresholdAlertDetailsType,
    }));
  };

  const handleThresholdValueChange = (value: string) => {
    setThresholdValue(value);

    // Update KPI form data with alert details
    setKpiFormData((prev) => ({
      ...prev,
      alertDetails: {
        ...prev.alertDetails,
        thresholdValue: parseFloat(value) || 0,
      } as ThresholdAlertDetailsType,
    }));
  };

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
            if (value) {
              handleConditionChange(value as ThresholdCondition);
            }
          }}
          data={CONDITION_OPTIONS}
        />
      </Stack>
      <Stack gap="xs" style={{ flex: 1 }}>
        <Text size="sm" fw={500}>
          Threshold Value
        </Text>
        <TextInput
          type="number"
          placeholder="Enter threshold value"
          value={thresholdValue}
          onChange={(event) => handleThresholdValueChange(event.currentTarget.value)}
        />
      </Stack>
    </Flex>
  );
}

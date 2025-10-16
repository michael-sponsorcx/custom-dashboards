import { Stack, Select, NumberInput } from '@mantine/core';
import { ComparisonOperator } from '../../../types/filters';

interface MeasureFilterContentProps {
  measureOperator: ComparisonOperator;
  measureValue: number | string;
  onOperatorChange: (operator: ComparisonOperator) => void;
  onValueChange: (value: number | string) => void;
}

const COMPARISON_OPERATORS: { value: ComparisonOperator; label: string }[] = [
  { value: '=', label: 'Equal to (=)' },
  { value: '>', label: 'Greater than (>)' },
  { value: '<', label: 'Less than (<)' },
  { value: '>=', label: 'Greater than or equal (≥)' },
  { value: '<=', label: 'Less than or equal (≤)' },
];

export function MeasureFilterContent({
  measureOperator,
  measureValue,
  onOperatorChange,
  onValueChange
}: MeasureFilterContentProps) {
  return (
    <Stack gap="md">
      <Select
        label="Comparison"
        data={COMPARISON_OPERATORS}
        value={measureOperator}
        onChange={(value) => value && onOperatorChange(value as ComparisonOperator)}
      />
      <NumberInput
        label="Value"
        placeholder="Enter numeric value"
        value={measureValue}
        onChange={onValueChange}
      />
    </Stack>
  );
}

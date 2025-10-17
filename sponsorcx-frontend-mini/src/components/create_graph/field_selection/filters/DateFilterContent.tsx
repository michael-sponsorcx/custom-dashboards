import { Stack, Select, TextInput } from '@mantine/core';
import { ComparisonOperator } from '../../../../types/filters';

interface DateFilterContentProps {
  dateOperator: ComparisonOperator;
  dateValue: string;
  onOperatorChange: (operator: ComparisonOperator) => void;
  onValueChange: (value: string) => void;
}

const COMPARISON_OPERATORS: { value: ComparisonOperator; label: string }[] = [
  { value: '=', label: 'Equal to (=)' },
  { value: '>', label: 'Greater than (>)' },
  { value: '<', label: 'Less than (<)' },
  { value: '>=', label: 'Greater than or equal (≥)' },
  { value: '<=', label: 'Less than or equal (≤)' },
];

export function DateFilterContent({
  dateOperator,
  dateValue,
  onOperatorChange,
  onValueChange
}: DateFilterContentProps) {
  return (
    <Stack gap="md">
      <Select
        label="Comparison"
        data={COMPARISON_OPERATORS}
        value={dateOperator}
        onChange={(value) => value && onOperatorChange(value as ComparisonOperator)}
      />
      <TextInput
        label="Date"
        placeholder="YYYY-MM-DD"
        value={dateValue}
        onChange={(event) => onValueChange(event.currentTarget.value)}
        type="date"
      />
    </Stack>
  );
}

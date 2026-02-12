import { Stack, Select, NumberInput, Divider } from '@mantine/core';
import { NumberFormat } from '../../../../types/backend-graphql';

interface NumberFormatSettingsProps {
  numberFormat: NumberFormat;
  onNumberFormatChange: (format: NumberFormat) => void;
  numberPrecision: number;
  onNumberPrecisionChange: (precision: number) => void;
}

const NUMBER_FORMAT_OPTIONS = [
  { value: 'number', label: 'Number (1,234,567.89)' },
  { value: 'currency', label: 'Currency ($1,234,567.89)' },
  { value: 'percentage', label: 'Percentage (12.34%)' },
  { value: 'abbreviated', label: 'Abbreviated (1.23M)' },
];

/**
 * NumberFormatSettings Component
 *
 * Handles number formatting configuration for charts
 */
export function NumberFormatSettings({
  numberFormat,
  onNumberFormatChange,
  numberPrecision,
  onNumberPrecisionChange,
}: NumberFormatSettingsProps) {
  return (
    <>
      <Divider label="Number Formatting" labelPosition="center" />
      <Stack gap="md">
        <Select
          label="Number Format"
          data={NUMBER_FORMAT_OPTIONS}
          value={numberFormat}
          onChange={(value) => onNumberFormatChange(value as NumberFormat)}
        />

        <NumberInput
          label="Decimal Places"
          description="Number of decimal places to display"
          value={numberPrecision}
          onChange={(value) => onNumberPrecisionChange(Number(value) || 0)}
          min={0}
          max={10}
          step={1}
        />
      </Stack>
    </>
  );
}

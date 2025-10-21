import { Paper, Text, Stack, Alert } from '@mantine/core';
import { formatNumber, NumberFormatType } from '../../../../utils/numberFormatter';
import { extractSingleValue } from '../../../../utils/chartDataAnalyzer';

interface NumberTileProps {
  // Either provide a direct value OR query result to extract from
  value?: number;
  queryResult?: any;
  label?: string;
  formatType?: NumberFormatType;
  precision?: number;
  primaryColor?: string;
}

/**
 * NumberTile component - displays a single numeric value in a styled tile
 * Can accept either a direct value or a query result to extract the value from
 */
export function NumberTile({
  value: directValue,
  queryResult,
  label,
  formatType = 'number',
  precision = 2,
  primaryColor = '#3b82f6'
}: NumberTileProps) {
  // Extract value from query result if provided, otherwise use direct value
  let value: number | undefined = directValue;

  if (queryResult !== undefined) {
    const extractedValue = extractSingleValue(queryResult);

    if (extractedValue === null) {
      return (
        <Alert color="red" variant="light">
          <Text size="sm">Unable to extract numeric value from query result.</Text>
        </Alert>
      );
    }

    value = extractedValue;
  }

  if (value === undefined) {
    return (
      <Alert color="red" variant="light">
        <Text size="sm">No value provided to NumberTile component.</Text>
      </Alert>
    );
  }

  const formattedValue = formatNumber(value, formatType, precision);

  // Convert hex color to rgba for background
  const hexToRgba = (hex: string, alpha: number = 0.05) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <Paper
      shadow="sm"
      p="xl"
      radius="md"
      withBorder
      style={{
        textAlign: 'center',
        backgroundColor: hexToRgba(primaryColor, 0.05),
      }}
    >
      <Stack gap="xs">
        <Text size="xl" fw={700} style={{ color: primaryColor }}>
          {formattedValue}
        </Text>
        {label && (
          <Text size="sm" c="dimmed">
            {label}
          </Text>
        )}
      </Stack>
    </Paper>
  );
}

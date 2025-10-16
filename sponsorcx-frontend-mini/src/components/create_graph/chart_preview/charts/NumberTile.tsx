import { Paper, Text, Stack } from '@mantine/core';

interface NumberTileProps {
  value: number;
  label?: string;
  formatType?: 'currency' | 'percentage' | 'number' | 'abbreviated';
  precision?: number;
  primaryColor?: string;
}

/**
 * Formats a number based on the specified format type
 */
function formatNumber(value: number, formatType: string, precision: number = 2): string {
  switch (formatType) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      }).format(value);

    case 'percentage':
      return `${value.toFixed(precision)}%`;

    case 'abbreviated':
      // Abbreviate large numbers (e.g., 1.2M, 3.4B)
      const absValue = Math.abs(value);
      if (absValue >= 1_000_000_000) {
        return `${(value / 1_000_000_000).toFixed(precision)}B`;
      } else if (absValue >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(precision)}M`;
      } else if (absValue >= 1_000) {
        return `${(value / 1_000).toFixed(precision)}K`;
      }
      return value.toFixed(precision);

    case 'number':
    default:
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      }).format(value);
  }
}

/**
 * NumberTile component - displays a single numeric value in a styled tile
 */
export function NumberTile({ value, label, formatType = 'number', precision = 2, primaryColor = '#3b82f6' }: NumberTileProps) {
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

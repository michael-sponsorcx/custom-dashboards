import { Stack, TextInput, Text, Switch } from '@mantine/core';

interface AxisSettingsProps {
  xAxisLabel?: string;
  yAxisLabel?: string;
  showGridLines?: boolean;
  onXAxisLabelChange?: (label: string) => void;
  onYAxisLabelChange?: (label: string) => void;
  onShowGridLinesChange?: (value: boolean) => void;
}

/**
 * AxisSettings Component
 *
 * Handles axis labels and grid line settings for charts
 */
export function AxisSettings({
  xAxisLabel = '',
  yAxisLabel = '',
  showGridLines = true,
  onXAxisLabelChange,
  onYAxisLabelChange,
  onShowGridLinesChange,
}: AxisSettingsProps) {
  return (
    <Stack gap="xs">
      <Text size="sm" fw={500}>
        Axis Configuration
      </Text>

      <TextInput
        label="X-Axis Label"
        placeholder="Enter X-axis label"
        value={xAxisLabel}
        onChange={(event) => onXAxisLabelChange?.(event.currentTarget.value)}
      />

      <TextInput
        label="Y-Axis Label"
        placeholder="Enter Y-axis label"
        value={yAxisLabel}
        onChange={(event) => onYAxisLabelChange?.(event.currentTarget.value)}
      />

      <Switch
        label="Show Grid Lines"
        description="Display grid lines on the chart"
        checked={showGridLines}
        onChange={(event) => onShowGridLinesChange?.(event.currentTarget.checked)}
      />
    </Stack>
  );
}

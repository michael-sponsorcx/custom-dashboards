import { Stack, TextInput, Text, Switch } from '@mantine/core';
import { ChartType } from '../../../../utils/chartDataAnalyzer';

interface AxisSettingsProps {
  chartType?: ChartType;
  xAxisLabel?: string;
  yAxisLabel?: string;
  showXAxisGridLines?: boolean;
  showYAxisGridLines?: boolean;
  showRegressionLine?: boolean;
  onXAxisLabelChange?: (label: string) => void;
  onYAxisLabelChange?: (label: string) => void;
  onShowXAxisGridLinesChange?: (value: boolean) => void;
  onShowYAxisGridLinesChange?: (value: boolean) => void;
  onShowRegressionLineChange?: (value: boolean) => void;
}

/**
 * AxisSettings Component
 *
 * Handles axis labels, grid line settings, and regression line for charts
 * Conditionally shows options based on chart type
 */
export function AxisSettings({
  chartType,
  xAxisLabel = '',
  yAxisLabel = '',
  showXAxisGridLines = true,
  showYAxisGridLines = true,
  showRegressionLine = false,
  onXAxisLabelChange,
  onYAxisLabelChange,
  onShowXAxisGridLinesChange,
  onShowYAxisGridLinesChange,
  onShowRegressionLineChange,
}: AxisSettingsProps) {
  // Regression line only makes sense for line charts
  const showRegressionLineOption = chartType === 'line';

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
        label="Show X-Axis Grid Lines"
        description="Display vertical gridlines (perpendicular to X-axis)"
        checked={showXAxisGridLines}
        onChange={(event) => onShowXAxisGridLinesChange?.(event.currentTarget.checked)}
      />

      <Switch
        label="Show Y-Axis Grid Lines"
        description="Display horizontal gridlines (perpendicular to Y-axis)"
        checked={showYAxisGridLines}
        onChange={(event) => onShowYAxisGridLinesChange?.(event.currentTarget.checked)}
      />

      {showRegressionLineOption && (
        <Switch
          label="Show Regression Line"
          description="Display a linear regression trend line on the chart"
          checked={showRegressionLine}
          onChange={(event) => onShowRegressionLineChange?.(event.currentTarget.checked)}
        />
      )}
    </Stack>
  );
}

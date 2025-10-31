import { TextInput } from '@mantine/core';

interface ChartBasicSettingsProps {
  chartTitle: string;
  onChartTitleChange: (title: string) => void;
}

/**
 * ChartBasicSettings Component
 *
 * Handles basic chart configuration like title
 */
export function ChartBasicSettings({ chartTitle, onChartTitleChange }: ChartBasicSettingsProps) {
  return (
    <TextInput
      label="Chart Title"
      placeholder="Enter chart title"
      value={chartTitle}
      onChange={(event) => onChartTitleChange(event.currentTarget.value)}
    />
  );
}

import { Select } from '@mantine/core';
import { ChartType } from '../../../../utils/chartDataAnalyzer';

interface ChartTypeSelectorProps {
  selectedChartType: ChartType | null;
  compatibleCharts: ChartType[];
  onChartTypeChange: (chartType: ChartType) => void;
}

const CHART_TYPE_LABELS: Record<ChartType, string> = {
  number: 'Number Tile',
  line: 'Line Chart',
  bar: 'Bar Chart (Vertical)',
  stackedBar: 'Stacked Bar Chart',
  horizontalBar: 'Bar Chart (Horizontal)',
  horizontalStackedBar: 'Horizontal Stacked Bar',
};

/**
 * ChartTypeSelector Component
 *
 * Handles chart type selection with compatible/incompatible states
 */
export function ChartTypeSelector({
  selectedChartType,
  compatibleCharts,
  onChartTypeChange,
}: ChartTypeSelectorProps) {
  // Show all chart types, but disable incompatible ones
  const allChartTypes: ChartType[] = [
    'number',
    'line',
    'bar',
    'stackedBar',
    'horizontalBar',
    'horizontalStackedBar',
  ];

  const chartTypeOptions = allChartTypes.map((type) => ({
    value: type,
    label: CHART_TYPE_LABELS[type],
    disabled: !compatibleCharts.includes(type),
  }));

  return (
    <Select
      label="Chart Type"
      placeholder="Select chart type"
      data={chartTypeOptions}
      value={selectedChartType}
      onChange={(value) => value && onChartTypeChange(value as ChartType)}
      disabled={compatibleCharts.length === 0}
    />
  );
}

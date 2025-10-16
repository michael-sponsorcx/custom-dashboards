import { useState } from 'react';
import { Paper, Stack, Title, Select, TextInput, NumberInput, ColorInput, Divider } from '@mantine/core';
import { ChartType } from '../../utils/chartDataAnalyzer';
import { OrderByControl, SortOrder } from './OrderByControl';
import { DataFieldSelector } from './DataFieldSelector';

interface ChartSettingsPanelProps {
  selectedChartType: ChartType | null;
  compatibleCharts: ChartType[];
  onChartTypeChange: (chartType: ChartType) => void;

  // Chart configuration
  chartTitle: string;
  onChartTitleChange: (title: string) => void;

  // Number tile specific settings
  numberFormat?: 'currency' | 'percentage' | 'number' | 'abbreviated';
  onNumberFormatChange?: (format: 'currency' | 'percentage' | 'number' | 'abbreviated') => void;
  numberPrecision?: number;
  onNumberPrecisionChange?: (precision: number) => void;

  // Color customization
  primaryColor?: string;
  onPrimaryColorChange?: (color: string) => void;

  // Callback to pass sort order to parent (for rendering charts)
  onSortOrderChange?: (sortOrder: SortOrder) => void;

  // Data field configuration (dimensions and measures from query)
  dimensions?: string[];
  measures?: string[];
  primaryDimension?: string;
  secondaryDimension?: string;
  selectedMeasure?: string;
  onPrimaryDimensionChange?: (dimension: string) => void;
  onSecondaryDimensionChange?: (dimension: string | null) => void;
  onMeasureChange?: (measure: string) => void;
}

const CHART_TYPE_LABELS: Record<ChartType, string> = {
  number: 'Number Tile',
  line: 'Line Chart',
  bar: 'Bar Chart (Vertical)',
  stackedBar: 'Stacked Bar Chart',
  horizontalBar: 'Bar Chart (Horizontal)',
  horizontalStackedBar: 'Horizontal Stacked Bar',
};

const NUMBER_FORMAT_OPTIONS = [
  { value: 'number', label: 'Number (1,234,567.89)' },
  { value: 'currency', label: 'Currency ($1,234,567.89)' },
  { value: 'percentage', label: 'Percentage (12.34%)' },
  { value: 'abbreviated', label: 'Abbreviated (1.23M)' },
];

export function ChartSettingsPanel({
  selectedChartType,
  compatibleCharts,
  onChartTypeChange,
  chartTitle,
  onChartTitleChange,
  numberFormat = 'number',
  onNumberFormatChange,
  numberPrecision = 2,
  onNumberPrecisionChange,
  primaryColor = '#3b82f6',
  onPrimaryColorChange,
  onSortOrderChange,
  dimensions = [],
  measures = [],
  primaryDimension,
  secondaryDimension,
  selectedMeasure,
  onPrimaryDimensionChange,
  onSecondaryDimensionChange,
  onMeasureChange,
}: ChartSettingsPanelProps) {
  // Internal state for sort order (defaults to descending)
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Handler for sort order changes
  const handleSortOrderChange = (newSortOrder: SortOrder) => {
    setSortOrder(newSortOrder);
    // Notify parent component if callback is provided
    console.log('ChartSettingsPanel - sort order changed to:', newSortOrder);
    onSortOrderChange?.(newSortOrder);
  };

  // Show all chart types, but disable incompatible ones
  const allChartTypes: ChartType[] = ['number', 'line', 'bar', 'stackedBar', 'horizontalBar', 'horizontalStackedBar'];

  const chartTypeOptions = allChartTypes.map(type => ({
    value: type,
    label: CHART_TYPE_LABELS[type],
    disabled: !compatibleCharts.includes(type),
  }));

  const showNumberSettings = selectedChartType === 'number';
  // Show order by control for charts that support dimensions
  // Bar, line, area, and pie charts all have dimension fields
  const chartsWithDimensions: ChartType[] = ['bar', 'stackedBar', 'horizontalBar', 'horizontalStackedBar', 'line'];
  const showOrderByControl = selectedChartType ? chartsWithDimensions.includes(selectedChartType) : false;

  // Only show secondary dimension for stacked chart types
  const stackedChartTypes: ChartType[] = ['stackedBar', 'horizontalStackedBar'];
  const supportsSecondaryDimension = selectedChartType ? stackedChartTypes.includes(selectedChartType) : false;

  return (
    <Paper shadow="sm" p="md" radius="md" withBorder style={{ height: '100%' }}>
      <Stack gap="md">
        <Title order={4}>Chart Settings</Title>

        {/* Chart Type Selection */}
        <Select
          label="Chart Type"
          placeholder="Select chart type"
          data={chartTypeOptions}
          value={selectedChartType}
          onChange={(value) => value && onChartTypeChange(value as ChartType)}
          disabled={compatibleCharts.length === 0}
        />

        {/* Chart Title */}
        <TextInput
          label="Chart Title"
          placeholder="Enter chart title"
          value={chartTitle}
          onChange={(event) => onChartTitleChange(event.currentTarget.value)}
        />

        {/* Data Field Configuration */}
        {(dimensions.length > 0 || measures.length > 0) && (
          <>
            <Divider />
            <DataFieldSelector
              dimensions={dimensions}
              measures={measures}
              primaryDimension={primaryDimension}
              secondaryDimension={secondaryDimension}
              selectedMeasure={selectedMeasure}
              supportsSecondaryDimension={supportsSecondaryDimension}
              onPrimaryDimensionChange={onPrimaryDimensionChange}
              onSecondaryDimensionChange={onSecondaryDimensionChange}
              onMeasureChange={onMeasureChange}
            />
          </>
        )}

        {/* Number Tile Specific Settings */}
        {showNumberSettings && (
          <>
            <Select
              label="Number Format"
              data={NUMBER_FORMAT_OPTIONS}
              value={numberFormat}
              onChange={(value) => onNumberFormatChange?.(value as any)}
            />

            <NumberInput
              label="Decimal Places"
              description="Number of decimal places to display"
              value={numberPrecision}
              onChange={(value) => onNumberPrecisionChange?.(Number(value) || 0)}
              min={0}
              max={10}
              step={1}
            />
          </>
        )}

        {/* Color Customization */}
        <ColorInput
          label="Primary Color"
          description="Customize chart color"
          value={primaryColor}
          onChange={(color) => onPrimaryColorChange?.(color)}
          format="hex"
        />

        {/* Order By Control - for charts with dimensions */}
        {showOrderByControl && (
          <OrderByControl
            sortOrder={sortOrder}
            onSortOrderChange={handleSortOrderChange}
            label="Sort"
          />
        )}

        {/* Placeholder for future chart-specific settings */}
        {selectedChartType && selectedChartType !== 'number' && (
          <Paper p="sm" withBorder style={{ backgroundColor: '#f8f9fa' }}>
            <Stack gap="xs">
              <Title order={6}>Additional Settings</Title>
              <TextInput
                label="X-Axis Label"
                placeholder="Coming soon..."
                disabled
              />
              <TextInput
                label="Y-Axis Label"
                placeholder="Coming soon..."
                disabled
              />
            </Stack>
          </Paper>
        )}
      </Stack>
    </Paper>
  );
}

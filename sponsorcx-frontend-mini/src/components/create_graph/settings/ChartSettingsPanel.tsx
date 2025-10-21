import { Paper, Stack, Title, Divider, Select } from '@mantine/core';
import { ChartType } from '../../../utils/chartDataAnalyzer';
import type { LegendPosition } from '../types';
import { OrderByControl, SortOrder } from './OrderByControl';
import { DataFieldSelector } from './DataFieldSelector';
import {
  ChartTypeSelector,
  ChartBasicSettings,
  NumberFormatSettings,
  ColorSettings,
  AxisSettings,
} from './components';

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
  sortOrder?: SortOrder;
  onSortOrderChange?: (sortOrder: SortOrder) => void;

  // Legend position
  legendPosition?: LegendPosition;
  onLegendPositionChange?: (pos: LegendPosition) => void;

  // Axis labels
  xAxisLabel?: string;
  yAxisLabel?: string;
  onXAxisLabelChange?: (label: string) => void;
  onYAxisLabelChange?: (label: string) => void;

  // Grid line settings
  showGridLines?: boolean;
  onShowGridLinesChange?: (show: boolean) => void;

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

// Chart types that support dimensions (for showing order by control)
const CHARTS_WITH_DIMENSIONS: ChartType[] = [
  'bar',
  'stackedBar',
  'horizontalBar',
  'horizontalStackedBar',
  'line',
];

// Chart types that support stacking (for secondary dimension)
const STACKED_CHART_TYPES: ChartType[] = ['stackedBar', 'horizontalStackedBar'];

/**
 * ChartSettingsPanel - Refactored
 *
 * A composable settings panel using smaller, focused components
 * Follows the same pattern as dashboard/grid structure
 */
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
  sortOrder = 'desc',
  onSortOrderChange,
  legendPosition = 'bottom',
  onLegendPositionChange,
  xAxisLabel = '',
  yAxisLabel = '',
  onXAxisLabelChange,
  onYAxisLabelChange,
  showGridLines = true,
  onShowGridLinesChange,
  dimensions = [],
  measures = [],
  primaryDimension,
  secondaryDimension,
  selectedMeasure,
  onPrimaryDimensionChange,
  onSecondaryDimensionChange,
  onMeasureChange,
}: ChartSettingsPanelProps) {
  // Show order by control for charts that support dimensions
  const showOrderByControl = selectedChartType
    ? CHARTS_WITH_DIMENSIONS.includes(selectedChartType)
    : false;

  // Only show secondary dimension for stacked chart types
  const supportsSecondaryDimension = selectedChartType
    ? STACKED_CHART_TYPES.includes(selectedChartType)
    : false;

  return (
    <Paper shadow="sm" p="md" radius="md" withBorder style={{ height: '100%' }}>
      <Stack gap="md">
        <Title order={4}>Chart Settings</Title>

        {/* Chart Type Selection */}
        <ChartTypeSelector
          selectedChartType={selectedChartType}
          compatibleCharts={compatibleCharts}
          onChartTypeChange={onChartTypeChange}
        />

        {/* Chart Title */}
        <ChartBasicSettings
          chartTitle={chartTitle}
          onChartTitleChange={onChartTitleChange}
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

        {/* Number Format Settings - Available for all chart types */}
        {selectedChartType && onNumberFormatChange && onNumberPrecisionChange && (
          <NumberFormatSettings
            numberFormat={numberFormat}
            onNumberFormatChange={onNumberFormatChange}
            numberPrecision={numberPrecision}
            onNumberPrecisionChange={onNumberPrecisionChange}
          />
        )}

        {/* Color Customization */}
        {onPrimaryColorChange && (
          <ColorSettings
            primaryColor={primaryColor}
            onPrimaryColorChange={onPrimaryColorChange}
          />
        )}

        {/* Order By Control - for charts with dimensions */}
        {showOrderByControl && onSortOrderChange && (
          <OrderByControl
            sortOrder={sortOrder}
            onSortOrderChange={onSortOrderChange}
            label="Sort"
          />
        )}

        {/* Legend Position */}
        {selectedChartType && selectedChartType !== 'number' && onLegendPositionChange && (
          <Select
            label="Legend Position"
            data={[
              { value: 'top', label: 'Top' },
              { value: 'bottom', label: 'Bottom' },
              { value: 'left', label: 'Left' },
              { value: 'right', label: 'Right' },
            ]}
            value={legendPosition}
            onChange={(v) => v && onLegendPositionChange(v as LegendPosition)}
          />
        )}

        {/* Axis Settings - for charts with axes */}
        {selectedChartType && selectedChartType !== 'number' && (
          <>
            <Divider />
            <AxisSettings
              xAxisLabel={xAxisLabel}
              yAxisLabel={yAxisLabel}
              showGridLines={showGridLines}
              onXAxisLabelChange={onXAxisLabelChange}
              onYAxisLabelChange={onYAxisLabelChange}
              onShowGridLinesChange={onShowGridLinesChange}
            />
          </>
        )}
      </Stack>
    </Paper>
  );
}

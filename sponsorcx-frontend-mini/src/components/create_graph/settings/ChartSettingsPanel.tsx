import { Paper, Stack, Title, Divider, Select, TextInput, NumberInput, Switch, Group } from '@mantine/core';
import { ChartType } from '../../../utils/chartDataAnalyzer';
import type { LegendPosition } from '../../../types/graph';
import { ColorPalette } from '../../../constants/colorPalettes';
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
  colorPalette?: ColorPalette;
  onColorPaletteChange?: (palette: ColorPalette) => void;
  primaryColor?: string;
  onPrimaryColorChange?: (color: string) => void;

  // Callback to pass sort order to parent (for rendering charts)
  sortOrder?: SortOrder;
  onSortOrderChange?: (sortOrder: SortOrder) => void;

  // Legend position
  legendPosition?: LegendPosition;
  onLegendPositionChange?: (pos: LegendPosition) => void;

  // KPI settings (used for number/KPI charts)
  kpiValue?: number;
  onKpiValueChange?: (v: number | undefined) => void;
  kpiLabel?: string;
  onKpiLabelChange?: (v: string) => void;
  kpiSecondaryValue?: number;
  onKpiSecondaryValueChange?: (v: number | undefined) => void;
  kpiSecondaryLabel?: string;
  onKpiSecondaryLabelChange?: (v: string) => void;
  kpiShowTrend?: boolean;
  onKpiShowTrendChange?: (v: boolean) => void;
  kpiTrendPercentage?: number;
  onKpiTrendPercentageChange?: (v: number | undefined) => void;

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

// Chart types that only display a single color (allow custom color option)
// These charts show only one data series/color at a time
const SINGLE_COLOR_CHART_TYPES: ChartType[] = [
  'kpi',           // KPI - single value display
  'bar',           // Shows one measure at a time
  'horizontalBar', // Shows one measure at a time
  // Note: 'line', 'stackedBar', 'horizontalStackedBar' can show multiple series with different colors
];

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
  colorPalette = 'hubspot-orange',
  onColorPaletteChange,
  primaryColor = '#FF7A59',
  onPrimaryColorChange,
  sortOrder = 'desc',
  onSortOrderChange,
  legendPosition = 'bottom',
  onLegendPositionChange,
  kpiValue,
  onKpiValueChange,
  kpiLabel,
  onKpiLabelChange,
  kpiSecondaryValue,
  onKpiSecondaryValueChange,
  kpiSecondaryLabel,
  onKpiSecondaryLabelChange,
  kpiShowTrend = false,
  onKpiShowTrendChange,
  kpiTrendPercentage,
  onKpiTrendPercentageChange,
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

  // Determine if the selected chart type only uses a single color
  const isSingleColorChart = selectedChartType
    ? SINGLE_COLOR_CHART_TYPES.includes(selectedChartType)
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

        {/* Color Customization - Show for all chart types */}
        {onPrimaryColorChange && onColorPaletteChange && selectedChartType && (
          <ColorSettings
            colorPalette={colorPalette}
            primaryColor={primaryColor}
            onColorPaletteChange={onColorPaletteChange}
            onPrimaryColorChange={onPrimaryColorChange}
            isSingleColorChart={isSingleColorChart}
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
        {selectedChartType && selectedChartType !== 'kpi' && onLegendPositionChange && (
          <Select
            label="Legend Position"
            data={[
              { value: 'top' satisfies LegendPosition, label: 'Top' },
              { value: 'bottom' satisfies LegendPosition, label: 'Bottom' },
            ]}
            value={legendPosition}
            onChange={(v) => v && onLegendPositionChange(v as LegendPosition)}
          />
        )}

        {/* KPI Settings - for KPI charts */}
        {selectedChartType === 'kpi' && (
          <>
            <Divider />
            <Title order={6}>KPI Settings</Title>
            <Stack gap="sm">
              <NumberInput
                label="Primary Value (optional override)"
                value={kpiValue ?? ''}
                placeholder="Leave empty to use query result"
                onChange={(v) => onKpiValueChange?.(typeof v === 'number' ? v : undefined)}
                min={Number.NEGATIVE_INFINITY}
              />
              <TextInput
                label="Primary Label"
                value={kpiLabel ?? ''}
                onChange={(e) => onKpiLabelChange?.(e.currentTarget.value)}
              />
              <Group grow>
                <NumberInput
                  label="Secondary Value"
                  value={kpiSecondaryValue ?? ''}
                  onChange={(v) => onKpiSecondaryValueChange?.(typeof v === 'number' ? v : undefined)}
                  min={Number.NEGATIVE_INFINITY}
                />
                <TextInput
                  label="Secondary Label"
                  value={kpiSecondaryLabel ?? ''}
                  onChange={(e) => onKpiSecondaryLabelChange?.(e.currentTarget.value)}
                />
              </Group>
              <Group align="end" grow>
                <Switch
                  label="Show Trend"
                  checked={!!kpiShowTrend}
                  onChange={(e) => onKpiShowTrendChange?.(e.currentTarget.checked)}
                />
                <NumberInput
                  label="Trend Percentage"
                  value={kpiTrendPercentage ?? ''}
                  onChange={(v) => onKpiTrendPercentageChange?.(typeof v === 'number' ? v : undefined)}
                  min={-1000000}
                  max={1000000}
                  disabled={!kpiShowTrend}
                />
              </Group>
            </Stack>
          </>
        )}

        {/* Axis Settings - for charts with axes */}
        {selectedChartType && selectedChartType !== 'kpi' && (
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

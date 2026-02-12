import {
  Paper,
  Stack,
  Title,
  Divider,
  Select,
  TextInput,
  NumberInput,
  Switch,
  Group,
  Text as MantineText,
} from '@mantine/core';
import { ChartType } from '../../../types/backend-graphql';
import { LegendPosition, NumberFormat } from '../../../types/backend-graphql';
import { ColorPalette } from '../../../types/backend-graphql';
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
  numberFormat?: NumberFormat;
  onNumberFormatChange?: (format: NumberFormat) => void;
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
  showXAxisGridLines?: boolean;
  showYAxisGridLines?: boolean;
  onShowXAxisGridLinesChange?: (show: boolean) => void;
  onShowYAxisGridLinesChange?: (show: boolean) => void;

  // Regression line
  showRegressionLine?: boolean;
  onShowRegressionLineChange?: (show: boolean) => void;

  // Max data points/series limit
  maxDataPoints?: number;
  onMaxDataPointsChange?: (max: number | undefined) => void;

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
  ChartType.Bar,
  ChartType.StackedBar,
  ChartType.HorizontalBar,
  ChartType.HorizontalStackedBar,
  ChartType.Line,
];

// Chart types that support stacking (for secondary dimension)
const STACKED_CHART_TYPES: ChartType[] = [ChartType.StackedBar, ChartType.HorizontalStackedBar];

// Chart types that only display a single color (allow custom color option)
// These charts show only one data series/color at a time
const SINGLE_COLOR_CHART_TYPES: ChartType[] = [
  ChartType.Kpi, // KPI - single value display
  ChartType.Bar, // Shows one measure at a time
  ChartType.HorizontalBar, // Shows one measure at a time
  // Note: 'line', 'stackedBar', 'horizontalStackedBar', 'pie' can show multiple series with different colors
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
  numberFormat = NumberFormat.Number,
  onNumberFormatChange,
  numberPrecision = 2,
  onNumberPrecisionChange,
  colorPalette = ColorPalette.HubspotOrange,
  onColorPaletteChange,
  primaryColor = '#FF7A59',
  onPrimaryColorChange,
  sortOrder = SortOrder.Desc,
  onSortOrderChange,
  legendPosition = LegendPosition.Bottom,
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
  showXAxisGridLines = true,
  showYAxisGridLines = true,
  onShowXAxisGridLinesChange,
  onShowYAxisGridLinesChange,
  showRegressionLine = false,
  onShowRegressionLineChange,
  maxDataPoints,
  onMaxDataPointsChange,
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
        <ChartBasicSettings chartTitle={chartTitle} onChartTitleChange={onChartTitleChange} />

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

        {/* Max Data Points / Series Limit */}
        {selectedChartType && selectedChartType !== ChartType.Kpi && onMaxDataPointsChange && (
          <>
            <Divider />
            <Stack gap="xs">
              <MantineText size="sm" fw={500}>
                Data Limits
              </MantineText>
              <NumberInput
                label="Max Series/Data Points"
                description="Maximum number of series to display (leave empty for default: 50)"
                placeholder="50"
                value={maxDataPoints ?? ''}
                onChange={(v) => {
                  if (onMaxDataPointsChange) {
                    onMaxDataPointsChange(typeof v === 'number' ? v : undefined);
                  }
                }}
                min={1}
                max={50}
                step={5}
                allowDecimal={false}
              />
            </Stack>
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
        {selectedChartType &&
          selectedChartType !== ChartType.Kpi &&
          selectedChartType !== ChartType.Pie &&
          onLegendPositionChange && (
            <Select
              label="Legend Position"
              data={[
                { value: LegendPosition.Top, label: 'Top' },
                { value: LegendPosition.Bottom, label: 'Bottom' },
                { value: LegendPosition.None, label: 'None' },
              ]}
              value={legendPosition}
              onChange={(v) => v && onLegendPositionChange(v as LegendPosition)}
            />
          )}

        {/* KPI Settings - for KPI charts */}
        {selectedChartType === ChartType.Kpi && (
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
                  onChange={(v) =>
                    onKpiSecondaryValueChange?.(typeof v === 'number' ? v : undefined)
                  }
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
                  onChange={(v) =>
                    onKpiTrendPercentageChange?.(typeof v === 'number' ? v : undefined)
                  }
                  min={-1000000}
                  max={1000000}
                  disabled={!kpiShowTrend}
                />
              </Group>
            </Stack>
          </>
        )}

        {/* Axis Settings - for charts with axes */}
        {selectedChartType &&
          selectedChartType !== ChartType.Kpi &&
          selectedChartType !== ChartType.Pie &&
          (() => {
            return (
              <>
                <Divider />
                <AxisSettings
                  chartType={selectedChartType}
                  xAxisLabel={xAxisLabel}
                  yAxisLabel={yAxisLabel}
                  showXAxisGridLines={showXAxisGridLines}
                  showYAxisGridLines={showYAxisGridLines}
                  showRegressionLine={showRegressionLine}
                  onXAxisLabelChange={onXAxisLabelChange}
                  onYAxisLabelChange={onYAxisLabelChange}
                  onShowXAxisGridLinesChange={onShowXAxisGridLinesChange}
                  onShowYAxisGridLinesChange={onShowYAxisGridLinesChange}
                  onShowRegressionLineChange={onShowRegressionLineChange}
                />
              </>
            );
          })()}
      </Stack>
    </Paper>
  );
}

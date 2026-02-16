import { Text } from '@mantine/core';
import { ChartType, NumberFormat, LegendPosition, ColorPalette } from '../../types/backend-graphql';
import { KPI } from './charts/KPI';
import { MantineLineChart } from './charts/MantineLineChart';
import { MantineBarChart } from './charts/MantineBarChart';
import { MantinePieChart } from './charts/MantinePieChart';
import { ReportTable } from './tables/ReportTable';
import { SortOrder } from '../create_graph/settings/OrderByControl';

interface ChartRendererProps {
  queryResult: any;
  selectedChartType: ChartType;
  numberFormat: NumberFormat;
  numberPrecision: number;
  primaryColor: string;
  colorPalette?: ColorPalette;
  sortOrder?: SortOrder;
  // User-selected dimensions and measure
  primaryDimension?: string;
  secondaryDimension?: string;
  selectedMeasure?: string;
  // Available dimensions for drill-down
  availableDimensions?: string[];
  // Callback when user selects a dimension to drill down
  onDrillDown?: (dimension: string, dataPoint: any) => void;
  // Axis labels
  xAxisLabel?: string;
  yAxisLabel?: string;
  showXAxisGridLines?: boolean;
  showYAxisGridLines?: boolean;
  showRegressionLine?: boolean;
  maxDataPoints?: number;
  // Legend position
  legendPosition?: LegendPosition;
  // KPI-specific optional props
  kpiValue?: number;
  kpiLabel?: string;
  kpiSecondaryValue?: number;
  kpiSecondaryLabel?: string;
  kpiShowTrend?: boolean;
  kpiTrendPercentage?: number;
}

/**
 * ChartRenderer - Renders the appropriate chart based on selected type
 *
 * This component acts as a router to specific chart implementations.
 * It does NOT impose any sizing constraints - that's the responsibility of the parent container.
 * All charts should inherit their size from their parent.
 */
export function ChartRenderer({
  queryResult,
  selectedChartType,
  numberFormat,
  numberPrecision,
  primaryColor,
  colorPalette = ColorPalette.Sponsorcx,
  sortOrder = SortOrder.Desc,
  primaryDimension,
  secondaryDimension,
  selectedMeasure,
  availableDimensions,
  onDrillDown,
  xAxisLabel,
  yAxisLabel,
  showXAxisGridLines = true,
  showYAxisGridLines = true,
  showRegressionLine = false,
  maxDataPoints,
  legendPosition = LegendPosition.Bottom,
  kpiValue,
  kpiLabel,
  kpiSecondaryValue,
  kpiSecondaryLabel,
  kpiShowTrend,
  kpiTrendPercentage,
}: ChartRendererProps) {
  switch (selectedChartType) {
    case ChartType.Kpi:
      return (
        <KPI
          userDefinedValue={kpiValue}
          queryResult={queryResult}
          label={kpiLabel}
          formatType={numberFormat}
          precision={numberPrecision}
          primaryColor={primaryColor}
          secondaryValue={kpiSecondaryValue}
          secondaryLabel={kpiSecondaryLabel}
          showTrend={!!kpiShowTrend}
          trendPercentage={kpiTrendPercentage}
        />
      );

    case ChartType.Line:
      return (
        <MantineLineChart
          queryResult={queryResult}
          primaryColor={primaryColor}
          colorPalette={colorPalette}
          sortOrder={sortOrder}
          primaryDimension={primaryDimension}
          selectedMeasure={selectedMeasure}
          numberFormat={numberFormat}
          numberPrecision={numberPrecision}
          xAxisLabel={xAxisLabel}
          yAxisLabel={yAxisLabel}
          showXAxisGridLines={showXAxisGridLines}
          showYAxisGridLines={showYAxisGridLines}
          showRegressionLine={showRegressionLine}
          maxDataPoints={maxDataPoints}
          legendPosition={legendPosition}
        />
      );

    case ChartType.Bar:
      return (
        <MantineBarChart
          queryResult={queryResult}
          primaryColor={primaryColor}
          colorPalette={colorPalette}
          orientation="vertical"
          type="default"
          sortOrder={sortOrder}
          primaryDimension={primaryDimension}
          secondaryDimension={secondaryDimension}
          selectedMeasure={selectedMeasure}
          availableDimensions={availableDimensions}
          onDrillDown={onDrillDown}
          numberFormat={numberFormat}
          numberPrecision={numberPrecision}
          xAxisLabel={xAxisLabel}
          yAxisLabel={yAxisLabel}
          showXAxisGridLines={showXAxisGridLines}
          showYAxisGridLines={showYAxisGridLines}
          maxDataPoints={maxDataPoints}
          legendPosition={legendPosition}
        />
      );

    case ChartType.StackedBar:
      return (
        <MantineBarChart
          queryResult={queryResult}
          primaryColor={primaryColor}
          colorPalette={colorPalette}
          orientation="vertical"
          type="stacked"
          sortOrder={sortOrder}
          primaryDimension={primaryDimension}
          secondaryDimension={secondaryDimension}
          selectedMeasure={selectedMeasure}
          availableDimensions={availableDimensions}
          onDrillDown={onDrillDown}
          numberFormat={numberFormat}
          numberPrecision={numberPrecision}
          xAxisLabel={xAxisLabel}
          yAxisLabel={yAxisLabel}
          showXAxisGridLines={showXAxisGridLines}
          showYAxisGridLines={showYAxisGridLines}
          maxDataPoints={maxDataPoints}
          legendPosition={legendPosition}
        />
      );

    case ChartType.HorizontalBar:
      return (
        <MantineBarChart
          queryResult={queryResult}
          primaryColor={primaryColor}
          colorPalette={colorPalette}
          orientation="horizontal"
          type="default"
          sortOrder={sortOrder}
          primaryDimension={primaryDimension}
          secondaryDimension={secondaryDimension}
          selectedMeasure={selectedMeasure}
          availableDimensions={availableDimensions}
          onDrillDown={onDrillDown}
          numberFormat={numberFormat}
          numberPrecision={numberPrecision}
          xAxisLabel={xAxisLabel}
          yAxisLabel={yAxisLabel}
          showXAxisGridLines={showXAxisGridLines}
          showYAxisGridLines={showYAxisGridLines}
          maxDataPoints={maxDataPoints}
          legendPosition={legendPosition}
        />
      );

    case ChartType.HorizontalStackedBar:
      return (
        <MantineBarChart
          queryResult={queryResult}
          primaryColor={primaryColor}
          colorPalette={colorPalette}
          orientation="horizontal"
          type="stacked"
          sortOrder={sortOrder}
          primaryDimension={primaryDimension}
          secondaryDimension={secondaryDimension}
          selectedMeasure={selectedMeasure}
          availableDimensions={availableDimensions}
          onDrillDown={onDrillDown}
          numberFormat={numberFormat}
          numberPrecision={numberPrecision}
          xAxisLabel={xAxisLabel}
          yAxisLabel={yAxisLabel}
          showXAxisGridLines={showXAxisGridLines}
          showYAxisGridLines={showYAxisGridLines}
          maxDataPoints={maxDataPoints}
          legendPosition={legendPosition}
        />
      );

    case ChartType.Pie:
      return (
        <MantinePieChart
          queryResult={queryResult}
          primaryColor={primaryColor}
          colorPalette={colorPalette}
          primaryDimension={primaryDimension}
          selectedMeasure={selectedMeasure}
          numberFormat={numberFormat}
          numberPrecision={numberPrecision}
          legendPosition={legendPosition}
          maxDataPoints={maxDataPoints}
        />
      );

    case ChartType.Table:
      return (
        <ReportTable
          queryResult={queryResult}
          numberFormat={numberFormat}
          numberPrecision={numberPrecision}
          height={600}
          minWidth={500}
        />
      );

    default:
      return <PlaceholderChart chartType={selectedChartType} />;
  }
}

/**
 * Placeholder component for charts not yet implemented
 */
function PlaceholderChart({ chartType }: { chartType: string }) {
  return (
    <Text size="lg" c="dimmed">
      {chartType} - Coming soon...
    </Text>
  );
}

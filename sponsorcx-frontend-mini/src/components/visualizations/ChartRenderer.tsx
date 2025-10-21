import { Text } from '@mantine/core';
import { ChartType } from '../../utils/chartDataAnalyzer';
import { KPI } from './charts/KPI';
import { MantineLineChart } from './charts/MantineLineChart';
import { MantineBarChart } from './charts/MantineBarChart';
import { SortOrder } from '../create_graph/settings/OrderByControl';
import type { LegendPosition } from '../../types/graph';
import type { ColorPalette } from '../../constants/colorPalettes';

interface ChartRendererProps {
  queryResult: any;
  selectedChartType: ChartType;
  numberFormat: 'currency' | 'percentage' | 'number' | 'abbreviated';
  numberPrecision: number;
  primaryColor: string;
  colorPalette?: ColorPalette;
  sortOrder?: SortOrder;
  // User-selected dimensions and measure
  primaryDimension?: string;
  secondaryDimension?: string;
  selectedMeasure?: string;
  // Axis labels
  xAxisLabel?: string;
  yAxisLabel?: string;
  showGridLines?: boolean;
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
  colorPalette = 'hubspot-orange',
  sortOrder = 'desc',
  primaryDimension,
  secondaryDimension,
  selectedMeasure,
  xAxisLabel,
  yAxisLabel,
  showGridLines = true,
  legendPosition = 'bottom',
  kpiValue,
  kpiLabel,
  kpiSecondaryValue,
  kpiSecondaryLabel,
  kpiShowTrend,
  kpiTrendPercentage,
}: ChartRendererProps) {
  switch (selectedChartType) {
    case 'kpi':
      return (
        <KPI
          value={kpiValue}
          queryResult={kpiValue === undefined ? queryResult : undefined}
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

    case 'line':
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
          showGridLines={showGridLines}
          legendPosition={legendPosition}
        />
      );

    case 'bar':
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
          numberFormat={numberFormat}
          numberPrecision={numberPrecision}
          xAxisLabel={xAxisLabel}
          yAxisLabel={yAxisLabel}
          showGridLines={showGridLines}
          legendPosition={legendPosition}
        />
      );

    case 'stackedBar':
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
          numberFormat={numberFormat}
          numberPrecision={numberPrecision}
          xAxisLabel={xAxisLabel}
          yAxisLabel={yAxisLabel}
          showGridLines={showGridLines}
          legendPosition={legendPosition}
        />
      );

    case 'horizontalBar':
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
          numberFormat={numberFormat}
          numberPrecision={numberPrecision}
          xAxisLabel={xAxisLabel}
          yAxisLabel={yAxisLabel}
          showGridLines={showGridLines}
          legendPosition={legendPosition}
        />
      );

    case 'horizontalStackedBar':
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
          numberFormat={numberFormat}
          numberPrecision={numberPrecision}
          xAxisLabel={xAxisLabel}
          yAxisLabel={yAxisLabel}
          showGridLines={showGridLines}
          legendPosition={legendPosition}
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

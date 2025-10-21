import { Text } from '@mantine/core';
import { ChartType } from '../../utils/chartDataAnalyzer';
import { NumberTile } from './charts/NumberTile';
import { MantineLineChart } from './charts/MantineLineChart';
import { MantineBarChart } from './charts/MantineBarChart';
import { SortOrder } from '../create_graph/settings/OrderByControl';
import type { LegendPosition } from '../create_graph/types';

interface ChartRendererProps {
  queryResult: any;
  selectedChartType: ChartType;
  numberFormat: 'currency' | 'percentage' | 'number' | 'abbreviated';
  numberPrecision: number;
  primaryColor: string;
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
  sortOrder = 'desc',
  primaryDimension,
  secondaryDimension,
  selectedMeasure,
  xAxisLabel,
  yAxisLabel,
  showGridLines = true,
  legendPosition = 'bottom',
}: ChartRendererProps) {
  switch (selectedChartType) {
    case 'number':
      return (
        <NumberTile
          queryResult={queryResult}
          formatType={numberFormat}
          precision={numberPrecision}
          primaryColor={primaryColor}
        />
      );

    case 'line':
      return (
        <MantineLineChart
          queryResult={queryResult}
          primaryColor={primaryColor}
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

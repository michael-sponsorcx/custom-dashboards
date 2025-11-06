import { useMemo, memo } from 'react';
import { LineChart } from '@mantine/charts';
import { transformChartData } from '../../../utils/chartDataTransformations';
import { SeriesLimitWrapper } from './SeriesLimitWrapper';
import { useSortedChartData, SortOrder } from '../../create_graph/settings/OrderByControl';
import { NumberFormatType } from '../../../utils/numberFormatter';
import { getLegendProps, shouldShowLegend } from './utils/legendHelpers';
import type { LegendPosition } from '../../../types/graph';
import type { ColorPalette } from '../../../constants/colorPalettes';
import { createChartColorFunction } from './utils/colorPaletteHelpers';
import { getGridAxisValue, getGridProps } from './utils/gridAxisHelpers';
import { createChartFormatters } from './utils/chartFormatterHelpers';
import {
  processRegressionData,
  mergeRegressionSeries,
} from './utils/regressionHelpers';

interface MantineLineChartProps {
  queryResult: any;
  primaryColor?: string;
  colorPalette?: ColorPalette;
  sortOrder?: SortOrder;
  // User-selected dimensions and measure
  primaryDimension?: string;
  selectedMeasure?: string;
  // Number formatting
  numberFormat?: NumberFormatType;
  numberPrecision?: number;
  // Axis labels
  xAxisLabel?: string;
  yAxisLabel?: string;
  showXAxisGridLines?: boolean;
  showYAxisGridLines?: boolean;
  showRegressionLine?: boolean;
  maxDataPoints?: number;
  legendPosition?: LegendPosition;
}

/**
 * MantineLineChart component - renders a line chart using Mantine charts
 * Wrapped with React.memo to prevent unnecessary re-renders
 */
export const MantineLineChart = memo(function MantineLineChart({
  queryResult,
  primaryColor = '#3b82f6',
  colorPalette = 'hubspot-orange',
  sortOrder = 'desc',
  primaryDimension,
  selectedMeasure,
  numberFormat = 'number',
  numberPrecision = 2,
  xAxisLabel,
  yAxisLabel,
  showXAxisGridLines = true,
  showYAxisGridLines = true,
  showRegressionLine = false,
  maxDataPoints,
  legendPosition = 'bottom',
}: MantineLineChartProps) {
  // Create color function based on palette (or use default chart colors for 'custom')
  const getColorFn = useMemo(() => {
    return createChartColorFunction(colorPalette);
  }, [colorPalette]);

  // Use the transformation utility to handle all data transformation
  // Pass raw Cube data directly - transformation happens inside the utility
  // Memoize to prevent unnecessary re-transformations
  const transformationResult = useMemo(
    () =>
      transformChartData({
        chartType: 'line',
        cubeData: queryResult,
        primaryColor,
        getColorFn,
        primaryDimension,
        selectedMeasure,
        maxDataPoints,
      }),
    [queryResult, primaryColor, getColorFn, primaryDimension, selectedMeasure, maxDataPoints]
  );

  const { data: transformedData, dimensionField, series } = transformationResult;

  // Handle case where transformation failed
  if (!transformedData || transformedData.length === 0 || !dimensionField || !series) {
    return <div>No data available for chart</div>;
  }

  // Apply sorting using useMemo hook inside useSortedChartData
  const sortedData = useSortedChartData(transformedData, dimensionField, sortOrder);

  // Add regression line if enabled
  const chartData = useMemo(() => {
    if (!series || series.length === 0) {
      return sortedData;
    }

    // For line charts, we'll add a regression line for the first series
    const firstSeriesKey = series[0].name;
    return processRegressionData(sortedData, dimensionField, firstSeriesKey, showRegressionLine);
  }, [showRegressionLine, sortedData, dimensionField, series]);

  // Create updated series list with regression line if enabled
  const finalSeries = useMemo(() => {
    return mergeRegressionSeries(series, showRegressionLine);
  }, [showRegressionLine, series]);

  // Create formatters for chart values and axis ticks
  const { valueFormatter, axisTickFormatter } = createChartFormatters(numberFormat, numberPrecision);

  const showLegend = shouldShowLegend(legendPosition);
  const legendPropsValue = getLegendProps(legendPosition);

  // Determine which gridlines to show based on user settings
  const gridAxisValue = getGridAxisValue(showXAxisGridLines, showYAxisGridLines);
  const gridProps = getGridProps(gridAxisValue);

  return (
    <SeriesLimitWrapper seriesCount={series.length} maxSeries={maxDataPoints}>
      <LineChart
        h="100%"
        data={chartData}
        dataKey={dimensionField}
        series={finalSeries}
        curveType="linear"
        connectNulls
        withLegend={showLegend}
        withDots
        {...(showLegend && legendPropsValue ? { legendProps: legendPropsValue } : {})}
        gridAxis={gridAxisValue}
        {...(gridProps ? { gridProps } : {})}
        tickLine="xy"
        valueFormatter={valueFormatter}
        xAxisLabel={xAxisLabel}
        yAxisLabel={yAxisLabel}
        yAxisProps={{ width: 80, tickFormatter: axisTickFormatter }}
        tooltipProps={{
          cursor: false,
          shared: false,
        }}
      />
    </SeriesLimitWrapper>
  );
});

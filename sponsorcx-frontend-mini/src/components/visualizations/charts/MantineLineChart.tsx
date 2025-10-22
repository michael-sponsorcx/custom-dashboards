import { useMemo, memo } from 'react';
import { LineChart } from '@mantine/charts';
import { transformChartData } from '../../../utils/chartDataTransformations';
import { SeriesLimitWrapper } from './SeriesLimitWrapper';
import { getChartColor } from '../../../constants/chartColors';
import { useSortedChartData, SortOrder } from '../../create_graph/settings/OrderByControl';
import { createChartValueFormatter, createAxisTickFormatter, NumberFormatType } from '../../../utils/numberFormatter';
import { getLegendProps, shouldShowLegend } from './utils/legendHelpers';
import type { LegendPosition } from '../../../types/graph';
import type { ColorPalette } from '../../../constants/colorPalettes';
import { createPaletteColorFunction } from '../../../constants/colorPalettes';
import { addRegressionLineToData } from '../../../utils/regressionCalculator';

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
    return colorPalette === 'custom' ? getChartColor : createPaletteColorFunction(colorPalette);
  }, [colorPalette]);

  // Use the transformation utility to handle all data transformation
  // Pass raw Cube data directly - transformation happens inside the utility
  // Memoize to prevent unnecessary re-transformations
  const transformationResult = useMemo(() =>
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
    if (!showRegressionLine || !series || series.length === 0) {
      return sortedData;
    }

    // For line charts, we'll add a regression line for the first series
    const firstSeriesKey = series[0].name;

    // Check if X values are numeric
    const firstXValue = sortedData[0]?.[dimensionField];
    const isNumericX = typeof firstXValue === 'number';

    if (!isNumericX) {
      // For non-numeric X (dates, categories), add index-based regression
      const dataWithIndices = sortedData.map((point, index) => ({
        ...point,
        _index: index
      }));
      return addRegressionLineToData(dataWithIndices, '_index', firstSeriesKey, '_regressionLine');
    }

    return addRegressionLineToData(sortedData, dimensionField, firstSeriesKey, '_regressionLine');
  }, [showRegressionLine, sortedData, dimensionField, series]);

  // Create updated series list with regression line if enabled
  const finalSeries = useMemo(() => {
    if (!showRegressionLine) {
      return series;
    }

    // Add regression line as a new series
    return [
      ...series,
      {
        name: '_regressionLine',
        color: '#FF6B6B',
        label: 'Trend Line',
        strokeDasharray: '5 5', // Make it dashed
      },
    ];
  }, [showRegressionLine, series]);

  // Create value formatter for the chart (tooltips)
  const valueFormatter = createChartValueFormatter(numberFormat, numberPrecision);

  // Create axis tick formatter (abbreviated for large numbers)
  const axisTickFormatter = createAxisTickFormatter(numberFormat);

  const showLegend = shouldShowLegend(legendPosition);
  const legendPropsValue = getLegendProps(legendPosition);

  // Determine which gridlines to show based on individual settings
  // Note: In Mantine/Recharts, gridAxis refers to which axis the gridlines extend FROM
  // - 'x' means horizontal gridlines extending from X-axis (which are Y-axis gridlines visually)
  // - 'y' means vertical gridlines extending from Y-axis (which are X-axis gridlines visually)
  // So we need to swap the logic to match user expectations
  const getGridAxis = (): 'x' | 'y' | 'xy' | 'none' => {
    const showX = showXAxisGridLines; // User wants vertical gridlines
    const showY = showYAxisGridLines; // User wants horizontal gridlines

    if (showX && showY) return 'xy';
    if (showX) return 'y'; // Vertical gridlines = gridAxis 'y'
    if (showY) return 'x'; // Horizontal gridlines = gridAxis 'x'
    return 'none';
  };

  const gridAxisValue = getGridAxis();

  // Build gridProps based on individual grid line settings
  const gridProps = gridAxisValue !== 'none' ? {
    strokeDasharray: '3 3',
    stroke: 'var(--mantine-color-gray-3)',
  } : undefined;

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

import { useMemo, memo } from 'react';
import { LineChart } from '@mantine/charts';
import { transformChartData } from '../../../utils/chartDataTransformations';
import { SeriesLimitWrapper } from './SeriesLimitWrapper';
import { getChartColor } from '../../../constants/chartColors';
import { useSortedChartData, SortOrder } from '../../create_graph/settings/OrderByControl';
import { createChartValueFormatter, createAxisTickFormatter, NumberFormatType } from '../../../utils/numberFormatter';
import { getLegendProps } from './utils/legendHelpers';
import type { LegendPosition } from '../../../types/graph';
import type { ColorPalette } from '../../../constants/colorPalettes';
import { createPaletteColorFunction } from '../../../constants/colorPalettes';

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
  showGridLines?: boolean;
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
  showGridLines = true,
  legendPosition = 'bottom',
}: MantineLineChartProps) {
  console.log('[CHART] MantineLineChart rendering');

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
    }),
    [queryResult, primaryColor, getColorFn, primaryDimension, selectedMeasure]
  );

  const { data: transformedData, dimensionField, series } = transformationResult;

  // Handle case where transformation failed
  if (!transformedData || transformedData.length === 0 || !dimensionField || !series) {
    return <div>No data available for chart</div>;
  }

  // Apply sorting using useMemo hook inside useSortedChartData
  const chartData = useSortedChartData(transformedData, dimensionField, sortOrder);

  // Create value formatter for the chart (tooltips)
  const valueFormatter = createChartValueFormatter(numberFormat, numberPrecision);

  // Create axis tick formatter (abbreviated for large numbers)
  const axisTickFormatter = createAxisTickFormatter(numberFormat);

  return (
    <SeriesLimitWrapper seriesCount={series.length}>
      <LineChart
        h="100%"
        data={chartData}
        dataKey={dimensionField}
        series={series}
        curveType="linear"
        connectNulls
        withLegend
        withDots
        legendProps={getLegendProps(legendPosition)}
        gridAxis={showGridLines ? 'xy' : 'none'}
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

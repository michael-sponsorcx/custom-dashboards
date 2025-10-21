import { LineChart } from '@mantine/charts';
import { transformChartData } from '../../../utils/chartDataTransformations';
import { SeriesLimitWrapper } from './SeriesLimitWrapper';
import { getChartColor } from '../../../constants/chartColors';
import { useSortedChartData, SortOrder } from '../../create_graph/settings/OrderByControl';
import { createChartValueFormatter, NumberFormatType } from '../../../utils/numberFormatter';
import { getLegendProps } from './utils/legendHelpers';

interface MantineLineChartProps {
  queryResult: any;
  primaryColor?: string;
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
}

/**
 * MantineLineChart component - renders a line chart using Mantine charts
 */
export function MantineLineChart({
  queryResult,
  primaryColor = '#3b82f6',
  sortOrder = 'desc',
  primaryDimension,
  selectedMeasure,
  numberFormat = 'number',
  numberPrecision = 2,
  xAxisLabel,
  yAxisLabel,
  showGridLines = true,
}: MantineLineChartProps) {
  // Use the transformation utility to handle all data transformation
  // Pass raw Cube data directly - transformation happens inside the utility
  const transformationResult = transformChartData({
    chartType: 'line',
    cubeData: queryResult,
    primaryColor,
    getColorFn: getChartColor,
    primaryDimension,
    selectedMeasure,
  });

  const { data: transformedData, dimensionField, series } = transformationResult;

  // Handle case where transformation failed
  if (!transformedData || transformedData.length === 0 || !dimensionField || !series) {
    return <div>No data available for chart</div>;
  }

  // Apply sorting using useMemo hook inside useSortedChartData
  const chartData = useSortedChartData(transformedData, dimensionField, sortOrder);

  // Create value formatter for the chart
  const valueFormatter = createChartValueFormatter(numberFormat, numberPrecision);

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
        legendProps={getLegendProps()}
        gridAxis={showGridLines ? 'xy' : undefined}
        tickLine="xy"
        valueFormatter={valueFormatter}
        xAxisLabel={xAxisLabel}
        yAxisLabel={yAxisLabel}
        tooltipProps={{
          cursor: false,
          shared: false,
        }}
      />
    </SeriesLimitWrapper>
  );
}

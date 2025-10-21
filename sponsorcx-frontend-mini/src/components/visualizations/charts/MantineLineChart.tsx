import { LineChart } from '@mantine/charts';
import { transformChartData } from '../../../utils/chartDataTransformations';
import { SeriesLimitWrapper } from './SeriesLimitWrapper';
import { getChartColor } from '../../../constants/chartColors';
import { useSortedChartData, SortOrder } from '../../create_graph/settings/OrderByControl';
import { createChartValueFormatter, NumberFormatType } from '../../../utils/numberFormatter';

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

  console.log('MantineLineChart - sorted data:', chartData);

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
        legendProps={{ verticalAlign: 'bottom', height: 50 }}
        gridAxis="xy"
        tickLine="xy"
        valueFormatter={valueFormatter}
        tooltipProps={{
          cursor: false,
          shared: false,
        }}
        lineChartProps={{
          margin: { top: 20, right: 20, bottom: 20, left: 60 }
        }}
      />
    </SeriesLimitWrapper>
  );
}

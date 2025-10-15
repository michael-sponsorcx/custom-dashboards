import { LineChart } from '@mantine/charts';
import { transformChartData } from '../../utils/chartDataTransformations';
import { SeriesLimitWrapper } from './SeriesLimitWrapper';
import { getChartColor } from '../../constants/chartColors';

interface MantineLineChartProps {
  queryResult: any;
  primaryColor?: string;
}

/**
 * MantineLineChart component - renders a line chart using Mantine charts
 */
export function MantineLineChart({ queryResult, primaryColor = '#3b82f6' }: MantineLineChartProps) {
  // Use the transformation utility to handle all data transformation
  // Pass raw Cube data directly - transformation happens inside the utility
  const transformationResult = transformChartData({
    chartType: 'line',
    cubeData: queryResult,
    primaryColor,
    getColorFn: getChartColor,
  });

  const { data: chartData, dimensionField, series } = transformationResult;

  console.log('MantineLineChart - transformed data:', chartData);

  // Handle case where transformation failed
  if (!chartData || chartData.length === 0 || !dimensionField || !series) {
    return <div>No data available for chart</div>;
  }

  return (
    <SeriesLimitWrapper seriesCount={series.length}>
      <div style={{ width: '100%', height: 400 }}>
        <LineChart
          h={400}
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
          tooltipProps={{
            cursor: false,
            shared: false,
          }}
        />
      </div>
    </SeriesLimitWrapper>
  );
}

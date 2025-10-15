import { BarChart, BarChartType } from '@mantine/charts';
import { Paper, Text, Stack } from '@mantine/core';
import { transformChartData } from '../../utils/chartDataTransformations';
import { SeriesLimitWrapper } from './SeriesLimitWrapper';
import { getChartColor } from '../../constants/chartColors';

interface MantineBarChartProps {
  queryResult: any;
  primaryColor?: string;
  orientation?: 'vertical' | 'horizontal';
  type?: BarChartType;
}

/**
 * MantineBarChart component - renders a bar chart using Mantine charts
 * Supports vertical/horizontal orientation and grouped/stacked types
 */
export function MantineBarChart({
  queryResult,
  primaryColor = '#3b82f6',
  orientation = 'vertical',
  type = 'default'
}: MantineBarChartProps) {
  // Use the transformation utility to handle all data transformation
  // Pass raw Cube data directly - transformation happens inside the utility
  const chartType = type === 'stacked' ? 'bar_stacked' : 'bar';
  const transformationResult = transformChartData({
    chartType,
    cubeData: queryResult,
    primaryColor,
    getColorFn: getChartColor,
  });

  const { data: finalChartData, dimensionField, series } = transformationResult;

  console.log('MantineBarChart - transformed data:', finalChartData);

  // Handle case where transformation failed
  if (!finalChartData || finalChartData.length === 0 || !dimensionField || !series) {
    return <div>No data available for chart</div>;
  }

  return (
    <SeriesLimitWrapper seriesCount={series.length}>
      <div style={{ width: '100%', height: 500, overflow: 'visible' }}>
        <BarChart
          h={500}
          data={finalChartData}
          dataKey={dimensionField}
          valueFormatter={(value) => new Intl.NumberFormat('en-US').format(value)}
          withBarValueLabel={type !== 'stacked'}
          series={series}
          type={type}
          orientation={orientation}
          withLegend
          legendProps={{ verticalAlign: 'bottom', height: 100 }}
          gridAxis={orientation === 'vertical' ? 'y' : 'x'}
          tickLine={orientation === 'vertical' ? 'y' : 'x'}
        />
      </div>
    </SeriesLimitWrapper>
  );
}

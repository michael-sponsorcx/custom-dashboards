import { useEffect } from 'react';
import { BarChart, BarChartType } from '@mantine/charts';
import { transformChartData } from '../../utils/chartDataTransformations';
import { SeriesLimitWrapper } from './SeriesLimitWrapper';
import { getChartColor } from '../../constants/chartColors';
import { useSortedChartData, SortOrder } from './OrderByControl';

interface MantineBarChartProps {
  queryResult: any;
  primaryColor?: string;
  orientation?: 'vertical' | 'horizontal';
  type?: BarChartType;
  sortOrder?: SortOrder;
  // User-selected dimensions and measure
  primaryDimension?: string;
  secondaryDimension?: string;
  selectedMeasure?: string;
}

/**
 * MantineBarChart component - renders a bar chart using Mantine charts
 * Supports vertical/horizontal orientation and grouped/stacked types
 */
export function MantineBarChart({
  queryResult,
  primaryColor = '#3b82f6',
  orientation = 'vertical',
  type = 'default',
  sortOrder = 'desc',
  primaryDimension,
  secondaryDimension,
  selectedMeasure
}: MantineBarChartProps) {
  // Use the transformation utility to handle all data transformation
  // Pass raw Cube data directly - transformation happens inside the utility
  const chartType = type === 'stacked' ? 'bar_stacked' : 'bar';
  const transformationResult = transformChartData({
    chartType,
    cubeData: queryResult,
    primaryColor,
    getColorFn: getChartColor,
    primaryDimension,
    secondaryDimension,
    selectedMeasure,
  });

  const { data: transformedData, dimensionField, series } = transformationResult;

  // Handle case where transformation failed
  if (!transformedData || transformedData.length === 0 || !dimensionField || !series) {
    return <div>No data available for chart</div>;
  }

  // Apply sorting using useMemo hook inside useSortedChartData
  const finalChartData = useSortedChartData(transformedData, dimensionField, sortOrder);

  // Log when sort order changes
  useEffect(() => {
    console.log('MantineBarChart - Sort order changed to:', sortOrder);
  }, [sortOrder]);

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

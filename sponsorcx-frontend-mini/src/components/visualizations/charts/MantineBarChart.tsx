import { BarChart, BarChartType } from '@mantine/charts';
import { transformChartData } from '../../../utils/chartDataTransformations';
import { SeriesLimitWrapper } from './SeriesLimitWrapper';
import { getChartColor } from '../../../constants/chartColors';
import { useSortedChartData, SortOrder } from '../../create_graph/settings/OrderByControl';
import { createChartValueFormatter, NumberFormatType } from '../../../utils/numberFormatter';
import type { LegendPosition } from '../../../types/graph';
import { getLegendProps } from './utils/legendHelpers';

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
  selectedMeasure,
  numberFormat = 'number',
  numberPrecision = 2,
  xAxisLabel,
  yAxisLabel,
  showGridLines = true,
  legendPosition = 'bottom',
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

  // Create value formatter for the chart
  const valueFormatter = createChartValueFormatter(numberFormat, numberPrecision);

  // Calculate margins based on whether labels are present
  const bottomMargin = xAxisLabel ? 60 : 20;
  const leftMargin = yAxisLabel ? 80 : 60;

  return (
    <SeriesLimitWrapper seriesCount={series.length}>
      <BarChart
        h="100%"
        data={finalChartData}
        dataKey={dimensionField}
        valueFormatter={valueFormatter}
        withBarValueLabel={type !== 'stacked'}
        series={series}
        type={type}
        orientation={orientation}
        withLegend
        legendProps={getLegendProps(legendPosition)}
        gridAxis={showGridLines ? (orientation === 'vertical' ? 'y' : 'x') : undefined}
        tickLine={orientation === 'vertical' ? 'y' : 'x'}
        yAxisProps={
          yAxisLabel
            ? {
                label: {
                  value: yAxisLabel,
                  angle: -90,
                  position: 'insideLeft',
                  style: {
                    textAnchor: 'middle',
                    fontWeight: 'bold',
                    fontSize: 14
                  },
                },
              }
            : undefined
        }
        xAxisProps={
          xAxisLabel
            ? {
                label: {
                  value: xAxisLabel,
                  position: 'insideBottom',
                  offset: -10,
                  style: {
                    textAnchor: 'middle',
                    fontWeight: 'bold',
                    fontSize: 14
                  },
                },
              }
            : undefined
        }
        barChartProps={{
          margin: { top: 20, right: 20, bottom: bottomMargin, left: leftMargin }
        }}
      />
    </SeriesLimitWrapper>
  );
}

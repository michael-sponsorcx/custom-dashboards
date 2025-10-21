import { LineChart } from '@mantine/charts';
import { transformChartData } from '../../../utils/chartDataTransformations';
import { SeriesLimitWrapper } from './SeriesLimitWrapper';
import { getChartColor } from '../../../constants/chartColors';
import { useSortedChartData, SortOrder } from '../../create_graph/settings/OrderByControl';
import { createChartValueFormatter, NumberFormatType } from '../../../utils/numberFormatter';
import type { LegendPosition } from '../../create_graph/types';

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
  legendPosition?: LegendPosition;
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
  legendPosition = 'bottom',
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

  // Calculate margins based on whether labels are present
  const bottomMargin = xAxisLabel ? 60 : 20;
  const leftMargin = yAxisLabel ? 80 : 60;

  // Map our legend position into recharts legend props to support left/right
  const legendProps = (() => {
    switch (legendPosition) {
      case 'top':
        return { verticalAlign: 'top' as const, height: 50, layout: 'horizontal' as const, align: 'center' as const };
      case 'bottom':
        return { verticalAlign: 'bottom' as const, height: 50, layout: 'horizontal' as const, align: 'center' as const };
      case 'left':
        return { verticalAlign: 'middle' as const, layout: 'vertical' as const, align: 'left' as const, width: 120 };
      case 'right':
        return { verticalAlign: 'middle' as const, layout: 'vertical' as const, align: 'right' as const, width: 120 };
      default:
        return { verticalAlign: 'bottom' as const, height: 50, layout: 'horizontal' as const, align: 'center' as const };
    }
  })();

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
        legendProps={legendProps}
        gridAxis={showGridLines ? 'xy' : undefined}
        tickLine="xy"
        valueFormatter={valueFormatter}
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
        tooltipProps={{
          cursor: false,
          shared: false,
        }}
        lineChartProps={{
          margin: { top: 20, right: 20, bottom: bottomMargin, left: leftMargin }
        }}
      />
    </SeriesLimitWrapper>
  );
}

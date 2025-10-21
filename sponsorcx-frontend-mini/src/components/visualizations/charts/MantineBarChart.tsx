import { useMemo } from 'react';
import { BarChart, BarChartType } from '@mantine/charts';
import { transformChartData } from '../../../utils/chartDataTransformations';
import { SeriesLimitWrapper } from './SeriesLimitWrapper';
import { getChartColor } from '../../../constants/chartColors';
import { useSortedChartData, SortOrder } from '../../create_graph/settings/OrderByControl';
import { createChartValueFormatter, createAxisTickFormatter, NumberFormatType } from '../../../utils/numberFormatter';
import type { LegendPosition } from '../../../types/graph';
import { getLegendProps } from './utils/legendHelpers';
import type { ColorPalette } from '../../../constants/colorPalettes';
import { createPaletteColorFunction } from '../../../constants/colorPalettes';

interface MantineBarChartProps {
  queryResult: any;
  primaryColor?: string;
  colorPalette?: ColorPalette;
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
  colorPalette = 'hubspot-orange',
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
  console.log('[CHART] MantineBarChart rendering');

  // Create color function based on palette (or use default chart colors for 'custom')
  const getColorFn = useMemo(() => {
    return colorPalette === 'custom' ? getChartColor : createPaletteColorFunction(colorPalette);
  }, [colorPalette]);

  // Use the transformation utility to handle all data transformation
  // Pass raw Cube data directly - transformation happens inside the utility
  // Memoize to prevent unnecessary re-transformations
  const chartType = type === 'stacked' ? 'bar_stacked' : 'bar';
  const transformationResult = useMemo(() =>
    transformChartData({
      chartType,
      cubeData: queryResult,
      primaryColor,
      getColorFn,
      primaryDimension,
      secondaryDimension,
      selectedMeasure,
    }),
    [chartType, queryResult, primaryColor, getColorFn, primaryDimension, secondaryDimension, selectedMeasure]
  );

  const { data: transformedData, dimensionField, series } = transformationResult;

  // Handle case where transformation failed
  if (!transformedData || transformedData.length === 0 || !dimensionField || !series) {
    return <div>No data available for chart</div>;
  }

  // Apply sorting using useMemo hook inside useSortedChartData
  const finalChartData = useSortedChartData(transformedData, dimensionField, sortOrder);

  // Create value formatter for the chart (tooltips)
  const valueFormatter = createChartValueFormatter(numberFormat, numberPrecision);

  // Create axis tick formatter (abbreviated for large numbers)
  const axisTickFormatter = createAxisTickFormatter(numberFormat);

  // For vertical bars: Y-axis shows numbers (needs formatter), X-axis shows categories (no formatter)
  // For horizontal bars: X-axis shows numbers (needs formatter), Y-axis shows categories (no formatter)
  const axisProps = orientation === 'vertical'
    ? { yAxisProps: { width: 80, tickFormatter: axisTickFormatter } }
    : { xAxisProps: { tickFormatter: axisTickFormatter } };

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
        gridAxis={showGridLines ? (orientation === 'vertical' ? 'y' : 'x') : 'none'}
        tickLine={orientation === 'vertical' ? 'y' : 'x'}
        xAxisLabel={xAxisLabel}
        yAxisLabel={yAxisLabel}
        {...axisProps}
      />
    </SeriesLimitWrapper>
  );
}

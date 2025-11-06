import { useMemo, memo } from 'react';
import { BarChart, BarChartType } from '@mantine/charts';
import { transformChartData } from '../../../utils/chartDataTransformations';
import { SeriesLimitWrapper } from './SeriesLimitWrapper';
import { useSortedChartData, SortOrder } from '../../create_graph/settings/OrderByControl';
import { NumberFormatType } from '../../../utils/numberFormatter';
import type { LegendPosition } from '../../../types/graph';
import { getLegendProps, shouldShowLegend } from './utils/legendHelpers';
import type { ColorPalette } from '../../../constants/colorPalettes';
import type { ChartDataPoint } from '../../../utils/chartDataTransformations/types';
import type { CubeQueryResult } from '../../../services/backendCube';
import { createChartColorFunction } from './utils/colorPaletteHelpers';
import { getGridAxisValue, getGridProps } from './utils/gridAxisHelpers';
import { createChartFormatters } from './utils/chartFormatterHelpers';
import { useDrillDown } from './drilldown/useDrillDown';
import { DrillDownPanel } from './drilldown/DrillDownPanel';

interface MantineBarChartProps {
  queryResult: CubeQueryResult;
  primaryColor?: string;
  colorPalette?: ColorPalette;
  orientation?: 'vertical' | 'horizontal';
  type?: BarChartType;
  sortOrder?: SortOrder;
  // User-selected dimensions and measure
  primaryDimension?: string;
  secondaryDimension?: string;
  selectedMeasure?: string;
  // Available dimensions for drill-down
  availableDimensions?: string[];
  // Callback when user selects a dimension to drill down
  onDrillDown?: (dimension: string, dataPoint: ChartDataPoint) => void;
  // Number formatting
  numberFormat?: NumberFormatType;
  numberPrecision?: number;
  // Axis labels
  xAxisLabel?: string;
  yAxisLabel?: string;
  showXAxisGridLines?: boolean;
  showYAxisGridLines?: boolean;
  maxDataPoints?: number;
  legendPosition?: LegendPosition;
}

/**
 * MantineBarChart component - renders a bar chart using Mantine charts
 * Supports vertical/horizontal orientation and grouped/stacked types
 * Wrapped with React.memo to prevent unnecessary re-renders
 */
export const MantineBarChart = memo(function MantineBarChart({
  queryResult,
  primaryColor = '#3b82f6',
  colorPalette = 'hubspot-orange',
  orientation = 'vertical',
  type = 'default',
  sortOrder = 'desc',
  primaryDimension,
  secondaryDimension,
  selectedMeasure,
  availableDimensions = [],
  onDrillDown,
  numberFormat = 'number',
  numberPrecision = 2,
  xAxisLabel,
  yAxisLabel,
  showXAxisGridLines = true,
  showYAxisGridLines = true,
  maxDataPoints,
  legendPosition = 'bottom',
}: MantineBarChartProps) {
  // Use drill-down hook to manage state and available dimensions
  const {
    drillDownDimensions,
    canDrillDown,
    clickedBar,
    showDrillDown,
    setClickedBar,
    setShowDrillDown,
    handleDrillDown,
  } = useDrillDown(availableDimensions, primaryDimension, onDrillDown);

  // Create color function based on palette (or use default chart colors for 'custom')
  const getColorFn = useMemo(() => {
    return createChartColorFunction(colorPalette);
  }, [colorPalette]);

  // Use the transformation utility to handle all data transformation
  // Pass raw Cube data directly - transformation happens inside the utility
  // Memoize to prevent unnecessary re-transformations
  const chartType = type === 'stacked' ? 'bar_stacked' : 'bar';

  const transformationResult = useMemo(() => {
    return transformChartData({
      chartType,
      cubeData: queryResult,
      primaryColor,
      getColorFn,
      primaryDimension,
      secondaryDimension,
      selectedMeasure,
      maxDataPoints,
    });
  }, [
    chartType,
    queryResult,
    primaryColor,
    getColorFn,
    primaryDimension,
    secondaryDimension,
    selectedMeasure,
    maxDataPoints,
  ]);

  const { data: transformedData, dimensionField, series } = transformationResult;

  // Handle case where transformation failed
  if (!transformedData || transformedData.length === 0 || !dimensionField || !series) {
    return <div>No data available for chart</div>;
  }

  // Apply sorting using useMemo hook inside useSortedChartData
  const finalChartData = useSortedChartData(transformedData, dimensionField, sortOrder);

  // Create formatters for chart values and axis ticks
  const { valueFormatter, axisTickFormatter } = createChartFormatters(numberFormat, numberPrecision);

  const showLegend = shouldShowLegend(legendPosition);
  const legendPropsValue = getLegendProps(legendPosition);

  // Determine which gridlines to show based on user settings
  const gridAxisValue = getGridAxisValue(showXAxisGridLines, showYAxisGridLines);
  const gridProps = getGridProps(gridAxisValue);

  return (
    <SeriesLimitWrapper seriesCount={series.length} maxSeries={maxDataPoints}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ flex: 1, minHeight: 0 }}>
          <BarChart
            h="100%"
            data={finalChartData}
            dataKey={dimensionField}
            valueFormatter={valueFormatter}
            withBarValueLabel={type !== 'stacked'}
            series={series}
            type={type}
            orientation={orientation}
            withLegend={showLegend}
            {...(showLegend && legendPropsValue ? { legendProps: legendPropsValue } : {})}
            gridAxis={gridAxisValue}
            {...(gridProps ? { gridProps } : {})}
            tickLine={'xy'}
            xAxisLabel={xAxisLabel}
            yAxisLabel={yAxisLabel}
            xAxisProps={
              orientation === 'horizontal' ? { tickFormatter: axisTickFormatter } : undefined
            }
            yAxisProps={
              orientation === 'horizontal'
                ? { width: 80, tickFormatter: axisTickFormatter }
                : { width: 80 }
            }
            barProps={(seriesData) => ({
              onClick: (data: ChartDataPoint, _index: number, event: React.MouseEvent) => {
                setClickedBar({
                  data: { ...data, series: seriesData.name },
                  position: {
                    x: event?.clientX || 0,
                    y: event?.clientY || 0,
                  },
                });
                setShowDrillDown(false); // Reset drill down view
              },
              cursor: 'pointer',
              style: { transition: 'opacity 0.2s' },
            })}
          />
        </div>

        {/* Drill-down panel below chart */}
        {clickedBar && (
          <DrillDownPanel
            clickedBar={clickedBar}
            dimensionField={dimensionField}
            drillDownDimensions={drillDownDimensions}
            canDrillDown={canDrillDown}
            showDrillDown={showDrillDown}
            onDrillDownClick={() => setShowDrillDown(true)}
            onDimensionSelect={(dimension) => handleDrillDown(dimension, clickedBar.data)}
            onBack={() => setShowDrillDown(false)}
            onClose={() => setClickedBar(null)}
          />
        )}
      </div>
    </SeriesLimitWrapper>
  );
});

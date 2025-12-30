import { useMemo, memo } from 'react';
import { PieChart } from '@mantine/charts';
import { transformChartData } from '../../../utils/chartDataTransformations';
import { NumberFormatType } from '../../../utils/numberFormatter';
import type { LegendPosition } from '../../../types/graph';
import type { ColorPalette } from '../../../constants/colorPalettes';
import { createChartColorFunction } from './utils/colorPaletteHelpers';
import { createChartFormatters } from './utils/chartFormatterHelpers';
import { EmptyState } from '../utils/EmptyState';

interface MantinePieChartProps {
  queryResult: unknown;
  primaryColor?: string;
  colorPalette?: ColorPalette;
  // User-selected dimension and measure
  primaryDimension?: string;
  selectedMeasure?: string;
  // Number formatting
  numberFormat?: NumberFormatType;
  numberPrecision?: number;
  // Legend position
  legendPosition?: LegendPosition;
  maxDataPoints?: number;
}

/**
 * MantinePieChart component - renders a pie chart using Mantine Charts
 * Wrapped with React.memo to prevent unnecessary re-renders
 */
export const MantinePieChart = memo(function MantinePieChart({
  queryResult,
  primaryColor = '#3b82f6',
  colorPalette = 'hubspot-orange',
  primaryDimension,
  selectedMeasure,
  numberFormat = 'number',
  numberPrecision = 2,
  maxDataPoints,
}: MantinePieChartProps) {
  // Create color function based on palette (or use default chart colors for 'custom')
  const getColorFn = useMemo(() => {
    return createChartColorFunction(colorPalette);
  }, [colorPalette]);

  // Use the transformation utility to handle all data transformation
  // Pass raw Cube data directly - transformation happens inside the utility
  // Memoize to prevent unnecessary re-transformations
  const transformationResult = useMemo(
    () =>
      transformChartData({
        chartType: 'pie',
        cubeData: queryResult,
        primaryColor,
        getColorFn,
        primaryDimension,
        selectedMeasure,
        maxDataPoints,
      }),
    [queryResult, primaryColor, getColorFn, primaryDimension, selectedMeasure, maxDataPoints]
  );

  const { data: transformedData, dimensionField, series } = transformationResult;

  // Handle empty or invalid data
  if (!transformedData || transformedData.length === 0 || !dimensionField || !series) {
    return <EmptyState data={transformedData} queryResult={queryResult} />;
  }

  // Create value formatter for tooltips
  const { valueFormatter } = createChartFormatters(numberFormat, numberPrecision);

  // Transform data into Mantine PieChart format
  // Mantine expects: { name: string, value: number, color: string }[]
  const mantineData = useMemo(() => {
    // For pie charts, we need the actual measure field name, not the series name
    // Series names in pie charts are the dimension values (slices), not measures
    // Find the measure field by looking at the data structure
    const sampleItem = transformedData[0];
    const measureKey =
      selectedMeasure ||
      Object.keys(sampleItem).find(
        (key) => key !== dimensionField && typeof sampleItem[key] === 'number'
      );

    if (!measureKey) {
      return [];
    }

    const result = transformedData.map((item, index) => ({
      name: String(item[dimensionField] || 'Unknown'),
      value: Number(item[measureKey]) || 0,
      color: series[index]?.color || primaryColor,
    }));

    return result;
  }, [transformedData, dimensionField, series, selectedMeasure, primaryColor]);

  // Mantine PieChart valid props (from docs):
  // - data: { name: string, value: number, color: string }[]
  // - withLabels: boolean
  // - labelsPosition: 'inside' | 'outside'
  // - withTooltip: boolean
  // - tooltipDataSource: 'segment' | 'all' - controls what data is shown in tooltip
  // - size: number
  // - strokeWidth: number
  // - startAngle: number
  // - endAngle: number
  // - valueFormatter: (value: number) => string
  // - tooltipProps: object (Recharts Tooltip props)
  return (
    <PieChart
      data={mantineData}
      withLabels
      labelsPosition="outside"
      withTooltip
      tooltipDataSource="segment"
      tooltipProps={{
        wrapperStyle: {
          zIndex: 1000,
        },
        contentStyle: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid #e0e0e0',
          borderRadius: '4px',
          padding: '8px 12px',
        },
        // Allow tooltip to be positioned outside the chart bounds
        allowEscapeViewBox: { x: true, y: true },
      }}
      valueFormatter={valueFormatter}
      size={200}
      strokeWidth={1}
    />
  );
});

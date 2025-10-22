import { useMemo, memo } from 'react';
import { PieChart } from '@mantine/charts';
import { transformChartData } from '../../../utils/chartDataTransformations';
import { getChartColor } from '../../../constants/chartColors';
import { createChartValueFormatter, NumberFormatType } from '../../../utils/numberFormatter';
import type { LegendPosition } from '../../../types/graph';
import type { ColorPalette } from '../../../constants/colorPalettes';
import { createPaletteColorFunction } from '../../../constants/colorPalettes';

interface MantinePieChartProps {
  queryResult: any;
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
  legendPosition = 'bottom',
}: MantinePieChartProps) {
  console.log('[PIE CHART] Rendering with props:', {
    queryResult,
    primaryColor,
    colorPalette,
    primaryDimension,
    selectedMeasure,
    numberFormat,
    numberPrecision,
    legendPosition
  });

  // Create color function based on palette (or use default chart colors for 'custom')
  const getColorFn = useMemo(() => {
    return colorPalette === 'custom' ? getChartColor : createPaletteColorFunction(colorPalette);
  }, [colorPalette]);

  // Use the transformation utility to handle all data transformation
  // Pass raw Cube data directly - transformation happens inside the utility
  // Memoize to prevent unnecessary re-transformations
  const transformationResult = useMemo(() =>
    transformChartData({
      chartType: 'pie',
      cubeData: queryResult,
      primaryColor,
      getColorFn,
      primaryDimension,
      selectedMeasure,
    }),
    [queryResult, primaryColor, getColorFn, primaryDimension, selectedMeasure]
  );

  const { data: transformedData, dimensionField, series } = transformationResult;

  console.log('[PIE CHART] Transformation result:', {
    transformedData,
    dimensionField,
    series,
    hasData: !!transformedData,
    dataLength: transformedData?.length,
    hasDimensionField: !!dimensionField,
    hasSeries: !!series
  });

  // Handle case where transformation failed
  if (!transformedData || transformedData.length === 0 || !dimensionField || !series) {
    console.log('[PIE CHART] Transformation failed - no data available');
    return <div>No data available for chart</div>;
  }

  // Create value formatter for tooltips
  const valueFormatter = createChartValueFormatter(numberFormat, numberPrecision);

  // Transform data into Mantine PieChart format
  // Mantine expects: { name: string, value: number, color: string }[]
  const mantineData = useMemo(() => {
    // For pie charts, we need the actual measure field name, not the series name
    // Series names in pie charts are the dimension values (slices), not measures
    // Find the measure field by looking at the data structure
    const sampleItem = transformedData[0];
    const measureKey = selectedMeasure || Object.keys(sampleItem).find(
      key => key !== dimensionField && typeof sampleItem[key] === 'number'
    );
    
    console.log('[PIE CHART] Transforming to Mantine format:', {
      measureKey,
      selectedMeasure,
      dimensionField,
      sampleTransformedData: transformedData[0],
      allKeys: Object.keys(sampleItem)
    });

    if (!measureKey) {
      console.log('[PIE CHART] No measure key found!');
      return [];
    }

    const result = transformedData.map((item, index) => ({
      name: String(item[dimensionField] || 'Unknown'),
      value: Number(item[measureKey]) || 0,
      color: series[index]?.color || primaryColor,
    }));

    console.log('[PIE CHART] Mantine data prepared:', {
      resultCount: result.length,
      sampleData: result.slice(0, 3),
      allData: result
    });

    return result;
  }, [transformedData, dimensionField, series, selectedMeasure, primaryColor]);

  console.log('[PIE CHART] Rendering PieChart component with:', {
    dataLength: mantineData.length,
    data: mantineData
  });

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

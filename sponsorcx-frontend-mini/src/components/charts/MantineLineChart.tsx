import { LineChart } from '@mantine/charts';
import { transformToChartData } from '../../utils/chartDataAnalyzer';
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
  // Transform Cube GraphQL data to chart format
  let chartData = transformToChartData(queryResult);

  if (chartData.length === 0) {
    return <div>No data available for chart</div>;
  }

  // Extract field names from first data point
  const firstPoint = chartData[0];
  const fields = Object.keys(firstPoint);

  // Identify dimension (x-axis) and measures (y-axis)
  // Typically dimensions are strings (like fiscal year labels)
  // Measures are numbers
  let dimensionField: string | null = null;
  const measureFields: string[] = [];

  fields.forEach(field => {
    const value = firstPoint[field];
    if (typeof value === 'string') {
      // First string field becomes the x-axis (dimension)
      if (!dimensionField) {
        dimensionField = field;
      }
    } else if (typeof value === 'number') {
      // Numeric fields are measures (series)
      measureFields.push(field);
    }
  });

  if (!dimensionField || measureFields.length === 0) {
    return <div>Unable to determine chart structure</div>;
  }

  const measure = measureFields[0]; // Should only be 1 measure
  const dimension = dimensionField; // TypeScript: ensure non-null

  // Limit dimension values to top 15 by measure value
  const MAX_DIMENSION_VALUES = 15;

  // Calculate total measure value for each dimension value
  const dimensionValueTotals: { [key: string]: number } = {};
  chartData.forEach(row => {
    const dimensionValue = row[dimension];
    const measureValue = row[measure];
    dimensionValueTotals[dimensionValue] = (dimensionValueTotals[dimensionValue] || 0) + measureValue;
  });

  // Get unique dimension values count
  const uniqueDimensionValues = Object.keys(dimensionValueTotals);

  if (uniqueDimensionValues.length > MAX_DIMENSION_VALUES) {
    // Sort dimension values by total and take top 15
    const topDimensionValues = Object.entries(dimensionValueTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, MAX_DIMENSION_VALUES)
      .map(([key]) => key);

    const topDimensionValuesSet = new Set(topDimensionValues);

    // Filter chartData to only include top dimension values
    chartData = chartData.filter(row => topDimensionValuesSet.has(row[dimension]));

    console.log('MantineLineChart - Filtered to top 15 dimension values:', topDimensionValues);
  }

  // Create series configuration for Mantine charts
  // Use primaryColor for single measure, color palette for multiple measures
  const series = measureFields.map((field, index) => ({
    name: field,
    color: measureFields.length === 1 ? primaryColor : getChartColor(index),
  }));

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

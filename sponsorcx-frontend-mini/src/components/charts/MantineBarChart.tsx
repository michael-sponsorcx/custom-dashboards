import { BarChart, BarChartType } from '@mantine/charts';
import { Paper, Text, Stack } from '@mantine/core';
import { transformToChartData } from '../../utils/chartDataAnalyzer';
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
  // Transform Cube GraphQL data to chart format
  const chartData = transformToChartData(queryResult);

  console.log('MantineBarChart - chartData:', chartData);
  console.log('MantineBarChart - orientation:', orientation, 'type:', type);

  if (chartData.length === 0) {
    return <div>No data available for chart</div>;
  }

  // Extract field names from first data point
  const firstPoint = chartData[0];
  const fields = Object.keys(firstPoint);

  console.log('MantineBarChart - fields:', fields);

  // Identify dimensions (string fields) and measures (numeric fields)
  const dimensionFields: string[] = [];
  const measureFields: string[] = [];

  fields.forEach(field => {
    const value = firstPoint[field];
    if (typeof value === 'string') {
      dimensionFields.push(field);
    } else if (typeof value === 'number') {
      measureFields.push(field);
    }
  });

  console.log('MantineBarChart - dimensionFields:', dimensionFields);
  console.log('MantineBarChart - measureFields:', measureFields);

  // Handle different data structures
  let finalChartData = chartData;
  let dimensionField: string;
  let series: Array<{ name: string; color?: string }>;

  // Case 1: Multiple dimensions + 1 measure (for stacked charts)
  // Pivot data so first dimension is x-axis, second dimension values become series
  if (dimensionFields.length > 1 && measureFields.length === 1 && type === 'stacked') {
    const primaryDimension = dimensionFields[1]; // x-axis
    const secondaryDimension = dimensionFields[0]; // becomes series
    const measure = measureFields[0];

    console.log('MantineBarChart - Pivoting data for stacked chart');
    console.log('  Primary dimension (x-axis):', primaryDimension);
    console.log('  Secondary dimension (series):', secondaryDimension);
    console.log('  Measure:', measure);

    const MAX_DIMENSION_VALUES = 5;

    // Calculate total measure value for BOTH dimensions independently
    const primaryDimensionTotals: { [key: string]: number } = {};
    const secondaryDimensionTotals: { [key: string]: number } = {};

    chartData.forEach(row => {
      const primaryValue = row[primaryDimension];
      const secondaryValue = row[secondaryDimension];
      const measureValue = row[measure];

      primaryDimensionTotals[primaryValue] = (primaryDimensionTotals[primaryValue] || 0) + measureValue;
      secondaryDimensionTotals[secondaryValue] = (secondaryDimensionTotals[secondaryValue] || 0) + measureValue;
    });

    // Get top 15 for primary dimension
    const topPrimaryValues = Object.entries(primaryDimensionTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, MAX_DIMENSION_VALUES)
      .map(([key]) => key);

    // Get top 15 for secondary dimension
    const topSecondaryValues = Object.entries(secondaryDimensionTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, MAX_DIMENSION_VALUES)
      .map(([key]) => key);

    const topPrimarySet = new Set(topPrimaryValues);
    const topSecondarySet = new Set(topSecondaryValues);

    console.log('MantineBarChart - Top 15 primary dimension values:', topPrimaryValues);
    console.log('MantineBarChart - Top 15 secondary dimension values:', topSecondaryValues);

    // Group data by primary dimension and pivot secondary dimension
    // Only include rows where BOTH dimensions are in top 15
    const pivotedData: { [key: string]: any } = {};

    chartData.forEach(row => {
      const primaryValue = row[primaryDimension];
      const secondaryValue = row[secondaryDimension];
      const measureValue = row[measure];

      // Only include if both dimension values are in top 15
      if (!topPrimarySet.has(primaryValue) || !topSecondarySet.has(secondaryValue)) {
        return;
      }

      if (!pivotedData[primaryValue]) {
        pivotedData[primaryValue] = { [primaryDimension]: primaryValue };
      }
      pivotedData[primaryValue][secondaryValue] = measureValue;
    });

    finalChartData = Object.values(pivotedData);
    dimensionField = primaryDimension;

    // Use color palette for multiple series (stacked chart with multiple categories)
    const seriesArray = Array.from(topSecondarySet);
    series = seriesArray.map((value, index) => ({
      name: value,
      color: seriesArray.length === 1 ? primaryColor : getChartColor(index),
    }));

    console.log('MantineBarChart - Pivoted data:', finalChartData);
    console.log('MantineBarChart - Series from secondary dimension:', series);
  }
  // Case 2: Standard case - single dimension, 1 measure
  else {
    if (dimensionFields.length === 0 || measureFields.length === 0) {
      return (
        <div>
          Unable to determine chart structure. dimensions: {dimensionFields.join(', ')}, measures:{' '}
          {measureFields.join(', ')}
        </div>
      );
    }

    dimensionField = dimensionFields[0]; // Use first dimension as x-axis
    const measure = measureFields[0]; // Should only be 1 measure

    // Limit dimension values to top 15 by measure value
    const MAX_DIMENSION_VALUES =5;

    // Calculate total measure value for each dimension value
    const dimensionValueTotals: { [key: string]: number } = {};
    chartData.forEach(row => {
      const dimensionValue = row[dimensionField];
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
      finalChartData = chartData.filter(row => topDimensionValuesSet.has(row[dimensionField]));

      console.log('MantineBarChart - Filtered to top 15 dimension values:', topDimensionValues);
    }

    // Use primaryColor for single measure, color palette for multiple measures
    series = measureFields.map((field, index) => ({
      name: field,
      color: measureFields.length === 1 ? primaryColor : getChartColor(index),
    }));

    console.log('MantineBarChart - Standard chart');
    console.log('  Dimension field:', dimensionField);
    console.log('  Series:', series);
  }

  // Custom tooltip for stacked bars showing total
  const CustomTooltip = ({ label, payload }: any) => {
    if (!payload || payload.length === 0) return null;

    const formatter = new Intl.NumberFormat('en-US');

    // For stacked charts, calculate and show total
    if (type === 'stacked') {
      const total = payload.reduce((sum: number, item: any) => sum + (item.value || 0), 0);

      return (
        <Paper shadow="md" p="xs" withBorder style={{ backgroundColor: 'white' }}>
          <Stack gap={4}>
            <Text size="sm" fw={600}>{label}</Text>
            {payload.map((item: any, index: number) => (
              <Text key={index} size="xs" style={{ color: item.color }}>
                {item.name}: {formatter.format(item.value)}
              </Text>
            ))}
            <Text size="sm" fw={700} mt={4} pt={4} style={{ borderTop: '1px solid #e9ecef' }}>
              Total: {formatter.format(total)}
            </Text>
          </Stack>
        </Paper>
      );
    }

    // For non-stacked charts, show default tooltip
    return (
      <Paper shadow="md" p="xs" withBorder style={{ backgroundColor: 'white' }}>
        <Stack gap={4}>
          <Text size="sm" fw={600}>{label}</Text>
          {payload.map((item: any, index: number) => (
            <Text key={index} size="xs" style={{ color: item.color }}>
              {item.name}: {formatter.format(item.value)}
            </Text>
          ))}
        </Stack>
      </Paper>
    );
  };

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
          tooltipProps={{
            content: CustomTooltip,
          }}
        />
      </div>
    </SeriesLimitWrapper>
  );
}

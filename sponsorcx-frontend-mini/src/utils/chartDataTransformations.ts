/**
 * Chart Data Transformation Utilities
 *
 * This module contains all data transformation logic for different chart types.
 * Each transformation is clearly labeled and designed to handle specific chart requirements.
 *
 * IMPORTANT: This is the ONLY place where Cube GraphQL data should be transformed to chart format.
 * All chart components should pass raw Cube data to these functions.
 */

const MAX_DIMENSION_VALUES = 10;
const MAX_LINE_CHART_DIMENSION_VALUES = 30;
const MAX_PIE_CHART_DIMENSION_VALUES = 10;

export type ChartType = 'bar' | 'bar_stacked' | 'line' | 'area' | 'pie' | 'number';

interface TransformationResult {
  data: any[];
  dimensionField?: string;
  series?: Array<{ name: string; color?: string }>;
}

interface TransformChartDataOptions {
  chartType: ChartType;
  cubeData: any; // Raw Cube GraphQL response
  primaryColor?: string;
  getColorFn?: (index: number) => string;
}

// Internal interface for chart-specific transformations that work with flat data
interface ChartSpecificTransformOptions {
  chartData: any[];
  primaryColor?: string;
  getColorFn?: (index: number) => string;
}

/**
 * Transforms Cube GraphQL response to flat chart data format
 * INTERNAL USE ONLY - not exported
 *
 * @param cubeResponse - Raw Cube GraphQL response
 * @returns Flattened array of data points
 */
function transformCubeDataToChartData(cubeResponse: any): any[] {
  if (!cubeResponse?.data?.cube || !Array.isArray(cubeResponse.data.cube)) {
    return [];
  }

  return cubeResponse.data.cube.map((item: any) => {
    const viewName = Object.keys(item)[0];
    return item[viewName];
  });
}

/**
 * Main entry point for chart data transformations.
 * Automatically routes to the appropriate transformation based on chart type.
 * Accepts raw Cube GraphQL data and handles the transformation internally.
 *
 * @param options - Configuration object containing chart type and raw Cube data
 * @returns Transformed data ready for chart rendering
 */
export function transformChartData(options: TransformChartDataOptions): TransformationResult {
  const { chartType, cubeData } = options;

  // Transform Cube data to flat chart format (this is the only place this should happen)
  const chartData = transformCubeDataToChartData(cubeData);

  if (!chartData || chartData.length === 0) {
    return { data: [] };
  }

  // Route to appropriate transformation based on chart type
  switch (chartType) {
    case 'bar':
      return barChartTransformation({ chartData, primaryColor: options.primaryColor, getColorFn: options.getColorFn });
    case 'bar_stacked':
      return barStackedTransformation({ chartData, primaryColor: options.primaryColor, getColorFn: options.getColorFn });
    case 'line':
      return lineChartTransformation({ chartData, primaryColor: options.primaryColor, getColorFn: options.getColorFn });
    case 'area':
      return areaChartTransformation({ chartData, primaryColor: options.primaryColor, getColorFn: options.getColorFn });
    case 'pie':
      return pieChartTransformation({ chartData, primaryColor: options.primaryColor, getColorFn: options.getColorFn });
    case 'number':
      return numberChartTransformation({ chartData, primaryColor: options.primaryColor, getColorFn: options.getColorFn });
    default:
      console.warn(`Unknown chart type: ${chartType}. Returning raw data.`);
      return { data: chartData };
  }
}

/**
 * BAR CHART TRANSFORMATION
 *
 * Handles transformation for standard (non-stacked) bar charts.
 * - Identifies dimensions (string fields) and measures (numeric fields)
 * - Limits to top N dimension values by measure total
 * - Configures series with appropriate colors
 *
 * Input: Raw chart data with dimensions and measures
 * Output: Filtered data with top dimension values and series configuration
 */
function barChartTransformation(options: ChartSpecificTransformOptions): TransformationResult {
  const { chartData, primaryColor = '#3b82f6', getColorFn } = options;

  // Extract field names from first data point
  const firstPoint = chartData[0];
  const fields = Object.keys(firstPoint);

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

  if (dimensionFields.length === 0 || measureFields.length === 0) {
    console.warn('Bar chart requires at least one dimension and one measure');
    return { data: [] };
  }

  const dimensionField = dimensionFields[0]; // Use first dimension as x-axis
  const measure = measureFields[0]; // Should only be 1 measure

  // Calculate total measure value for each dimension value
  const dimensionValueTotals: { [key: string]: number } = {};
  chartData.forEach(row => {
    const dimensionValue = row[dimensionField];
    const measureValue = row[measure];
    dimensionValueTotals[dimensionValue] = (dimensionValueTotals[dimensionValue] || 0) + measureValue;
  });

  // Get unique dimension values count
  const uniqueDimensionValues = Object.keys(dimensionValueTotals);

  let finalChartData = chartData;

  // Limit to top N dimension values if there are too many
  if (uniqueDimensionValues.length > MAX_DIMENSION_VALUES) {
    // Sort dimension values by total and take top N
    const topDimensionValues = Object.entries(dimensionValueTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, MAX_DIMENSION_VALUES)
      .map(([key]) => key);

    const topDimensionValuesSet = new Set(topDimensionValues);

    // Filter chartData to only include top dimension values
    finalChartData = chartData.filter(row => topDimensionValuesSet.has(row[dimensionField]));

    console.log('Bar chart - Filtered to top dimension values:', topDimensionValues);
  }

  // Use primaryColor for single measure, color palette for multiple measures
  const series = measureFields.map((field, index) => ({
    name: field,
    color: measureFields.length === 1 ? primaryColor : (getColorFn ? getColorFn(index) : undefined),
  }));

  return {
    data: finalChartData,
    dimensionField,
    series,
  };
}

/**
 * BAR STACKED TRANSFORMATION
 *
 * Handles transformation for stacked bar charts with multiple dimensions.
 * - Pivots data so first dimension becomes series (stacked segments)
 * - Second dimension becomes x-axis categories
 * - Limits both dimensions to top N values by measure total
 * - Creates series configuration for each segment
 *
 * Input: Raw data with 2+ dimensions and 1 measure
 * Output: Pivoted data structure with dimension as x-axis and series for stacking
 */
function barStackedTransformation(options: ChartSpecificTransformOptions): TransformationResult {
  const { chartData, primaryColor = '#3b82f6', getColorFn } = options;

  // Extract field names from first data point
  const firstPoint = chartData[0];
  const fields = Object.keys(firstPoint);

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

  // Require multiple dimensions and 1 measure for stacked charts
  if (dimensionFields.length < 2 || measureFields.length !== 1) {
    console.warn('Stacked bar chart requires 2+ dimensions and exactly 1 measure');
    return { data: [] };
  }

  const primaryDimension = dimensionFields[1]; // x-axis
  const secondaryDimension = dimensionFields[0]; // becomes series (stacked segments)
  const measure = measureFields[0];

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

  // Get top N for primary dimension (x-axis)
  const topPrimaryValues = Object.entries(primaryDimensionTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, MAX_DIMENSION_VALUES)
    .map(([key]) => key);

  // Get top N for secondary dimension (series)
  const topSecondaryValues = Object.entries(secondaryDimensionTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, MAX_DIMENSION_VALUES)
    .map(([key]) => key);

  const topPrimarySet = new Set(topPrimaryValues);
  const topSecondarySet = new Set(topSecondaryValues);

  // Group data by primary dimension and pivot secondary dimension
  // Only include rows where BOTH dimensions are in top N
  const pivotedData: { [key: string]: any } = {};

  chartData.forEach(row => {
    const primaryValue = row[primaryDimension];
    const secondaryValue = row[secondaryDimension];
    const measureValue = row[measure];

    // Only include if both dimension values are in top N
    if (!topPrimarySet.has(primaryValue) || !topSecondarySet.has(secondaryValue)) {
      return;
    }

    if (!pivotedData[primaryValue]) {
      pivotedData[primaryValue] = { [primaryDimension]: primaryValue };
    }
    pivotedData[primaryValue][secondaryValue] = measureValue;
  });

  const finalChartData = Object.values(pivotedData);

  // Use color palette for multiple series (stacked chart with multiple categories)
  const seriesArray = Array.from(topSecondarySet);
  const series = seriesArray.map((value, index) => ({
    name: value,
    color: seriesArray.length === 1 ? primaryColor : (getColorFn ? getColorFn(index) : undefined),
  }));

  return {
    data: finalChartData,
    dimensionField: primaryDimension,
    series,
  };
}

/**
 * LINE CHART TRANSFORMATION
 *
 * Handles transformation for line charts.
 * Similar to bar chart but optimized for time-series or continuous data.
 * - Preserves order of dimension values (important for time series)
 * - Limits to top 30 dimension values by measure total
 * - Configures series for line rendering
 *
 * Input: Raw chart data with time/continuous dimension and measures
 * Output: Ordered data with series configuration for lines (max 30 data points)
 */
function lineChartTransformation(options: ChartSpecificTransformOptions): TransformationResult {
  const { chartData, primaryColor = '#3b82f6', getColorFn } = options;

  // Extract field names from first data point
  const firstPoint = chartData[0];
  const fields = Object.keys(firstPoint);

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

  if (dimensionFields.length === 0 || measureFields.length === 0) {
    console.warn('Line chart requires at least one dimension and one measure');
    return { data: [] };
  }

  const dimensionField = dimensionFields[0];
  const measure = measureFields[0];

  // Calculate total measure value for each dimension value
  const dimensionValueTotals: { [key: string]: number } = {};
  chartData.forEach(row => {
    const dimensionValue = row[dimensionField];
    const measureValue = row[measure];
    dimensionValueTotals[dimensionValue] = (dimensionValueTotals[dimensionValue] || 0) + measureValue;
  });

  // Get unique dimension values count
  const uniqueDimensionValues = Object.keys(dimensionValueTotals);

  let finalChartData = chartData;

  // Limit to top 30 dimension values if there are too many
  if (uniqueDimensionValues.length > MAX_LINE_CHART_DIMENSION_VALUES) {
    // Sort dimension values by total and take top 30
    const topDimensionValues = Object.entries(dimensionValueTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, MAX_LINE_CHART_DIMENSION_VALUES)
      .map(([key]) => key);

    const topDimensionValuesSet = new Set(topDimensionValues);

    // Filter chartData to only include top dimension values
    finalChartData = chartData.filter(row => topDimensionValuesSet.has(row[dimensionField]));

    console.log('Line chart - Filtered to top 30 dimension values:', topDimensionValues);
  }

  // Use primaryColor for single measure, color palette for multiple measures
  const series = measureFields.map((field, index) => ({
    name: field,
    color: measureFields.length === 1 ? primaryColor : (getColorFn ? getColorFn(index) : undefined),
  }));

  return {
    data: finalChartData,
    dimensionField,
    series,
  };
}

/**
 * AREA CHART TRANSFORMATION
 *
 * Handles transformation for area charts.
 * Similar to line chart but with area fill configuration.
 *
 * Input: Raw chart data with dimension and measures
 * Output: Data with series configuration for area rendering
 */
function areaChartTransformation(options: ChartSpecificTransformOptions): TransformationResult {
  // Area charts use same transformation as line charts
  return lineChartTransformation(options);
}

/**
 * PIE CHART TRANSFORMATION
 *
 * Handles transformation for pie charts.
 * - Requires 1 dimension (category) and 1 measure (value)
 * - Limits to top 10 categories by value
 * - Groups remaining categories into "Other" slice
 * - Configures colors for each slice
 *
 * Input: Raw data with category dimension and numeric measure
 * Output: Top 10 categories + "Other" category with color configuration
 */
function pieChartTransformation(options: ChartSpecificTransformOptions): TransformationResult {
  const { chartData, getColorFn } = options;

  // Extract field names from first data point
  const firstPoint = chartData[0];
  const fields = Object.keys(firstPoint);

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

  if (dimensionFields.length === 0 || measureFields.length === 0) {
    console.warn('Pie chart requires one dimension and one measure');
    return { data: [] };
  }

  const dimensionField = dimensionFields[0];
  const measure = measureFields[0];

  // Calculate total measure value for each dimension value
  const dimensionValueTotals: { [key: string]: number } = {};
  chartData.forEach(row => {
    const dimensionValue = row[dimensionField];
    const measureValue = row[measure];
    dimensionValueTotals[dimensionValue] = (dimensionValueTotals[dimensionValue] || 0) + measureValue;
  });

  // Get unique dimension values count
  const uniqueDimensionValues = Object.keys(dimensionValueTotals);

  let finalChartData: any[] = [];
  let finalSeries: Array<{ name: string; color?: string }> = [];

  // Limit to top 10 dimension values and group rest into "Other"
  if (uniqueDimensionValues.length > MAX_PIE_CHART_DIMENSION_VALUES) {
    // Sort by value and get top 10
    const sortedEntries = Object.entries(dimensionValueTotals).sort(([, a], [, b]) => b - a);
    const topEntries = sortedEntries.slice(0, MAX_PIE_CHART_DIMENSION_VALUES);
    const remainingEntries = sortedEntries.slice(MAX_PIE_CHART_DIMENSION_VALUES);

    // Create data points for top 10
    topEntries.forEach(([dimensionValue, total]) => {
      finalChartData.push({
        [dimensionField]: dimensionValue,
        [measure]: total,
      });
    });

    // Calculate "Other" total from remaining entries
    const otherTotal = remainingEntries.reduce((sum, [, value]) => sum + value, 0);

    if (otherTotal > 0) {
      finalChartData.push({
        [dimensionField]: 'Other',
        [measure]: otherTotal,
      });
    }

    // Create series for top 10 + "Other"
    finalSeries = topEntries.map(([dimensionValue], index) => ({
      name: dimensionValue,
      color: getColorFn ? getColorFn(index) : undefined,
    }));

    if (otherTotal > 0) {
      finalSeries.push({
        name: 'Other',
        color: getColorFn ? getColorFn(MAX_PIE_CHART_DIMENSION_VALUES) : undefined,
      });
    }

    console.log(`Pie chart - Grouped ${remainingEntries.length} categories into "Other"`);
  } else {
    // Less than or equal to 10 categories - use all data
    finalChartData = chartData;
    finalSeries = uniqueDimensionValues.map((value, index) => ({
      name: value,
      color: getColorFn ? getColorFn(index) : undefined,
    }));
  }

  return {
    data: finalChartData,
    dimensionField,
    series: finalSeries,
  };
}

/**
 * NUMBER CHART TRANSFORMATION
 *
 * Handles transformation for single number/KPI displays.
 * - Aggregates measure values if multiple rows exist
 * - Returns single aggregated value
 *
 * Input: Raw data with numeric measure(s)
 * Output: Aggregated single value
 */
function numberChartTransformation(options: ChartSpecificTransformOptions): TransformationResult {
  const { chartData } = options;

  // Extract field names from first data point
  const firstPoint = chartData[0];
  const fields = Object.keys(firstPoint);

  // Find numeric fields
  const measureFields: string[] = [];
  fields.forEach(field => {
    const value = firstPoint[field];
    if (typeof value === 'number') {
      measureFields.push(field);
    }
  });

  if (measureFields.length === 0) {
    console.warn('Number chart requires at least one numeric measure');
    return { data: [] };
  }

  // Aggregate all rows for the first measure
  const measure = measureFields[0];
  const total = chartData.reduce((sum, row) => sum + (row[measure] || 0), 0);

  return {
    data: [{ value: total, label: measure }],
  };
}

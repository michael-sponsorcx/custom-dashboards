/**
 * Bar Stacked Transformation
 *
 * Handles transformation for stacked bar charts with multiple dimensions.
 * - Pivots data so first dimension becomes series (stacked segments)
 * - Second dimension becomes x-axis categories
 * - Limits both dimensions to top N values by measure total
 * - Creates series configuration for each segment
 */

import { ChartSpecificTransformOptions, TransformationResult, MAX_BAR_DIMENSION_VALUES } from '../types';
import { extractFields, selectDimension, selectMeasure } from '../core/fieldExtraction';
import { aggregateDualDimensions, pivotStackedData } from '../core/aggregation';
import { getTopDualDimensionValues } from '../core/filtering';
import { buildStackedSeriesConfig } from '../core/seriesConfig';

export function barStackedTransformation(options: ChartSpecificTransformOptions): TransformationResult {
  const {
    chartData,
    primaryColor = '#3b82f6',
    getColorFn,
    primaryDimension: userPrimaryDimension,
    secondaryDimension: userSecondaryDimension,
    selectedMeasure
  } = options;

  // 1. Extract and validate fields
  const { dimensionFields, measureFields } = extractFields(chartData);

  if (dimensionFields.length < 2 || measureFields.length !== 1) {
    console.warn('Stacked bar chart requires 2+ dimensions and exactly 1 measure');
    return { data: [] };
  }

  // 2. Select dimensions and measure
  // Primary dimension is the x-axis, secondary becomes the series (stacked segments)
  const primaryDimension = userPrimaryDimension && dimensionFields.includes(userPrimaryDimension)
    ? userPrimaryDimension
    : dimensionFields[0]; // Default to first dimension for x-axis

  const secondaryDimension = userSecondaryDimension && dimensionFields.includes(userSecondaryDimension)
    ? userSecondaryDimension
    : dimensionFields[1]; // Default to second dimension for series

  const measure = selectMeasure(measureFields, selectedMeasure);

  // 3. Aggregate both dimensions
  const { primaryTotals, secondaryTotals } = aggregateDualDimensions(
    chartData,
    primaryDimension,
    secondaryDimension,
    measure
  );

  // 4. Get top N values for both dimensions
  const { topPrimaryValues, topSecondaryValues } = getTopDualDimensionValues(
    primaryTotals,
    secondaryTotals,
    MAX_BAR_DIMENSION_VALUES,
    MAX_BAR_DIMENSION_VALUES
  );

  // 5. Pivot data
  const finalChartData = pivotStackedData(
    chartData,
    primaryDimension,
    secondaryDimension,
    measure,
    topPrimaryValues,
    topSecondaryValues
  );

  // 6. Build series configuration
  const series = buildStackedSeriesConfig(topSecondaryValues, primaryColor, getColorFn);

  return {
    data: finalChartData,
    dimensionField: primaryDimension,
    series,
  };
}

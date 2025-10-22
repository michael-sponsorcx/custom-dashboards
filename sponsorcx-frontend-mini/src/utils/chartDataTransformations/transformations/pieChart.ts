/**
 * Pie Chart Transformation
 *
 * Handles transformation for pie charts.
 * - Requires 1 dimension (category) and 1 measure (value)
 * - Limits to top 10 categories by value
 * - Groups remaining categories into "Other" slice
 * - Configures colors for each slice
 */

import { ChartSpecificTransformOptions, TransformationResult, MAX_PIE_CHART_DIMENSION_VALUES } from '../types';
import { extractFields } from '../core/fieldExtraction';
import { aggregateDimensionValues } from '../core/aggregation';
import { groupIntoOther } from '../core/filtering';
import { buildPieSeriesConfig } from '../core/seriesConfig';

export function pieChartTransformation(options: ChartSpecificTransformOptions): TransformationResult {
  const { chartData, getColorFn, maxDataPoints } = options;

  // 1. Extract fields
  const { dimensionFields, measureFields } = extractFields(chartData);

  if (dimensionFields.length === 0 || measureFields.length === 0) {
    return { data: [] };
  }

  const dimensionField = dimensionFields[0];
  const measure = measureFields[0];

  // 2. Aggregate data by dimension
  const dimensionTotals = aggregateDimensionValues(chartData, dimensionField, measure);

  // 3. Get unique dimension values count
  const uniqueDimensionValues = Object.keys(dimensionTotals);

  let finalChartData: any[] = [];
  let finalSeries: Array<{ name: string; color?: string }> = [];
  const limit = maxDataPoints ?? MAX_PIE_CHART_DIMENSION_VALUES;

  // 4. Limit to top N dimension values and group rest into "Other"
  if (uniqueDimensionValues.length > limit) {
    const { topData, otherTotal } = groupIntoOther(
      dimensionTotals,
      limit,
      dimensionField,
      measure
    );

    finalChartData = [...topData];

    // Add "Other" slice if there's a remainder
    if (otherTotal > 0) {
      finalChartData.push({
        [dimensionField]: 'Other',
        [measure]: otherTotal,
      });
    }

    // Create series for top 10 + "Other"
    const topDimensionValues = topData.map(item => item[dimensionField]);
    finalSeries = buildPieSeriesConfig(topDimensionValues, getColorFn);

    if (otherTotal > 0) {
      finalSeries.push({
        name: 'Other',
        color: getColorFn ? getColorFn(limit) : undefined,
      });
    }
  } else {
    // Less than or equal to 10 categories - use all data
    finalChartData = chartData;
    finalSeries = buildPieSeriesConfig(uniqueDimensionValues, getColorFn);
  }

  return {
    data: finalChartData,
    dimensionField,
    series: finalSeries,
  };
}

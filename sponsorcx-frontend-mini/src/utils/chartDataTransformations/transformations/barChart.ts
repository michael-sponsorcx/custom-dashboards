/**
 * Bar Chart Transformation
 *
 * Handles transformation for standard (non-stacked) bar charts.
 * - Identifies dimensions (string fields) and measures (numeric fields)
 * - Limits to top N dimension values by measure total
 * - Configures series with appropriate colors
 */

import { ChartSpecificTransformOptions, TransformationResult, MAX_BAR_DIMENSION_VALUES } from '../types';
import { extractFields, selectDimension, selectMeasure } from '../core/fieldExtraction';
import { aggregateDimensionValues, createAggregatedData } from '../core/aggregation';
import { getTopDimensionValues, filterToTopValues } from '../core/filtering';
import { buildSeriesConfig } from '../core/seriesConfig';

export function barChartTransformation(options: ChartSpecificTransformOptions): TransformationResult {
  const {
    chartData,
    primaryColor = '#3b82f6',
    getColorFn,
    primaryDimension,
    selectedMeasure,
    maxDataPoints
  } = options;

  // 1. Extract and select fields
  const { dimensionFields, measureFields } = extractFields(chartData);

  if (dimensionFields.length === 0 || measureFields.length === 0) {
    return { data: [] };
  }

  const dimensionField = selectDimension(dimensionFields, primaryDimension);
  const measure = selectMeasure(measureFields, selectedMeasure);

  // 2. Aggregate data by dimension
  const dimensionTotals = aggregateDimensionValues(chartData, dimensionField, measure);
  const aggregatedData = createAggregatedData(dimensionTotals, dimensionField, measure);

  // 3. Filter to top N dimension values if necessary
  const uniqueDimensionValues = Object.keys(dimensionTotals);
  let finalChartData = aggregatedData;
  const limit = maxDataPoints ?? MAX_BAR_DIMENSION_VALUES;

  if (uniqueDimensionValues.length > limit) {
    const topValues = getTopDimensionValues(dimensionTotals, limit);
    finalChartData = filterToTopValues(aggregatedData, dimensionField, topValues);
  }

  // 4. Build series configuration
  const series = buildSeriesConfig(measureFields, primaryColor, getColorFn);

  return {
    data: finalChartData,
    dimensionField,
    series,
  };
}

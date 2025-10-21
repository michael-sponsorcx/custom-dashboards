/**
 * Line Chart Transformation
 *
 * Handles transformation for line charts.
 * Similar to bar chart but optimized for time-series or continuous data.
 * - Preserves order of dimension values (important for time series)
 * - Limits to top 30 dimension values by measure total
 * - Configures series for line rendering
 */

import { ChartSpecificTransformOptions, TransformationResult, MAX_LINE_CHART_DIMENSION_VALUES } from '../types';
import { extractFields, selectDimension, selectMeasure } from '../core/fieldExtraction';
import { aggregateDimensionValues, createAggregatedData } from '../core/aggregation';
import { getTopDimensionValues, filterToTopValues } from '../core/filtering';
import { buildSeriesConfig } from '../core/seriesConfig';

export function lineChartTransformation(options: ChartSpecificTransformOptions): TransformationResult {
  const {
    chartData,
    primaryColor = '#3b82f6',
    getColorFn,
    primaryDimension,
    selectedMeasure
  } = options;

  // 1. Extract and select fields
  const { dimensionFields, measureFields } = extractFields(chartData);

  if (dimensionFields.length === 0 || measureFields.length === 0) {
    console.warn('Line chart requires at least one dimension and one measure');
    return { data: [] };
  }

  const dimensionField = selectDimension(dimensionFields, primaryDimension);
  const measure = selectMeasure(measureFields, selectedMeasure);

  // 2. Aggregate data by dimension
  const dimensionTotals = aggregateDimensionValues(chartData, dimensionField, measure);
  const aggregatedData = createAggregatedData(dimensionTotals, dimensionField, measure);

  // 3. Filter to top 30 dimension values if necessary
  const uniqueDimensionValues = Object.keys(dimensionTotals);
  let finalChartData = aggregatedData;

  if (uniqueDimensionValues.length > MAX_LINE_CHART_DIMENSION_VALUES) {
    const topValues = getTopDimensionValues(dimensionTotals, MAX_LINE_CHART_DIMENSION_VALUES);
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

/**
 * Area Chart Transformation
 *
 * Handles transformation for area charts.
 * Uses the same logic as line charts (just different rendering style).
 */
export function areaChartTransformation(options: ChartSpecificTransformOptions): TransformationResult {
  return lineChartTransformation(options);
}

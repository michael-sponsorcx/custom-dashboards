/**
 * Number Chart Transformation
 *
 * Handles transformation for single number/KPI displays.
 * - Aggregates measure values if multiple rows exist
 * - Returns single aggregated value
 */

import { ChartSpecificTransformOptions, TransformationResult } from '../types';
import { extractFields } from '../core/fieldExtraction';

export function kpiChartTransformation(options: ChartSpecificTransformOptions): TransformationResult {
  const { chartData } = options;

  // Extract fields
  const { measureFields } = extractFields(chartData);

  if (measureFields.length === 0) {
    return { data: [] };
  }

  // Aggregate all rows for the first measure
  const measure = measureFields[0];
  const total = chartData.reduce((sum, row) => sum + (row[measure] || 0), 0);

  return {
    data: [{ value: total, label: measure }],
  };
}

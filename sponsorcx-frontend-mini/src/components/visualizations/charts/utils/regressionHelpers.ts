import { addRegressionLineToData } from '../../../../utils/regressionCalculator';
import type { ChartSeries } from '@mantine/charts';

/**
 * Process chart data to add regression line values when enabled
 *
 * This function handles both numeric and non-numeric X-axis values:
 * - For numeric X values: uses actual values for regression calculation
 * - For non-numeric X values (dates, categories): uses index-based regression
 *
 * @param data - The chart data points
 * @param dimensionField - The field name for the X-axis dimension
 * @param seriesKey - The field name for the Y-axis values to calculate regression for
 * @param showRegressionLine - Whether to add regression line data
 * @returns Chart data with optional '_regressionLine' field added
 *
 * @example
 * // Input: data: [{x: 1, y: 10}, {x: 2, y: 20}], dimensionField: 'x', seriesKey: 'y', showRegressionLine: true
 * // Output: [{x: 1, y: 10, _regressionLine: 10.5}, {x: 2, y: 20, _regressionLine: 19.5}]
 * const data = [{x: 1, y: 10}, {x: 2, y: 20}];
 * const result = processRegressionData(data, 'x', 'y', true);
 *
 * @example
 * // Input: data with non-numeric X (dates), showRegressionLine: true
 * // Output: Data with index-based regression added
 * const data = [{date: '2024-01', sales: 100}, {date: '2024-02', sales: 150}];
 * const result = processRegressionData(data, 'date', 'sales', true);
 * // Uses index (0, 1, 2...) internally for regression calculation
 *
 * @example
 * // Input: showRegressionLine: false
 * // Output: Original data unchanged
 * const data = [{x: 1, y: 10}];
 * const result = processRegressionData(data, 'x', 'y', false);
 * // result === data (no modification)
 */
export function processRegressionData<T extends Record<string, any>>(
  data: T[],
  dimensionField: string,
  seriesKey: string,
  showRegressionLine: boolean
): T[] {
  if (!showRegressionLine || data.length === 0) {
    return data;
  }

  // Check if X values are numeric
  const firstXValue = data[0]?.[dimensionField];
  const isNumericX = typeof firstXValue === 'number';

  if (!isNumericX) {
    // For non-numeric X (dates, categories), add index-based regression
    const dataWithIndices = data.map((point, index) => ({
      ...point,
      _index: index,
    }));
    return addRegressionLineToData(dataWithIndices, '_index', seriesKey, '_regressionLine') as T[];
  }

  return addRegressionLineToData(data, dimensionField, seriesKey, '_regressionLine') as T[];
}

/**
 * Create regression line series configuration
 *
 * Returns an array containing the regression line series definition if enabled.
 * The regression line is styled with a red color and labeled "Trend Line".
 *
 * Note: Mantine ChartSeries type doesn't support strokeDasharray.
 * The line styling must be applied via chart component props if needed.
 *
 * @param showRegressionLine - Whether to include the regression line series
 * @returns Array with regression series config, or empty array if disabled
 *
 * @example
 * // Input: showRegressionLine: true
 * // Output: [{ name: '_regressionLine', color: '#FF6B6B', label: 'Trend Line' }]
 * const series = getRegressionSeries(true);
 *
 * @example
 * // Input: showRegressionLine: false
 * // Output: []
 * const series = getRegressionSeries(false);
 */
export function getRegressionSeries(showRegressionLine: boolean): ChartSeries[] {
  if (!showRegressionLine) {
    return [];
  }

  return [
    {
      name: '_regressionLine',
      color: '#FF6B6B',
      label: 'Trend Line',
    },
  ];
}

/**
 * Merge regression series with existing chart series
 *
 * This is a convenience function to append regression series to the end
 * of an existing series array when regression is enabled.
 *
 * @param existingSeries - The current chart series configurations
 * @param showRegressionLine - Whether to append regression series
 * @returns Combined series array with regression series appended if enabled
 *
 * @example
 * // Input: existingSeries: [{name: 'sales', color: '#blue'}], showRegressionLine: true
 * // Output: [{name: 'sales', color: '#blue'}, {name: '_regressionLine', ...}]
 * const series = [{name: 'sales', color: '#blue'}];
 * const result = mergeRegressionSeries(series, true);
 *
 * @example
 * // Input: showRegressionLine: false
 * // Output: Original series unchanged
 * const series = [{name: 'sales', color: '#blue'}];
 * const result = mergeRegressionSeries(series, false);
 * // result === series
 */
export function mergeRegressionSeries(
  existingSeries: ChartSeries[],
  showRegressionLine: boolean
): ChartSeries[] {
  if (!showRegressionLine) {
    return existingSeries;
  }

  return [...existingSeries, ...getRegressionSeries(true)];
}

/**
 * Filtering Utilities
 *
 * Handles top-N filtering of dimension values for chart transformations.
 * Prevents charts from becoming too cluttered with many dimension values.
 */

/**
 * Get top N dimension values sorted by their total measure value
 *
 * @param dimensionTotals - Object mapping dimension values to totals
 * @param limit - Maximum number of values to return
 * @returns Array of top N dimension values
 */
export function getTopDimensionValues(
  dimensionTotals: Record<string, number>,
  limit: number
): string[] {
  return Object.entries(dimensionTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([key]) => key);
}

/**
 * Filter data to only include rows with top dimension values
 *
 * @param data - Chart data array
 * @param dimensionField - Field to filter on
 * @param topValues - Array of dimension values to keep
 * @returns Filtered data array
 */
export function filterToTopValues(data: any[], dimensionField: string, topValues: string[]): any[] {
  const topValuesSet = new Set(topValues);
  return data.filter((row) => topValuesSet.has(String(row[dimensionField])));
}

/**
 * Filter dual dimensions to top N values for each dimension
 * Used in stacked bar charts to limit both primary and secondary dimensions
 *
 * @param primaryTotals - Primary dimension totals
 * @param secondaryTotals - Secondary dimension totals
 * @param primaryLimit - Max primary dimension values
 * @param secondaryLimit - Max secondary dimension values
 * @returns Object containing top values for both dimensions
 */
export function getTopDualDimensionValues(
  primaryTotals: Record<string, number>,
  secondaryTotals: Record<string, number>,
  primaryLimit: number,
  secondaryLimit: number
): {
  topPrimaryValues: string[];
  topSecondaryValues: string[];
} {
  const topPrimaryValues = getTopDimensionValues(primaryTotals, primaryLimit);
  const topSecondaryValues = getTopDimensionValues(secondaryTotals, secondaryLimit);

  return { topPrimaryValues, topSecondaryValues };
}

/**
 * Group remaining dimension values into "Other" category
 * Used for pie charts to prevent too many slices
 *
 * @param dimensionTotals - All dimension value totals
 * @param topN - Number of top values to keep separate
 * @param dimensionField - Dimension field name
 * @param measureField - Measure field name
 * @returns Object with top entries and "Other" total
 */
export function groupIntoOther(
  dimensionTotals: Record<string, number>,
  topN: number,
  dimensionField: string,
  measureField: string
): {
  topData: any[];
  otherTotal: number;
} {
  const sortedEntries = Object.entries(dimensionTotals).sort(([, a], [, b]) => b - a);
  const topEntries = sortedEntries.slice(0, topN);
  const remainingEntries = sortedEntries.slice(topN);

  // Create data points for top N
  const topData = topEntries.map(([dimensionValue, total]) => ({
    [dimensionField]: dimensionValue,
    [measureField]: total,
  }));

  // Calculate "Other" total
  const otherTotal = remainingEntries.reduce((sum, [, value]) => sum + value, 0);

  return { topData, otherTotal };
}

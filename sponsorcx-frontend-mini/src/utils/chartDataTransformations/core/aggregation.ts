/**
 * Aggregation Utilities
 *
 * Handles data aggregation patterns for chart transformations.
 * Includes single and dual dimension aggregation logic.
 */

/**
 * Calculate total measure value for each unique dimension value
 *
 * @param data - Chart data array
 * @param dimensionField - Field to group by
 * @param measureField - Field to sum
 * @returns Object mapping dimension values to their totals
 */
export function aggregateDimensionValues(
  data: any[],
  dimensionField: string,
  measureField: string
): Record<string, number> {
  const dimensionValueTotals: Record<string, number> = {};

  data.forEach((row) => {
    const dimensionValue = String(row[dimensionField]); // Convert to string for consistent key handling
    const measureValue = row[measureField];
    dimensionValueTotals[dimensionValue] =
      (dimensionValueTotals[dimensionValue] || 0) + measureValue;
  });

  return dimensionValueTotals;
}

/**
 * Create aggregated data points (one per unique dimension value)
 *
 * @param dimensionTotals - Pre-calculated dimension totals
 * @param dimensionField - Dimension field name
 * @param measureField - Measure field name
 * @returns Array of aggregated data points
 */
export function createAggregatedData(
  dimensionTotals: Record<string, number>,
  dimensionField: string,
  measureField: string
): any[] {
  return Object.entries(dimensionTotals).map(([dimensionValue, total]) => ({
    [dimensionField]: dimensionValue,
    [measureField]: total,
  }));
}

/**
 * Aggregate data for dual dimensions (used in stacked charts)
 *
 * @param data - Chart data array
 * @param primaryDimension - Primary dimension field
 * @param secondaryDimension - Secondary dimension field
 * @param measure - Measure field
 * @returns Object containing totals for both dimensions
 */
export function aggregateDualDimensions(
  data: any[],
  primaryDimension: string,
  secondaryDimension: string,
  measure: string
): {
  primaryTotals: Record<string, number>;
  secondaryTotals: Record<string, number>;
} {
  const primaryTotals: Record<string, number> = {};
  const secondaryTotals: Record<string, number> = {};

  data.forEach((row) => {
    const primaryValue = row[primaryDimension];
    const secondaryValue = row[secondaryDimension];
    const measureValue = row[measure];

    primaryTotals[primaryValue] = (primaryTotals[primaryValue] || 0) + measureValue;
    secondaryTotals[secondaryValue] = (secondaryTotals[secondaryValue] || 0) + measureValue;
  });

  return { primaryTotals, secondaryTotals };
}

/**
 * Pivot data for stacked charts
 * Groups by primary dimension and pivots secondary dimension into columns
 *
 * @param data - Chart data array
 * @param primaryDimension - Dimension for x-axis
 * @param secondaryDimension - Dimension for series (stacked segments)
 * @param measure - Measure field
 * @param topPrimaryValues - Filter to only these primary values
 * @param topSecondaryValues - Filter to only these secondary values
 * @returns Pivoted data array
 */
export function pivotStackedData(
  data: any[],
  primaryDimension: string,
  secondaryDimension: string,
  measure: string,
  topPrimaryValues: string[],
  topSecondaryValues: string[]
): any[] {
  const topPrimarySet = new Set(topPrimaryValues);
  const topSecondarySet = new Set(topSecondaryValues);

  // Group data by primary dimension and pivot secondary dimension
  const pivotedData: Record<string, any> = {};

  data.forEach((row) => {
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

  return Object.values(pivotedData);
}

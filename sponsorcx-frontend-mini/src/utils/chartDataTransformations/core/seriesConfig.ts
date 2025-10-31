/**
 * Series Configuration Utilities
 *
 * Handles creation of series configuration for different chart types.
 * Manages color assignment and series naming.
 */

/**
 * Build series configuration for charts with measure-based series
 * Used for bar charts, line charts, area charts
 *
 * @param measureFields - Array of measure field names
 * @param primaryColor - Primary color to use for single series
 * @param getColorFn - Function to get color by index for multiple series
 * @returns Array of series configuration objects
 */
export function buildSeriesConfig(
  measureFields: string[],
  primaryColor = '#3b82f6',
  getColorFn?: (index: number) => string
): Array<{ name: string; color?: string }> {
  return measureFields.map((field, index) => ({
    name: field,
    color: measureFields.length === 1 ? primaryColor : getColorFn ? getColorFn(index) : undefined,
  }));
}

/**
 * Build series configuration for stacked charts
 * Series are based on dimension values (secondary dimension)
 *
 * @param dimensionValues - Array of dimension values that become series
 * @param primaryColor - Primary color to use for single series
 * @param getColorFn - Function to get color by index for multiple series
 * @returns Array of series configuration objects
 */
export function buildStackedSeriesConfig(
  dimensionValues: string[],
  primaryColor = '#3b82f6',
  getColorFn?: (index: number) => string
): Array<{ name: string; color?: string }> {
  return dimensionValues.map((value, index) => ({
    name: value,
    color: dimensionValues.length === 1 ? primaryColor : getColorFn ? getColorFn(index) : undefined,
  }));
}

/**
 * Build series configuration for pie charts
 * Each pie slice is a series with its own color
 *
 * @param dimensionValues - Array of dimension values (pie slice names)
 * @param getColorFn - Function to get color by index
 * @returns Array of series configuration objects
 */
export function buildPieSeriesConfig(
  dimensionValues: string[],
  getColorFn?: (index: number) => string
): Array<{ name: string; color?: string }> {
  return dimensionValues.map((value, index) => ({
    name: value,
    color: getColorFn ? getColorFn(index) : undefined,
  }));
}

/**
 * Chart Color Palette
 *
 * A carefully selected set of 15 distinct colors optimized for data visualization.
 * Colors are chosen for:
 * - Maximum distinguishability
 * - Accessibility (colorblind-friendly where possible)
 * - Professional appearance
 *
 * Inspired by Tableau 10 and other professional data visualization palettes
 */

export const CHART_COLORS = [
  '#4E79A7', // Blue
  '#F28E2C', // Orange
  '#E15759', // Red
  '#76B7B2', // Teal
  '#59A14F', // Green
  '#EDC949', // Yellow
  '#AF7AA1', // Purple
  '#FF9DA7', // Pink
  '#9C755F', // Brown
  '#BAB0AB', // Gray
  '#1F77B4', // Deep Blue
  '#FF7F0E', // Bright Orange
  '#2CA02C', // Lime Green
  '#D62728', // Crimson
  '#9467BD', // Violet
] as const;

/**
 * Get a color from the palette by index
 * Cycles through colors if index exceeds palette size
 */
export function getChartColor(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length];
}

/**
 * Get multiple colors from the palette
 */
export function getChartColors(count: number): string[] {
  return Array.from({ length: count }, (_, i) => getChartColor(i));
}

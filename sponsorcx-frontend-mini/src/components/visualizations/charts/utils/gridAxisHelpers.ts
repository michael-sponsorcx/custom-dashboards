/**
 * Grid axis configuration utilities for Mantine/Recharts charts
 *
 * Note: In Mantine/Recharts, gridAxis refers to which axis the gridlines extend FROM:
 * - 'x' means horizontal gridlines extending from X-axis (visually these are Y-axis gridlines)
 * - 'y' means vertical gridlines extending from Y-axis (visually these are X-axis gridlines)
 * - 'xy' means both horizontal and vertical gridlines
 * - 'none' means no gridlines
 */

export type GridAxisValue = 'x' | 'y' | 'xy' | 'none';

export interface GridProps {
  strokeDasharray: string;
  stroke: string;
}

/**
 * Calculate the appropriate grid axis value based on user's gridline preferences
 *
 * @param showXAxisGridLines - Whether to show vertical gridlines (user perspective)
 * @param showYAxisGridLines - Whether to show horizontal gridlines (user perspective)
 * @returns The gridAxis value for Mantine/Recharts
 *
 * @example
 * // Input: showXAxisGridLines: true, showYAxisGridLines: true
 * // Output: 'xy'
 * getGridAxisValue(true, true);
 *
 * @example
 * // Input: showXAxisGridLines: true, showYAxisGridLines: false
 * // Output: 'y' (shows vertical gridlines only)
 * getGridAxisValue(true, false);
 *
 * @example
 * // Input: showXAxisGridLines: false, showYAxisGridLines: true
 * // Output: 'x' (shows horizontal gridlines only)
 * getGridAxisValue(false, true);
 *
 * @example
 * // Input: showXAxisGridLines: false, showYAxisGridLines: false
 * // Output: 'none'
 * getGridAxisValue(false, false);
 */
export function getGridAxisValue(
  showXAxisGridLines: boolean,
  showYAxisGridLines: boolean
): GridAxisValue {
  const showX = showXAxisGridLines; // User wants vertical gridlines
  const showY = showYAxisGridLines; // User wants horizontal gridlines

  if (showX && showY) {
    return 'xy';
  } else if (showX) {
    return 'y'; // Vertical gridlines = gridAxis 'y'
  } else if (showY) {
    return 'x'; // Horizontal gridlines = gridAxis 'x'
  } else {
    return 'none';
  }
}

/**
 * Generate grid styling props for Mantine/Recharts charts
 * Returns undefined if no gridlines should be shown
 *
 * @param gridAxis - The grid axis configuration value
 * @returns Grid props object or undefined if gridAxis is 'none'
 *
 * @example
 * // Input: gridAxis: 'xy'
 * // Output: { strokeDasharray: '3 3', stroke: 'var(--mantine-color-gray-3)' }
 * getGridProps('xy');
 *
 * @example
 * // Input: gridAxis: 'x'
 * // Output: { strokeDasharray: '3 3', stroke: 'var(--mantine-color-gray-3)' }
 * getGridProps('x');
 *
 * @example
 * // Input: gridAxis: 'none'
 * // Output: undefined
 * getGridProps('none');
 */
export function getGridProps(gridAxis: GridAxisValue): GridProps | undefined {
  if (gridAxis === 'none') {
    return undefined;
  }

  return {
    strokeDasharray: '3 3',
    stroke: 'var(--mantine-color-gray-3)',
  };
}

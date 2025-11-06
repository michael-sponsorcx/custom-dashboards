import type { LegendPosition } from '../../../../types/graph';

/**
 * Legend props configuration for Mantine/Recharts charts
 */
export interface LegendPropsConfig {
  verticalAlign: 'top' | 'bottom';
  height: number;
}

/**
 * Maps legend position to Recharts legend props configuration
 *
 * Follows Mantine docs style: legendProps={{ verticalAlign: 'bottom', height: 50 }}
 * Returns null for 'none' position (legend won't be shown).
 *
 * @param legendPosition - The desired legend position ('top', 'bottom', or 'none')
 * @returns Legend props object or null if position is 'none'
 *
 * @example
 * // Input: legendPosition: 'top'
 * // Output: { verticalAlign: 'top', height: 50 }
 * const props = getLegendProps('top');
 *
 * @example
 * // Input: legendPosition: 'bottom'
 * // Output: { verticalAlign: 'bottom', height: 50 }
 * const props = getLegendProps('bottom');
 *
 * @example
 * // Input: legendPosition: 'none'
 * // Output: null (legend won't show)
 * const props = getLegendProps('none');
 */
export function getLegendProps(legendPosition: LegendPosition = 'bottom'): LegendPropsConfig | null {
  switch (legendPosition) {
    case 'top':
      return { verticalAlign: 'top' as const, height: 50 };
    case 'bottom':
      return { verticalAlign: 'bottom' as const, height: 50 };
    case 'none':
      return null;
    default:
      return { verticalAlign: 'bottom' as const, height: 50 };
  }
}

/**
 * Determines if the legend should be displayed based on position setting
 *
 * @param legendPosition - The legend position setting
 * @returns True if legend should be shown, false if 'none'
 *
 * @example
 * // Input: legendPosition: 'top'
 * // Output: true
 * shouldShowLegend('top');
 *
 * @example
 * // Input: legendPosition: 'none'
 * // Output: false
 * shouldShowLegend('none');
 */
export function shouldShowLegend(legendPosition: LegendPosition = 'bottom'): boolean {
  return legendPosition !== 'none';
}

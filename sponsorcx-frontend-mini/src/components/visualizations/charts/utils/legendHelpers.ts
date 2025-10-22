import type { LegendPosition } from '../../../../types/graph';

/**
 * Maps legend position to Recharts legend props
 * Follows Mantine docs style: legendProps={{ verticalAlign: 'bottom', height: 50 }}
 * Returns null for 'none' to indicate legend should be hidden
 */
export function getLegendProps(legendPosition: LegendPosition = 'bottom') {
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
 * Helper to determine if legend should be shown
 */
export function shouldShowLegend(legendPosition: LegendPosition = 'bottom'): boolean {
  return legendPosition !== 'none';
}

import type { LegendPosition } from '../../../../types/graph';

/**
 * Maps legend position to Recharts legend props
 * Follows Mantine docs style: legendProps={{ verticalAlign: 'bottom', height: 50 }}
 */
export function getLegendProps(legendPosition: LegendPosition = 'bottom') {
  switch (legendPosition) {
    case 'top':
      return { verticalAlign: 'top' as const, height: 50 };
    case 'bottom':
      return { verticalAlign: 'bottom' as const, height: 50 };
    default:
      return { verticalAlign: 'bottom' as const, height: 50 };
  }
}

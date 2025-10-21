import type { LegendPosition } from '../../../create_graph/types';

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
    case 'left':
      return { verticalAlign: 'middle' as const, width: 120, layout: 'vertical' as const, align: 'left' as const };
    case 'right':
      return { verticalAlign: 'middle' as const, width: 120, layout: 'vertical' as const, align: 'right' as const };
    default:
      return { verticalAlign: 'bottom' as const, height: 50 };
  }
}

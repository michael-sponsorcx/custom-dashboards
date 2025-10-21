/**
 * Number formatting utilities for charts and visualizations
 */

export type NumberFormatType = 'currency' | 'percentage' | 'number' | 'abbreviated';

/**
 * Formats a number based on the specified format type
 * @param value - The number to format
 * @param formatType - The format type to use
 * @param precision - Number of decimal places (default: 2)
 * @returns Formatted string representation of the number
 */
export function formatNumber(value: number, formatType: NumberFormatType = 'number', precision: number = 2): string {
  switch (formatType) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      }).format(value);

    case 'percentage':
      return `${value.toFixed(precision)}%`;

    case 'abbreviated':
      // Abbreviate large numbers (e.g., 1.2M, 3.4B)
      const absValue = Math.abs(value);
      if (absValue >= 1_000_000_000) {
        return `${(value / 1_000_000_000).toFixed(precision)}B`;
      } else if (absValue >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(precision)}M`;
      } else if (absValue >= 1_000) {
        return `${(value / 1_000).toFixed(precision)}K`;
      }
      return value.toFixed(precision);

    case 'number':
    default:
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      }).format(value);
  }
}

/**
 * Creates a value formatter function for Mantine charts
 * @param formatType - The format type to use
 * @param precision - Number of decimal places (default: 2)
 * @returns A function that formats numbers for chart tooltips and labels
 */
export function createChartValueFormatter(
  formatType: NumberFormatType = 'number',
  precision: number = 2
): (value: number) => string {
  return (value: number) => formatNumber(value, formatType, precision);
}

/**
 * Creates an axis tick formatter that automatically abbreviates large numbers
 * to keep them at 4 digits maximum
 * @param formatType - The base format type to use
 * @returns A function that formats numbers for axis ticks with smart abbreviation
 */
export function createAxisTickFormatter(
  formatType: NumberFormatType = 'number'
): (value: number) => string {
  return (value: number) => {
    const absValue = Math.abs(value);

    // For currency, add $ prefix and abbreviate
    if (formatType === 'currency') {
      if (absValue >= 1_000_000_000) {
        return `$${(value / 1_000_000_000).toFixed(1)}B`;
      } else if (absValue >= 1_000_000) {
        return `$${(value / 1_000_000).toFixed(1)}M`;
      } else if (absValue >= 10_000) {
        return `$${(value / 1_000).toFixed(1)}K`;
      } else if (absValue >= 1_000) {
        return `$${(value / 1_000).toFixed(0)}K`;
      }
      return `$${value.toFixed(0)}`;
    }

    // For percentage, keep it simple
    if (formatType === 'percentage') {
      return `${value.toFixed(0)}%`;
    }

    // For numbers and abbreviated, use smart abbreviation
    if (absValue >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toFixed(1)}B`;
    } else if (absValue >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M`;
    } else if (absValue >= 10_000) {
      return `${(value / 1_000).toFixed(1)}K`;
    } else if (absValue >= 1_000) {
      return `${(value / 1_000).toFixed(0)}K`;
    }

    return value.toFixed(0);
  };
}

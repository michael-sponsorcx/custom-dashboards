/**
 * Number formatting utilities for charts and visualizations
 */

export type NumberFormatType = 'currency' | 'percentage' | 'number' | 'abbreviated';

/**
 * Formats a number based on the specified format type
 * @param value - The number to format (strings are coerced to numbers)
 * @param formatType - The format type to use
 * @param precision - Number of decimal places (default: 2)
 * @returns Formatted string representation of the number
 */
export function formatNumber(
  value: unknown,
  formatType: NumberFormatType = 'number',
  precision = 2
): string {
  const num = typeof value === 'string' ? parseFloat(value) : Number(value);

  if (isNaN(num)) {
    return String(value);
  }

  switch (formatType) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      }).format(num);

    case 'percentage':
      return `${num.toFixed(precision)}%`;

    case 'abbreviated': {
      const absValue = Math.abs(num);
      if (absValue >= 1_000_000_000) {
        return `${(num / 1_000_000_000).toFixed(precision)}B`;
      } else if (absValue >= 1_000_000) {
        return `${(num / 1_000_000).toFixed(precision)}M`;
      } else if (absValue >= 1_000) {
        return `${(num / 1_000).toFixed(precision)}K`;
      }
      return num.toFixed(precision);
    }

    case 'number':
    default:
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      }).format(num);
  }
}

/**
 * Abbreviates large numbers to keep them concise (e.g., 1.2M, 3.4B)
 * @param value - The number to abbreviate
 * @param formatType - The format type to use
 * @param precision - Number of decimal places (default: 1 for abbreviations)
 * @returns Abbreviated string representation of the number
 */
function abbreviateNumber(
  value: number,
  formatType: NumberFormatType = 'number',
  precision = 1
): string {
  // Handle non-numeric values (e.g., category labels)
  if (typeof value !== 'number' || isNaN(value)) {
    return String(value);
  }

  const absValue = Math.abs(value);

  // For currency, add $ prefix and abbreviate
  if (formatType === 'currency') {
    if (absValue >= 1_000_000_000) {
      return `$${(value / 1_000_000_000).toFixed(precision)}B`;
    } else if (absValue >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(precision)}M`;
    } else if (absValue >= 10_000) {
      return `$${(value / 1_000).toFixed(precision)}K`;
    } else if (absValue >= 1_000) {
      return `$${(value / 1_000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
  }

  // For percentage, keep it simple
  if (formatType === 'percentage') {
    return `${value.toFixed(precision)}%`;
  }

  // For numbers and abbreviated, use smart abbreviation
  if (absValue >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(precision)}B`;
  } else if (absValue >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(precision)}M`;
  } else if (absValue >= 10_000) {
    return `${(value / 1_000).toFixed(precision)}K`;
  } else if (absValue >= 1_000) {
    return `${(value / 1_000).toFixed(0)}K`;
  }

  return value.toFixed(0);
}

/**
 * Creates a value formatter function for Mantine charts (tooltips and bar labels)
 * Uses abbreviated formatting for consistency with axis ticks
 * @param formatType - The format type to use
 * @param precision - Number of decimal places (default: 1)
 * @returns A function that formats numbers for chart tooltips and labels
 */
export function createChartValueFormatter(
  formatType: NumberFormatType = 'number',
  precision = 1
): (value: number) => string {
  return (value: number) => abbreviateNumber(value, formatType, precision);
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
  return (value: number) => abbreviateNumber(value, formatType, 1);
}

import {
  createChartValueFormatter,
  createAxisTickFormatter,
  type NumberFormatType,
} from '../../../../utils/numberFormatter';

/**
 * Chart formatters bundle containing both value and axis formatters
 */
export interface ChartFormatters {
  /** Formatter for chart tooltips and values - shows full precision */
  valueFormatter: (value: number) => string;
  /** Formatter for axis ticks - abbreviated for large numbers */
  axisTickFormatter: (value: number) => string;
}

/**
 * Create both value and axis formatters for a chart in one call
 *
 * This is a convenience function that bundles the two most commonly used
 * formatters together to reduce boilerplate in chart components.
 *
 * @param numberFormat - The format type (e.g., 'number', 'currency', 'percentage')
 * @param numberPrecision - Number of decimal places to show
 * @returns Object containing both valueFormatter and axisTickFormatter
 *
 * @example
 * // Input: numberFormat: 'currency', numberPrecision: 2
 * // Output: { valueFormatter: Function, axisTickFormatter: Function }
 * const formatters = createChartFormatters('currency', 2);
 * formatters.valueFormatter(1234.56); // '$1,234.56'
 * formatters.axisTickFormatter(1234.56); // '$1.2K'
 *
 * @example
 * // Input: numberFormat: 'percentage', numberPrecision: 1
 * // Output: { valueFormatter: Function, axisTickFormatter: Function }
 * const formatters = createChartFormatters('percentage', 1);
 * formatters.valueFormatter(0.456); // '45.6%'
 * formatters.axisTickFormatter(0.456); // '45.6%'
 *
 * @example
 * // Input: numberFormat: 'number', numberPrecision: 0
 * // Output: { valueFormatter: Function, axisTickFormatter: Function }
 * const formatters = createChartFormatters('number', 0);
 * formatters.valueFormatter(1234567); // '1,234,567'
 * formatters.axisTickFormatter(1234567); // '1.2M'
 */
export function createChartFormatters(
  numberFormat: NumberFormatType = 'number',
  numberPrecision = 2
): ChartFormatters {
  return {
    valueFormatter: createChartValueFormatter(numberFormat, numberPrecision),
    axisTickFormatter: createAxisTickFormatter(numberFormat),
  };
}

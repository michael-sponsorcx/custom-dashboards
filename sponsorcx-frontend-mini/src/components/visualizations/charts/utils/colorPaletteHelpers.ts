import { getChartColor } from '../../../../constants/chartColors';
import { createPaletteColorFunction, type ColorPalette } from '../../../../constants/colorPalettes';

/**
 * Color function type that takes an index and returns a color string
 */
export type ColorFunction = (index: number) => string;

/**
 * Create a color function based on the selected color palette
 *
 * For 'custom' palette, returns the default chart color function
 * For named palettes (e.g., 'hubspot-orange'), returns the palette-specific function
 *
 * @param colorPalette - The palette identifier ('custom' or a named palette)
 * @returns A function that takes an index and returns a color string
 *
 * @example
 * // Input: colorPalette: 'custom'
 * // Output: getChartColor function
 * const colorFn = createChartColorFunction('custom');
 * colorFn(0); // Returns first color from default chart colors
 *
 * @example
 * // Input: colorPalette: 'hubspot-orange'
 * // Output: Function returning colors from HubSpot orange palette
 * const colorFn = createChartColorFunction('hubspot-orange');
 * colorFn(0); // Returns first color from HubSpot orange palette
 *
 * @example
 * // Input: colorPalette: 'ocean-blue'
 * // Output: Function returning colors from ocean blue palette
 * const colorFn = createChartColorFunction('ocean-blue');
 * colorFn(2); // Returns third color from ocean blue palette
 */
export function createChartColorFunction(colorPalette: ColorPalette): ColorFunction {
  return colorPalette === 'custom' ? getChartColor : createPaletteColorFunction(colorPalette);
}

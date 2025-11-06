/**
 * Color Palette System - HubSpot Inspired
 *
 * Professional color palettes optimized for data visualization
 * Based on HubSpot's design system with accessibility and distinguishability in mind
 */

export type ColorPalette =
  | 'hubspot-orange'
  | 'professional'
  | 'vibrant'
  | 'cool'
  | 'warm'
  | 'green'
  | 'purple'
  | 'monochrome'
  | 'professionalMinimalist'
  | 'vibrantDynamic'
  | 'accessibleCalming'
  | 'custom';

export interface PaletteDefinition {
  name: string;
  colors: string[]; // Full palette (8 colors)
  preview: string[]; // Preview colors (5 colors for UI display)
}

export const COLOR_PALETTES: Record<Exclude<ColorPalette, 'custom'>, PaletteDefinition> = {
  'hubspot-orange': {
    name: 'HubSpot Orange',
    colors: [
      '#FF7A59',
      '#FF8F73',
      '#FFA38C',
      '#FFB8A6',
      '#FFCDBF',
      '#FFE2D8',
      '#FFF1EC',
      '#FFF8F5',
    ],
    preview: ['#FF7A59', '#FF8F73', '#FFA38C', '#FFB8A6', '#FFCDBF'],
  },
  professional: {
    name: 'Professional',
    colors: [
      '#0091AE',
      '#1AA0BA',
      '#33A1B8',
      '#4DB2C6',
      '#66B2C2',
      '#80C2CE',
      '#99C2CC',
      '#B3D2D9',
    ],
    preview: ['#0091AE', '#33A1B8', '#66B2C2', '#99C2CC', '#B3D2D9'],
  },
  vibrant: {
    name: 'Vibrant',
    colors: [
      '#FF7A59',
      '#F2547D',
      '#E03E9E',
      '#C95DD8',
      '#9B7FF5',
      '#7C98F5',
      '#00BFB3',
      '#00B3A4',
    ],
    preview: ['#FF7A59', '#F2547D', '#C95DD8', '#7C98F5', '#00B3A4'],
  },
  cool: {
    name: 'Cool',
    colors: [
      '#0091AE',
      '#33A1B8',
      '#5DBCD2',
      '#7CC8DE',
      '#99D6E8',
      '#B3E0EE',
      '#CCE9F4',
      '#E6F4FA',
    ],
    preview: ['#0091AE', '#33A1B8', '#5DBCD2', '#7CC8DE', '#99D6E8'],
  },
  warm: {
    name: 'Warm',
    colors: [
      '#FF7A59',
      '#FF9270',
      '#FFAA87',
      '#FFC29E',
      '#FFD9B5',
      '#FFE7CC',
      '#FFF3E3',
      '#FFF9F0',
    ],
    preview: ['#FF7A59', '#FF9270', '#FFAA87', '#FFC29E', '#FFD9B5'],
  },
  green: {
    name: 'Green',
    colors: [
      '#00A86B',
      '#26B580',
      '#33BA8A',
      '#59C79F',
      '#66CBA9',
      '#8CD9BD',
      '#99DDC8',
      '#B3E7D6',
    ],
    preview: ['#00A86B', '#33BA8A', '#66CBA9', '#99DDC8', '#B3E7D6'],
  },
  purple: {
    name: 'Purple',
    colors: [
      '#7C98F5',
      '#8DA5F7',
      '#96ACF7',
      '#A7B9F9',
      '#B0C0F9',
      '#C1CEFB',
      '#CAD4FB',
      '#DBE2FD',
    ],
    preview: ['#7C98F5', '#96ACF7', '#B0C0F9', '#CAD4FB', '#DBE2FD'],
  },
  monochrome: {
    name: 'Monochrome',
    colors: [
      '#2D3E50',
      '#425568',
      '#516F90',
      '#6586A8',
      '#7594B0',
      '#8AA8C8',
      '#99B9D0',
      '#ADC9E8',
    ],
    preview: ['#2D3E50', '#516F90', '#7594B0', '#99B9D0', '#ADC9E8'],
  },
  "professionalMinimalist": {
    "name": "Professional & Minimalist",
    "colors": [
      "#F4F4F8",
      "#202020",
      "#7E909A",
      "#0091D5",
      "#F39C12",
      "#E74C3C"
    ],
    "preview": ["#F4F4F8", "#202020", "#0091D5", "#F39C12", "#E74C3C"]
  },
  "vibrantDynamic": {
    "name": "Vibrant & Dynamic (Dark Theme)",
    "colors": [
      "#1E1F26",
      "#FFFFFF",
      "#0E9AA7",
      "#F6CD61",
      "#FE8A71",
      "#7ccc63"
    ],
    "preview": ["#1E1F26", "#FFFFFF", "#0E9AA7", "#F6CD61", "#FE8A71"]
  },
  "accessibleCalming": {
    "name": "Accessible & Calming",
    "colors": [
      "#FFFFFF",
      "#011F4B",
      "#03396C",
      "#005B96",
      "#6497B1",
      "#B3CDE0",
      "#EB5757"
    ],
    "preview": ["#FFFFFF", "#011F4B", "#005B96", "#6497B1", "#B3CDE0"]
  },
};

/**
 * Get all colors from a palette
 */
export function getPaletteColors(paletteName: ColorPalette): string[] {
  if (paletteName === 'custom') {
    return [];
  }
  return COLOR_PALETTES[paletteName].colors;
}

/**
 * Get a specific color from a palette by index
 * Cycles through colors if index exceeds palette size
 */
export function getPaletteColor(paletteName: ColorPalette, index: number): string {
  const colors = getPaletteColors(paletteName);
  if (colors.length === 0) {
    // Fallback for custom palette - should not reach here
    return '#3b82f6';
  }
  return colors[index % colors.length];
}

/**
 * Get preview colors for UI display (5 colors)
 */
export function getPalettePreview(paletteName: ColorPalette): string[] {
  if (paletteName === 'custom') {
    return [];
  }
  return COLOR_PALETTES[paletteName].preview;
}

/**
 * Get palette name for display
 */
export function getPaletteName(paletteName: ColorPalette): string {
  if (paletteName === 'custom') {
    return 'Custom';
  }
  return COLOR_PALETTES[paletteName].name;
}

/**
 * Get first color from palette (used for single-series charts)
 */
export function getPalettePrimaryColor(paletteName: ColorPalette): string {
  if (paletteName === 'custom') {
    return '#3b82f6'; // Default fallback
  }
  return COLOR_PALETTES[paletteName].colors[0];
}

/**
 * Get all available palette keys
 */
export function getAllPalettes(): ColorPalette[] {
  return [
    ...(Object.keys(COLOR_PALETTES) as ColorPalette[]),
    'custom',
  ];
}

/**
 * Create a color function from a palette
 * Returns a function that gets colors by index, cycling through the palette
 *
 * @param paletteName - The palette to use
 * @returns Function that takes an index and returns a color
 */
export function createPaletteColorFunction(paletteName: ColorPalette): (index: number) => string {
  return (index: number) => getPaletteColor(paletteName, index);
}

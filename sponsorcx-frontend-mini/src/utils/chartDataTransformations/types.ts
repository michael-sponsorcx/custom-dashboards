/**
 * Shared types for chart data transformations
 */

export type ChartType = 'bar' | 'bar_stacked' | 'line' | 'area' | 'pie' | 'number';

export interface TransformationResult {
  data: any[];
  dimensionField?: string;
  series?: Array<{ name: string; color?: string }>;
}

export interface TransformChartDataOptions {
  chartType: ChartType;
  cubeData: any; // Raw Cube GraphQL response
  primaryColor?: string;
  getColorFn?: (index: number) => string;
  // User-selected fields (optional - will auto-detect if not provided)
  primaryDimension?: string;
  secondaryDimension?: string;
  selectedMeasure?: string;
}

export interface ChartSpecificTransformOptions {
  chartData: any[];
  primaryColor?: string;
  getColorFn?: (index: number) => string;
  // User-selected fields (optional - will auto-detect if not provided)
  primaryDimension?: string;
  secondaryDimension?: string;
  selectedMeasure?: string;
}

export interface FieldStructure {
  dimensionFields: string[];
  measureFields: string[];
}

export const MAX_BAR_DIMENSION_VALUES = 10;
export const MAX_LINE_CHART_DIMENSION_VALUES = 30;
export const MAX_PIE_CHART_DIMENSION_VALUES = 10;

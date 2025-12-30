/**
 * Shared types for chart data transformations
 */

export type ChartType = 'bar' | 'bar_stacked' | 'line' | 'area' | 'pie' | 'kpi' | 'table';

export type ChartDataPoint = Record<string, string | number>;

export interface TransformationResult {
  data: ChartDataPoint[];
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
  // Data point limit (optional - falls back to chart-specific defaults)
  maxDataPoints?: number;
}

export interface ChartSpecificTransformOptions {
  chartData: ChartDataPoint[];
  primaryColor?: string;
  getColorFn?: (index: number) => string;
  // User-selected fields (optional - will auto-detect if not provided)
  primaryDimension?: string;
  secondaryDimension?: string;
  selectedMeasure?: string;
  // Data point limit (optional - falls back to chart-specific defaults)
  maxDataPoints?: number;
}

export interface FieldStructure {
  dimensionFields: string[];
  measureFields: string[];
}

export const MAX_BAR_DIMENSION_VALUES = 10;
export const MAX_LINE_CHART_DIMENSION_VALUES = 30;
export const MAX_PIE_CHART_DIMENSION_VALUES = 10;

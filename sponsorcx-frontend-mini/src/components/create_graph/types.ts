/**
 * Shared types for CreateGraph component and its hooks
 */

import { CubeMeasureUI, CubeDimensionUI } from '../../types/cube';
import { ChartType } from '../../types/backend-graphql';
import { SortOrder } from './settings/OrderByControl';
import type { LegendPosition, NumberFormat } from '../../types/backend-graphql';
import type { ColorPalette } from '../../types/backend-graphql';

/**
 * View fields structure
 */
export interface ViewFields {
  measures: CubeMeasureUI[];
  dimensions: CubeDimensionUI[];
  dates: CubeDimensionUI[];
}

/**
 * Chart configuration settings
 */
export interface ChartConfig {
  chartType: ChartType | null;
  chartTitle: string;
  numberFormat: NumberFormat;
  numberPrecision: number;
  colorPalette: ColorPalette;
  primaryColor: string;
  sortOrder: SortOrder;
  legendPosition?: LegendPosition;
  // KPI specific
  kpiValue?: number;
  kpiLabel?: string;
  kpiSecondaryValue?: number;
  kpiSecondaryLabel?: string;
  kpiShowTrend?: boolean;
  kpiTrendPercentage?: number;
  primaryDimension?: string;
  secondaryDimension?: string;
  selectedMeasure?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  showXAxisGridLines?: boolean;
  showYAxisGridLines?: boolean;
  showRegressionLine?: boolean;
  maxDataPoints?: number;
}

/**
 * Field selections state
 */
export interface FieldSelections {
  measures: Set<string>;
  dimensions: Set<string>;
  dates: Set<string>;
}

/**
 * Filter field information
 */
export interface FilterFieldInfo {
  fieldName: string;
  fieldTitle: string;
  fieldType: 'measure' | 'dimension' | 'date';
}

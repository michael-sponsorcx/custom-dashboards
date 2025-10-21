/**
 * Shared types for CreateGraph component and its hooks
 */

import { CubeMeasure, CubeDimension } from '../../types/cube';
import { ChartType } from '../../utils/chartDataAnalyzer';
import { SortOrder } from './settings/OrderByControl';
import type { LegendPosition } from '../../types/graph';
import type { ColorPalette } from '../../constants/colorPalettes';

/**
 * View fields structure
 */
export interface ViewFields {
  measures: CubeMeasure[];
  dimensions: CubeDimension[];
  dates: CubeDimension[];
}

/**
 * Chart configuration settings
 */
export interface ChartConfig {
  chartType: ChartType | null;
  chartTitle: string;
  numberFormat: 'currency' | 'percentage' | 'number' | 'abbreviated';
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
  showGridLines?: boolean;
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

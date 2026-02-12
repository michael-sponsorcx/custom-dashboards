/**
 * Graph Input Mapper
 *
 * Converts frontend GraphUI format to backend GraphQL GraphInput format.
 * Since generated enums now use the same lowercase values as the frontend,
 * no enum conversion is needed — values pass through directly.
 */

import type { GraphInput } from '../../../types/backend-graphql';
import type { GraphUI } from '../../../types/graph';

/**
 * Convert GraphUI to GraphInput for mutations
 */
export const toGraphInput = (
  template: Omit<GraphUI, 'id' | 'createdAt' | 'updatedAt'>
): GraphInput => ({
  name: template.name,
  viewName: template.viewName,
  chartType: template.chartType,
  chartTitle: template.chartTitle,
  measures: template.measures,
  dimensions: template.dimensions,
  dates: template.dates,
  filters: template.filters as unknown as Record<string, unknown>,
  orderByField: template.orderByField,
  orderByDirection: template.orderByDirection,
  numberFormat: template.numberFormat,
  numberPrecision: template.numberPrecision,
  colorPalette: template.colorPalette,
  primaryColor: template.primaryColor,
  sortOrder: template.sortOrder,
  legendPosition: template.legendPosition,
  kpiValue: template.kpiValue,
  kpiLabel: template.kpiLabel,
  kpiSecondaryValue: template.kpiSecondaryValue,
  kpiSecondaryLabel: template.kpiSecondaryLabel,
  kpiShowTrend: template.kpiShowTrend,
  kpiTrendPercentage: template.kpiTrendPercentage,
  showXAxisGridLines: template.showXAxisGridLines,
  showYAxisGridLines: template.showYAxisGridLines,
  showGridLines: template.showGridLines,
  showRegressionLine: template.showRegressionLine,
  xAxisLabel: template.xAxisLabel,
  yAxisLabel: template.yAxisLabel,
  maxDataPoints: template.maxDataPoints,
  primaryDimension: template.primaryDimension,
  secondaryDimension: template.secondaryDimension,
  selectedMeasure: template.selectedMeasure,
});

/**
 * Graph Input Mapper
 *
 * Converts frontend graph template format to backend GraphQL GraphInput format.
 * Main purpose: map frontend chart type variants (horizontalStackedBar, etc.) to backend enum values.
 */

import {
  ChartType as BackendChartType,
  SortOrder as BackendSortOrder,
  NumberFormat as BackendNumberFormat,
  LegendPosition as BackendLegendPosition,
  type GraphInput
} from '../../../types/backend-graphql';
import type { GraphTemplate } from '../../../types/graph';
import type { ChartType as FrontendChartType } from '../../../utils/chartDataAnalyzer';

/**
 * Map frontend ChartType variants to backend ChartType enum
 * Maps each frontend chart type to its corresponding backend enum value
 */
function mapChartType(frontendType: FrontendChartType): BackendChartType {
  const mapping: Record<FrontendChartType, BackendChartType> = {
    'kpi': BackendChartType.Kpi,
    'line': BackendChartType.Line,
    'bar': BackendChartType.Bar,
    'stackedBar': BackendChartType.StackedBar,
    'horizontalBar': BackendChartType.HorizontalBar,
    'horizontalStackedBar': BackendChartType.HorizontalStackedBar,
    'pie': BackendChartType.Pie,
  };
  return mapping[frontendType];
}

/**
 * Convert GraphTemplate to GraphInput for mutations
 */
export function toGraphInput(
  template: Omit<GraphTemplate, 'id' | 'createdAt' | 'updatedAt'>
): GraphInput {
  return {
    name: template.name,
    viewName: template.viewName,
    chartType: mapChartType(template.chartType),
    chartTitle: template.chartTitle,
    measures: template.measures || [],
    dimensions: template.dimensions || [],
    dates: template.dates || [],
    filters: template.filters || [],
    orderByField: template.orderByField,
    orderByDirection: template.orderByDirection ? (template.orderByDirection === 'asc' ? BackendSortOrder.Asc : BackendSortOrder.Desc) : undefined,
    numberFormat: template.numberFormat ? mapNumberFormat(template.numberFormat) : undefined,
    numberPrecision: template.numberPrecision,
    colorPalette: template.colorPalette,
    primaryColor: template.primaryColor,
    sortOrder: template.sortOrder ? (template.sortOrder === 'asc' ? BackendSortOrder.Asc : BackendSortOrder.Desc) : undefined,
    legendPosition: template.legendPosition ? mapLegendPosition(template.legendPosition) : undefined,
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
  };
}

/**
 * Map frontend number format to backend NumberFormat enum
 */
function mapNumberFormat(format: 'currency' | 'percentage' | 'number' | 'abbreviated'): BackendNumberFormat {
  const mapping: Record<'currency' | 'percentage' | 'number' | 'abbreviated', BackendNumberFormat> = {
    'currency': BackendNumberFormat.Currency,
    'percentage': BackendNumberFormat.Percentage,
    'number': BackendNumberFormat.Number,
    'abbreviated': BackendNumberFormat.Abbreviated,
  };
  return mapping[format];
}

/**
 * Map frontend legend position to backend LegendPosition enum
 */
function mapLegendPosition(position: 'top' | 'bottom' | 'none'): BackendLegendPosition {
  const mapping: Record<'top' | 'bottom' | 'none', BackendLegendPosition> = {
    'top': BackendLegendPosition.Top,
    'bottom': BackendLegendPosition.Bottom,
    'none': BackendLegendPosition.None,
  };
  return mapping[position];
}

/**
 * Map backend ChartType enum to frontend ChartType string
 * Used when receiving data from backend
 */
export function mapBackendChartType(backendType: BackendChartType): FrontendChartType {
  // Backend ChartType enum values are uppercase strings like 'BAR', 'LINE', etc.
  // We need to convert them to frontend lowercase values
  const mapping: Record<string, FrontendChartType> = {
    'BAR': 'bar',
    'STACKED_BAR': 'stackedBar',
    'HORIZONTAL_BAR': 'horizontalBar',
    'HORIZONTAL_STACKED_BAR': 'horizontalStackedBar',
    'LINE': 'line',
    'PIE': 'pie',
    'KPI': 'kpi',
    'AREA': 'line', // Fallback to line
    'SCATTER': 'line', // Fallback to line
    'HEATMAP': 'bar', // Fallback to bar
    'TABLE': 'bar', // Fallback to bar
  };

  return mapping[backendType] || 'bar';
}

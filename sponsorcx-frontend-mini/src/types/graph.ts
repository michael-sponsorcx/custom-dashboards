import { ChartType } from '../utils/chartDataAnalyzer';
import { FilterRule } from './filters';
import { ColorPalette } from '../constants/colorPalettes';

/**
 * Legend position for charts
 */
export type LegendPosition = 'top' | 'bottom' | 'none';

/**
 * Frontend graph configuration with UI-specific fields.
 * Distinct from the backend `Graph` type in backend-graphql.ts which represents the API contract.
 */
export interface GraphUI {
  id: string;
  name: string;
  createdAt: string;

  // Data source configuration
  viewName: string;
  measures: string[];
  dimensions: string[];
  dates: string[];
  filters: FilterRule[];

  // Query options
  orderByField?: string;
  orderByDirection?: 'asc' | 'desc';

  // Chart configuration
  chartType: ChartType;
  chartTitle: string;

  // Chart-specific settings
  numberFormat?: 'currency' | 'percentage' | 'number' | 'abbreviated';
  numberPrecision?: number;
  colorPalette?: ColorPalette; // Color palette selection (default: 'hubspot-orange')
  primaryColor?: string; // Used when colorPalette === 'custom' OR for single-series charts
  sortOrder?: 'asc' | 'desc';
  legendPosition?: LegendPosition;

  // KPI configuration
  kpiValue?: number;
  kpiLabel?: string;
  kpiSecondaryValue?: number;
  kpiSecondaryLabel?: string;
  kpiShowTrend?: boolean;
  kpiTrendPercentage?: number;

  // Grid line settings
  showXAxisGridLines?: boolean;
  showYAxisGridLines?: boolean;
  showGridLines?: boolean;

  // Regression line
  showRegressionLine?: boolean;

  // Axis labels
  xAxisLabel?: string;
  yAxisLabel?: string;

  // Data limits
  maxDataPoints?: number;

  // Data field selection (for charts with multiple dimensions/measures)
  primaryDimension?: string;
  secondaryDimension?: string;
  selectedMeasure?: string;
}

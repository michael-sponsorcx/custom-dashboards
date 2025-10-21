import { ChartType } from '../utils/chartDataAnalyzer';
import { FilterRule } from './filters';

/**
 * Legend position for charts
 */
export type LegendPosition = 'top' | 'bottom';

export interface GraphTemplate {
  id: string;
  name: string;
  createdAt: string;

  // Data source configuration
  viewName: string;
  measures: string[];
  dimensions: string[];
  dates: string[];
  filters: FilterRule[];

  // GraphQL query (constructed at creation time, used to fetch fresh data)
  query: string;

  // Chart configuration
  chartType: ChartType;
  chartTitle: string;

  // Chart-specific settings
  numberFormat?: 'currency' | 'percentage' | 'number' | 'abbreviated';
  numberPrecision?: number;
  primaryColor?: string;
  sortOrder?: 'asc' | 'desc';
  legendPosition?: LegendPosition;

  // Grid line settings
  showXAxisGridLines?: boolean;
  showYAxisGridLines?: boolean;
  showGridLines?: boolean;

  // Axis labels
  xAxisLabel?: string;
  yAxisLabel?: string;

  // Data field selection (for charts with multiple dimensions/measures)
  primaryDimension?: string;
  secondaryDimension?: string;
  selectedMeasure?: string;
}

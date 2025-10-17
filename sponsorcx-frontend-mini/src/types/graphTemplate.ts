import { ChartType } from '../utils/chartDataAnalyzer';
import { FilterRule } from './filters';

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

  // Data field selection (for charts with multiple dimensions/measures)
  primaryDimension?: string;
  secondaryDimension?: string;
  selectedMeasure?: string;
}

export interface DashboardTemplate {
  id: string;
  name: string;
  layout: 'grid' | 'list';
  graphIds: string[];
  createdAt: string;
  updatedAt: string;
}

import type { ChartType, SortOrder, NumberFormat, ColorPalette, LegendPosition } from '../../generated/graphql';

/** Database row type for graphs table (snake_case) */
export interface GraphRow {
    id: string;
    organization_id: string | null;
    name: string;
    view_name: string | null;
    chart_type: ChartType;
    chart_title: string | null;
    measures: string[];
    dimensions: string[];
    dates: string[];
    filters: unknown;
    order_by_field: string;
    order_by_direction: SortOrder;
    number_format: NumberFormat;
    number_precision: number;
    color_palette: ColorPalette;
    primary_color: string;
    sort_order: SortOrder;
    legend_position: LegendPosition;
    kpi_value: string | null;
    kpi_label: string | null;
    kpi_secondary_value: string | null;
    kpi_secondary_label: string | null;
    kpi_show_trend: boolean;
    kpi_trend_percentage: string | null;
    show_x_axis_grid_lines: boolean;
    show_y_axis_grid_lines: boolean;
    show_grid_lines: boolean;
    show_regression_line: boolean;
    x_axis_label: string | null;
    y_axis_label: string | null;
    max_data_points: number;
    primary_dimension: string;
    secondary_dimension: string | null;
    selected_measure: string;
    created_at: Date;
    updated_at: Date;
}

/** Resolved Graph type (camelCase for GraphQL) */
export interface Graph {
    id: string;
    organizationId: string | null;
    name: string;
    viewName: string | null;
    chartType: ChartType;
    chartTitle: string | null;
    measures: string[];
    dimensions: string[];
    dates: string[];
    filters: unknown;
    orderByField: string;
    orderByDirection: SortOrder;
    numberFormat: NumberFormat;
    numberPrecision: number;
    colorPalette: ColorPalette;
    primaryColor: string;
    sortOrder: SortOrder;
    legendPosition: LegendPosition;
    kpiValue: number | null;
    kpiLabel: string | null;
    kpiSecondaryValue: number | null;
    kpiSecondaryLabel: string | null;
    kpiShowTrend: boolean;
    kpiTrendPercentage: number | null;
    showXAxisGridLines: boolean;
    showYAxisGridLines: boolean;
    showGridLines: boolean;
    showRegressionLine: boolean;
    xAxisLabel: string | null;
    yAxisLabel: string | null;
    maxDataPoints: number;
    primaryDimension: string;
    secondaryDimension: string | null;
    selectedMeasure: string;
    createdAt: Date;
    updatedAt: Date;
}

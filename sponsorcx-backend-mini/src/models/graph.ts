/** Database row type for graphs table (snake_case) */
export interface GraphRow {
    id: string;
    organization_id: string | null;
    name: string;
    view_name: string | null;
    chart_type: string;
    chart_title: string | null;
    measures: string[];
    dimensions: string[];
    dates: string[];
    filters: unknown;
    order_by_field: string | null;
    order_by_direction: string | null;
    number_format: string | null;
    number_precision: number | null;
    color_palette: string | null;
    primary_color: string | null;
    sort_order: string | null;
    legend_position: string | null;
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
    max_data_points: number | null;
    primary_dimension: string | null;
    secondary_dimension: string | null;
    selected_measure: string | null;
    created_at: Date;
    updated_at: Date;
}

/** Resolved type for Graph (camelCase for GraphQL) */
export interface Graph {
    id: string;
    organizationId: string | null;
    name: string;
    viewName: string | null;
    chartType: string;
    chartTitle: string | null;
    measures: string[];
    dimensions: string[];
    dates: string[];
    filters: unknown;
    orderByField: string | null;
    orderByDirection: string | null;
    numberFormat: string | null;
    numberPrecision: number | null;
    colorPalette: string | null;
    primaryColor: string | null;
    sortOrder: string | null;
    legendPosition: string | null;
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
    maxDataPoints: number | null;
    primaryDimension: string | null;
    secondaryDimension: string | null;
    selectedMeasure: string | null;
    createdAt: Date;
    updatedAt: Date;
}

/** Convert a graph database row to camelCase for GraphQL */
export const graphRowToCamelCase = (row: GraphRow): Graph => ({
    id: row.id,
    organizationId: row.organization_id,
    name: row.name,
    viewName: row.view_name,
    chartType: row.chart_type,
    chartTitle: row.chart_title,
    measures: row.measures,
    dimensions: row.dimensions,
    dates: row.dates,
    filters: row.filters,
    orderByField: row.order_by_field,
    orderByDirection: row.order_by_direction,
    numberFormat: row.number_format,
    numberPrecision: row.number_precision,
    colorPalette: row.color_palette,
    primaryColor: row.primary_color,
    sortOrder: row.sort_order,
    legendPosition: row.legend_position,
    kpiValue: row.kpi_value ? parseFloat(row.kpi_value) : null,
    kpiLabel: row.kpi_label,
    kpiSecondaryValue: row.kpi_secondary_value ? parseFloat(row.kpi_secondary_value) : null,
    kpiSecondaryLabel: row.kpi_secondary_label,
    kpiShowTrend: row.kpi_show_trend,
    kpiTrendPercentage: row.kpi_trend_percentage ? parseFloat(row.kpi_trend_percentage) : null,
    showXAxisGridLines: row.show_x_axis_grid_lines,
    showYAxisGridLines: row.show_y_axis_grid_lines,
    showGridLines: row.show_grid_lines,
    showRegressionLine: row.show_regression_line,
    xAxisLabel: row.x_axis_label,
    yAxisLabel: row.y_axis_label,
    maxDataPoints: row.max_data_points,
    primaryDimension: row.primary_dimension,
    secondaryDimension: row.secondary_dimension,
    selectedMeasure: row.selected_measure,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
});

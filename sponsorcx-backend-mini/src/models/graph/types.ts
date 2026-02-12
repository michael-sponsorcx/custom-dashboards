import type { Graph as CodegenGraph } from '../../generated/graphql';

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
    order_by_field: string;
    order_by_direction: string;
    number_format: string;
    number_precision: number;
    color_palette: string;
    primary_color: string;
    sort_order: string;
    legend_position: string;
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

/**
 * Resolved Graph type (camelCase for GraphQL).
 *
 * Based on codegen Graph with overrides for fields where the DB representation
 * differs from the GraphQL schema type:
 * - Date fields: pg returns Date objects, GraphQL serializes to string
 * - Enum fields: DB stores plain strings, codegen uses enum types
 * - Nullability: DB columns may be nullable where schema marks required
 * - filters: DB returns unknown, codegen expects Record<string, unknown>
 */
type GraphOverrides = {
    viewName: string | null;
    chartType: string;
    chartTitle: string | null;
    measures: string[];
    dimensions: string[];
    dates: string[];
    filters: unknown;
    orderByDirection: string;
    numberFormat: string;
    colorPalette: string;
    sortOrder: string;
    legendPosition: string;
    kpiShowTrend: boolean;
    showXAxisGridLines: boolean;
    showYAxisGridLines: boolean;
    showGridLines: boolean;
    showRegressionLine: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export type Graph = Omit<CodegenGraph, '__typename' | keyof GraphOverrides> & GraphOverrides;

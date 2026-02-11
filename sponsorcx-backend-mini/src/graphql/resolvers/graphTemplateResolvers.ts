import { GraphQLNonNull, GraphQLID, GraphQLList } from 'graphql';
import { query } from '../../db/connection';
import { GraphType, GraphInput } from '../types';

// ============================================================================
// Database Row Type (snake_case from PostgreSQL)
// ============================================================================

interface GraphRow {
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

// ============================================================================
// Resolved Type (camelCase for GraphQL)
// ============================================================================

interface Graph {
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

// ============================================================================
// Resolver Argument Types
// ============================================================================

interface GraphsArgs {
    organizationId?: string;
}

interface GraphArgs {
    id: string;
}

interface GraphInputData {
    name: string;
    viewName?: string;
    chartType: string;
    chartTitle?: string;
    measures?: string[];
    dimensions?: string[];
    dates?: string[];
    filters?: unknown;
    orderByField?: string;
    orderByDirection?: string;
    numberFormat?: string;
    numberPrecision?: number;
    colorPalette?: string;
    primaryColor?: string;
    sortOrder?: string;
    legendPosition?: string;
    kpiValue?: number;
    kpiLabel?: string;
    kpiSecondaryValue?: number;
    kpiSecondaryLabel?: string;
    kpiShowTrend?: boolean;
    kpiTrendPercentage?: number;
    showXAxisGridLines?: boolean;
    showYAxisGridLines?: boolean;
    showGridLines?: boolean;
    showRegressionLine?: boolean;
    xAxisLabel?: string;
    yAxisLabel?: string;
    maxDataPoints?: number;
    primaryDimension?: string;
    secondaryDimension?: string;
    selectedMeasure?: string;
}

interface CreateGraphArgs {
    input: GraphInputData;
    organizationId?: string;
}

interface UpdateGraphArgs {
    id: string;
    input: GraphInputData;
}

interface DeleteGraphArgs {
    id: string;
}

// ============================================================================
// Row-to-Object Converter
// ============================================================================

const graphToCamelCase = (row: GraphRow): Graph => ({
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
    kpiValue: row.kpi_value ? parseFloat(row.kpi_value as string) : null,
    kpiLabel: row.kpi_label,
    kpiSecondaryValue: row.kpi_secondary_value ? parseFloat(row.kpi_secondary_value as string) : null,
    kpiSecondaryLabel: row.kpi_secondary_label,
    kpiShowTrend: row.kpi_show_trend,
    kpiTrendPercentage: row.kpi_trend_percentage ? parseFloat(row.kpi_trend_percentage as string) : null,
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

export const graphQueries = {
    graphs: {
        type: new GraphQLList(GraphType),
        args: {
            organizationId: { type: GraphQLID },
        },
        resolve: async (_: unknown, { organizationId }: GraphsArgs): Promise<Graph[]> => {
            const sql = organizationId
                ? 'SELECT * FROM graphs WHERE organization_id = $1 ORDER BY created_at DESC'
                : 'SELECT * FROM graphs ORDER BY created_at DESC';
            const params = organizationId ? [organizationId] : [];
            const result = await query(sql, params);
            return result.rows.map((row) => graphToCamelCase(row as GraphRow));
        },
    },
    graph: {
        type: GraphType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: unknown, { id }: GraphArgs): Promise<Graph | null> => {
            const result = await query('SELECT * FROM graphs WHERE id = $1', [id]);
            return result.rows[0] ? graphToCamelCase(result.rows[0] as GraphRow) : null;
        },
    },
};

export const graphMutations = {
    createGraph: {
        type: GraphType,
        args: {
            input: { type: new GraphQLNonNull(GraphInput) },
            organizationId: { type: GraphQLID },
        },
        resolve: async (_: unknown, { input, organizationId }: CreateGraphArgs): Promise<Graph> => {
            const sql = `
                INSERT INTO graphs (
                    organization_id, name, view_name, chart_type, chart_title,
                    measures, dimensions, dates, filters,
                    order_by_field, order_by_direction,
                    number_format, number_precision, color_palette, primary_color,
                    sort_order, legend_position,
                    kpi_value, kpi_label, kpi_secondary_value, kpi_secondary_label,
                    kpi_show_trend, kpi_trend_percentage,
                    show_x_axis_grid_lines, show_y_axis_grid_lines, show_grid_lines,
                    show_regression_line, x_axis_label, y_axis_label,
                    max_data_points, primary_dimension, secondary_dimension, selected_measure
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
                    $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28,
                    $29, $30, $31, $32, $33
                )
                RETURNING *
            `;

            const params = [
                organizationId ?? null,
                input.name,
                input.viewName,
                input.chartType,
                input.chartTitle,
                input.measures ?? [],
                input.dimensions ?? [],
                input.dates ?? [],
                input.filters ? JSON.stringify(input.filters) : '[]',
                input.orderByField ?? null,
                input.orderByDirection ?? null,
                input.numberFormat ?? null,
                input.numberPrecision ?? null,
                input.colorPalette ?? null,
                input.primaryColor ?? null,
                input.sortOrder ?? null,
                input.legendPosition ?? null,
                input.kpiValue ?? null,
                input.kpiLabel ?? null,
                input.kpiSecondaryValue ?? null,
                input.kpiSecondaryLabel ?? null,
                input.kpiShowTrend ?? false,
                input.kpiTrendPercentage ?? null,
                input.showXAxisGridLines ?? true,
                input.showYAxisGridLines ?? true,
                input.showGridLines ?? true,
                input.showRegressionLine ?? false,
                input.xAxisLabel ?? null,
                input.yAxisLabel ?? null,
                input.maxDataPoints ?? null,
                input.primaryDimension ?? null,
                input.secondaryDimension ?? null,
                input.selectedMeasure ?? null,
            ];

            const result = await query(sql, params);
            return graphToCamelCase(result.rows[0] as GraphRow);
        },
    },
    updateGraph: {
        type: GraphType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            input: { type: new GraphQLNonNull(GraphInput) },
        },
        resolve: async (_: unknown, { id, input }: UpdateGraphArgs): Promise<Graph | null> => {
            const sql = `
                UPDATE graphs SET
                    name = $2,
                    view_name = $3,
                    chart_type = $4,
                    chart_title = $5,
                    measures = $6,
                    dimensions = $7,
                    dates = $8,
                    filters = $9,
                    order_by_field = $10,
                    order_by_direction = $11,
                    number_format = $12,
                    number_precision = $13,
                    color_palette = $14,
                    primary_color = $15,
                    sort_order = $16,
                    legend_position = $17,
                    kpi_value = $18,
                    kpi_label = $19,
                    kpi_secondary_value = $20,
                    kpi_secondary_label = $21,
                    kpi_show_trend = $22,
                    kpi_trend_percentage = $23,
                    show_x_axis_grid_lines = $24,
                    show_y_axis_grid_lines = $25,
                    show_grid_lines = $26,
                    show_regression_line = $27,
                    x_axis_label = $28,
                    y_axis_label = $29,
                    max_data_points = $30,
                    primary_dimension = $31,
                    secondary_dimension = $32,
                    selected_measure = $33
                WHERE id = $1
                RETURNING *
            `;

            const params = [
                id,
                input.name,
                input.viewName,
                input.chartType,
                input.chartTitle,
                input.measures ?? [],
                input.dimensions ?? [],
                input.dates ?? [],
                input.filters ? JSON.stringify(input.filters) : '[]',
                input.orderByField ?? null,
                input.orderByDirection ?? null,
                input.numberFormat ?? null,
                input.numberPrecision ?? null,
                input.colorPalette ?? null,
                input.primaryColor ?? null,
                input.sortOrder ?? null,
                input.legendPosition ?? null,
                input.kpiValue ?? null,
                input.kpiLabel ?? null,
                input.kpiSecondaryValue ?? null,
                input.kpiSecondaryLabel ?? null,
                input.kpiShowTrend ?? false,
                input.kpiTrendPercentage ?? null,
                input.showXAxisGridLines ?? true,
                input.showYAxisGridLines ?? true,
                input.showGridLines ?? true,
                input.showRegressionLine ?? false,
                input.xAxisLabel ?? null,
                input.yAxisLabel ?? null,
                input.maxDataPoints ?? null,
                input.primaryDimension ?? null,
                input.secondaryDimension ?? null,
                input.selectedMeasure ?? null,
            ];

            const result = await query(sql, params);
            return result.rows[0] ? graphToCamelCase(result.rows[0] as GraphRow) : null;
        },
    },
    deleteGraph: {
        type: GraphType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: unknown, { id }: DeleteGraphArgs): Promise<Graph | null> => {
            const result = await query('DELETE FROM graphs WHERE id = $1 RETURNING *', [id]);
            return result.rows[0] ? graphToCamelCase(result.rows[0] as GraphRow) : null;
        },
    },
};
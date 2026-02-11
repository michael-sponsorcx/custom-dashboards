import { typedQuery } from '../../db/connection';
import type { GraphRow, Graph } from './types';
import { graphRowToCamelCase } from './mapper';
import type { GraphInput } from '../../generated/graphql';

export const findAllGraphs = async (organizationId?: string | null): Promise<Graph[]> => {
    const sql = organizationId
        ? 'SELECT * FROM graphs WHERE organization_id = $1 ORDER BY created_at DESC'
        : 'SELECT * FROM graphs ORDER BY created_at DESC';
    const params = organizationId ? [organizationId] : [];
    const result = await typedQuery<GraphRow>(sql, params);
    return result.rows.map(graphRowToCamelCase);
};

export const findGraphById = async (id: string): Promise<Graph | null> => {
    const result = await typedQuery<GraphRow>(
        'SELECT * FROM graphs WHERE id = $1',
        [id]
    );
    return result.rows[0] ? graphRowToCamelCase(result.rows[0]) : null;
};

export const createGraph = async (input: GraphInput, organizationId?: string | null): Promise<Graph> => {
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

    const result = await typedQuery<GraphRow>(sql, params);
    return graphRowToCamelCase(result.rows[0]);
};

export const updateGraph = async (id: string, input: GraphInput): Promise<Graph | null> => {
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

    const result = await typedQuery<GraphRow>(sql, params);
    return result.rows[0] ? graphRowToCamelCase(result.rows[0]) : null;
};

export const deleteGraph = async (id: string): Promise<Graph | null> => {
    const result = await typedQuery<GraphRow>(
        'DELETE FROM graphs WHERE id = $1 RETURNING *',
        [id]
    );
    return result.rows[0] ? graphRowToCamelCase(result.rows[0]) : null;
};

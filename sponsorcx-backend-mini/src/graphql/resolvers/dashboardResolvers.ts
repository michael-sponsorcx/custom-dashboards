import { GraphQLNonNull, GraphQLID, GraphQLList } from 'graphql';
import { query } from '../../db/connection';
import {
    DashboardType,
    DashboardInput,
    DashboardGridItemType,
    DashboardGridItemInput,
    DashboardFilterType,
    DashboardFilterInput,
    GraphType,
} from '../types';

// Helper to convert dashboard row
const dashboardToCamelCase = (row: any) => ({
    id: row.id,
    organizationId: row.organization_id,
    name: row.name,
    layout: row.layout,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
});

// Helper to convert dashboard grid item row
const dashboardGridItemToCamelCase = (row: any) => ({
    id: row.id,
    dashboardId: row.dashboard_id,
    graphId: row.graph_id,
    gridColumn: row.grid_column,
    gridRow: row.grid_row,
    gridWidth: row.grid_width,
    gridHeight: row.grid_height,
    displayOrder: row.display_order,
});

// Helper to convert dashboard filter row
const dashboardFilterToCamelCase = (row: any) => ({
    id: row.id,
    dashboardId: row.dashboard_id,
    selectedViews: row.selected_views,
    availableFields: row.available_fields,
    activeFilters: row.active_filters,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
});

export const dashboardQueries = {
    dashboards: {
        type: new GraphQLList(DashboardType),
        args: {
            organizationId: { type: GraphQLID },
        },
        resolve: async (_: any, { organizationId }: any) => {
            const sql = organizationId
                ? 'SELECT * FROM dashboards WHERE organization_id = $1 ORDER BY updated_at DESC'
                : 'SELECT * FROM dashboards ORDER BY updated_at DESC';
            const params = organizationId ? [organizationId] : [];
            const result = await query(sql, params);
            return result.rows.map(dashboardToCamelCase);
        },
    },
    dashboard: {
        type: DashboardType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: any, { id }: any) => {
            const result = await query('SELECT * FROM dashboards WHERE id = $1', [id]);
            return result.rows[0] ? dashboardToCamelCase(result.rows[0]) : null;
        },
    },
    dashboardGridItems: {
        type: new GraphQLList(DashboardGridItemType),
        args: {
            dashboardId: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: any, { dashboardId }: any) => {
            const sql = `
                SELECT di.*,
                       g.id as graph_id, g.name as graph_name, g.chart_type, g.chart_title
                FROM dashboard_grid_items di
                LEFT JOIN graphs g ON di.graph_id = g.id
                WHERE di.dashboard_id = $1
                ORDER BY di.display_order, di.created_at
            `;
            const result = await query(sql, [dashboardId]);
            return result.rows.map(row => ({
                ...dashboardGridItemToCamelCase(row),
                graph: row.graph_id ? {
                    id: row.graph_id,
                    name: row.graph_name,
                    chartType: row.chart_type,
                    chartTitle: row.chart_title,
                } : null,
            }));
        },
    },
    dashboardFilter: {
        type: DashboardFilterType,
        args: {
            dashboardId: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: any, { dashboardId }: any) => {
            const result = await query('SELECT * FROM dashboard_filters WHERE dashboard_id = $1', [dashboardId]);
            return result.rows[0] ? dashboardFilterToCamelCase(result.rows[0]) : null;
        },
    },
};

export const dashboardMutations = {
    createDashboard: {
        type: DashboardType,
        args: {
            input: { type: new GraphQLNonNull(DashboardInput) },
            organizationId: { type: GraphQLID },
        },
        resolve: async (_: any, { input, organizationId }: any) => {
            const sql = `
                INSERT INTO dashboards (organization_id, name, layout)
                VALUES ($1, $2, $3)
                RETURNING *
            `;
            const params = [organizationId || null, input.name, input.layout];
            const result = await query(sql, params);
            return dashboardToCamelCase(result.rows[0]);
        },
    },
    updateDashboard: {
        type: DashboardType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            input: { type: new GraphQLNonNull(DashboardInput) },
        },
        resolve: async (_: any, { id, input }: any) => {
            const sql = `
                UPDATE dashboards
                SET name = $2, layout = $3
                WHERE id = $1
                RETURNING *
            `;
            const params = [id, input.name, input.layout];
            const result = await query(sql, params);
            return result.rows[0] ? dashboardToCamelCase(result.rows[0]) : null;
        },
    },
    deleteDashboard: {
        type: DashboardType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: any, { id }: any) => {
            const result = await query('DELETE FROM dashboards WHERE id = $1 RETURNING *', [id]);
            return result.rows[0] ? dashboardToCamelCase(result.rows[0]) : null;
        },
    },
    addDashboardGridItem: {
        type: DashboardGridItemType,
        args: {
            dashboardId: { type: new GraphQLNonNull(GraphQLID) },
            input: { type: new GraphQLNonNull(DashboardGridItemInput) },
        },
        resolve: async (_: any, { dashboardId, input }: any) => {
            const sql = `
                INSERT INTO dashboard_grid_items (
                    dashboard_id, graph_id, grid_column, grid_row,
                    grid_width, grid_height, display_order
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT (dashboard_id, graph_id)
                DO UPDATE SET
                    grid_column = EXCLUDED.grid_column,
                    grid_row = EXCLUDED.grid_row,
                    grid_width = EXCLUDED.grid_width,
                    grid_height = EXCLUDED.grid_height,
                    display_order = EXCLUDED.display_order
                RETURNING *
            `;
            const params = [
                dashboardId,
                input.graphId,
                input.gridColumn || null,
                input.gridRow || null,
                input.gridWidth || null,
                input.gridHeight || null,
                input.displayOrder || 0,
            ];
            const result = await query(sql, params);
            return dashboardGridItemToCamelCase(result.rows[0]);
        },
    },
    updateDashboardGridItem: {
        type: DashboardGridItemType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            input: { type: new GraphQLNonNull(DashboardGridItemInput) },
        },
        resolve: async (_: any, { id, input }: any) => {
            const sql = `
                UPDATE dashboard_grid_items
                SET grid_column = $2, grid_row = $3, grid_width = $4,
                    grid_height = $5, display_order = $6
                WHERE id = $1
                RETURNING *
            `;
            const params = [
                id,
                input.gridColumn || null,
                input.gridRow || null,
                input.gridWidth || null,
                input.gridHeight || null,
                input.displayOrder || 0,
            ];
            const result = await query(sql, params);
            return result.rows[0] ? dashboardGridItemToCamelCase(result.rows[0]) : null;
        },
    },
    removeDashboardGridItem: {
        type: DashboardGridItemType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: any, { id }: any) => {
            const result = await query('DELETE FROM dashboard_grid_items WHERE id = $1 RETURNING *', [id]);
            return result.rows[0] ? dashboardGridItemToCamelCase(result.rows[0]) : null;
        },
    },
    saveDashboardFilter: {
        type: DashboardFilterType,
        args: {
            dashboardId: { type: new GraphQLNonNull(GraphQLID) },
            input: { type: new GraphQLNonNull(DashboardFilterInput) },
        },
        resolve: async (_: any, { dashboardId, input }: any) => {
            const sql = `
                INSERT INTO dashboard_filters (
                    dashboard_id, selected_views, available_fields, active_filters
                )
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (dashboard_id)
                DO UPDATE SET
                    selected_views = EXCLUDED.selected_views,
                    available_fields = EXCLUDED.available_fields,
                    active_filters = EXCLUDED.active_filters
                RETURNING *
            `;
            const params = [
                dashboardId,
                input.selectedViews || [],
                input.availableFields ? JSON.stringify(input.availableFields) : '[]',
                input.activeFilters ? JSON.stringify(input.activeFilters) : '[]',
            ];
            const result = await query(sql, params);
            return dashboardFilterToCamelCase(result.rows[0]);
        },
    },
    clearDashboardFilter: {
        type: DashboardFilterType,
        args: {
            dashboardId: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: any, { dashboardId }: any) => {
            const result = await query('DELETE FROM dashboard_filters WHERE dashboard_id = $1 RETURNING *', [dashboardId]);
            return result.rows[0] ? dashboardFilterToCamelCase(result.rows[0]) : null;
        },
    },
};
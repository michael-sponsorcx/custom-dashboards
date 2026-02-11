import { GraphQLNonNull, GraphQLID, GraphQLList } from 'graphql';
import { query } from '../../db/connection';
import {
    DashboardType,
    DashboardInput,
    DashboardGridItemType,
    DashboardGridItemInput,
    DashboardFilterType,
    DashboardFilterInput,
} from '../types';
import type {
    QueryDashboardsArgs,
    QueryDashboardArgs,
    QueryDashboardGridItemsArgs,
    QueryDashboardFilterArgs,
    MutationCreateDashboardArgs,
    MutationUpdateDashboardArgs,
    MutationDeleteDashboardArgs,
    MutationAddDashboardGridItemArgs,
    MutationUpdateDashboardGridItemArgs,
    MutationRemoveDashboardGridItemArgs,
    MutationSaveDashboardFilterArgs,
    MutationClearDashboardFilterArgs,
} from '../../generated/graphql';
import {
    dashboardToCamelCase,
    dashboardGridItemToCamelCase,
    dashboardFilterToCamelCase,
} from '../../models';
import type {
    DashboardRow,
    Dashboard,
    DashboardGridItemRow,
    DashboardGridItem,
    DashboardFilterRow,
    DashboardFilter,
} from '../../models';

export const dashboardQueries = {
    dashboards: {
        type: new GraphQLList(DashboardType),
        args: {
            organizationId: { type: GraphQLID },
        },
        resolve: async (_: unknown, { organizationId }: QueryDashboardsArgs): Promise<Dashboard[]> => {
            const sql = organizationId
                ? 'SELECT * FROM dashboards WHERE organization_id = $1 ORDER BY updated_at DESC'
                : 'SELECT * FROM dashboards ORDER BY updated_at DESC';
            const params = organizationId ? [organizationId] : [];
            const result = await query(sql, params);
            return result.rows.map((row: DashboardRow) => dashboardToCamelCase(row));
        },
    },
    dashboard: {
        type: DashboardType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: unknown, { id }: QueryDashboardArgs): Promise<Dashboard | null> => {
            const result = await query('SELECT * FROM dashboards WHERE id = $1', [id]);
            return result.rows[0] ? dashboardToCamelCase(result.rows[0] as DashboardRow) : null;
        },
    },
    dashboardGridItems: {
        type: new GraphQLList(DashboardGridItemType),
        args: {
            dashboardId: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: unknown, { dashboardId }: QueryDashboardGridItemsArgs): Promise<DashboardGridItem[]> => {
            // Get all grid items for this dashboard
            // The graph field will be resolved by the field resolver in DashboardGridItemType
            const sql = 'SELECT * FROM dashboard_grid_items WHERE dashboard_id = $1 ORDER BY display_order, created_at';
            const result = await query(sql, [dashboardId]);
            return result.rows.map((row) => dashboardGridItemToCamelCase(row as DashboardGridItemRow));
        },
    },
    dashboardFilter: {
        type: DashboardFilterType,
        args: {
            dashboardId: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: unknown, { dashboardId }: QueryDashboardFilterArgs): Promise<DashboardFilter | null> => {
            const result = await query('SELECT * FROM dashboard_filters WHERE dashboard_id = $1', [dashboardId]);
            return result.rows[0] ? dashboardFilterToCamelCase(result.rows[0] as DashboardFilterRow) : null;
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
        resolve: async (_: unknown, { input, organizationId }: MutationCreateDashboardArgs): Promise<Dashboard> => {
            const sql = `
                INSERT INTO dashboards (organization_id, name, layout)
                VALUES ($1, $2, $3)
                RETURNING *
            `;
            const params = [organizationId ?? null, input.name, input.layout];
            const result = await query(sql, params);
            return dashboardToCamelCase(result.rows[0] as DashboardRow);
        },
    },
    updateDashboard: {
        type: DashboardType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            input: { type: new GraphQLNonNull(DashboardInput) },
        },
        resolve: async (_: unknown, { id, input }: MutationUpdateDashboardArgs): Promise<Dashboard | null> => {
            const sql = `
                UPDATE dashboards
                SET name = $2, layout = $3
                WHERE id = $1
                RETURNING *
            `;
            const params = [id, input.name, input.layout];
            const result = await query(sql, params);
            return result.rows[0] ? dashboardToCamelCase(result.rows[0] as DashboardRow) : null;
        },
    },
    deleteDashboard: {
        type: DashboardType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: unknown, { id }: MutationDeleteDashboardArgs): Promise<Dashboard | null> => {
            const result = await query('DELETE FROM dashboards WHERE id = $1 RETURNING *', [id]);
            return result.rows[0] ? dashboardToCamelCase(result.rows[0] as DashboardRow) : null;
        },
    },
    addDashboardGridItem: {
        type: DashboardGridItemType,
        args: {
            dashboardId: { type: new GraphQLNonNull(GraphQLID) },
            input: { type: new GraphQLNonNull(DashboardGridItemInput) },
        },
        resolve: async (_: unknown, { dashboardId, input }: MutationAddDashboardGridItemArgs): Promise<DashboardGridItem> => {
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
                input.gridColumn ?? null,
                input.gridRow ?? null,
                input.gridWidth ?? null,
                input.gridHeight ?? null,
                input.displayOrder ?? 0,
            ];
            const result = await query(sql, params);
            return dashboardGridItemToCamelCase(result.rows[0] as DashboardGridItemRow);
        },
    },
    updateDashboardGridItem: {
        type: DashboardGridItemType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            input: { type: new GraphQLNonNull(DashboardGridItemInput) },
        },
        resolve: async (_: unknown, { id, input }: MutationUpdateDashboardGridItemArgs): Promise<DashboardGridItem | null> => {
            const sql = `
                UPDATE dashboard_grid_items
                SET grid_column = $2, grid_row = $3, grid_width = $4,
                    grid_height = $5, display_order = $6
                WHERE id = $1
                RETURNING *
            `;
            const params = [
                id,
                input.gridColumn ?? null,
                input.gridRow ?? null,
                input.gridWidth ?? null,
                input.gridHeight ?? null,
                input.displayOrder ?? 0,
            ];
            const result = await query(sql, params);
            return result.rows[0] ? dashboardGridItemToCamelCase(result.rows[0] as DashboardGridItemRow) : null;
        },
    },
    removeDashboardGridItem: {
        type: DashboardGridItemType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: unknown, { id }: MutationRemoveDashboardGridItemArgs): Promise<DashboardGridItem | null> => {
            const result = await query('DELETE FROM dashboard_grid_items WHERE id = $1 RETURNING *', [id]);
            return result.rows[0] ? dashboardGridItemToCamelCase(result.rows[0] as DashboardGridItemRow) : null;
        },
    },
    saveDashboardFilter: {
        type: DashboardFilterType,
        args: {
            dashboardId: { type: new GraphQLNonNull(GraphQLID) },
            input: { type: new GraphQLNonNull(DashboardFilterInput) },
        },
        resolve: async (_: unknown, { dashboardId, input }: MutationSaveDashboardFilterArgs): Promise<DashboardFilter> => {
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
            return dashboardFilterToCamelCase(result.rows[0] as DashboardFilterRow);
        },
    },
    clearDashboardFilter: {
        type: DashboardFilterType,
        args: {
            dashboardId: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: unknown, { dashboardId }: MutationClearDashboardFilterArgs): Promise<DashboardFilter | null> => {
            const result = await query('DELETE FROM dashboard_filters WHERE dashboard_id = $1 RETURNING *', [dashboardId]);
            return result.rows[0] ? dashboardFilterToCamelCase(result.rows[0] as DashboardFilterRow) : null;
        },
    },
};

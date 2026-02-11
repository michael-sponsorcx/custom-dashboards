/** Database row type for dashboard_grid_items table (snake_case) */
export interface DashboardGridItemRow {
    id: string;
    dashboard_id: string;
    graph_id: string;
    grid_column: number | null;
    grid_row: number | null;
    grid_width: number | null;
    grid_height: number | null;
    display_order: number;
}

/** Resolved type for DashboardGridItem (camelCase for GraphQL) */
export interface DashboardGridItem {
    id: string;
    dashboardId: string;
    graphId: string;
    gridColumn: number | null;
    gridRow: number | null;
    gridWidth: number | null;
    gridHeight: number | null;
    displayOrder: number;
}

/** Parent type for DashboardGridItem field resolver */
export interface DashboardGridItemParent {
    id: string;
    dashboardId: string;
    graphId: string;
    gridColumn: number | null;
    gridRow: number | null;
    gridWidth: number | null;
    gridHeight: number | null;
    displayOrder: number;
}

/** Convert a dashboard grid item database row to camelCase for GraphQL */
export const dashboardGridItemToCamelCase = (row: DashboardGridItemRow): DashboardGridItem => ({
    id: row.id,
    dashboardId: row.dashboard_id,
    graphId: row.graph_id,
    gridColumn: row.grid_column,
    gridRow: row.grid_row,
    gridWidth: row.grid_width,
    gridHeight: row.grid_height,
    displayOrder: row.display_order,
});

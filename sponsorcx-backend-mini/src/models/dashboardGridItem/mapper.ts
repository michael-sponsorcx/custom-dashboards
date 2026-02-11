import type { DashboardGridItemRow, DashboardGridItem } from './types';

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

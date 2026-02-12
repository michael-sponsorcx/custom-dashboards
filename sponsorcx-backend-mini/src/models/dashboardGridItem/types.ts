import type { DashboardGridItem as CodegenDashboardGridItem } from '../../generated/graphql';

/** Database row type for dashboard_grid_items table (snake_case) */
export interface DashboardGridItemRow {
    id: string;
    dashboard_id: string;
    graph_id: string;
    grid_column: number;
    grid_row: number;
    grid_width: number;
    grid_height: number;
    display_order: number;
}

/**
 * Resolved DashboardGridItem type (camelCase for GraphQL).
 * graph is excluded because it's a resolved field, not a DB column.
 */
export type DashboardGridItem = Omit<CodegenDashboardGridItem, '__typename' | 'graph'>;

import type { DashboardGridItem as CodegenDashboardGridItem } from '../../generated/graphql';

/** Database row type for dashboard_grid_items table (snake_case) */
export interface DashboardGridItemRow {
    id: string;
    dashboard_id: string;
    graph_id: string;
    grid_column: number | null;
    grid_row: number | null;
    grid_width: number | null;
    grid_height: number | null;
    display_order: number | null;
}

/**
 * Resolved DashboardGridItem type (camelCase for GraphQL).
 * graph is excluded because it's a resolved field, not a DB column.
 */
export type DashboardGridItem = Omit<CodegenDashboardGridItem, '__typename' | 'graph'>;

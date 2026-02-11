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
    display_order: number;
}

/**
 * Resolved DashboardGridItem type (camelCase for GraphQL).
 * Overrides: displayOrder (non-null from DB), graph excluded (resolved field, not a DB column)
 */
type DashboardGridItemOverrides = {
    displayOrder: number;
};

export type DashboardGridItem = Omit<CodegenDashboardGridItem, '__typename' | 'graph' | keyof DashboardGridItemOverrides> & DashboardGridItemOverrides;

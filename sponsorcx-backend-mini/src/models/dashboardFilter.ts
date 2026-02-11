/** Database row type for dashboard_filters table (snake_case) */
export interface DashboardFilterRow {
    id: string;
    dashboard_id: string;
    selected_views: string[];
    available_fields: unknown;
    active_filters: unknown;
    created_at: Date;
    updated_at: Date;
}

/** Resolved type for DashboardFilter (camelCase for GraphQL) */
export interface DashboardFilter {
    id: string;
    dashboardId: string;
    selectedViews: string[];
    availableFields: unknown;
    activeFilters: unknown;
    createdAt: Date;
    updatedAt: Date;
}

/** Convert a dashboard filter database row to camelCase for GraphQL */
export const dashboardFilterToCamelCase = (row: DashboardFilterRow): DashboardFilter => ({
    id: row.id,
    dashboardId: row.dashboard_id,
    selectedViews: row.selected_views,
    availableFields: row.available_fields,
    activeFilters: row.active_filters,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
});

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

/** Resolved DashboardFilter type (camelCase for GraphQL) */
export interface DashboardFilter {
    id: string;
    dashboardId: string;
    selectedViews: string[];
    availableFields: unknown;
    activeFilters: unknown;
    createdAt: Date;
    updatedAt: Date;
}

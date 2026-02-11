import type { DashboardFilterRow, DashboardFilter } from './types';

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

import type { DashboardFilter as CodegenDashboardFilter } from '../../generated/graphql';

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

/**
 * Resolved DashboardFilter type (camelCase for GraphQL).
 * Overrides: date fields, selectedViews (non-null array from DB),
 * availableFields/activeFilters (unknown from DB vs Record<string, unknown>)
 */
type DashboardFilterOverrides = {
    selectedViews: string[];
    availableFields: unknown;
    activeFilters: unknown;
    createdAt: Date;
    updatedAt: Date;
};

export type DashboardFilter = Omit<CodegenDashboardFilter, '__typename' | keyof DashboardFilterOverrides> & DashboardFilterOverrides;

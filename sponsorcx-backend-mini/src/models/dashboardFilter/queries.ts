import { typedQuery } from '../../db/connection';
import type { DashboardFilterRow, DashboardFilter } from './types';
import { dashboardFilterToCamelCase } from './mapper';
import type { DashboardFilterInput } from '../../generated/graphql';

export const findFilterByDashboard = async (dashboardId: string): Promise<DashboardFilter | null> => {
    const result = await typedQuery<DashboardFilterRow>(
        'SELECT * FROM dashboard_filters WHERE dashboard_id = $1',
        [dashboardId]
    );
    return result.rows[0] ? dashboardFilterToCamelCase(result.rows[0]) : null;
};

export const saveFilter = async (dashboardId: string, input: DashboardFilterInput): Promise<DashboardFilter> => {
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
    const result = await typedQuery<DashboardFilterRow>(sql, params);
    return dashboardFilterToCamelCase(result.rows[0]);
};

export const clearFilter = async (dashboardId: string): Promise<DashboardFilter | null> => {
    const result = await typedQuery<DashboardFilterRow>(
        'DELETE FROM dashboard_filters WHERE dashboard_id = $1 RETURNING *',
        [dashboardId]
    );
    return result.rows[0] ? dashboardFilterToCamelCase(result.rows[0]) : null;
};

import { typedQuery } from '../../db/connection';
import type { DashboardGridItemRow, DashboardGridItem } from './types';
import { dashboardGridItemToCamelCase } from './mapper';
import type { DashboardGridItemInput } from '../../generated/graphql';

export const findGridItemsByDashboard = async (dashboardId: string): Promise<DashboardGridItem[]> => {
    const sql = 'SELECT * FROM dashboard_grid_items WHERE dashboard_id = $1 ORDER BY display_order, created_at';
    const result = await typedQuery<DashboardGridItemRow>(sql, [dashboardId]);
    return result.rows.map(dashboardGridItemToCamelCase);
};

export const addGridItem = async (dashboardId: string, input: DashboardGridItemInput): Promise<DashboardGridItem> => {
    const sql = `
        INSERT INTO dashboard_grid_items (
            dashboard_id, graph_id, grid_column, grid_row,
            grid_width, grid_height, display_order
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (dashboard_id, graph_id)
        DO UPDATE SET
            grid_column = EXCLUDED.grid_column,
            grid_row = EXCLUDED.grid_row,
            grid_width = EXCLUDED.grid_width,
            grid_height = EXCLUDED.grid_height,
            display_order = EXCLUDED.display_order
        RETURNING *
    `;
    const params = [
        dashboardId,
        input.graphId,
        input.gridColumn ?? null,
        input.gridRow ?? null,
        input.gridWidth ?? null,
        input.gridHeight ?? null,
        input.displayOrder ?? null,
    ];
    const result = await typedQuery<DashboardGridItemRow>(sql, params);
    return dashboardGridItemToCamelCase(result.rows[0]);
};

export const updateGridItem = async (id: string, input: DashboardGridItemInput): Promise<DashboardGridItem | null> => {
    const setClauses: string[] = [];
    const params: (string | number | null)[] = [id];
    let paramIndex = 2;

    if (input.gridColumn != null) {
        setClauses.push(`grid_column = $${paramIndex++}`);
        params.push(input.gridColumn);
    }
    if (input.gridRow != null) {
        setClauses.push(`grid_row = $${paramIndex++}`);
        params.push(input.gridRow);
    }
    if (input.gridWidth != null) {
        setClauses.push(`grid_width = $${paramIndex++}`);
        params.push(input.gridWidth);
    }
    if (input.gridHeight != null) {
        setClauses.push(`grid_height = $${paramIndex++}`);
        params.push(input.gridHeight);
    }
    if (input.displayOrder != null) {
        setClauses.push(`display_order = $${paramIndex++}`);
        params.push(input.displayOrder);
    }

    if (setClauses.length === 0) {
        return null;
    }

    const sql = `
        UPDATE dashboard_grid_items
        SET ${setClauses.join(', ')}
        WHERE id = $1
        RETURNING *
    `;
    const result = await typedQuery<DashboardGridItemRow>(sql, params);
    return result.rows[0] ? dashboardGridItemToCamelCase(result.rows[0]) : null;
};

export const removeGridItem = async (id: string): Promise<DashboardGridItem | null> => {
    const result = await typedQuery<DashboardGridItemRow>(
        'DELETE FROM dashboard_grid_items WHERE id = $1 RETURNING *',
        [id]
    );
    return result.rows[0] ? dashboardGridItemToCamelCase(result.rows[0]) : null;
};

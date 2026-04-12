import { typedQuery } from '../../db/connection';
import type { DashboardGridItemRow, DashboardGridItem } from './types';
import { dashboardGridItemToCamelCase } from './mapper';
import type { DashboardGridItemInput } from '../../generated/graphql';

export const findGridItemsByDashboard = async (dashboardId: string): Promise<DashboardGridItem[]> => {
    const sql = 'SELECT * FROM dashboard_grid_items WHERE dashboard_id = $1 ORDER BY grid_row, grid_column, created_at';
    const result = await typedQuery<DashboardGridItemRow>(sql, [dashboardId]);
    return result.rows.map(dashboardGridItemToCamelCase);
};

const GRID_COLUMNS = 6;
const DEFAULT_WIDTH = 3;
const DEFAULT_HEIGHT = 3;

/** Build a set of all occupied cell keys ("col,row") from existing grid items. */
const buildOccupancySet = (items: DashboardGridItemRow[]): Set<string> => {
    const occupied = new Set<string>();
    for (const item of items) {
        const col = item.grid_column ?? 1;
        const row = item.grid_row ?? 1;
        const w = item.grid_width ?? DEFAULT_WIDTH;
        const h = item.grid_height ?? DEFAULT_HEIGHT;
        for (let c = col; c < col + w; c++) {
            for (let r = row; r < row + h; r++) {
                occupied.add(`${c},${r}`);
            }
        }
    }
    return occupied;
};

/** Check whether a rectangle of (width x height) fits at (col, row) without overlapping occupied cells. */
const fitsAt = (occupied: Set<string>, col: number, row: number, width: number, height: number): boolean => {
    for (let c = col; c < col + width; c++) {
        for (let r = row; r < row + height; r++) {
            if (occupied.has(`${c},${r}`)) return false;
        }
    }
    return true;
};

/** Find the next open grid position that fits an item of the given size. */
const findNextOpenPosition = (
    existing: DashboardGridItemRow[],
    width: number,
    height: number,
): { column: number; row: number } => {
    const occupied = buildOccupancySet(existing);

    const maxRow = existing.reduce((max, item) => {
        const bottom = (item.grid_row ?? 1) + (item.grid_height ?? DEFAULT_HEIGHT) - 1;
        return Math.max(max, bottom);
    }, 0);

    for (let row = 1; row <= maxRow + height + 1; row++) {
        for (let col = 1; col <= GRID_COLUMNS - width + 1; col++) {
            if (fitsAt(occupied, col, row, width, height)) {
                return { column: col, row };
            }
        }
    }

    return { column: 1, row: maxRow + 1 };
};

export const addGridItem = async (dashboardId: string, input: DashboardGridItemInput): Promise<DashboardGridItem> => {
    const width = input.gridWidth ?? DEFAULT_WIDTH;
    const height = input.gridHeight ?? DEFAULT_HEIGHT;

    // If no explicit position, find the next open slot
    let gridColumn = input.gridColumn;
    let gridRow = input.gridRow;
    if (gridColumn == null || gridRow == null) {
        const existingResult = await typedQuery<DashboardGridItemRow>(
            'SELECT * FROM dashboard_grid_items WHERE dashboard_id = $1',
            [dashboardId]
        );
        const position = findNextOpenPosition(existingResult.rows, width, height);
        gridColumn = gridColumn ?? position.column;
        gridRow = gridRow ?? position.row;
    }

    const sql = `
        INSERT INTO dashboard_grid_items (
            dashboard_id, graph_id, grid_column, grid_row,
            grid_width, grid_height
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (dashboard_id, graph_id)
        DO UPDATE SET
            grid_column = EXCLUDED.grid_column,
            grid_row = EXCLUDED.grid_row,
            grid_width = EXCLUDED.grid_width,
            grid_height = EXCLUDED.grid_height
        RETURNING *
    `;
    const params = [
        dashboardId,
        input.graphId,
        gridColumn,
        gridRow,
        width,
        height,
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

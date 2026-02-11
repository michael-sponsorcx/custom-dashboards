import { typedQuery } from '../../db/connection';
import type { DashboardRow, Dashboard } from './types';
import { dashboardToCamelCase } from './mapper';
import type { DashboardInput } from '../../generated/graphql';

export const findAllDashboards = async (organizationId?: string | null): Promise<Dashboard[]> => {
    const sql = organizationId
        ? 'SELECT * FROM dashboards WHERE organization_id = $1 ORDER BY updated_at DESC'
        : 'SELECT * FROM dashboards ORDER BY updated_at DESC';
    const params = organizationId ? [organizationId] : [];
    const result = await typedQuery<DashboardRow>(sql, params);
    return result.rows.map(dashboardToCamelCase);
};

export const findDashboardById = async (id: string): Promise<Dashboard | null> => {
    const result = await typedQuery<DashboardRow>(
        'SELECT * FROM dashboards WHERE id = $1',
        [id]
    );
    return result.rows[0] ? dashboardToCamelCase(result.rows[0]) : null;
};

export const createDashboard = async (input: DashboardInput, organizationId?: string | null): Promise<Dashboard> => {
    const sql = `
        INSERT INTO dashboards (organization_id, name, layout)
        VALUES ($1, $2, $3)
        RETURNING *
    `;
    const params = [organizationId ?? null, input.name, input.layout];
    const result = await typedQuery<DashboardRow>(sql, params);
    return dashboardToCamelCase(result.rows[0]);
};

export const updateDashboard = async (id: string, input: DashboardInput): Promise<Dashboard | null> => {
    const sql = `
        UPDATE dashboards
        SET name = $2, layout = $3
        WHERE id = $1
        RETURNING *
    `;
    const params = [id, input.name, input.layout];
    const result = await typedQuery<DashboardRow>(sql, params);
    return result.rows[0] ? dashboardToCamelCase(result.rows[0]) : null;
};

export const deleteDashboard = async (id: string): Promise<Dashboard | null> => {
    const result = await typedQuery<DashboardRow>(
        'DELETE FROM dashboards WHERE id = $1 RETURNING *',
        [id]
    );
    return result.rows[0] ? dashboardToCamelCase(result.rows[0]) : null;
};

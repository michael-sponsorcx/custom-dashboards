import type { DashboardRow, Dashboard } from './types';

/** Convert a dashboard database row to camelCase for GraphQL */
export const dashboardToCamelCase = (row: DashboardRow): Dashboard => ({
    id: row.id,
    organizationId: row.organization_id,
    name: row.name,
    layout: row.layout,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
});

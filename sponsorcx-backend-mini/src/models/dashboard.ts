/** Database row type for dashboards table (snake_case) */
export interface DashboardRow {
    id: string;
    organization_id: string | null;
    name: string;
    layout: string;
    created_at: Date;
    updated_at: Date;
}

/** Resolved type for Dashboard (camelCase for GraphQL) */
export interface Dashboard {
    id: string;
    organizationId: string | null;
    name: string;
    layout: string;
    createdAt: Date;
    updatedAt: Date;
}

/** Convert a dashboard database row to camelCase for GraphQL */
export const dashboardToCamelCase = (row: DashboardRow): Dashboard => ({
    id: row.id,
    organizationId: row.organization_id,
    name: row.name,
    layout: row.layout,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
});

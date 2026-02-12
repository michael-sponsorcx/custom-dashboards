/** Database row type for dashboards table (snake_case) */
export interface DashboardRow {
    id: string;
    organization_id: string | null;
    name: string;
    layout: string;
    created_at: Date;
    updated_at: Date;
}

/** Resolved Dashboard type (camelCase for GraphQL) */
export interface Dashboard {
    id: string;
    organizationId: string | null;
    name: string;
    layout: string;
    createdAt: Date;
    updatedAt: Date;
}

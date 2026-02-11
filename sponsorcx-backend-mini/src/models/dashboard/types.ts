import type { Dashboard as CodegenDashboard } from '../../generated/graphql';

/** Database row type for dashboards table (snake_case) */
export interface DashboardRow {
    id: string;
    organization_id: string | null;
    name: string;
    layout: string;
    created_at: Date;
    updated_at: Date;
}

/**
 * Resolved Dashboard type (camelCase for GraphQL).
 * Overrides: date fields (pg Date vs codegen string), layout (string vs LayoutType enum)
 */
type DashboardOverrides = {
    layout: string;
    createdAt: Date;
    updatedAt: Date;
};

export type Dashboard = Omit<CodegenDashboard, '__typename' | keyof DashboardOverrides> & DashboardOverrides;

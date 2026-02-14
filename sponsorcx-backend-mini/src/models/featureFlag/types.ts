/** Database row type for feature_flags table (snake_case) */
export interface FeatureFlagRow {
    id: string;
    name: string;
    description: string | null;
    key: string;
    default_value: boolean;
    rules: unknown[];
    tags: unknown[];
    archived: boolean;
    metadata: Record<string, unknown> | null;
    permanent: boolean;
    created_at: Date;
    updated_at: Date;
}

/** Resolved FeatureFlag type (camelCase for GraphQL) */
export interface FeatureFlag {
    id: string;
    name: string;
    description: string | null;
    key: string;
    defaultValue: boolean;
    rules: unknown[];
    tags: unknown[];
    archived: boolean;
    metadata: Record<string, unknown> | null;
    permanent: boolean;
    createdAt: Date;
    updatedAt: Date;
}

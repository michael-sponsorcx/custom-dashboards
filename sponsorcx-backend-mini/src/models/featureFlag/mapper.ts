import type { FeatureFlagRow, FeatureFlag } from './types';

/** Convert a feature_flags database row to camelCase for GraphQL */
export const featureFlagToCamelCase = (row: FeatureFlagRow): FeatureFlag => ({
    id: row.id,
    name: row.name,
    description: row.description,
    key: row.key,
    defaultValue: row.default_value,
    rules: row.rules,
    tags: row.tags,
    archived: row.archived,
    metadata: row.metadata,
    permanent: row.permanent,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
});

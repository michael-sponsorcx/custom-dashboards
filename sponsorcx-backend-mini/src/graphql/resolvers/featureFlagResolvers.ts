/**
 * Feature Flag Resolvers
 * GraphQL resolvers for querying feature flags
 */

import { GraphQLNonNull, GraphQLString } from 'graphql';
import { FeatureFlagType } from '../types';
import { findFeatureFlagByKey } from '../../models/featureFlag';

// ============================================================================
// Queries
// ============================================================================

export const featureFlagQueries = {
    /**
     * Fetch a feature flag by its unique key
     */
    featureFlag: {
        type: FeatureFlagType,
        args: {
            key: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: async (_: unknown, { key }: { key: string }) =>
            findFeatureFlagByKey(key),
    },
};

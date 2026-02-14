/**
 * KPI Threshold Resolvers
 * GraphQL resolvers for managing KPI threshold-based alerts
 */

import { GraphQLNonNull, GraphQLID, GraphQLList, GraphQLBoolean } from 'graphql';
import { KpiThresholdType, CreateKpiThresholdInput as CreateKpiThresholdInputType } from '../types';
import { findThresholdsByGraph, createKpiThreshold, deleteKpiThreshold, toggleKpiThresholdActive } from '../../models/kpiThreshold';
import type {
    QueryKpiThresholdsByGraphArgs,
    MutationCreateKpiThresholdArgs,
    MutationDeleteKpiThresholdArgs,
    MutationToggleKpiThresholdActiveArgs,
} from '../../generated/graphql';

// ============================================================================
// Queries
// ============================================================================

export const kpiThresholdQueries = {
    /**
     * Fetch all KPI thresholds for a specific graph
     */
    kpiThresholdsByGraph: {
        type: new GraphQLList(KpiThresholdType),
        args: {
            graphId: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: unknown, args: QueryKpiThresholdsByGraphArgs) =>
            findThresholdsByGraph(args.graphId),
    },
};

// ============================================================================
// Mutations
// ============================================================================

export const kpiThresholdMutations = {
    /**
     * Create a new KPI threshold alert for a graph
     */
    createKpiThreshold: {
        type: KpiThresholdType,
        args: {
            organizationId: { type: new GraphQLNonNull(GraphQLID) },
            input: { type: new GraphQLNonNull(CreateKpiThresholdInputType) },
        },
        resolve: async (_: unknown, args: MutationCreateKpiThresholdArgs) =>
            createKpiThreshold(args.organizationId, args.input),
    },
    /**
     * Delete a KPI threshold by ID
     */
    deleteKpiThreshold: {
        type: GraphQLBoolean,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: unknown, args: MutationDeleteKpiThresholdArgs) =>
            deleteKpiThreshold(args.id),
    },
    /**
     * Toggle a KPI threshold's active status
     */
    toggleKpiThresholdActive: {
        type: KpiThresholdType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            isActive: { type: new GraphQLNonNull(GraphQLBoolean) },
        },
        resolve: async (_: unknown, args: MutationToggleKpiThresholdActiveArgs) =>
            toggleKpiThresholdActive(args.id, args.isActive),
    },
};

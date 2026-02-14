/**
 * KPI Schedule Resolvers
 * GraphQL resolvers for managing KPI schedule-based alerts
 */

import { GraphQLNonNull, GraphQLID, GraphQLList, GraphQLBoolean } from 'graphql';
import { KpiScheduleType, CreateKpiScheduleInput as CreateKpiScheduleInputType } from '../types';
import { findSchedulesByGraph, createKpiSchedule, deleteKpiSchedule, toggleKpiScheduleActive } from '../../models/kpiSchedule';
import type {
    QueryKpiSchedulesByGraphArgs,
    MutationCreateKpiScheduleArgs,
    MutationDeleteKpiScheduleArgs,
    MutationToggleKpiScheduleActiveArgs,
} from '../../generated/graphql';

// ============================================================================
// Queries
// ============================================================================

export const kpiScheduleQueries = {
    /**
     * Fetch all KPI schedules for a specific graph
     */
    kpiSchedulesByGraph: {
        type: new GraphQLList(KpiScheduleType),
        args: {
            graphId: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: unknown, args: QueryKpiSchedulesByGraphArgs) =>
            findSchedulesByGraph(args.graphId),
    },
};

// ============================================================================
// Mutations
// ============================================================================

export const kpiScheduleMutations = {
    /**
     * Create a new KPI schedule alert for a graph
     */
    createKpiSchedule: {
        type: KpiScheduleType,
        args: {
            organizationId: { type: new GraphQLNonNull(GraphQLID) },
            input: { type: new GraphQLNonNull(CreateKpiScheduleInputType) },
        },
        resolve: async (_: unknown, args: MutationCreateKpiScheduleArgs) =>
            createKpiSchedule(args.organizationId, args.input),
    },
    /**
     * Delete a KPI schedule by ID
     */
    deleteKpiSchedule: {
        type: GraphQLBoolean,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: unknown, args: MutationDeleteKpiScheduleArgs) =>
            deleteKpiSchedule(args.id),
    },
    /**
     * Toggle a KPI schedule's active status
     */
    toggleKpiScheduleActive: {
        type: KpiScheduleType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            isActive: { type: new GraphQLNonNull(GraphQLBoolean) },
        },
        resolve: async (_: unknown, args: MutationToggleKpiScheduleActiveArgs) =>
            toggleKpiScheduleActive(args.id, args.isActive),
    },
};

/**
 * Dashboard Schedule Resolvers
 * GraphQL resolvers for managing scheduled dashboard email deliveries
 */

import { GraphQLNonNull, GraphQLID, GraphQLList, GraphQLBoolean } from 'graphql';
import { DashboardScheduleType, DashboardScheduleInput as DashboardScheduleInputType } from '../types';
import {
    findAllDashboardSchedules,
    findDashboardScheduleById,
    findDashboardSchedulesByDashboard,
    createDashboardSchedule,
    updateDashboardSchedule,
    deleteDashboardSchedule,
} from '../../models/dashboardSchedule';
import type {
    QueryDashboardSchedulesArgs,
    QueryDashboardScheduleArgs,
    QueryDashboardSchedulesByDashboardArgs,
    MutationCreateDashboardScheduleArgs,
    MutationUpdateDashboardScheduleArgs,
    MutationDeleteDashboardScheduleArgs,
} from '../../generated/graphql';

// ============================================================================
// Queries
// ============================================================================

export const dashboardScheduleQueries = {
    /**
     * Fetch all dashboard schedules, optionally filtered by organization and active status
     */
    dashboardSchedules: {
        type: new GraphQLList(DashboardScheduleType),
        args: {
            organizationId: { type: GraphQLID },
            isActive: { type: GraphQLBoolean },
        },
        resolve: async (_: unknown, args: QueryDashboardSchedulesArgs) =>
            findAllDashboardSchedules(args.organizationId ?? undefined, args.isActive ?? undefined),
    },
    /**
     * Fetch a single dashboard schedule by ID
     */
    dashboardSchedule: {
        type: DashboardScheduleType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: unknown, args: QueryDashboardScheduleArgs) =>
            findDashboardScheduleById(args.id),
    },
    /**
     * Fetch all schedules associated with a specific dashboard
     */
    dashboardSchedulesByDashboard: {
        type: new GraphQLList(DashboardScheduleType),
        args: {
            dashboardId: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: unknown, args: QueryDashboardSchedulesByDashboardArgs) =>
            findDashboardSchedulesByDashboard(args.dashboardId),
    },
};

// ============================================================================
// Mutations
// ============================================================================

export const dashboardScheduleMutations = {
    /**
     * Create a new dashboard schedule for an organization
     */
    createDashboardSchedule: {
        type: DashboardScheduleType,
        args: {
            organizationId: { type: new GraphQLNonNull(GraphQLID) },
            input: { type: new GraphQLNonNull(DashboardScheduleInputType) },
        },
        resolve: async (_: unknown, args: MutationCreateDashboardScheduleArgs) =>
            createDashboardSchedule(args.organizationId, args.input),
    },
    /**
     * Update an existing dashboard schedule by ID
     */
    updateDashboardSchedule: {
        type: DashboardScheduleType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            input: { type: new GraphQLNonNull(DashboardScheduleInputType) },
        },
        resolve: async (_: unknown, args: MutationUpdateDashboardScheduleArgs) =>
            updateDashboardSchedule(args.id, args.input),
    },
    /**
     * Delete a dashboard schedule by ID
     */
    deleteDashboardSchedule: {
        type: GraphQLBoolean,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: unknown, args: MutationDeleteDashboardScheduleArgs) =>
            deleteDashboardSchedule(args.id),
    },
};

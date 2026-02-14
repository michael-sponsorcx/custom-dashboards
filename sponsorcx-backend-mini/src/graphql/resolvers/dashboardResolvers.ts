/**
 * Dashboard Resolvers
 * GraphQL resolvers for managing dashboards, grid items, and dashboard filters
 */

import { GraphQLNonNull, GraphQLID, GraphQLList } from 'graphql';
import {
    DashboardType,
    DashboardInput,
    DashboardGridItemType,
    DashboardGridItemInput,
    DashboardFilterType,
    DashboardFilterInput,
} from '../types';
import { findAllDashboards, findDashboardById, createDashboard, updateDashboard, deleteDashboard } from '../../models/dashboard';
import { findGridItemsByDashboard, addGridItem, updateGridItem, removeGridItem } from '../../models/dashboardGridItem';
import { findFilterByDashboard, saveFilter, clearFilter } from '../../models/dashboardFilter';
import { findGraphById } from '../../models/graph';
import type { DashboardGridItem } from '../../models';
import type {
    QueryDashboardsArgs,
    QueryDashboardArgs,
    QueryDashboardGridItemsArgs,
    QueryDashboardFilterArgs,
    MutationCreateDashboardArgs,
    MutationUpdateDashboardArgs,
    MutationDeleteDashboardArgs,
    MutationAddDashboardGridItemArgs,
    MutationUpdateDashboardGridItemArgs,
    MutationRemoveDashboardGridItemArgs,
    MutationSaveDashboardFilterArgs,
    MutationClearDashboardFilterArgs,
} from '../../generated/graphql';

// ============================================================================
// Queries
// ============================================================================

export const dashboardQueries = {
    /**
     * Fetch all dashboards, optionally filtered by organization
     */
    dashboards: {
        type: new GraphQLList(DashboardType),
        args: {
            organizationId: { type: GraphQLID },
        },
        resolve: async (_: unknown, { organizationId }: QueryDashboardsArgs) =>
            findAllDashboards(organizationId),
    },
    /**
     * Fetch a single dashboard by ID
     */
    dashboard: {
        type: DashboardType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: unknown, { id }: QueryDashboardArgs) =>
            findDashboardById(id),
    },
    /**
     * Fetch all grid items for a dashboard (includes graph data via field resolver)
     */
    dashboardGridItems: {
        type: new GraphQLList(DashboardGridItemType),
        args: {
            dashboardId: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: unknown, { dashboardId }: QueryDashboardGridItemsArgs) =>
            findGridItemsByDashboard(dashboardId),
    },
    /**
     * Fetch the filter configuration for a dashboard
     */
    dashboardFilter: {
        type: DashboardFilterType,
        args: {
            dashboardId: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: unknown, { dashboardId }: QueryDashboardFilterArgs) =>
            findFilterByDashboard(dashboardId),
    },
};

// ============================================================================
// Mutations
// ============================================================================

export const dashboardMutations = {
    /**
     * Create a new dashboard
     */
    createDashboard: {
        type: DashboardType,
        args: {
            input: { type: new GraphQLNonNull(DashboardInput) },
            organizationId: { type: GraphQLID },
        },
        resolve: async (_: unknown, { input, organizationId }: MutationCreateDashboardArgs) =>
            createDashboard(input, organizationId),
    },
    /**
     * Update an existing dashboard by ID
     */
    updateDashboard: {
        type: DashboardType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            input: { type: new GraphQLNonNull(DashboardInput) },
        },
        resolve: async (_: unknown, { id, input }: MutationUpdateDashboardArgs) =>
            updateDashboard(id, input),
    },
    /**
     * Delete a dashboard by ID
     */
    deleteDashboard: {
        type: DashboardType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: unknown, { id }: MutationDeleteDashboardArgs) =>
            deleteDashboard(id),
    },
    /**
     * Add a grid item (graph placement) to a dashboard
     */
    addDashboardGridItem: {
        type: DashboardGridItemType,
        args: {
            dashboardId: { type: new GraphQLNonNull(GraphQLID) },
            input: { type: new GraphQLNonNull(DashboardGridItemInput) },
        },
        resolve: async (_: unknown, { dashboardId, input }: MutationAddDashboardGridItemArgs) =>
            addGridItem(dashboardId, input),
    },
    /**
     * Update a grid item's position or size
     */
    updateDashboardGridItem: {
        type: DashboardGridItemType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            input: { type: new GraphQLNonNull(DashboardGridItemInput) },
        },
        resolve: async (_: unknown, { id, input }: MutationUpdateDashboardGridItemArgs) =>
            updateGridItem(id, input),
    },
    /**
     * Remove a grid item from a dashboard
     */
    removeDashboardGridItem: {
        type: DashboardGridItemType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: unknown, { id }: MutationRemoveDashboardGridItemArgs) =>
            removeGridItem(id),
    },
    /**
     * Save or update a dashboard's filter configuration
     */
    saveDashboardFilter: {
        type: DashboardFilterType,
        args: {
            dashboardId: { type: new GraphQLNonNull(GraphQLID) },
            input: { type: new GraphQLNonNull(DashboardFilterInput) },
        },
        resolve: async (_: unknown, { dashboardId, input }: MutationSaveDashboardFilterArgs) =>
            saveFilter(dashboardId, input),
    },
    /**
     * Clear all filters for a dashboard
     */
    clearDashboardFilter: {
        type: DashboardFilterType,
        args: {
            dashboardId: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: unknown, { dashboardId }: MutationClearDashboardFilterArgs) =>
            clearFilter(dashboardId),
    },
};

// ============================================================================
// Field Resolvers
// ============================================================================

// Resolves DashboardGridItem.graph — loads the associated graph for each grid item.
// This loads graphs one at a time, we may need to consider batching this in the future.
const graphField = DashboardGridItemType.getFields().graph;
graphField.resolve = async (parent: DashboardGridItem) => {
    if (!parent.graphId) return null;
    return findGraphById(parent.graphId);
};

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

export const dashboardQueries = {
    dashboards: {
        type: new GraphQLList(DashboardType),
        args: {
            organizationId: { type: GraphQLID },
        },
        resolve: async (_: unknown, { organizationId }: QueryDashboardsArgs) =>
            findAllDashboards(organizationId),
    },
    dashboard: {
        type: DashboardType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: unknown, { id }: QueryDashboardArgs) =>
            findDashboardById(id),
    },
    dashboardGridItems: {
        type: new GraphQLList(DashboardGridItemType),
        args: {
            dashboardId: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: unknown, { dashboardId }: QueryDashboardGridItemsArgs) =>
            findGridItemsByDashboard(dashboardId),
    },
    dashboardFilter: {
        type: DashboardFilterType,
        args: {
            dashboardId: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: unknown, { dashboardId }: QueryDashboardFilterArgs) =>
            findFilterByDashboard(dashboardId),
    },
};

export const dashboardMutations = {
    createDashboard: {
        type: DashboardType,
        args: {
            input: { type: new GraphQLNonNull(DashboardInput) },
            organizationId: { type: GraphQLID },
        },
        resolve: async (_: unknown, { input, organizationId }: MutationCreateDashboardArgs) =>
            createDashboard(input, organizationId),
    },
    updateDashboard: {
        type: DashboardType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            input: { type: new GraphQLNonNull(DashboardInput) },
        },
        resolve: async (_: unknown, { id, input }: MutationUpdateDashboardArgs) =>
            updateDashboard(id, input),
    },
    deleteDashboard: {
        type: DashboardType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: unknown, { id }: MutationDeleteDashboardArgs) =>
            deleteDashboard(id),
    },
    addDashboardGridItem: {
        type: DashboardGridItemType,
        args: {
            dashboardId: { type: new GraphQLNonNull(GraphQLID) },
            input: { type: new GraphQLNonNull(DashboardGridItemInput) },
        },
        resolve: async (_: unknown, { dashboardId, input }: MutationAddDashboardGridItemArgs) =>
            addGridItem(dashboardId, input),
    },
    updateDashboardGridItem: {
        type: DashboardGridItemType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            input: { type: new GraphQLNonNull(DashboardGridItemInput) },
        },
        resolve: async (_: unknown, { id, input }: MutationUpdateDashboardGridItemArgs) =>
            updateGridItem(id, input),
    },
    removeDashboardGridItem: {
        type: DashboardGridItemType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: unknown, { id }: MutationRemoveDashboardGridItemArgs) =>
            removeGridItem(id),
    },
    saveDashboardFilter: {
        type: DashboardFilterType,
        args: {
            dashboardId: { type: new GraphQLNonNull(GraphQLID) },
            input: { type: new GraphQLNonNull(DashboardFilterInput) },
        },
        resolve: async (_: unknown, { dashboardId, input }: MutationSaveDashboardFilterArgs) =>
            saveFilter(dashboardId, input),
    },
    clearDashboardFilter: {
        type: DashboardFilterType,
        args: {
            dashboardId: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: unknown, { dashboardId }: MutationClearDashboardFilterArgs) =>
            clearFilter(dashboardId),
    },
};

// Field resolver for DashboardGridItem.graph — loads the associated graph
// This loads graphs one at a time, we may need to consider batching this in the future.
const graphField = DashboardGridItemType.getFields().graph;
graphField.resolve = async (parent: DashboardGridItem) => {
    if (!parent.graphId) return null;
    return findGraphById(parent.graphId);
};

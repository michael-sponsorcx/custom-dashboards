import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLList,
    GraphQLInt,
    GraphQLInputObjectType,
    GraphQLNonNull,
} from 'graphql';
import { GraphQLJSON } from 'graphql-scalars';
import { LayoutTypeEnum } from './sharedResolversTypes';
import { GraphType } from './graphResolversTypes';

export const DashboardType = new GraphQLObjectType({
    name: 'Dashboard',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLID) },
        organizationId: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        layout: { type: new GraphQLNonNull(LayoutTypeEnum) },
        createdAt: { type: new GraphQLNonNull(GraphQLString) },
        updatedAt: { type: new GraphQLNonNull(GraphQLString) },
    }),
});

export const DashboardGridItemType = new GraphQLObjectType({
    name: 'DashboardGridItem',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLID) },
        dashboardId: { type: new GraphQLNonNull(GraphQLID) },
        graphId: { type: new GraphQLNonNull(GraphQLID) },
        gridColumn: { type: GraphQLInt },
        gridRow: { type: GraphQLInt },
        gridWidth: { type: GraphQLInt },
        gridHeight: { type: GraphQLInt },
        displayOrder: { type: GraphQLInt },
        graph: {
            type: GraphType,
        },
    }),
});

export const DashboardFilterType = new GraphQLObjectType({
    name: 'DashboardFilter',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLID) },
        dashboardId: { type: new GraphQLNonNull(GraphQLID) },
        selectedViews: { type: new GraphQLList(GraphQLString) },
        availableFields: { type: GraphQLJSON },
        activeFilters: { type: GraphQLJSON },
        createdAt: { type: new GraphQLNonNull(GraphQLString) },
        updatedAt: { type: new GraphQLNonNull(GraphQLString) },
    }),
});

export const DashboardInput = new GraphQLInputObjectType({
    name: 'DashboardInput',
    fields: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        layout: { type: new GraphQLNonNull(LayoutTypeEnum) },
    },
});

export const DashboardGridItemInput = new GraphQLInputObjectType({
    name: 'DashboardGridItemInput',
    fields: {
        graphId: { type: new GraphQLNonNull(GraphQLID) },
        gridColumn: { type: GraphQLInt },
        gridRow: { type: GraphQLInt },
        gridWidth: { type: GraphQLInt },
        gridHeight: { type: GraphQLInt },
        displayOrder: { type: GraphQLInt },
    },
});

export const DashboardFilterInput = new GraphQLInputObjectType({
    name: 'DashboardFilterInput',
    fields: {
        selectedViews: { type: new GraphQLList(GraphQLString) },
        availableFields: { type: GraphQLJSON },
        activeFilters: { type: GraphQLJSON },
    },
});

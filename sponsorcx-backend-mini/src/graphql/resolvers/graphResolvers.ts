import { GraphQLNonNull, GraphQLID, GraphQLList } from 'graphql';
import { GraphType, GraphInput } from '../types';
import { findAllGraphs, findGraphById, createGraph, updateGraph, deleteGraph } from '../../models/graph';
import type {
    QueryGraphsArgs,
    QueryGraphArgs,
    MutationCreateGraphArgs,
    MutationUpdateGraphArgs,
    MutationDeleteGraphArgs,
} from '../../generated/graphql';

export const graphQueries = {
    graphs: {
        type: new GraphQLList(GraphType),
        args: {
            organizationId: { type: GraphQLID },
        },
        resolve: async (_: unknown, { organizationId }: QueryGraphsArgs) =>
            findAllGraphs(organizationId),
    },
    graph: {
        type: GraphType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: unknown, { id }: QueryGraphArgs) =>
            findGraphById(id),
    },
};

export const graphMutations = {
    createGraph: {
        type: GraphType,
        args: {
            input: { type: new GraphQLNonNull(GraphInput) },
            organizationId: { type: GraphQLID },
        },
        resolve: async (_: unknown, { input, organizationId }: MutationCreateGraphArgs) =>
            createGraph(input, organizationId),
    },
    updateGraph: {
        type: GraphType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            input: { type: new GraphQLNonNull(GraphInput) },
        },
        resolve: async (_: unknown, { id, input }: MutationUpdateGraphArgs) =>
            updateGraph(id, input),
    },
    deleteGraph: {
        type: GraphType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: unknown, { id }: MutationDeleteGraphArgs) =>
            deleteGraph(id),
    },
};

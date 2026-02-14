/**
 * Graph Resolvers
 * GraphQL resolvers for managing graph templates (chart configurations)
 */

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

// ============================================================================
// Queries
// ============================================================================

export const graphQueries = {
    /**
     * Fetch all graphs, optionally filtered by organization
     */
    graphs: {
        type: new GraphQLList(GraphType),
        args: {
            organizationId: { type: GraphQLID },
        },
        resolve: async (_: unknown, { organizationId }: QueryGraphsArgs) =>
            findAllGraphs(organizationId),
    },
    /**
     * Fetch a single graph by ID
     */
    graph: {
        type: GraphType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: unknown, { id }: QueryGraphArgs) =>
            findGraphById(id),
    },
};

// ============================================================================
// Mutations
// ============================================================================

export const graphMutations = {
    /**
     * Create a new graph template
     */
    createGraph: {
        type: GraphType,
        args: {
            input: { type: new GraphQLNonNull(GraphInput) },
            organizationId: { type: GraphQLID },
        },
        resolve: async (_: unknown, { input, organizationId }: MutationCreateGraphArgs) =>
            createGraph(input, organizationId),
    },
    /**
     * Update an existing graph template by ID
     */
    updateGraph: {
        type: GraphType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            input: { type: new GraphQLNonNull(GraphInput) },
        },
        resolve: async (_: unknown, { id, input }: MutationUpdateGraphArgs) =>
            updateGraph(id, input),
    },
    /**
     * Delete a graph template by ID
     */
    deleteGraph: {
        type: GraphType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: unknown, { id }: MutationDeleteGraphArgs) =>
            deleteGraph(id),
    },
};

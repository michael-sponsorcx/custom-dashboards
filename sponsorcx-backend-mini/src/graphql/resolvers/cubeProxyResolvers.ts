/**
 * Cube API Proxy Resolvers
 * GraphQL resolvers that proxy requests to Cube.js API
 */

import { GraphQLNonNull, GraphQLString } from 'graphql';
import { GraphQLJSON } from 'graphql-scalars';
import {
    executeCubeGraphQL,
    fetchCubeMetadata,
    fetchCubeSchema,
    fetchDimensionValues,
} from '../../services/cubeApiClient';
import {
    CubeSchemaType,
    CubeDimensionValuesType,
    CubeMetadataType,
    type CubeMetadataResponse,
} from '../types';
import type {
    QueryCubeQueryArgs,
    QueryCubeDimensionValuesArgs,
} from '../../generated/graphql';

// ============================================================================
// Queries
// ============================================================================

export const cubeProxyQueries = {
    /**
     * Execute a GraphQL query against Cube API
     * Returns raw JSON response from Cube
     */
    cubeQuery: {
        type: GraphQLJSON,
        args: {
            query: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: async (_: unknown, args: QueryCubeQueryArgs): Promise<unknown> => {
            const { query } = args;

            if (!query || typeof query !== 'string') {
                throw new Error('Query parameter is required and must be a string');
            }

            return await executeCubeGraphQL(query);
        },
    },

    /**
     * Fetch Cube metadata (cubes, dimensions, measures)
     * Cached for CUBE_METADATA_CACHE_TTL minutes
     */
    cubeMetadata: {
        type: CubeMetadataType,
        resolve: async (): Promise<CubeMetadataResponse> => {
            return await fetchCubeMetadata();
        },
    },

    /**
     * Fetch available filter operators from Cube GraphQL schema
     * Cached for CUBE_SCHEMA_CACHE_TTL minutes
     */
    cubeSchema: {
        type: CubeSchemaType,
        resolve: async (): Promise<{ operators: string[] }> => {
            const operators = await fetchCubeSchema();
            return { operators };
        },
    },

    /**
     * Fetch distinct values for a specific dimension
     */
    cubeDimensionValues: {
        type: CubeDimensionValuesType,
        args: {
            view: { type: new GraphQLNonNull(GraphQLString) },
            dimension: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: async (_: unknown, args: QueryCubeDimensionValuesArgs): Promise<{ values: string[] }> => {
            const { view, dimension } = args;

            if (!view || !dimension) {
                throw new Error('View and dimension parameters are required');
            }

            const values = await fetchDimensionValues(view, dimension);
            return { values };
        },
    },
};

import { GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
import { graphQueries, graphMutations } from './graphql/resolvers/graphTemplateResolvers';
import { dashboardQueries, dashboardMutations } from './graphql/resolvers/dashboardResolvers';
import { cubeProxyQueries } from './graphql/resolvers/cubeProxyResolvers';

// Define Query type with all queries
const QueryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        hello: {
            type: GraphQLString,
            resolve: () => 'Hello from SponsorCX Backend!',
        },
        status: {
            type: GraphQLString,
            resolve: () => 'Backend is running successfully',
        },
        // Graph queries
        ...graphQueries,
        // Dashboard queries
        ...dashboardQueries,
        // Cube API Proxy queries
        ...cubeProxyQueries,
    },
});

// Define Mutation type with all mutations
const MutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        // Graph mutations
        ...graphMutations,
        // Dashboard mutations
        ...dashboardMutations,
    },
});

// Export the schema
export const graphqlSchema = new GraphQLSchema({
    query: QueryType,
    mutation: MutationType,
});

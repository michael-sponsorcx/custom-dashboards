import { GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
import { graphQueries, graphMutations } from './graphql/resolvers/graphResolvers';
import { dashboardQueries, dashboardMutations } from './graphql/resolvers/dashboardResolvers';
import { cubeProxyQueries } from './graphql/resolvers/cubeProxyResolvers';
import { kpiScheduleQueries, kpiScheduleMutations } from './graphql/resolvers/kpiScheduleResolvers';
import { kpiThresholdQueries, kpiThresholdMutations } from './graphql/resolvers/kpiThresholdResolvers';
import { dashboardScheduleQueries, dashboardScheduleMutations } from './graphql/resolvers/dashboardScheduleResolvers';
import { cronJobResultQueries } from './graphql/resolvers/cronJobResultResolvers';
import { featureFlagQueries } from './graphql/resolvers/featureFlagResolvers';

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
        // KPI Schedule queries
        ...kpiScheduleQueries,
        // KPI Threshold queries
        ...kpiThresholdQueries,
        // Cube API Proxy queries
        ...cubeProxyQueries,
        // Dashboard Schedule queries
        ...dashboardScheduleQueries,
        // Cron Job Result queries
        ...cronJobResultQueries,
        // Feature Flag queries
        ...featureFlagQueries,
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
        // KPI Schedule mutations
        ...kpiScheduleMutations,
        // KPI Threshold mutations
        ...kpiThresholdMutations,
        // Dashboard Schedule mutations
        ...dashboardScheduleMutations,
    },
});

// Export the schema
export const graphqlSchema = new GraphQLSchema({
    query: QueryType,
    mutation: MutationType,
});

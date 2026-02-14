import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLBoolean,
    GraphQLNonNull,
} from 'graphql';
import { GraphQLJSON } from 'graphql-scalars';

export const CronJobResultType = new GraphQLObjectType({
    name: 'CronJobResult',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLID) },
        cronJobId: { type: new GraphQLNonNull(GraphQLString) },
        notes: { type: GraphQLJSON },
        completed: { type: new GraphQLNonNull(GraphQLBoolean) },
        jobStartTimestamp: { type: new GraphQLNonNull(GraphQLString) },
        trigger: { type: new GraphQLNonNull(GraphQLString) },
        organizationId: { type: new GraphQLNonNull(GraphQLID) },
    }),
});

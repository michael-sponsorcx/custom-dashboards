import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLBoolean,
    GraphQLNonNull,
} from 'graphql';
import { GraphQLJSON } from 'graphql-scalars';

export const FeatureFlagType = new GraphQLObjectType({
    name: 'FeatureFlag',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        key: { type: new GraphQLNonNull(GraphQLString) },
        defaultValue: { type: new GraphQLNonNull(GraphQLBoolean) },
        rules: { type: GraphQLJSON },
        tags: { type: GraphQLJSON },
        archived: { type: new GraphQLNonNull(GraphQLBoolean) },
        metadata: { type: GraphQLJSON },
        permanent: { type: new GraphQLNonNull(GraphQLBoolean) },
        createdAt: { type: new GraphQLNonNull(GraphQLString) },
        updatedAt: { type: new GraphQLNonNull(GraphQLString) },
    }),
});

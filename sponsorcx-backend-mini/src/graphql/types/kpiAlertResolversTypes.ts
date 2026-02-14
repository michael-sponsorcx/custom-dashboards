import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLList,
    GraphQLBoolean,
    GraphQLNonNull,
} from 'graphql';
import { AlertTypeEnum } from './sharedResolversTypes';

export const KpiAlertType = new GraphQLObjectType({
    name: 'KpiAlert',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLID) },
        cronJobId: { type: new GraphQLNonNull(GraphQLID) },
        organizationId: { type: new GraphQLNonNull(GraphQLID) },
        graphId: { type: GraphQLID },
        dashboardId: { type: new GraphQLNonNull(GraphQLID) },
        createdById: { type: new GraphQLNonNull(GraphQLID) },
        alertName: { type: new GraphQLNonNull(GraphQLString) },
        alertType: { type: new GraphQLNonNull(AlertTypeEnum) },
        comment: { type: GraphQLString },
        recipients: { type: new GraphQLList(GraphQLString) },
        isActive: { type: GraphQLBoolean },
        createdAt: { type: new GraphQLNonNull(GraphQLString) },
        updatedAt: { type: new GraphQLNonNull(GraphQLString) },
    }),
});

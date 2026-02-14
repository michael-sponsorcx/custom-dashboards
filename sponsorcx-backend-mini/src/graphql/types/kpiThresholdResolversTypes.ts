import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLList,
    GraphQLFloat,
    GraphQLBoolean,
    GraphQLInputObjectType,
    GraphQLNonNull,
} from 'graphql';
import { ThresholdConditionEnum } from './sharedResolversTypes';
import { KpiAlertType } from './kpiAlertResolversTypes';

export const KpiThresholdType = new GraphQLObjectType({
    name: 'KpiThreshold',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLID) },
        kpiAlertId: { type: new GraphQLNonNull(GraphQLID) },
        condition: { type: new GraphQLNonNull(ThresholdConditionEnum) },
        thresholdValue: { type: new GraphQLNonNull(GraphQLFloat) },
        timeZone: { type: GraphQLString },
        alert: { type: new GraphQLNonNull(KpiAlertType) },
    }),
});

export const CreateKpiThresholdInput = new GraphQLInputObjectType({
    name: 'CreateKpiThresholdInput',
    fields: {
        graphId: { type: GraphQLID },
        dashboardId: { type: new GraphQLNonNull(GraphQLID) },
        createdById: { type: new GraphQLNonNull(GraphQLID) },
        alertName: { type: new GraphQLNonNull(GraphQLString) },
        comment: { type: GraphQLString },
        recipients: { type: new GraphQLList(GraphQLString) },
        isActive: { type: GraphQLBoolean },
        condition: { type: new GraphQLNonNull(ThresholdConditionEnum) },
        thresholdValue: { type: new GraphQLNonNull(GraphQLFloat) },
        timeZone: { type: GraphQLString },
    },
});

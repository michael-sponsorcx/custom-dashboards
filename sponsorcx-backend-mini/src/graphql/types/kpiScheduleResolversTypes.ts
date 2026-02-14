import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLList,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLInputObjectType,
    GraphQLNonNull,
} from 'graphql';
import { FrequencyIntervalEnum, AttachmentTypeEnum } from './sharedResolversTypes';
import { KpiAlertType } from './kpiAlertResolversTypes';

export const KpiScheduleType = new GraphQLObjectType({
    name: 'KpiSchedule',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLID) },
        kpiAlertId: { type: new GraphQLNonNull(GraphQLID) },
        frequencyInterval: { type: new GraphQLNonNull(FrequencyIntervalEnum) },
        minuteInterval: { type: GraphQLInt },
        hourInterval: { type: GraphQLInt },
        scheduleHour: { type: GraphQLInt },
        scheduleMinute: { type: GraphQLInt },
        selectedDays: { type: new GraphQLList(GraphQLString) },
        excludeWeekends: { type: GraphQLBoolean },
        monthDates: { type: new GraphQLList(GraphQLInt) },
        timeZone: { type: GraphQLString },
        attachmentType: { type: AttachmentTypeEnum },
        alert: { type: new GraphQLNonNull(KpiAlertType) },
    }),
});

export const CreateKpiScheduleInput = new GraphQLInputObjectType({
    name: 'CreateKpiScheduleInput',
    fields: {
        graphId: { type: GraphQLID },
        dashboardId: { type: new GraphQLNonNull(GraphQLID) },
        createdById: { type: new GraphQLNonNull(GraphQLID) },
        alertName: { type: new GraphQLNonNull(GraphQLString) },
        comment: { type: GraphQLString },
        recipients: { type: new GraphQLList(GraphQLString) },
        isActive: { type: GraphQLBoolean },
        frequencyInterval: { type: new GraphQLNonNull(FrequencyIntervalEnum) },
        minuteInterval: { type: GraphQLInt },
        hourInterval: { type: GraphQLInt },
        scheduleHour: { type: GraphQLInt },
        scheduleMinute: { type: GraphQLInt },
        selectedDays: { type: new GraphQLList(GraphQLString) },
        excludeWeekends: { type: GraphQLBoolean },
        monthDates: { type: new GraphQLList(GraphQLInt) },
        timeZone: { type: GraphQLString },
        attachmentType: { type: AttachmentTypeEnum },
    },
});

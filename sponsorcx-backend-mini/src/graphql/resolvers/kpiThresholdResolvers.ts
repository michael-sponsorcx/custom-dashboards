import { GraphQLNonNull, GraphQLID, GraphQLList, GraphQLBoolean } from 'graphql';
import { KpiThresholdType, CreateKpiThresholdInput as CreateKpiThresholdInputType } from '../types';
import { findThresholdsByGraph, createKpiThreshold, deleteKpiThreshold, toggleKpiThresholdActive } from '../../models/kpiThreshold';
import type {
    QueryKpiThresholdsByGraphArgs,
    MutationCreateKpiThresholdArgs,
    MutationDeleteKpiThresholdArgs,
    MutationToggleKpiThresholdActiveArgs,
} from '../../generated/graphql';

export const kpiThresholdQueries = {
    kpiThresholdsByGraph: {
        type: new GraphQLList(KpiThresholdType),
        args: {
            graphId: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: unknown, args: QueryKpiThresholdsByGraphArgs) =>
            findThresholdsByGraph(args.graphId),
    },
};

export const kpiThresholdMutations = {
    createKpiThreshold: {
        type: KpiThresholdType,
        args: {
            organizationId: { type: new GraphQLNonNull(GraphQLID) },
            input: { type: new GraphQLNonNull(CreateKpiThresholdInputType) },
        },
        resolve: async (_: unknown, args: MutationCreateKpiThresholdArgs) =>
            createKpiThreshold(args.organizationId, args.input),
    },
    deleteKpiThreshold: {
        type: GraphQLBoolean,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: unknown, args: MutationDeleteKpiThresholdArgs) =>
            deleteKpiThreshold(args.id),
    },
    toggleKpiThresholdActive: {
        type: KpiThresholdType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            isActive: { type: new GraphQLNonNull(GraphQLBoolean) },
        },
        resolve: async (_: unknown, args: MutationToggleKpiThresholdActiveArgs) =>
            toggleKpiThresholdActive(args.id, args.isActive),
    },
};

import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLNonNull,
} from 'graphql';
import { GraphQLJSON } from 'graphql-scalars';

export const CubeSchemaType = new GraphQLObjectType({
    name: 'CubeSchema',
    fields: () => ({
        operators: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
    }),
});

export const CubeDimensionValuesType = new GraphQLObjectType({
    name: 'CubeDimensionValues',
    fields: () => ({
        values: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
    }),
});

const CubeDrillMembersGroupedType = new GraphQLObjectType({
    name: 'CubeDrillMembersGrouped',
    fields: () => ({
        measures: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
        dimensions: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
    }),
});

const CubeMeasureType = new GraphQLObjectType({
    name: 'CubeMeasure',
    fields: () => ({
        name: { type: new GraphQLNonNull(GraphQLString) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        shortTitle: { type: new GraphQLNonNull(GraphQLString) },
        format: { type: GraphQLString },
        cumulativeTotal: { type: new GraphQLNonNull(GraphQLBoolean) },
        cumulative: { type: new GraphQLNonNull(GraphQLBoolean) },
        type: { type: new GraphQLNonNull(GraphQLString) },
        aggType: { type: new GraphQLNonNull(GraphQLString) },
        drillMembers: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
        drillMembersGrouped: { type: new GraphQLNonNull(CubeDrillMembersGroupedType) },
        isVisible: { type: new GraphQLNonNull(GraphQLBoolean) },
        public: { type: new GraphQLNonNull(GraphQLBoolean) },
    }),
});

const CubeDimensionType = new GraphQLObjectType({
    name: 'CubeDimension',
    fields: () => ({
        name: { type: new GraphQLNonNull(GraphQLString) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        type: { type: new GraphQLNonNull(GraphQLString) },
        shortTitle: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        suggestFilterValues: { type: new GraphQLNonNull(GraphQLBoolean) },
        isVisible: { type: new GraphQLNonNull(GraphQLBoolean) },
        public: { type: new GraphQLNonNull(GraphQLBoolean) },
        primaryKey: { type: new GraphQLNonNull(GraphQLBoolean) },
    }),
});

const CubeSegmentType = new GraphQLObjectType({
    name: 'CubeSegment',
    fields: () => ({
        name: { type: new GraphQLNonNull(GraphQLString) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        shortTitle: { type: new GraphQLNonNull(GraphQLString) },
        isVisible: { type: new GraphQLNonNull(GraphQLBoolean) },
        public: { type: new GraphQLNonNull(GraphQLBoolean) },
    }),
});

const CubeMetaType = new GraphQLObjectType({
    name: 'CubeMeta',
    fields: () => ({
        name: { type: new GraphQLNonNull(GraphQLString) },
        type: { type: new GraphQLNonNull(GraphQLString) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        isVisible: { type: new GraphQLNonNull(GraphQLBoolean) },
        public: { type: new GraphQLNonNull(GraphQLBoolean) },
        connectedComponent: { type: new GraphQLNonNull(GraphQLInt) },
        measures: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(CubeMeasureType))) },
        dimensions: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(CubeDimensionType))) },
        segments: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(CubeSegmentType))) },
        hierarchies: { type: new GraphQLNonNull(new GraphQLList(GraphQLJSON)) },
        folders: { type: new GraphQLNonNull(new GraphQLList(GraphQLJSON)) },
        nestedFolders: { type: new GraphQLNonNull(new GraphQLList(GraphQLJSON)) },
    }),
});

export const CubeMetadataType = new GraphQLObjectType({
    name: 'CubeMetadata',
    fields: () => ({
        cubes: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(CubeMetaType))) },
    }),
});

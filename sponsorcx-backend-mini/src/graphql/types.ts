import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLList,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLInputObjectType,
    GraphQLNonNull,
    GraphQLEnumType,
} from 'graphql';
import GraphQLJSON from 'graphql-type-json';

// Enums
export const ChartTypeEnum = new GraphQLEnumType({
    name: 'ChartType',
    values: {
        BAR: { value: 'bar' },
        LINE: { value: 'line' },
        PIE: { value: 'pie' },
        AREA: { value: 'area' },
        SCATTER: { value: 'scatter' },
        TABLE: { value: 'table' },
        KPI: { value: 'kpi' },
        HEATMAP: { value: 'heatmap' },
    },
});

export const NumberFormatEnum = new GraphQLEnumType({
    name: 'NumberFormat',
    values: {
        CURRENCY: { value: 'currency' },
        PERCENTAGE: { value: 'percentage' },
        NUMBER: { value: 'number' },
        ABBREVIATED: { value: 'abbreviated' },
    },
});

export const SortOrderEnum = new GraphQLEnumType({
    name: 'SortOrder',
    values: {
        ASC: { value: 'asc' },
        DESC: { value: 'desc' },
    },
});

export const LegendPositionEnum = new GraphQLEnumType({
    name: 'LegendPosition',
    values: {
        TOP: { value: 'top' },
        BOTTOM: { value: 'bottom' },
        NONE: { value: 'none' },
    },
});

export const LayoutTypeEnum = new GraphQLEnumType({
    name: 'LayoutType',
    values: {
        GRID: { value: 'grid' },
        LIST: { value: 'list' },
    },
});

// Graph Type
export const GraphType = new GraphQLObjectType({
    name: 'Graph',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLID) },
        organizationId: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        viewName: { type: new GraphQLNonNull(GraphQLString) },
        chartType: { type: new GraphQLNonNull(ChartTypeEnum) },
        chartTitle: { type: new GraphQLNonNull(GraphQLString) },
        measures: { type: new GraphQLList(GraphQLString) },
        dimensions: { type: new GraphQLList(GraphQLString) },
        dates: { type: new GraphQLList(GraphQLString) },
        filters: { type: GraphQLJSON },
        orderByField: { type: GraphQLString },
        orderByDirection: { type: SortOrderEnum },
        numberFormat: { type: NumberFormatEnum },
        numberPrecision: { type: GraphQLInt },
        colorPalette: { type: GraphQLString },
        primaryColor: { type: GraphQLString },
        sortOrder: { type: SortOrderEnum },
        legendPosition: { type: LegendPositionEnum },
        kpiValue: { type: GraphQLFloat },
        kpiLabel: { type: GraphQLString },
        kpiSecondaryValue: { type: GraphQLFloat },
        kpiSecondaryLabel: { type: GraphQLString },
        kpiShowTrend: { type: GraphQLBoolean },
        kpiTrendPercentage: { type: GraphQLFloat },
        showXAxisGridLines: { type: GraphQLBoolean },
        showYAxisGridLines: { type: GraphQLBoolean },
        showGridLines: { type: GraphQLBoolean },
        showRegressionLine: { type: GraphQLBoolean },
        xAxisLabel: { type: GraphQLString },
        yAxisLabel: { type: GraphQLString },
        maxDataPoints: { type: GraphQLInt },
        primaryDimension: { type: GraphQLString },
        secondaryDimension: { type: GraphQLString },
        selectedMeasure: { type: GraphQLString },
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString },
    }),
});

// Dashboard Type
export const DashboardType = new GraphQLObjectType({
    name: 'Dashboard',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLID) },
        organizationId: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        layout: { type: new GraphQLNonNull(LayoutTypeEnum) },
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString },
    }),
});

// DashboardGridItem Type
export const DashboardGridItemType = new GraphQLObjectType({
    name: 'DashboardGridItem',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLID) },
        dashboardId: { type: new GraphQLNonNull(GraphQLID) },
        graphId: { type: new GraphQLNonNull(GraphQLID) },
        gridColumn: { type: GraphQLInt },
        gridRow: { type: GraphQLInt },
        gridWidth: { type: GraphQLInt },
        gridHeight: { type: GraphQLInt },
        displayOrder: { type: GraphQLInt },
        graph: { type: GraphType },
    }),
});

// DashboardFilter Type
export const DashboardFilterType = new GraphQLObjectType({
    name: 'DashboardFilter',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLID) },
        dashboardId: { type: new GraphQLNonNull(GraphQLID) },
        selectedViews: { type: new GraphQLList(GraphQLString) },
        availableFields: { type: GraphQLJSON },
        activeFilters: { type: GraphQLJSON },
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString },
    }),
});

// Input Types for Mutations
export const GraphInput = new GraphQLInputObjectType({
    name: 'GraphInput',
    fields: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        viewName: { type: new GraphQLNonNull(GraphQLString) },
        chartType: { type: new GraphQLNonNull(ChartTypeEnum) },
        chartTitle: { type: new GraphQLNonNull(GraphQLString) },
        measures: { type: new GraphQLList(GraphQLString) },
        dimensions: { type: new GraphQLList(GraphQLString) },
        dates: { type: new GraphQLList(GraphQLString) },
        filters: { type: GraphQLJSON },
        orderByField: { type: GraphQLString },
        orderByDirection: { type: SortOrderEnum },
        numberFormat: { type: NumberFormatEnum },
        numberPrecision: { type: GraphQLInt },
        colorPalette: { type: GraphQLString },
        primaryColor: { type: GraphQLString },
        sortOrder: { type: SortOrderEnum },
        legendPosition: { type: LegendPositionEnum },
        kpiValue: { type: GraphQLFloat },
        kpiLabel: { type: GraphQLString },
        kpiSecondaryValue: { type: GraphQLFloat },
        kpiSecondaryLabel: { type: GraphQLString },
        kpiShowTrend: { type: GraphQLBoolean },
        kpiTrendPercentage: { type: GraphQLFloat },
        showXAxisGridLines: { type: GraphQLBoolean },
        showYAxisGridLines: { type: GraphQLBoolean },
        showGridLines: { type: GraphQLBoolean },
        showRegressionLine: { type: GraphQLBoolean },
        xAxisLabel: { type: GraphQLString },
        yAxisLabel: { type: GraphQLString },
        maxDataPoints: { type: GraphQLInt },
        primaryDimension: { type: GraphQLString },
        secondaryDimension: { type: GraphQLString },
        selectedMeasure: { type: GraphQLString },
    },
});

export const DashboardInput = new GraphQLInputObjectType({
    name: 'DashboardInput',
    fields: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        layout: { type: new GraphQLNonNull(LayoutTypeEnum) },
    },
});

export const DashboardGridItemInput = new GraphQLInputObjectType({
    name: 'DashboardGridItemInput',
    fields: {
        graphId: { type: new GraphQLNonNull(GraphQLID) },
        gridColumn: { type: GraphQLInt },
        gridRow: { type: GraphQLInt },
        gridWidth: { type: GraphQLInt },
        gridHeight: { type: GraphQLInt },
        displayOrder: { type: GraphQLInt },
    },
});

export const DashboardFilterInput = new GraphQLInputObjectType({
    name: 'DashboardFilterInput',
    fields: {
        selectedViews: { type: new GraphQLList(GraphQLString) },
        availableFields: { type: GraphQLJSON },
        activeFilters: { type: GraphQLJSON },
    },
});

// Cube API Proxy Types
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

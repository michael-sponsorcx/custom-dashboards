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
import { GraphQLJSON } from 'graphql-scalars';

// ============================================================================
// GraphQL Enums
// ============================================================================

// Enums
// Enum names match their values so GraphQL serializes the same string
// that is stored in the database and used on the frontend.
export const ChartTypeEnum = new GraphQLEnumType({
    name: 'ChartType',
    values: {
        bar: {},
        stackedBar: {},
        horizontalBar: {},
        horizontalStackedBar: {},
        line: {},
        pie: {},
        area: {},
        scatter: {},
        table: {},
        kpi: {},
        heatmap: {},
    },
});

export const NumberFormatEnum = new GraphQLEnumType({
    name: 'NumberFormat',
    values: {
        currency: {},
        percentage: {},
        number: {},
        abbreviated: {},
    },
});

export const SortOrderEnum = new GraphQLEnumType({
    name: 'SortOrder',
    values: {
        asc: {},
        desc: {},
    },
});

export const LegendPositionEnum = new GraphQLEnumType({
    name: 'LegendPosition',
    values: {
        top: {},
        bottom: {},
        none: {},
    },
});

export const LayoutTypeEnum = new GraphQLEnumType({
    name: 'LayoutType',
    values: {
        grid: {},
        list: {},
    },
});

export const ColorPaletteEnum = new GraphQLEnumType({
    name: 'ColorPalette',
    values: {
        hubspotOrange: {},
        professional: {},
        vibrant: {},
        cool: {},
        warm: {},
        green: {},
        purple: {},
        monochrome: {},
        professionalMinimalist: {},
        vibrantDynamic: {},
        accessibleCalming: {},
        custom: {},
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
        measures: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))) },
        dimensions: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))) },
        dates: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))) },
        filters: { type: new GraphQLNonNull(GraphQLJSON) },
        orderByField: { type: new GraphQLNonNull(GraphQLString) },
        orderByDirection: { type: new GraphQLNonNull(SortOrderEnum) },
        numberFormat: { type: new GraphQLNonNull(NumberFormatEnum) },
        numberPrecision: { type: new GraphQLNonNull(GraphQLInt) },
        colorPalette: { type: new GraphQLNonNull(ColorPaletteEnum) },
        primaryColor: { type: new GraphQLNonNull(GraphQLString) },
        sortOrder: { type: new GraphQLNonNull(SortOrderEnum) },
        legendPosition: { type: new GraphQLNonNull(LegendPositionEnum) },
        kpiValue: { type: GraphQLFloat },
        kpiLabel: { type: GraphQLString },
        kpiSecondaryValue: { type: GraphQLFloat },
        kpiSecondaryLabel: { type: GraphQLString },
        kpiShowTrend: { type: new GraphQLNonNull(GraphQLBoolean) },
        kpiTrendPercentage: { type: GraphQLFloat },
        showXAxisGridLines: { type: new GraphQLNonNull(GraphQLBoolean) },
        showYAxisGridLines: { type: new GraphQLNonNull(GraphQLBoolean) },
        showGridLines: { type: new GraphQLNonNull(GraphQLBoolean) },
        showRegressionLine: { type: new GraphQLNonNull(GraphQLBoolean) },
        xAxisLabel: { type: GraphQLString },
        yAxisLabel: { type: GraphQLString },
        maxDataPoints: { type: new GraphQLNonNull(GraphQLInt) },
        primaryDimension: { type: new GraphQLNonNull(GraphQLString) },
        secondaryDimension: { type: GraphQLString },
        selectedMeasure: { type: new GraphQLNonNull(GraphQLString) },
        createdAt: { type: new GraphQLNonNull(GraphQLString) },
        updatedAt: { type: new GraphQLNonNull(GraphQLString) },
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
        createdAt: { type: new GraphQLNonNull(GraphQLString) },
        updatedAt: { type: new GraphQLNonNull(GraphQLString) },
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
        graph: {
            type: GraphType,
        },
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
        createdAt: { type: new GraphQLNonNull(GraphQLString) },
        updatedAt: { type: new GraphQLNonNull(GraphQLString) },
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
        colorPalette: { type: ColorPaletteEnum },
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

// KPI Schedule Enums
export const FrequencyIntervalEnum = new GraphQLEnumType({
    name: 'FrequencyInterval',
    values: {
        n_minute: {},
        hour: {},
        day: {},
        week: {},
        month: {},
    },
});

export const AttachmentTypeEnum = new GraphQLEnumType({
    name: 'AttachmentType',
    values: {
        PDF: {},
        Excel: {},
        CSV: {},
    },
});

// KPI Schedule Type (with nested alert)
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
        hasGatingCondition: { type: GraphQLBoolean },
        gatingCondition: { type: GraphQLJSON },
        attachmentType: { type: AttachmentTypeEnum },
        cronExpression: { type: GraphQLString },
        alert: { type: new GraphQLNonNull(KpiAlertType) },
    }),
});

// KPI Schedule Input Type (flattened for easier mutation input)
export const CreateKpiScheduleInput = new GraphQLInputObjectType({
    name: 'CreateKpiScheduleInput',
    fields: {
        // Alert fields
        graphId: { type: GraphQLID },
        dashboardId: { type: new GraphQLNonNull(GraphQLID) },
        createdById: { type: new GraphQLNonNull(GraphQLID) },
        alertName: { type: new GraphQLNonNull(GraphQLString) },
        comment: { type: GraphQLString },
        recipients: { type: new GraphQLList(GraphQLString) },
        isActive: { type: GraphQLBoolean },
        // Schedule-specific fields
        frequencyInterval: { type: new GraphQLNonNull(FrequencyIntervalEnum) },
        minuteInterval: { type: GraphQLInt },
        hourInterval: { type: GraphQLInt },
        scheduleHour: { type: GraphQLInt },
        scheduleMinute: { type: GraphQLInt },
        selectedDays: { type: new GraphQLList(GraphQLString) },
        excludeWeekends: { type: GraphQLBoolean },
        monthDates: { type: new GraphQLList(GraphQLInt) },
        timeZone: { type: GraphQLString },
        hasGatingCondition: { type: GraphQLBoolean },
        gatingCondition: { type: GraphQLJSON },
        attachmentType: { type: AttachmentTypeEnum },
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

// ============================================================================
// Cube Metadata Types
// ============================================================================

// GraphQL Types for Cube Metadata

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

// ============================================================================
// KPI Alert Types (shared base for schedules and thresholds)
// ============================================================================

export const AlertTypeEnum = new GraphQLEnumType({
    name: 'AlertType',
    values: {
        schedule: {},
        threshold: {},
    },
});

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

// ============================================================================
// KPI Threshold Types
// ============================================================================

export const ThresholdConditionEnum = new GraphQLEnumType({
    name: 'ThresholdCondition',
    values: {
        GREATER_THAN: {},
        GREATER_THAN_OR_EQUAL: {},
        LESS_THAN: {},
        LESS_THAN_OR_EQUAL: {},
        EQUAL_TO: {},
        NOT_EQUAL_TO: {},
    },
});

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

// ============================================================================
// Dashboard Schedule Types
// ============================================================================

export const DashboardScheduleType = new GraphQLObjectType({
    name: 'DashboardSchedule',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLID) },
        cronJobId: { type: new GraphQLNonNull(GraphQLID) },
        organizationId: { type: new GraphQLNonNull(GraphQLID) },
        dashboardId: { type: new GraphQLNonNull(GraphQLID) },
        createdById: { type: new GraphQLNonNull(GraphQLID) },
        scheduleName: { type: new GraphQLNonNull(GraphQLString) },
        comment: { type: GraphQLString },
        frequencyInterval: { type: new GraphQLNonNull(FrequencyIntervalEnum) },
        minuteInterval: { type: GraphQLInt },
        hourInterval: { type: GraphQLInt },
        scheduleHour: { type: GraphQLInt },
        scheduleMinute: { type: GraphQLInt },
        selectedDays: { type: new GraphQLList(GraphQLString) },
        excludeWeekends: { type: GraphQLBoolean },
        monthDates: { type: new GraphQLList(GraphQLInt) },
        timeZone: { type: GraphQLString },
        hasGatingCondition: { type: GraphQLBoolean },
        gatingCondition: { type: GraphQLJSON },
        attachmentType: { type: AttachmentTypeEnum },
        recipients: { type: new GraphQLList(GraphQLString) },
        isActive: { type: GraphQLBoolean },
        cronExpression: { type: GraphQLString },
        createdAt: { type: new GraphQLNonNull(GraphQLString) },
        updatedAt: { type: new GraphQLNonNull(GraphQLString) },
    }),
});

export const DashboardScheduleInput = new GraphQLInputObjectType({
    name: 'DashboardScheduleInput',
    fields: {
        dashboardId: { type: new GraphQLNonNull(GraphQLID) },
        createdById: { type: new GraphQLNonNull(GraphQLID) },
        scheduleName: { type: new GraphQLNonNull(GraphQLString) },
        comment: { type: GraphQLString },
        frequencyInterval: { type: new GraphQLNonNull(FrequencyIntervalEnum) },
        minuteInterval: { type: GraphQLInt },
        hourInterval: { type: GraphQLInt },
        scheduleHour: { type: GraphQLInt },
        scheduleMinute: { type: GraphQLInt },
        selectedDays: { type: new GraphQLList(GraphQLString) },
        excludeWeekends: { type: GraphQLBoolean },
        monthDates: { type: new GraphQLList(GraphQLInt) },
        timeZone: { type: GraphQLString },
        hasGatingCondition: { type: GraphQLBoolean },
        gatingCondition: { type: GraphQLJSON },
        attachmentType: { type: AttachmentTypeEnum },
        recipients: { type: new GraphQLList(GraphQLString) },
        isActive: { type: GraphQLBoolean },
    },
});

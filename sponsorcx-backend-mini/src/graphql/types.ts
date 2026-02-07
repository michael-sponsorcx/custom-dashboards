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
import { query } from '../db/connection';

// ============================================================================
// TypeScript Interfaces for Type Safety
// ============================================================================

/** Database row type for graphs table (snake_case) */
interface GraphRow {
    id: string;
    organization_id: string | null;
    name: string;
    view_name: string | null;
    chart_type: string;
    chart_title: string | null;
    measures: string[];
    dimensions: string[];
    dates: string[];
    filters: unknown;
    order_by_field: string | null;
    order_by_direction: string | null;
    number_format: string | null;
    number_precision: number | null;
    color_palette: string | null;
    primary_color: string | null;
    sort_order: string | null;
    legend_position: string | null;
    kpi_value: string | null;
    kpi_label: string | null;
    kpi_secondary_value: string | null;
    kpi_secondary_label: string | null;
    kpi_show_trend: boolean;
    kpi_trend_percentage: string | null;
    show_x_axis_grid_lines: boolean;
    show_y_axis_grid_lines: boolean;
    show_grid_lines: boolean;
    show_regression_line: boolean;
    x_axis_label: string | null;
    y_axis_label: string | null;
    max_data_points: number | null;
    primary_dimension: string | null;
    secondary_dimension: string | null;
    selected_measure: string | null;
    created_at: Date;
    updated_at: Date;
}

/** Resolved type for Graph (camelCase for GraphQL) */
export interface Graph {
    id: string;
    organizationId: string | null;
    name: string;
    viewName: string | null;
    chartType: string;
    chartTitle: string | null;
    measures: string[];
    dimensions: string[];
    dates: string[];
    filters: unknown;
    orderByField: string | null;
    orderByDirection: string | null;
    numberFormat: string | null;
    numberPrecision: number | null;
    colorPalette: string | null;
    primaryColor: string | null;
    sortOrder: string | null;
    legendPosition: string | null;
    kpiValue: number | null;
    kpiLabel: string | null;
    kpiSecondaryValue: number | null;
    kpiSecondaryLabel: string | null;
    kpiShowTrend: boolean;
    kpiTrendPercentage: number | null;
    showXAxisGridLines: boolean;
    showYAxisGridLines: boolean;
    showGridLines: boolean;
    showRegressionLine: boolean;
    xAxisLabel: string | null;
    yAxisLabel: string | null;
    maxDataPoints: number | null;
    primaryDimension: string | null;
    secondaryDimension: string | null;
    selectedMeasure: string | null;
    createdAt: Date;
    updatedAt: Date;
}

/** Parent type for DashboardGridItem field resolver */
interface DashboardGridItemParent {
    id: string;
    dashboardId: string;
    graphId: string;
    gridColumn: number | null;
    gridRow: number | null;
    gridWidth: number | null;
    gridHeight: number | null;
    displayOrder: number;
}

// ============================================================================
// Helper Functions
// ============================================================================

/** Convert a graph database row to camelCase for GraphQL */
const graphRowToCamelCase = (row: GraphRow): Graph => ({
    id: row.id,
    organizationId: row.organization_id,
    name: row.name,
    viewName: row.view_name,
    chartType: row.chart_type,
    chartTitle: row.chart_title,
    measures: row.measures,
    dimensions: row.dimensions,
    dates: row.dates,
    filters: row.filters,
    orderByField: row.order_by_field,
    orderByDirection: row.order_by_direction,
    numberFormat: row.number_format,
    numberPrecision: row.number_precision,
    colorPalette: row.color_palette,
    primaryColor: row.primary_color,
    sortOrder: row.sort_order,
    legendPosition: row.legend_position,
    kpiValue: row.kpi_value ? parseFloat(row.kpi_value) : null,
    kpiLabel: row.kpi_label,
    kpiSecondaryValue: row.kpi_secondary_value ? parseFloat(row.kpi_secondary_value) : null,
    kpiSecondaryLabel: row.kpi_secondary_label,
    kpiShowTrend: row.kpi_show_trend,
    kpiTrendPercentage: row.kpi_trend_percentage ? parseFloat(row.kpi_trend_percentage) : null,
    showXAxisGridLines: row.show_x_axis_grid_lines,
    showYAxisGridLines: row.show_y_axis_grid_lines,
    showGridLines: row.show_grid_lines,
    showRegressionLine: row.show_regression_line,
    xAxisLabel: row.x_axis_label,
    yAxisLabel: row.y_axis_label,
    maxDataPoints: row.max_data_points,
    primaryDimension: row.primary_dimension,
    secondaryDimension: row.secondary_dimension,
    selectedMeasure: row.selected_measure,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
});

// ============================================================================
// GraphQL Enums
// ============================================================================

// Enums
export const ChartTypeEnum = new GraphQLEnumType({
    name: 'ChartType',
    values: {
        BAR: { value: 'bar' },
        STACKED_BAR: { value: 'stackedBar' },
        HORIZONTAL_BAR: { value: 'horizontalBar' },
        HORIZONTAL_STACKED_BAR: { value: 'horizontalStackedBar' },
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
        graph: {
            type: GraphType,
            // This loads graphs one at a time, we may need to consider batching this in the future.
            resolve: async (parent: DashboardGridItemParent): Promise<Graph | null> => {
                // Lazy-load the graph when requested
                if (!parent.graphId) return null;

                const result = await query('SELECT * FROM graphs WHERE id = $1', [parent.graphId]);
                if (!result.rows[0]) return null;

                return graphRowToCamelCase(result.rows[0] as GraphRow);
            },
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

// KPI Schedule Enums
export const FrequencyIntervalEnum = new GraphQLEnumType({
    name: 'FrequencyInterval',
    values: {
        N_MINUTE: { value: 'n_minute' },
        HOUR: { value: 'hour' },
        DAY: { value: 'day' },
        WEEK: { value: 'week' },
        MONTH: { value: 'month' },
    },
});

export const AttachmentTypeEnum = new GraphQLEnumType({
    name: 'AttachmentType',
    values: {
        PDF: { value: 'PDF' },
        EXCEL: { value: 'Excel' },
        CSV: { value: 'CSV' },
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

/** TypeScript interface for Cube drill members grouped */
export interface CubeDrillMembersGrouped {
    measures: string[];
    dimensions: string[];
}

/** TypeScript interface for Cube measure metadata */
export interface CubeMeasure {
    name: string;
    title: string;
    shortTitle: string;
    format?: string;
    cumulativeTotal: boolean;
    cumulative: boolean;
    type: string;
    aggType: string;
    drillMembers: string[];
    drillMembersGrouped: CubeDrillMembersGrouped;
    isVisible: boolean;
    public: boolean;
}

/** TypeScript interface for Cube dimension metadata */
export interface CubeDimension {
    name: string;
    title: string;
    type: string;
    shortTitle: string;
    description?: string;
    suggestFilterValues: boolean;
    isVisible: boolean;
    public: boolean;
    primaryKey: boolean;
}

/** TypeScript interface for Cube segment metadata */
export interface CubeSegment {
    name: string;
    title: string;
    shortTitle: string;
    isVisible: boolean;
    public: boolean;
}

/** TypeScript interface for a single Cube metadata */
export interface CubeMeta {
    name: string;
    type: string;
    title: string;
    isVisible: boolean;
    public: boolean;
    connectedComponent: number;
    measures: CubeMeasure[];
    dimensions: CubeDimension[];
    segments: CubeSegment[];
    hierarchies: unknown[];
    folders: unknown[];
    nestedFolders: unknown[];
}

/** TypeScript interface for the full Cube metadata response */
export interface CubeMetadataResponse {
    cubes: CubeMeta[];
}

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
        SCHEDULE: { value: 'schedule' },
        THRESHOLD: { value: 'threshold' },
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
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString },
    }),
});

// ============================================================================
// KPI Threshold Types
// ============================================================================

export const ThresholdConditionEnum = new GraphQLEnumType({
    name: 'ThresholdCondition',
    values: {
        GREATER_THAN: { value: 'GREATER_THAN' },
        GREATER_THAN_OR_EQUAL: { value: 'GREATER_THAN_OR_EQUAL' },
        LESS_THAN: { value: 'LESS_THAN' },
        LESS_THAN_OR_EQUAL: { value: 'LESS_THAN_OR_EQUAL' },
        EQUAL_TO: { value: 'EQUAL_TO' },
        NOT_EQUAL_TO: { value: 'NOT_EQUAL_TO' },
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

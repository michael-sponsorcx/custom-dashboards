import { GraphQLEnumType } from 'graphql';

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
        sponsorcx: {},
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

export const AlertTypeEnum = new GraphQLEnumType({
    name: 'AlertType',
    values: {
        schedule: {},
        threshold: {},
    },
});

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

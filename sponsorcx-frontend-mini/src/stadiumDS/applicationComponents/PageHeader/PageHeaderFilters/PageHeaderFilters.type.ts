import { ObjectType } from '@/gql/customFieldGql';
import { ComboboxData } from '@mantine/core';
import type { ReactNode } from 'react';

type PageHeaderFilterShared = {
    label: string;
    key: string;
    showInHeader?: boolean;
    hideInFilterSlideout?: boolean;
    /** Optional suffix element to render next to the label (e.g., toggle badges) */
    labelSuffix?: ReactNode;
};

type PageHeaderSelectFilterShared = {
    options: ComboboxData;
    selectedOptions?: ComboboxData;
    placeholder?: string;
    onLoadMore?: () => void;
    onSearch?: (search: string) => void;
    loadingItems?: boolean;
};

type PageHeaderMultiSelectFilter = PageHeaderSelectFilterShared & {
    defaultValue: string[];
    resetValue: string[];
    type: 'multiselect';
    disabled?: boolean;
};

type PageHeaderPaginatedMultiSelectFilter = PageHeaderSelectFilterShared & {
    defaultValue: string[];
    resetValue: string[];
    type: 'paginatedMultiselect';
    disabled?: boolean;
    paginatedItemCount?: number;
};

type PageHeaderSelectFilter = PageHeaderSelectFilterShared & {
    defaultValue: string | null | undefined;
    resetValue: string | null | undefined;
    type: 'select';
    clearable?: boolean;
    allowDeselect?: boolean;
};

export type DateRangeFilterValueType = [string, string];

type PageHeaderDateRangeFilter = {
    defaultValue: DateRangeFilterValueType;
    resetValue: DateRangeFilterValueType;
    type: 'dateRange';
};

export type TogglePillOption = {
    label: string;
    value: string;
};

type PageHeaderTogglePillsFilter = {
    defaultValue: string[];
    resetValue: string[];
    type: 'togglePills';
    options: TogglePillOption[];
    multiSelect: boolean;
    subLabel?: string;
    removeAllOption?: boolean;
    selectedOptions?: ComboboxData;
    onLoadMore?: () => void;
    onSearch?: (search: string) => void;
    loadingItems?: boolean;
};

export type NumberRangeFilterValueType = [number | null, number | null];

type PageHeaderRangeFilter = {
    minValue: number;
    maxValue: number;
    defaultValue: NumberRangeFilterValueType;
    resetValue: NumberRangeFilterValueType;
    type: 'range';
    numberLabel?: (value: number) => string;
    minRange?: number;
    numberScale?: (value: number) => number;
};

type PageHeaderBooleanFilter = {
    defaultValue: boolean;
    resetValue: boolean;
    type: 'boolean';
};

type PageHeaderCustomFieldsFilter = {
    type: 'customFields';
    objectType: ObjectType;
    resetValue: string;
    defaultValue: string;
};

export type PageHeaderFilter = PageHeaderFilterShared &
    (
        | PageHeaderSelectFilter
        | PageHeaderMultiSelectFilter
        | PageHeaderPaginatedMultiSelectFilter
        | PageHeaderDateRangeFilter
        | PageHeaderTogglePillsFilter
        | PageHeaderRangeFilter
        | PageHeaderBooleanFilter
        | PageHeaderCustomFieldsFilter
    );

export type FilterValueType =
    | string
    | string[]
    | NumberRangeFilterValueType
    | DateRangeFilterValueType
    | null
    | boolean
    | undefined;

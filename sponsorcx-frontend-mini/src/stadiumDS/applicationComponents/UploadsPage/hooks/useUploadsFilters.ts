import { useFileTypeOptions } from '@/hooks/useFileTypeOptions';
import useFilterHelpers from '@/hooks/useFilterHelpers';
import { useUserOptions } from '@/hooks/useUserOptions';
import { PageHeaderFilter } from '@/stadiumDS/applicationComponents/PageHeader/PageHeaderFilters/PageHeaderFilters.type';
import { ComboboxItem } from '@mantine/core';
import { ArrayParam, useQueryParams } from 'use-query-params';

export enum UploadsFilterKeys {
    UPLOADED_BY = 'uploaded_by',
    ORIGIN = 'origin',
    FILE_TYPE = 'file_type',
    DATE_MODIFIED_RANGE = 'date_modified_range',
}

export type UploadsFiltersProps = {
    originOptions: ComboboxItem[];
    extraFilters?: {
        filter: PageHeaderFilter;
        position: number;
    }[];
    tableName: string;
};

export const useUploadsFilters = ({
    originOptions,
    extraFilters,
    tableName,
}: UploadsFiltersProps) => {
    const [queryParams, setQueryParams] = useQueryParams({
        [UploadsFilterKeys.UPLOADED_BY]: ArrayParam,
        [UploadsFilterKeys.ORIGIN]: ArrayParam,
        [UploadsFilterKeys.FILE_TYPE]: ArrayParam,
        [UploadsFilterKeys.DATE_MODIFIED_RANGE]: ArrayParam,
    });

    const userOptions: ComboboxItem[] = useUserOptions().map((option) => ({
        label: option.text,
        value: option.value as string,
    }));

    const fileTypeOptions = useFileTypeOptions();

    const defaultFilters: PageHeaderFilter[] = [
        {
            defaultValue: queryParams[UploadsFilterKeys.UPLOADED_BY]?.length
                ? (queryParams[UploadsFilterKeys.UPLOADED_BY].filter(
                      Boolean
                  ) as string[])
                : [],
            resetValue: [],
            label: 'Uploaded By',
            type: 'multiselect' as const,
            key: UploadsFilterKeys.UPLOADED_BY,
            options: userOptions,
            placeholder: 'Select Uploader',
            showInHeader: true,
        },
        {
            defaultValue: queryParams[UploadsFilterKeys.ORIGIN]?.length
                ? (queryParams[UploadsFilterKeys.ORIGIN].filter(
                      Boolean
                  ) as string[])
                : [],
            resetValue: [],
            label: 'Origin',
            type: 'multiselect' as const,
            key: UploadsFilterKeys.ORIGIN,
            options: originOptions,
            placeholder: 'Select Origin',
        },
        {
            defaultValue: queryParams[UploadsFilterKeys.FILE_TYPE]?.length
                ? (queryParams[UploadsFilterKeys.FILE_TYPE].filter(
                      Boolean
                  ) as string[])
                : [],
            resetValue: [],
            label: 'File Type',
            type: 'multiselect' as const,
            key: UploadsFilterKeys.FILE_TYPE,
            options: fileTypeOptions,
            placeholder: 'Select File Type',
            showInHeader: true,
        },
        {
            defaultValue: [
                queryParams[UploadsFilterKeys.DATE_MODIFIED_RANGE]?.[0]
                    ? new Date(
                          queryParams[UploadsFilterKeys.DATE_MODIFIED_RANGE][0]
                      ).toISOString()
                    : '',
                queryParams[UploadsFilterKeys.DATE_MODIFIED_RANGE]?.[1]
                    ? new Date(
                          queryParams[UploadsFilterKeys.DATE_MODIFIED_RANGE][1]
                      ).toISOString()
                    : '',
            ],
            resetValue: ['', ''],
            label: 'Date Modified',
            type: 'dateRange' as const,
            key: UploadsFilterKeys.DATE_MODIFIED_RANGE,
        },
    ];

    if (extraFilters) {
        extraFilters.forEach((filter) => {
            defaultFilters.splice(filter.position, 0, filter.filter);
        });
    }

    const {
        appliedFilterValues,
        updateFilters,
        handleResetFilters,
        filtersAreApplied,
        filterResetValues,
    } = useFilterHelpers({
        defaultFilters,
        setQueryParams,
        queryParams,
        filtersToIgnoreOnReset: [],
        tableName,
    });

    return {
        defaultFilters,
        appliedFilterValues,
        updateFilters,
        handleResetFilters,
        filtersAreApplied,
        queryParams,
        setQueryParams,
        filterResetValues,
    };
};

import { Checkbox, MultiSelect, Select } from '@mantine/core';
import {
    DateRangeFilterValueType,
    FilterValueType,
    PageHeaderFilter,
} from './PageHeaderFilters.type';
import { FilterTogglePills } from './components/FilterTogglePills';
import { DateRangeSelects } from './components/DateRangeSelects';
import { Stack } from '@mantine/core';
import { FilterRangeSlider } from './components/FilterRangeSlider';
import { FilterSlideOutCustomFields } from './components/FilterSlideOutCustomFields';
import { PaginatedMultiSelect } from './components/PaginatedMultiselect';
import { deepEqual } from '@/utils/helpers';
import React from 'react';
import { getCategoryIcon } from '@/pages/teamPortal/admin/validationRules';

interface PageHeaderFilterSlideOutComponentsProps {
    defaultFilters: PageHeaderFilter[];
    appliedFilterValues: Record<string, FilterValueType>;
    updateFilters: (updatedParams: Record<string, FilterValueType>) => void;
}

/** This component is used to render the filters in the filter slideout. The filters that are rendered in the header itself are in PageHeaderInlineFilters.tsx */
export const PageHeaderFilterSlideOutComponents = ({
    defaultFilters = [],
    appliedFilterValues,
    updateFilters,
}: PageHeaderFilterSlideOutComponentsProps) => {
    return (
        <Stack gap="md">
            {(defaultFilters || []).map((filter) => {
                if (filter.hideInFilterSlideout) {
                    return null;
                }

                if (filter.type === 'select') {
                    return (
                        <Select
                            key={filter.key}
                            label={filter.label}
                            data={
                                filter.options.length > 0
                                    ? filter.options
                                    : [
                                          {
                                              value: 'no-items',
                                              label: 'No items found',
                                              disabled: true,
                                          },
                                      ]
                            }
                            value={
                                (appliedFilterValues[filter.key] as string) ||
                                filter.defaultValue
                            }
                            onChange={(value) =>
                                updateFilters({ [filter.key]: value })
                            }
                            placeholder={filter.placeholder}
                            searchable
                            clearable={filter.clearable}
                            allowDeselect={filter.allowDeselect}
                        />
                    );
                }

                if (filter.type === 'multiselect') {
                    const missingSelectedOptions = (
                        filter.selectedOptions ?? []
                    ).filter(
                        (option) =>
                            !filter.options.some((o) => deepEqual(o, option))
                    );

                    const allOptions = [
                        ...filter.options,
                        ...missingSelectedOptions,
                    ];
                    // Check if this is categories or business rules filter
                    const isCategoriesFilter = filter.key === 'categories';
                    const isBusinessRulesFilter =
                        filter.key === 'businessRules';
                    const needsCustomRender =
                        isCategoriesFilter || isBusinessRulesFilter;

                    // Build label with optional suffix
                    const labelWithSuffix = filter.labelSuffix ? (
                        <div
                            key={`label-${filter.key}`}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                        >
                            <span>{filter.label}</span>
                            {filter.labelSuffix}
                        </div>
                    ) : (
                        filter.label
                    );

                    return (
                        <MultiSelect
                            key={filter.key}
                            label={labelWithSuffix}
                            data={
                                allOptions.length > 0
                                    ? allOptions
                                    : [
                                          {
                                              value: 'no-items',
                                              label: 'No items found',
                                              disabled: true,
                                          },
                                      ]
                            }
                            value={
                                (appliedFilterValues[filter.key] as string[]) ||
                                filter.defaultValue
                            }
                            onChange={(value) =>
                                updateFilters({ [filter.key]: value })
                            }
                            placeholder={filter.placeholder}
                            searchable
                            disabled={filter.disabled}
                            onSearchChange={filter.onSearch}
                            renderOption={
                                needsCustomRender
                                    ? ({ option }: { option: any }) => {
                                          return (
                                              <div
                                                  style={{
                                                      display: 'flex',
                                                      alignItems: 'center',
                                                      gap: '8px',
                                                  }}
                                              >
                                                  {isCategoriesFilter &&
                                                      getCategoryIcon(
                                                          option.label
                                                      )}
                                                  {isBusinessRulesFilter &&
                                                      option.color && (
                                                          <div
                                                              style={{
                                                                  width: '8px',
                                                                  height: '8px',
                                                                  borderRadius:
                                                                      '50%',
                                                                  backgroundColor:
                                                                      option.color,
                                                                  flexShrink: 0,
                                                              }}
                                                          />
                                                      )}
                                                  <span>{option.label}</span>
                                              </div>
                                          );
                                      }
                                    : undefined
                            }
                        />
                    );
                }

                if (filter.type === 'paginatedMultiselect') {
                    return (
                        <PaginatedMultiSelect
                            key={filter.key}
                            label={filter.label}
                            data={
                                filter.options.length > 0
                                    ? filter.options
                                    : [
                                          {
                                              value: 'no-items',
                                              label: 'No items found',
                                              disabled: true,
                                          },
                                      ]
                            }
                            value={
                                (appliedFilterValues[filter.key] as string[]) ||
                                filter.defaultValue
                            }
                            onChange={(value) =>
                                updateFilters({ [filter.key]: value })
                            }
                            placeholder={filter.placeholder}
                            searchable
                            disabled={filter.disabled}
                            onSearchChange={filter.onSearch}
                            paginatedItemCount={filter.paginatedItemCount}
                        />
                    );
                }

                if (filter.type === 'dateRange') {
                    return (
                        <DateRangeSelects
                            key={filter.key}
                            value={
                                (appliedFilterValues[
                                    filter.key
                                ] as DateRangeFilterValueType) ||
                                filter.defaultValue
                            }
                            onChange={(value) => {
                                updateFilters({ [filter.key]: value });
                            }}
                        />
                    );
                }

                if (filter.type === 'togglePills') {
                    return (
                        <FilterTogglePills
                            key={filter.key}
                            options={filter.options}
                            value={
                                (appliedFilterValues[filter.key] as string[]) ||
                                filter.defaultValue
                            }
                            onChange={(newValue) => {
                                updateFilters({ [filter.key]: newValue });
                            }}
                            multiSelect={filter.multiSelect}
                            label={filter.label}
                            subLabel={filter.subLabel}
                            includeAllOption={!filter.removeAllOption}
                        />
                    );
                }

                if (filter.type === 'range') {
                    return (
                        <FilterRangeSlider
                            key={filter.key}
                            filter={filter}
                            updateFilters={updateFilters}
                        />
                    );
                }

                if (filter.type === 'boolean') {
                    return (
                        <Checkbox
                            key={filter.key}
                            label={filter.label}
                            checked={
                                (appliedFilterValues[filter.key] as boolean) ||
                                filter.defaultValue
                            }
                            onChange={(event) =>
                                updateFilters({
                                    [filter.key]: event.target.checked,
                                })
                            }
                        />
                    );
                }

                if (filter.type === 'customFields') {
                    return (
                        <FilterSlideOutCustomFields
                            key={filter.key}
                            filterKey={filter.key}
                            label={filter.label}
                            objectType={filter.objectType}
                            defaultValue={JSON.parse(filter.defaultValue)}
                            updateFilters={updateFilters}
                        />
                    );
                }

                console.error(`Unsupported slideoutfilter: ${filter}`); // eslint-disable-line no-console
                return null;
            })}
        </Stack>
    );
};

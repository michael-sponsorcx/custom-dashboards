import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { Group, MultiSelect, MultiSelectProps } from '@mantine/core';
import { ComboboxData, ComboboxItem } from '@mantine/core';
import Check from '@/stadiumDS/foundations/icons/General/Check';
import colors from '@/stadiumDS/foundations/colors';

export interface PaginatedMultiSelectProps
    extends Omit<MultiSelectProps, 'data'> {
    data?: ComboboxData;
    paginatedItemCount?: number;
}

export const PaginatedMultiSelect = React.forwardRef<
    HTMLInputElement,
    PaginatedMultiSelectProps
>(
    (
        {
            data = [],
            paginatedItemCount = 25,
            searchValue,
            onSearchChange,
            ...props
        },
        ref
    ) => {
        const [internalSearchValue, setInternalSearchValue] = useState('');
        const [visibleItemCount, setVisibleItemCount] =
            useState(paginatedItemCount);

        const currentSearchValue =
            searchValue !== undefined ? searchValue : internalSearchValue;
        const handleSearchChange = useCallback(
            (value: string) => {
                if (onSearchChange) {
                    onSearchChange(value);
                } else {
                    setInternalSearchValue(value);
                }
            },
            [onSearchChange]
        );

        useEffect(() => {
            setVisibleItemCount(paginatedItemCount);
        }, [data, currentSearchValue, paginatedItemCount]);

        const paginatedData = useMemo(() => {
            if (!data || data.length === 0) {
                return [];
            }

            const parseItem = (
                item: unknown
            ): ComboboxItem | ComboboxItem[] => {
                if (typeof item === 'string') {
                    return { value: item, label: item };
                }
                if (typeof item === 'number') {
                    return { value: item.toString(), label: item.toString() };
                }
                if (item && typeof item === 'object') {
                    if (
                        'group' in item &&
                        'items' in item &&
                        typeof item.group === 'string' &&
                        Array.isArray(item.items)
                    ) {
                        return item.items.map(
                            (subItem: unknown) =>
                                parseItem(subItem) as ComboboxItem
                        );
                    }
                    const comboboxItem = item as ComboboxItem;
                    return {
                        value:
                            comboboxItem.value ||
                            comboboxItem.label ||
                            String(item),
                        label:
                            comboboxItem.label ||
                            comboboxItem.value ||
                            String(item),
                        disabled: comboboxItem.disabled || false,
                    };
                }
                return { value: String(item), label: String(item) };
            };

            const flattenAndParse = (items: unknown[]): ComboboxItem[] => {
                const result: ComboboxItem[] = [];
                for (const item of items) {
                    const parsed = parseItem(item);
                    if (Array.isArray(parsed)) {
                        result.push(...parsed);
                    } else {
                        result.push(parsed);
                    }
                }
                return result;
            };

            const dataArray = Array.isArray(data) ? data : [data];
            const allItems = flattenAndParse(dataArray);

            const filteredItems = currentSearchValue
                ? allItems.filter(
                      (item) =>
                          item.label
                              .toLowerCase()
                              .includes(currentSearchValue.toLowerCase()) ||
                          item.value
                              .toLowerCase()
                              .includes(currentSearchValue.toLowerCase())
                  )
                : allItems;

            const totalCount = filteredItems.length;
            const paginatedItems = filteredItems.slice(0, visibleItemCount);

            const unaccountedForItems =
                props.value
                    ?.filter(
                        (value) =>
                            !paginatedItems.some(
                                (item) => item.value === value
                            ) && allItems.some((item) => item.value === value)
                    )
                    .map(
                        (value) =>
                            allItems.find(
                                (item) => item.value === value
                            ) as ComboboxItem
                    ) || [];
            paginatedItems.push(...unaccountedForItems);

            const hasMoreItems = totalCount > paginatedItems.length;

            const finalData = hasMoreItems
                ? [
                      ...paginatedItems,
                      {
                          value: '__show_more_button__',
                          label: `Show next ${Math.min(
                              25,
                              totalCount - paginatedItems.length
                          )} (${paginatedItems.length} of ${totalCount})`,
                          disabled: false,
                      },
                  ]
                : paginatedItems;

            return finalData;
        }, [data, currentSearchValue, visibleItemCount]);

        const handleShowMoreClick = useCallback((event: React.MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();
            setVisibleItemCount((prev) => prev + 25);
        }, []);

        const renderOption = useCallback(
            ({ option }: { option: ComboboxItem }) => {
                if (option.value === '__show_more_button__') {
                    return (
                        <div
                            style={{
                                padding: '8px 12px',
                                cursor: 'pointer',
                                textAlign: 'center',
                                fontWeight: 500,
                                color: '#495057',
                            }}
                            onClick={handleShowMoreClick}
                        >
                            {option.label}
                        </div>
                    );
                }
                return (
                    <Group justify="space-between" flex="1">
                        {option.label}
                        {props.value?.includes(option.value) ? (
                            <Check color={colors.Brand[400]} />
                        ) : null}
                    </Group>
                );
            },
            [handleShowMoreClick, props.value]
        );

        return (
            <MultiSelect
                {...props}
                ref={ref}
                data={paginatedData}
                searchValue={currentSearchValue}
                onSearchChange={handleSearchChange}
                searchable={props.searchable !== false}
                renderOption={renderOption}
                placeholder={props.placeholder}
            />
        );
    }
);

PaginatedMultiSelect.displayName = 'PaginatedMultiSelect';

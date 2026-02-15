import { ComboboxItem, Group, UnstyledButton } from '@mantine/core';
import { SelectMenu } from '@/stadiumDS/sharedComponents/menu/SelectMenu';
import { PageHeaderInlineLabel } from './PageHeaderInlineLabel';
import { FilterValueType, PageHeaderFilter } from '../PageHeaderFilters.type';
import { SELECT_MENU_PAGE_SIZE } from '@/stadiumDS/sharedComponents/menu/SelectMenu.constants';
import { getCategoryIcon } from '@/pages/teamPortal/admin/validationRules';

interface PageHeaderInlineFiltersProps {
    defaultFilters: PageHeaderFilter[];
    appliedFilterValues: Record<string, FilterValueType>;
    updateFilters: (updatedParams: Record<string, FilterValueType>) => void;
}

/** This component is used to render the filters in the filter header itself. The filters that are rendered in the filter slideout are in PageHeaderFilterSlideOutComponents.tsx */
export const PageHeaderInlineFilters = ({
    defaultFilters = [],
    appliedFilterValues,
    updateFilters,
}: PageHeaderInlineFiltersProps) => {
    const inHeaderFilters = (defaultFilters || []).filter(
        (filter) => filter.showInHeader
    );

    if (inHeaderFilters.length === 0) {
        return null;
    }

    return (
        <Group gap="md" wrap="nowrap">
            {inHeaderFilters.map((filter) => {
                if (
                    filter.type === 'select' ||
                    (filter.type === 'togglePills' && !filter.multiSelect)
                ) {
                    let tooltipLabel = `Select ${filter.label}`;
                    if (
                        filter.type === 'select' &&
                        appliedFilterValues[filter.key]
                    ) {
                        const option = (
                            filter.selectedOptions ?? filter.options
                        ).find(
                            (option) =>
                                (option as ComboboxItem).value ===
                                appliedFilterValues[filter.key]
                        );
                        tooltipLabel =
                            (option as ComboboxItem)?.label ?? tooltipLabel;
                    } else if (
                        filter.type === 'togglePills' &&
                        (appliedFilterValues[filter.key] as string[])?.length
                    ) {
                        const option = (
                            filter.selectedOptions ?? filter.options
                        ).find(
                            (option) =>
                                (option as ComboboxItem).value ===
                                ((appliedFilterValues[
                                    filter.key
                                ] as string[]) || [])[0]
                        );
                        tooltipLabel =
                            (option as ComboboxItem)?.label ?? tooltipLabel;
                    }

                    return (
                        <SelectMenu
                            key={filter.key}
                            position="bottom-start"
                            trigger={
                                <UnstyledButton>
                                    <PageHeaderInlineLabel
                                        label={filter.label}
                                        selected={
                                            !!(
                                                (appliedFilterValues[
                                                    filter.key
                                                ] as string[]) || []
                                            ).length
                                        }
                                        onClear={() =>
                                            updateFilters({
                                                [filter.key]: undefined,
                                            })
                                        }
                                        tooltipLabel={tooltipLabel}
                                        clearable={
                                            filter.type === 'select'
                                                ? filter.clearable
                                                : !filter.removeAllOption
                                        }
                                    />
                                </UnstyledButton>
                            }
                            // listProps={{
                            //     scrollToIndex: filter.options.findIndex(
                            //         (option) =>
                            //             (option as ComboboxItem).value ===
                            //             appliedFilterValues[filter.key]
                            //     ),
                            // }}
                            items={filter.options.map((option) => ({
                                label: (option as ComboboxItem).label,
                                value: (option as ComboboxItem).value,
                                onClick: () => {
                                    updateFilters({
                                        [filter.key]:
                                            filter.type === 'select'
                                                ? (option as ComboboxItem).value
                                                : [
                                                      (option as ComboboxItem)
                                                          .value,
                                                  ],
                                    });
                                },
                            }))}
                            value={
                                filter.type === 'select'
                                    ? appliedFilterValues[filter.key]
                                    : (
                                          appliedFilterValues[
                                              filter.key
                                          ] as string[]
                                      )?.[0]
                            }
                            searchable
                            pageSize={
                                filter.onLoadMore
                                    ? undefined
                                    : SELECT_MENU_PAGE_SIZE
                            }
                            onSearch={filter.onSearch}
                            onLoadMore={filter.onLoadMore}
                            loadingItems={filter.loadingItems}
                        />
                    );
                } else if (
                    filter.type === 'multiselect' ||
                    (filter.type === 'togglePills' && filter.multiSelect)
                ) {
                    let tooltipLabel = `Select ${filter.label}`;
                    if ((appliedFilterValues[filter.key] as string[])?.length) {
                        const options = (
                            filter.selectedOptions ?? filter.options
                        ).filter((option) =>
                            (
                                (appliedFilterValues[filter.key] as string[]) ||
                                []
                            ).includes((option as ComboboxItem).value)
                        );
                        tooltipLabel = options
                            .map((option) => (option as ComboboxItem).label)
                            .join(', ');
                    }

                    return (
                        <SelectMenu
                            key={filter.key}
                            position="bottom-start"
                            trigger={
                                <UnstyledButton>
                                    <PageHeaderInlineLabel
                                        label={filter.label}
                                        amountSelected={
                                            (
                                                (appliedFilterValues[
                                                    filter.key
                                                ] as string[]) || []
                                            ).length
                                        }
                                        onClear={() =>
                                            updateFilters({
                                                [filter.key]: [],
                                            })
                                        }
                                        tooltipLabel={tooltipLabel}
                                    />
                                </UnstyledButton>
                            }
                            items={filter.options.map((option) => {
                                const optionWithExtras =
                                    option as ComboboxItem & {
                                        color?: string;
                                    };

                                // Determine leftSection based on filter type
                                let leftSection: React.ReactNode = undefined;

                                // For categories filter, use getCategoryIcon
                                if (filter.key === 'categories') {
                                    leftSection = getCategoryIcon(
                                        optionWithExtras.label
                                    );
                                }
                                // For business rules filter, use color indicator
                                else if (
                                    filter.key === 'businessRules' &&
                                    optionWithExtras.color
                                ) {
                                    leftSection = (
                                        <div
                                            style={{
                                                width: '8px',
                                                height: '8px',
                                                borderRadius: '50%',
                                                backgroundColor:
                                                    optionWithExtras.color,
                                                flexShrink: 0,
                                            }}
                                        />
                                    );
                                }

                                return {
                                    label: optionWithExtras.label,
                                    value: optionWithExtras.value,
                                    leftSection,
                                    onClick: () => {
                                        const newValues = [
                                            ...((appliedFilterValues[
                                                filter.key
                                            ] as string[]) || []),
                                        ];
                                        if (
                                            newValues.includes(
                                                optionWithExtras.value
                                            )
                                        ) {
                                            newValues.splice(
                                                newValues.indexOf(
                                                    optionWithExtras.value
                                                ),
                                                1
                                            );
                                        } else {
                                            newValues.push(
                                                optionWithExtras.value
                                            );
                                        }
                                        updateFilters({
                                            [filter.key]: newValues,
                                        });
                                    },
                                };
                            })}
                            multiple
                            value={appliedFilterValues[filter.key]}
                            searchable
                            pageSize={
                                filter.onLoadMore
                                    ? undefined
                                    : SELECT_MENU_PAGE_SIZE
                            }
                            onSearch={filter.onSearch}
                            onLoadMore={filter.onLoadMore}
                            loadingItems={filter.loadingItems}
                        />
                    );
                }
                console.error(`Unsupported header filter: ${filter}`); // eslint-disable-line no-console
                return null;
            })}
        </Group>
    );
};

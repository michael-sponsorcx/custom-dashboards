import { FloatingPosition, Menu, Text, TextInput } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import classes from './SelectMenu.module.css';
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import Check from '@/stadiumDS/foundations/icons/General/Check';
import colors from '@/stadiumDS/foundations/colors';
import Search from '@/stadiumDS/foundations/icons/General/Search';

export type Item = {
    label: string;
    value: any;
    leftSection?: React.ReactNode;
    onClick: (value: any, e: React.MouseEvent<HTMLButtonElement>) => void;
    key?: string;
};

interface SelectMenuProps {
    withinPortal?: boolean;
    trigger: React.ReactNode;
    items: Item[];
    value?: any;
    onClose?: () => void;
    multiple?: boolean;
    searchable?: boolean;
    disabled?: boolean;
    closeOnItemClick?: boolean;
    onSearch?: (search: string) => void;
    loadingItems?: boolean;
    position?: FloatingPosition;
    pageSize?: number;
    onLoadMore?: () => void;
    opened?: boolean;
    onChange?: (opened: boolean) => void;
    // listProps?: Menu.DropdownProps['listProps'];
}

export const SelectMenu = forwardRef<HTMLDivElement, SelectMenuProps>(
    (
        {
            withinPortal = false,
            trigger,
            items,
            value,
            onClose,
            multiple = false,
            searchable = false,
            disabled = false,
            closeOnItemClick = false,
            onSearch,
            position,
            pageSize,
            loadingItems = false,
            onLoadMore,
            opened,
            onChange,
            // listProps,
        },
        ref
    ) => {
        const [search, setSearch] = useState('');
        const [debouncedSearch] = useDebouncedValue(search, 300);
        const [filteredItems, setFilteredItems] = useState<Item[]>(items);
        const [itemsToShow, setItemsToShow] = useState(pageSize);
        const scrollableContainerRef = useRef<HTMLDivElement>(null);
        const selectedItemRef = useRef<HTMLElement | null>(null);
        const menuOpenedRef = useRef(false);

        const handleClose = () => {
            setSearch('');
            onSearch?.('');
            setItemsToShow(pageSize);
            onClose?.();
        };

        const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
            const target = e.currentTarget;
            const scrolledToBottom =
                target.scrollHeight - target.scrollTop - target.clientHeight <
                50;

            if (!scrolledToBottom) return;

            const canRevealMore =
                itemsToShow !== undefined && itemsToShow < filteredItems.length;

            if (canRevealMore) {
                setItemsToShow((prev) => {
                    const increment = pageSize ?? filteredItems.length;
                    return Math.min(
                        filteredItems.length,
                        (prev ?? 0) + increment
                    );
                });
                return;
            }

            if (onLoadMore && !loadingItems) {
                onLoadMore();
            }
        };

        useEffect(() => {
            setFilteredItems(
                items.filter((item) =>
                    item.label
                        .toLowerCase()
                        .includes(debouncedSearch.toLowerCase())
                )
            );
        }, [debouncedSearch, items]);

        useEffect(() => {
            setItemsToShow(pageSize);
        }, [debouncedSearch, pageSize]);

        // Ensure selected item is visible when menu opens (for pagination)
        useEffect(() => {
            if (
                opened &&
                !search &&
                value !== undefined &&
                value !== null &&
                filteredItems.length > 0
            ) {
                const selectedIndex = filteredItems.findIndex(
                    (item) => item.value === value
                );
                if (
                    selectedIndex !== -1 &&
                    selectedIndex >= (itemsToShow ?? pageSize ?? 0)
                ) {
                    // Selected item is beyond the currently shown items, expand to show it
                    setItemsToShow(selectedIndex + 1);
                }
            }
        }, [opened, value, search, filteredItems, itemsToShow, pageSize]);

        const loadingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
        const [isLoading, setIsLoading] = useState(false);

        useEffect(() => {
            if (loadingItems) {
                setIsLoading(true);
                loadingRef.current && clearTimeout(loadingRef.current);
            } else if (filteredItems.length === 0) {
                loadingRef.current = setTimeout(() => {
                    setIsLoading(false);
                }, 500);
            } else {
                setIsLoading(false);
                loadingRef.current && clearTimeout(loadingRef.current);
            }
        }, [loadingItems, filteredItems.length]);

        useEffect(() => {
            return () => {
                if (loadingRef.current) {
                    clearTimeout(loadingRef.current);
                    loadingRef.current = null;
                }
            };
        }, []);

        // Function to scroll to the selected item
        const scrollToSelectedItem = useCallback(() => {
            if (
                search ||
                value === undefined ||
                value === null ||
                !scrollableContainerRef.current
            ) {
                return;
            }

            let attempts = 0;
            const maxAttempts = 10;

            const tryScroll = () => {
                attempts++;

                if (!scrollableContainerRef.current) {
                    if (attempts < maxAttempts) {
                        setTimeout(tryScroll, 100);
                    }
                    return;
                }

                if (!selectedItemRef.current) {
                    // For multiselect, find the first selected item
                    // querySelector returns the first match, which is what we want
                    const selectedItem =
                        scrollableContainerRef.current.querySelector(
                            '[data-selected="true"]'
                        ) as HTMLElement;
                    if (selectedItem) {
                        selectedItemRef.current = selectedItem;
                    } else {
                        if (attempts < maxAttempts) {
                            setTimeout(tryScroll, 100);
                        }
                        return;
                    }
                }

                if (scrollableContainerRef.current && selectedItemRef.current) {
                    const container = scrollableContainerRef.current;
                    const selected = selectedItemRef.current;

                    const containerRect = container.getBoundingClientRect();
                    const selectedRect = selected.getBoundingClientRect();
                    const relativeTop =
                        selectedRect.top -
                        containerRect.top +
                        container.scrollTop;

                    const scrollPosition =
                        relativeTop -
                        container.clientHeight / 2 +
                        selected.clientHeight / 2;

                    container.scrollTo({
                        top: Math.max(0, scrollPosition),
                        behavior: 'smooth',
                    });
                }
            };

            tryScroll();
        }, [search, value]);

        return (
            <Menu
                withinPortal={withinPortal}
                classNames={classes}
                onClose={handleClose}
                closeOnItemClick={closeOnItemClick}
                disabled={disabled}
                position={position}
                opened={opened}
                onChange={(openedState) => {
                    onChange?.(openedState);
                    if (openedState) {
                        menuOpenedRef.current = true;
                        // Trigger scroll when menu opens
                        setTimeout(() => {
                            scrollToSelectedItem();
                        }, 150);
                    } else {
                        menuOpenedRef.current = false;
                    }
                }}
            >
                <Menu.Target>{trigger}</Menu.Target>
                <Menu.Dropdown ref={ref}>
                    {searchable && (
                        <TextInput
                            value={search}
                            onChange={(event) => {
                                setSearch(event.currentTarget.value);
                                onSearch?.(event.currentTarget.value);
                            }}
                            placeholder="Search"
                            leftSection={
                                <Search
                                    size={'16'}
                                    variant="md"
                                    color={colors.Gray[600]}
                                />
                            }
                            styles={{
                                input: {
                                    padding: '4px 8px 4px 32px',
                                    height: '32px',
                                    borderRadius: '0px',
                                    border: 'none',
                                    borderBottom: `1px solid ${colors.Gray[300]}`,
                                    boxShadow: 'none',
                                    fontSize: '14px',
                                },
                            }}
                            onClick={(e) => e.stopPropagation()}
                        />
                    )}
                    <div
                        ref={scrollableContainerRef}
                        style={{
                            maxHeight: '250px',
                            overflowY: 'auto',
                            scrollbarWidth: 'thin',
                        }}
                        onScroll={handleScroll}
                    >
                        {filteredItems.slice(0, itemsToShow).map((item) => {
                            const isSelected =
                                (multiple &&
                                    (value || []).includes(item.value)) ||
                                (!multiple && item.value === value);

                            // For multiselect, only set ref on the first selected item in the filtered list
                            let shouldSetRef = isSelected;
                            if (multiple && isSelected) {
                                // Find the first selected item in the filtered list
                                const firstSelectedIndex = filteredItems
                                    .slice(0, itemsToShow)
                                    .findIndex((filteredItem) =>
                                        (value || []).includes(
                                            filteredItem.value
                                        )
                                    );
                                const currentIndex = filteredItems
                                    .slice(0, itemsToShow)
                                    .findIndex(
                                        (filteredItem) =>
                                            filteredItem.value === item.value
                                    );
                                shouldSetRef =
                                    currentIndex === firstSelectedIndex;
                            }

                            return (
                                <Menu.Item
                                    key={`select-menu-item-${item.value}-${item.key}`}
                                    component="button"
                                    ref={
                                        shouldSetRef
                                            ? (
                                                  el: HTMLButtonElement | null
                                              ) => {
                                                  selectedItemRef.current = el;
                                              }
                                            : undefined
                                    }
                                    data-menu-item
                                    data-selected={
                                        isSelected ? 'true' : 'false'
                                    }
                                    leftSection={item.leftSection}
                                    rightSection={
                                        isSelected ? (
                                            <Check
                                                color={colors.Brand[400]}
                                                size={'16'}
                                            />
                                        ) : (
                                            <div style={{ width: '16px' }} />
                                        )
                                    }
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        item.onClick(item.value, e);
                                    }}
                                >
                                    {item.label}
                                </Menu.Item>
                            );
                        })}
                        {isLoading ? (
                            <Menu.Item disabled>
                                <Text className={classes.loadingText}>
                                    Loading more results
                                </Text>
                            </Menu.Item>
                        ) : filteredItems.length === 0 ? (
                            <Menu.Item disabled>No items found</Menu.Item>
                        ) : null}
                    </div>
                </Menu.Dropdown>
            </Menu>
        );
    }
);

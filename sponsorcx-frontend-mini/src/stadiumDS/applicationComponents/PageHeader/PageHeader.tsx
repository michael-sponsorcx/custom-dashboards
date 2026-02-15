import { SavedViewsManager } from '@/components/DataTable/SavedViews/SavedViewsManager';
import { UserContext } from '@/context';
import { SavedView } from '@/gql/savedViewsGql';
import useStore from '@/state';
import { Button, Flex, Group, Stack, Text } from '@mantine/core';
import {
    ColumnDef,
    ColumnOrderState,
    ColumnPinningState,
    SortingState,
} from '@tanstack/react-table';
import { ReactNode, useContext } from 'react';
import 'styled-components/macro';
import PageHeaderFilters from './PageHeaderFilters/PageHeaderFilters';
import {
    FilterValueType,
    PageHeaderFilter,
} from './PageHeaderFilters/PageHeaderFilters.type';
import { ColumnsSelectSlideOut } from './components/ColumnsSelectSlideOut';
import GroupSortMenu from './components/GroupSortMenu';
import ThreeDotMenu, { ThreeDotMenuOption } from './components/ThreeDotMenu';
import { SearchBar } from './components/SearchBar';
import colors from '@/stadiumDS/foundations/colors';
import ExpandAllButton from './components/ExpandAllButton';
import ViewToggle from './components/ViewToggle/ViewToggle';

interface PageHeaderPropsBase<T> {
    tableName: string;
    primaryBtnLeftSection?: ReactNode;
    primaryBtnDisabled?: boolean;
    hideFilters?: boolean;
    hideSavedViews?: boolean;
    secondaryBtnText?: string;
    handleSecondaryBtnClick?: () => void;
    searchable?: boolean;
    /** Custom key for the search query param. Defaults to 'search'. */
    searchKey?: string;
    selectedGroupByOption?: string;
    groupByOptions?: { key: string; label: string }[];
    handleGroupBySelect?: (option: string) => void;
    threeDotMenuOptions?: ThreeDotMenuOption[];
    currentColumnOrder?: ColumnOrderState;
    currentSorting?: SortingState;
    currentColumnPinning?: ColumnPinningState;
    currentColumnVisibility?: Record<string, boolean>;
    currentColumnWidths?: Record<string, number>;
    currentGroupBy?: string;
    currentExpanded?: any;
    setColumnVisibility?: (visibility: Record<string, boolean>) => void;
    onViewSelect: (view: SavedView) => void;
    isSelectColumnsSlideoutOpen?: boolean;
    setIsSelectColumnsSlideoutOpen?: (isOpen: boolean) => void;
    appliedFilterValues: Record<string, FilterValueType>;
    handleResetFilters: () => void;
    updateFilters: (
        updatedParams: Record<string, any>,
        replace?: 'replace'
    ) => void;
    filtersAreApplied: boolean;
    defaultFilters: PageHeaderFilter[];
    tableColumns?: ColumnDef<T>[];
    isAllExpanded?: boolean;
    setIsAllExpanded?: (isAllExpanded: boolean) => void;
    viewToggleItems?: {
        key: string;
        tooltip: string;
        children: ReactNode;
        onClick: () => void;
        isActive: boolean;
    }[];
    entityId?: string;
    entityIdLoading?: boolean;
    activeView?: SavedView;
    savedViews: SavedView[];
    refetchSavedViews: () => void;
    savedViewsLoading: boolean;
    setActiveViewId: (viewId: string) => void;
    removeFilterSlideOut?: boolean;
    expandingDisabled?: boolean;
    defaultSearchBarToOpen?: boolean;
    additionalHeaderItems?: ReactNode;
    disableScrollActiveButton?: boolean;
}

export type PageHeaderProps<T> = PageHeaderPropsBase<T> &
    // TODO: alex -> remove `hidePrimaryBtn` prop and derive the value from whether `handlePrimaryBtnClick` is defined (therefore make `handlePrimaryBtnClick` type be possibly undefined)
    (| {
              hidePrimaryBtn: true;
              primaryBtnText?: string;
              handlePrimaryBtnClick?: () => void;
          }
        | {
              hidePrimaryBtn?: false;
              primaryBtnText: string;
              handlePrimaryBtnClick: () => void;
          }
    );

const PageHeader = <T,>({
    tableName,
    primaryBtnText,
    handlePrimaryBtnClick,
    primaryBtnLeftSection,
    primaryBtnDisabled = false,
    hidePrimaryBtn = false,
    hideFilters = false,
    hideSavedViews = false,
    secondaryBtnText,
    handleSecondaryBtnClick,
    searchable = false,
    searchKey,
    selectedGroupByOption,
    groupByOptions,
    handleGroupBySelect,
    threeDotMenuOptions,
    appliedFilterValues,
    handleResetFilters,
    updateFilters,
    filtersAreApplied,
    currentColumnOrder = [],
    currentSorting = [],
    currentColumnPinning = {},
    currentColumnVisibility = {},
    currentColumnWidths = {},
    currentGroupBy,
    currentExpanded,
    setColumnVisibility = () => null,
    onViewSelect,
    defaultFilters,
    isSelectColumnsSlideoutOpen = false,
    setIsSelectColumnsSlideoutOpen = () => null,
    tableColumns = [],
    isAllExpanded,
    setIsAllExpanded,
    viewToggleItems = [],
    entityId,
    entityIdLoading,
    activeView,
    savedViews,
    refetchSavedViews,
    savedViewsLoading,
    setActiveViewId,
    removeFilterSlideOut,
    expandingDisabled = false,
    defaultSearchBarToOpen = false,
    additionalHeaderItems,
    disableScrollActiveButton = false,
}: PageHeaderProps<T>): JSX.Element => {
    const { user } = useContext(UserContext);
    const organization = useStore((state) => state.organization);

    const showSecondaryBtn = secondaryBtnText && handleSecondaryBtnClick;
    const showGroupingOptions =
        !!groupByOptions?.length &&
        !!handleGroupBySelect &&
        !!selectedGroupByOption;
    const showExpandBtn = isAllExpanded !== undefined && setIsAllExpanded;

    const firstRowJustify = hideSavedViews ? 'flex-end' : 'space-between';

    return (
        <>
            <Stack gap="4px">
                <Flex
                    justify={firstRowJustify}
                    wrap="nowrap"
                    align="flex-start"
                    gap="md"
                >
                    {!hideSavedViews && (
                        <SavedViewsManager
                            currentFilters={appliedFilterValues}
                            currentColumnOrder={currentColumnOrder}
                            currentSorting={currentSorting}
                            currentColumnPinning={currentColumnPinning}
                            currentColumnVisibility={currentColumnVisibility}
                            currentColumnWidths={currentColumnWidths}
                            onViewSelect={onViewSelect}
                            userId={user?.id}
                            organizationId={organization?.id}
                            tableName={tableName}
                            currentGroupBy={currentGroupBy}
                            currentExpanded={currentExpanded}
                            entityId={entityId}
                            entityIdLoading={entityIdLoading}
                            activeView={activeView}
                            savedViews={savedViews}
                            refetchSavedViews={refetchSavedViews}
                            savedViewsLoading={savedViewsLoading}
                            setActiveViewId={setActiveViewId}
                            filtersAreApplied={filtersAreApplied}
                            disableScrollActiveButton={
                                disableScrollActiveButton
                            }
                        />
                    )}
                    <Group>
                        {viewToggleItems.length > 0 && (
                            <ViewToggle items={viewToggleItems} />
                        )}
                        {additionalHeaderItems}
                        {showSecondaryBtn && (
                            <Button
                                variant="outline"
                                onClick={handleSecondaryBtnClick}
                            >
                                {secondaryBtnText}
                            </Button>
                        )}
                        {!hidePrimaryBtn && (
                            <Button
                                onClick={handlePrimaryBtnClick}
                                disabled={primaryBtnDisabled}
                                leftSection={primaryBtnLeftSection}
                            >
                                {primaryBtnText}
                            </Button>
                        )}
                    </Group>
                </Flex>
                <Group justify="space-between">
                    <Group>
                        {searchable && (
                            <SearchBar
                                defaultToOpen={defaultSearchBarToOpen}
                                searchKey={searchKey}
                            />
                        )}
                        {!hideFilters && (
                            <PageHeaderFilters
                                appliedFilterValues={appliedFilterValues}
                                handleResetFilters={handleResetFilters}
                                updateFilters={updateFilters}
                                filtersAreApplied={filtersAreApplied}
                                defaultFilters={defaultFilters}
                                removeFilterSlideOut={removeFilterSlideOut}
                            />
                        )}
                    </Group>
                    <Group>
                        {showGroupingOptions &&
                            selectedGroupByOption !== 'none' && (
                                <Text c={colors.Brand[400]} size="sm">
                                    Grouped by:{' '}
                                    {
                                        groupByOptions?.find(
                                            (opt) =>
                                                opt.key ===
                                                selectedGroupByOption
                                        )?.label
                                    }
                                </Text>
                            )}
                        {showGroupingOptions && (
                            <GroupSortMenu
                                selectedGroupByOption={selectedGroupByOption}
                                groupByOptions={groupByOptions}
                                onGroupBySelect={(key) => {
                                    handleGroupBySelect(key);
                                }}
                            />
                        )}
                        {showExpandBtn && (
                            <ExpandAllButton
                                isAllExpanded={isAllExpanded}
                                setIsAllExpanded={setIsAllExpanded}
                                expandingDisabled={expandingDisabled}
                            />
                        )}
                        {threeDotMenuOptions?.length && (
                            <ThreeDotMenu options={threeDotMenuOptions} />
                        )}
                    </Group>
                </Group>
            </Stack>
            {tableColumns.length > 0 && (
                <ColumnsSelectSlideOut
                    isOpen={isSelectColumnsSlideoutOpen}
                    onClose={() => setIsSelectColumnsSlideoutOpen(false)}
                    visibleColumns={Object.entries(currentColumnVisibility)
                        .filter(([_, isVisible]) => isVisible)
                        .map(([columnId]) => columnId)}
                    onColumnVisibilityChange={(columnId, isVisible) => {
                        setColumnVisibility({
                            ...currentColumnVisibility,
                            [columnId]: isVisible,
                        });
                    }}
                    columns={tableColumns}
                />
            )}
        </>
    );
};

export default PageHeader;

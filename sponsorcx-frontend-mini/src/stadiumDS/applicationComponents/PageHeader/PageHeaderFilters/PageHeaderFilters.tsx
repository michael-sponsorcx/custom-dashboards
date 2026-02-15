import colors from '@/stadiumDS/foundations/colors';
import Settings from '@/stadiumDS/foundations/icons/General/Settings';
import { Button, Divider } from '@mantine/core';
import { useState } from 'react';
import { FilterValueType, PageHeaderFilter } from './PageHeaderFilters.type';
import PageHeaderFilterSlideOut from './PageHeaderFilterSlideOut';
import { PageHeaderInlineFilters } from './PageHeaderInlineFilters/PageHeaderInlineFilters';

interface PageHeaderFiltersProps {
    appliedFilterValues: Record<string, FilterValueType>;
    handleResetFilters: () => void;
    updateFilters: (updatedParams: Record<string, FilterValueType>) => void;
    filtersAreApplied: boolean;
    defaultFilters: PageHeaderFilter[];
    removeFilterSlideOut?: boolean;
}

const PageHeaderFilters = ({
    appliedFilterValues,
    handleResetFilters,
    updateFilters,
    filtersAreApplied,
    defaultFilters,
    removeFilterSlideOut,
}: PageHeaderFiltersProps) => {
    const [filterModalOpen, setFilterModalOpen] = useState<boolean>(false);

    return (
        <>
            <PageHeaderInlineFilters
                defaultFilters={defaultFilters}
                appliedFilterValues={appliedFilterValues}
                updateFilters={updateFilters}
            />
            {!removeFilterSlideOut && (
                <Button
                    variant="subtle"
                    rightSection={
                        <Settings
                            size="18px"
                            variant="4"
                            color={colors.Gray[400]}
                        />
                    }
                    onClick={() => setFilterModalOpen(true)}
                    c={colors.Gray[600]}
                    style={{
                        fontSize: '12px',
                        lineHeight: '20px',
                        padding: '6px 8px',
                        borderWidth: '0px',
                    }}
                >
                    Filter
                </Button>
            )}
            {filtersAreApplied && (
                <>
                    <Divider
                        orientation="vertical"
                        h={24}
                        style={{ alignSelf: 'center' }}
                    />
                    <Button
                        variant="subtle"
                        onClick={handleResetFilters}
                        c={colors.Brand[400]}
                        fw={400}
                        style={{
                            fontSize: '12px',
                            lineHeight: '20px',
                            padding: '6px 8px',
                            borderWidth: '0px',
                        }}
                    >
                        Reset
                    </Button>
                </>
            )}
            {!removeFilterSlideOut && (
                <PageHeaderFilterSlideOut
                    isOpen={filterModalOpen}
                    onClose={() => setFilterModalOpen(false)}
                    appliedFilterValues={appliedFilterValues}
                    handleResetFilters={handleResetFilters}
                    updateFilters={updateFilters}
                    filtersAreApplied={filtersAreApplied}
                    defaultFilters={defaultFilters}
                />
            )}
        </>
    );
};

export default PageHeaderFilters;

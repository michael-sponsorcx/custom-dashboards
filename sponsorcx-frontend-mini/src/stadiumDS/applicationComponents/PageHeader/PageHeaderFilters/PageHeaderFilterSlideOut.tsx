import { SlideOut } from '@/stadiumDS/sharedComponents/SlideOut/SlideOut';
import { Button, Group } from '@mantine/core';
import { FilterValueType, PageHeaderFilter } from './PageHeaderFilters.type';
import { PageHeaderFilterSlideOutComponents } from './PageHeaderFilterSlideOutComponents';

interface PageHeaderFilterSlideOutProps {
    isOpen: boolean;
    onClose: () => void;
    appliedFilterValues: Record<string, FilterValueType>;
    handleResetFilters: () => void;
    updateFilters: (updatedParams: Record<string, FilterValueType>) => void;
    filtersAreApplied: boolean;
    defaultFilters: PageHeaderFilter[];
}

const PageHeaderFilterSlideOut = ({
    isOpen,
    onClose,
    appliedFilterValues,
    handleResetFilters,
    updateFilters,
    filtersAreApplied,
    defaultFilters,
}: PageHeaderFilterSlideOutProps) => {
    return (
        <SlideOut
            width="400px"
            isOpen={isOpen}
            onClose={onClose}
            headerTitle="Filters"
            headerSubTitle="Apply filters to see your data"
            footerContent={
                <Group justify="end" mih="50px">
                    {filtersAreApplied && (
                        <Button variant="subtle" onClick={handleResetFilters}>
                            Reset
                        </Button>
                    )}
                </Group>
            }
        >
            <PageHeaderFilterSlideOutComponents
                defaultFilters={defaultFilters}
                appliedFilterValues={appliedFilterValues}
                updateFilters={updateFilters}
            />
        </SlideOut>
    );
};

export default PageHeaderFilterSlideOut;

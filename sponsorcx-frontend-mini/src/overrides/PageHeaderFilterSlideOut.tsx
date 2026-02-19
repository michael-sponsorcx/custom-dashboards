/**
 * App-level override of stadiumDS PageHeaderFilterSlideOut.
 *
 * Identical to the original but adds a "Configure" tab to the SlideOut
 * so users can set up which data sources and fields are filterable
 * from within the same slideout that shows filter values.
 *
 * Swapped in via Vite resolve alias in vite.config.ts.
 */

import { SlideOut } from '@/stadiumDS/sharedComponents/SlideOut/SlideOut';
import { Button, Group } from '@mantine/core';
import type {
  FilterValueType,
  PageHeaderFilter,
} from '@/stadiumDS/applicationComponents/PageHeader/PageHeaderFilters/PageHeaderFilters.type';
import { PageHeaderFilterSlideOutComponents } from '@/stadiumDS/applicationComponents/PageHeader/PageHeaderFilters/PageHeaderFilterSlideOutComponents';
import { ConfigureFiltersContent } from '@/components/dashboard/ConfigureFiltersContent';

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
  const additionalTabs = [
    {
      value: 'configure',
      label: 'Configure',
      content: <ConfigureFiltersContent onClose={onClose} />,
    },
  ];

  return (
    <SlideOut
      width="400px"
      isOpen={isOpen}
      onClose={onClose}
      headerTitle="Filters"
      headerSubTitle="Apply filters to see your data"
      additionalTabs={additionalTabs}
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

import { Button } from '@mantine/core';
import { IconFilter } from '@tabler/icons-react';

interface DashboardFiltersProps {
  onOpenFilters: () => void;
}

/**
 * DashboardFilters Component
 *
 * Button component that opens the dashboard-wide filter modal.
 * Allows applying filters across all graphs on the dashboard.
 */
export function DashboardFilters({ onOpenFilters }: DashboardFiltersProps) {
  return (
    <Button
      onClick={onOpenFilters}
      variant="outline"
      leftSection={<IconFilter size={18} />}
      size="md"
    >
      Dashboard Filters
    </Button>
  );
}

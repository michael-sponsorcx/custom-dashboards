import { useMemo } from 'react';
import { Group, Text, ActionIcon } from '@mantine/core';
import { IconSortAscending, IconSortDescending } from '@tabler/icons-react';

export type SortOrder = 'asc' | 'desc';

export interface OrderByControlProps {
  /** Current sort order */
  sortOrder: SortOrder;
  /** Callback when sort order changes */
  onSortOrderChange: (order: SortOrder) => void;
  /** Label to display */
  label?: string;
}

/**
 * OrderByControl Component (UI Only)
 *
 * A control that displays the current sort order and allows toggling between
 * ascending and descending. This component is meant to be used in chart settings.
 */
export function OrderByControl({
  sortOrder,
  onSortOrderChange,
  label = "Order By"
}: OrderByControlProps) {
  const handleToggle = () => {
    onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <Group justify="space-between">
      <Text size="sm" fw={500}>
        {label}
      </Text>
      <ActionIcon
        variant="light"
        size="lg"
        onClick={handleToggle}
        aria-label={`Sort ${sortOrder === 'asc' ? 'ascending' : 'descending'}`}
      >
        {sortOrder === 'asc' ? (
          <IconSortAscending size={18} />
        ) : (
          <IconSortDescending size={18} />
        )}
      </ActionIcon>
    </Group>
  );
}


/**
 * Hook to sort chart data by the primary dimension field
 *
 * @param data - Array of chart data points
 * @param dimensionField - The field name to sort by (primary dimension)
 * @param sortOrder - Sort order ('asc' or 'desc')
 * @returns Sorted array of chart data
 */
export function useSortedChartData<T extends Record<string, any>>(
  data: T[],
  dimensionField: string,
  sortOrder: SortOrder
): T[] {
  return useMemo(() => {
    if (!data || data.length === 0 || !dimensionField) {
      return data;
    }

    // Create a shallow copy to avoid mutating original array
    const sortedData = [...data];

    sortedData.sort((a, b) => {
      const aValue = a[dimensionField];
      const bValue = b[dimensionField];

      // Handle undefined/null values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortOrder === 'asc' ? 1 : -1;
      if (bValue == null) return sortOrder === 'asc' ? -1 : 1;

      // Sort based on type
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        // String comparison (case-insensitive)
        const comparison = aValue.toLowerCase().localeCompare(bValue.toLowerCase());
        return sortOrder === 'asc' ? comparison : -comparison;
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        // Numeric comparison
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      } else {
        // Fallback to string comparison
        const comparison = String(aValue).localeCompare(String(bValue));
        return sortOrder === 'asc' ? comparison : -comparison;
      }
    });

    return sortedData;
  }, [data, dimensionField, sortOrder]);
}

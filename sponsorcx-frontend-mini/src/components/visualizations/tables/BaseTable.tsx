import { Table, Loader, Center, Text } from '@mantine/core';
import { useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { EmptyState } from '../utils/EmptyState';

// Constants
export const INITIAL_DISPLAY_LIMIT = 50;
export const LOAD_INCREMENT = 50;
export const SCROLL_THRESHOLD = 50; // pixels from bottom to trigger load

export interface BaseTableColumn {
  key: string;
  label: string;
  render?: (value: unknown, row: Record<string, unknown>) => ReactNode;
}

export interface BaseTableProps {
  parsedData: Array<Record<string, unknown>>;
  queryResult?: unknown;
  columns?: BaseTableColumn[];
  isLoading?: boolean;
  height?: number;
  minWidth?: number;
  striped?: boolean;
  highlightOnHover?: boolean;
  withTableBorder?: boolean;
  withColumnBorders?: boolean;
  stickyHeader?: boolean;
  enableLazyLoading?: boolean;
  initialDisplayLimit?: number;
  loadIncrement?: number;
  scrollThreshold?: number;
}

/**
 * BaseTable Component
 *
 * A reusable table component with built-in features:
 * - Lazy loading with scroll-based virtualization
 * - Loading states
 * - Empty states
 * - Customizable styling
 * - Custom column renderers
 *
 * This component serves as the foundation for:
 * - QueryResultsTable: Displays raw query results
 * - ReportTable: Displays formatted reports as dashboard visualizations
 */
export function BaseTable({
  parsedData,
  queryResult,
  columns,
  isLoading = false,
  height = 600,
  minWidth = 500,
  striped = true,
  highlightOnHover = true,
  withTableBorder = true,
  withColumnBorders = true,
  stickyHeader = true,
  enableLazyLoading = true,
  initialDisplayLimit = INITIAL_DISPLAY_LIMIT,
  loadIncrement = LOAD_INCREMENT,
  scrollThreshold = SCROLL_THRESHOLD,
}: BaseTableProps) {
  // Lazy loading state
  const [displayLimit, setDisplayLimit] = useState(initialDisplayLimit);

  // Ref for scroll container
  const scrollRef = useRef<HTMLDivElement>(null);

  // Store total rows count in ref to avoid recreating handleScroll
  const totalRowsRef = useRef(0);

  // Auto-generate columns from first data row if not provided
  const effectiveColumns: BaseTableColumn[] = columns || (
    parsedData.length > 0
      ? Object.keys(parsedData[0]).map((key) => ({
          key,
          label: key,
        }))
      : []
  );

  // Handle scroll event to load more items - MUST be before any early returns
  const handleScroll = useCallback((e: Event) => {
    const container = e.target as HTMLDivElement;
    if (!container) {
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = container;
    const scrolledToBottom = scrollHeight - scrollTop - clientHeight < scrollThreshold;
    if (scrolledToBottom) {
      setDisplayLimit((prev) => {
        const total = totalRowsRef.current;
        if (prev >= total) return prev;
        return Math.min(prev + loadIncrement, total);
      });
    }
  }, [scrollThreshold, loadIncrement]);

  // Attach scroll listener - runs when data changes
  useEffect(() => {
    if (!enableLazyLoading) return;

    const container = scrollRef.current;

    if (container) {
      // Mantine's ScrollArea creates a viewport div that actually scrolls
      const viewport = container.querySelector('.mantine-ScrollArea-viewport') as HTMLElement;

      if (viewport) {
        viewport.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
          viewport.removeEventListener('scroll', handleScroll);
        };
      } else {
        container.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
          container.removeEventListener('scroll', handleScroll);
        };
      }
    }
  }, [parsedData, enableLazyLoading, handleScroll]);

  // Reset display limit when data changes
  useEffect(() => {
    setDisplayLimit(initialDisplayLimit);
  }, [parsedData, initialDisplayLimit]);

  // Update total rows ref
  totalRowsRef.current = parsedData.length;

  // Show loading indicator
  if (isLoading) {
    return (
      <div
        style={{
          height: `${height}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Center>
          <Loader size="xl" />
        </Center>
      </div>
    );
  }

  // Show empty state
  if (!parsedData || parsedData.length === 0) {
    return <EmptyState data={parsedData} queryResult={queryResult} />;
  }

  // Check if there are more items to load
  const hasMore = enableLazyLoading && displayLimit < parsedData.length;

  // Get rows to display
  const rowsToDisplay = enableLazyLoading ? parsedData.slice(0, displayLimit) : parsedData;

  // Default cell renderer
  const renderCell = (column: BaseTableColumn, row: Record<string, unknown>) => {
    const value = row[column.key];

    if (column.render) {
      return column.render(value, row);
    }

    return value !== null && value !== undefined ? String(value) : '-';
  };

  return (
    <Table.ScrollContainer minWidth={minWidth} h={height} ref={scrollRef}>
      <Table
        striped={striped}
        highlightOnHover={highlightOnHover}
        withTableBorder={withTableBorder}
        withColumnBorders={withColumnBorders}
        stickyHeader={stickyHeader}
      >
        <Table.Thead>
          <Table.Tr>
            {effectiveColumns.map((col) => (
              <Table.Th key={col.key}>{col.label}</Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rowsToDisplay.map((row, idx) => (
            <Table.Tr key={idx}>
              {effectiveColumns.map((col) => (
                <Table.Td key={col.key}>
                  {renderCell(col, row)}
                </Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      {hasMore && (
        <Center py="md">
          <Loader size="sm" />
        </Center>
      )}
      {!hasMore && enableLazyLoading && parsedData.length > initialDisplayLimit && (
        <Center py="xs">
          <Text size="xs" c="dimmed">
            All {parsedData.length} rows loaded
          </Text>
        </Center>
      )}
    </Table.ScrollContainer>
  );
}

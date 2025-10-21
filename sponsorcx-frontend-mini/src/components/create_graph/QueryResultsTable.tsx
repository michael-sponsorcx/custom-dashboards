import { Table, Loader, Center, Text } from '@mantine/core';
import { useState, useEffect, useRef, useCallback } from 'react';

interface QueryResultsTableProps {
  queryResult: any;
  isLoading?: boolean;
}

// Constants outside component to avoid recreation
const INITIAL_DISPLAY_LIMIT = 50;
const LOAD_INCREMENT = 50;
const SCROLL_THRESHOLD = 50; // pixels from bottom to trigger load

/**
 * QueryResultsTable Component
 *
 * Displays query results in a structured table format.
 * Parses Cube.js query results and renders columns and rows.
 *
 * Performance optimizations:
 * - Lazy loading: Only renders 50 rows initially
 * - Scroll-based virtualization: Loads more rows as user scrolls
 * - No unnecessary memoization (table only re-renders when queryResult changes, which is intentional)
 */
export function QueryResultsTable({ queryResult, isLoading = false }: QueryResultsTableProps) {
  // Lazy loading state - only render a subset at a time
  const [displayLimit, setDisplayLimit] = useState(INITIAL_DISPLAY_LIMIT);

  // Ref for scroll container
  const scrollRef = useRef<HTMLDivElement>(null);

  // Store total rows count in ref to avoid recreating handleScroll
  const totalRowsRef = useRef(0);

  // Handle scroll event to load more items - MUST be before any early returns
  const handleScroll = useCallback((e: Event) => {
    const container = e.target as HTMLDivElement;
    if (!container) {
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = container;
    const scrolledToBottom = scrollHeight - scrollTop - clientHeight < SCROLL_THRESHOLD;

    if (scrolledToBottom) {
      setDisplayLimit(prev => {
        const total = totalRowsRef.current;
        if (prev >= total) return prev;
        return Math.min(prev + LOAD_INCREMENT, total);
      });
    }
  }, []);

  // Attach scroll listener - MUST be before any early returns
  useEffect(() => {
    const container = scrollRef.current;

    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

  // Reset display limit when queryResult changes
  useEffect(() => {
    setDisplayLimit(INITIAL_DISPLAY_LIMIT);
  }, [queryResult]);

  // Show loading indicator
  if (isLoading) {
    return (
      <div
        style={{
          height: '600px',
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

  if (!queryResult) {
    return <p style={{ color: '#888' }}>No data yet. Execute a query to see results.</p>;
  }

  // Extract the cube data from the result
  // Actual structure: { data: { cube: [...rows] } }
  // Each row is: { [cubeName]: { field1: value1, field2: value2, ... } }
  const cubeArray = queryResult?.data?.cube;

  if (!Array.isArray(cubeArray) || cubeArray.length === 0) {
    return <p style={{ color: '#888' }}>No rows returned from query.</p>;
  }

  // Each item in the array has a key (cube name) with the actual data
  // Get the cube name from the first item
  const firstItem = cubeArray[0];
  const cubeName = Object.keys(firstItem)[0];

  // Extract the actual data objects
  const rows = cubeArray.map(item => item[cubeName]);

  // Update ref
  totalRowsRef.current = rows.length;

  if (rows.length === 0) {
    return <p style={{ color: '#888' }}>No data available.</p>;
  }

  // Extract column names from the first row
  const columns = Object.keys(rows[0]);

  // Check if there are more items to load
  const hasMore = displayLimit < rows.length;

  // Get rows to display
  const rowsToDisplay = rows.slice(0, displayLimit);

  return (
    <div
      ref={scrollRef}
      style={{
        height: '600px',
        overflowY: 'auto',
        overflowX: 'auto',
        position: 'relative',
      }}
    >
      <Table striped highlightOnHover withTableBorder withColumnBorders stickyHeader>
        <Table.Thead>
          <Table.Tr>
            {columns.map((col) => (
              <Table.Th key={col}>{col}</Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rowsToDisplay.map((row, idx) => (
            <Table.Tr key={idx}>
              {columns.map((col) => (
                <Table.Td key={col}>
                  {row[col] !== null && row[col] !== undefined
                    ? String(row[col])
                    : '-'}
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
      {!hasMore && rows.length > 50 && (
        <Center py="xs">
          <Text size="xs" c="dimmed">All {rows.length} rows loaded</Text>
        </Center>
      )}
    </div>
  );
}
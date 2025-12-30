import { BaseTable } from './BaseTable';
import { useMemo } from 'react';
import { transformChartData } from '../../../utils/chartDataTransformations';

interface QueryResultsTableProps {
  queryResult: unknown;
  isLoading?: boolean;
}

/**
 * QueryResultsTable Component
 *
 * Displays Cube.js query results in a structured table format.
 * Uses the centralized transformChartData utility to parse Cube responses.
 *
 * Performance optimizations inherited from BaseTable:
 * - Lazy loading: Only renders 50 rows initially
 * - Scroll-based virtualization: Loads more rows as user scrolls
 * - Efficient re-renders only when queryResult changes
 */
export function QueryResultsTable({ queryResult, isLoading = false }: QueryResultsTableProps) {
  // Use centralized transformation utility to parse Cube data
  const parsedData = useMemo(() => {
    const result = transformChartData({
      chartType: 'table',
      cubeData: queryResult,
    });
    return result.data;
  }, [queryResult]);

  return (
    <BaseTable
      parsedData={parsedData}
      queryResult={queryResult}
      isLoading={isLoading}
      height={600}
      minWidth={500}
      striped
      highlightOnHover
      withTableBorder
      withColumnBorders
      stickyHeader
      enableLazyLoading
    />
  );
}

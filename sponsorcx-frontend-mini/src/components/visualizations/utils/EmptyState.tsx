import { useMemo } from 'react';

/**
 * Standardized empty state component for all visualization components.
 * Provides consistent messaging across charts, tables, and KPIs.
 *
 * This component analyzes the data and determines the appropriate message to display.
 * All visualization components must use this component to handle empty states.
 */

interface EmptyStateProps {
  data?: unknown[] | null;
  queryResult?: unknown;
  isLoading?: boolean;
}

/**
 * Container style for empty state display
 * Extracted as a constant to optimize React Fast Refresh performance
 */
const EMPTY_STATE_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  minHeight: '120px',
  color: '#888',
  padding: '2rem',
  textAlign: 'center',
};

/**
 * Universal empty state component for all visualizations.
 * Analyzes the provided data and displays the appropriate message.
 *
 * @param data - The transformed data array from the visualization
 * @param queryResult - The raw query result (optional, used to distinguish no-query vs empty-result)
 * @param isLoading - Whether data is currently loading
 *
 * @example
 * const transformedData = transformChartData({ chartType: 'bar', cubeData: queryResult });
 * if (!transformedData.data || transformedData.data.length === 0) {
 *   return <EmptyState data={transformedData.data} queryResult={queryResult} />;
 * }
 */
export function EmptyState({ data, queryResult, isLoading = false }: EmptyStateProps) {
  const message = useMemo(() => {
    // Loading state takes priority
    if (isLoading) {
      return 'Loading data...';
    }

    // No query has been executed yet
    if (!queryResult) {
      return 'No data yet. Execute a query to see results.';
    }

    // Query executed but returned no results
    if (!data || data.length === 0) {
      return 'Query returned no results';
    }

    // Data exists but can't be visualized
    return 'Unable to display data in this format';
  }, [data, queryResult, isLoading]);

  return (
    <div style={EMPTY_STATE_STYLE}>
      {message}
    </div>
  );
}

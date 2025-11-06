import { useState, useEffect, useCallback } from 'react';
import { notifications } from '@mantine/notifications';
import { executeCubeGraphQL } from '../../../../../services/backendCube';

/**
 * State returned by useGraphData hook
 */
export interface GraphDataState {
  queryResult: any;
  loading: boolean;
  error: string | null;
  isRefreshing: boolean;
  refresh: (showNotification?: boolean) => Promise<void>;
}

/**
 * Manages GraphQL data fetching for graph cards with auto-refresh support
 *
 * **Purpose:** Centralizes data fetching logic, eliminates duplication
 * **Pattern:** useEffect triggers on query/refreshKey change
 *
 * @input query: string - GraphQL query to execute
 * @input refreshKey: number | undefined - Increment to trigger re-fetch
 * @input graphName: string | undefined - Name for notifications
 * @output GraphDataState - { queryResult, loading, error, isRefreshing, refresh }
 *
 * @example
 * // Auto-fetches on mount, re-fetches when refreshKey changes
 * const { queryResult, loading } = useGraphData(query, refreshKey, 'Sales Chart');
 *
 * @example
 * // Manual refresh with notification
 * const { refresh } = useGraphData(query);
 * await refresh(true); // Shows "Graph Refreshed" toast
 */
export function useGraphData(
  query: string,
  refreshKey?: number,
  graphName?: string
): GraphDataState {
  const [queryResult, setQueryResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Core fetch logic - used by both auto-fetch and manual refresh
  const fetchData = useCallback(
    async (showNotification = false) => {
      try {
        setLoading(true);
        setError(null);
        const result = await executeCubeGraphQL(query);
        setQueryResult(result);

        if (showNotification) {
          notifications.show({
            title: 'Graph Refreshed',
            message: `${graphName || 'Graph'} has been updated`,
            color: 'green',
            autoClose: 2000,
          });
        }
      } catch (err) {
        setError('Failed to load graph data');

        if (showNotification) {
          notifications.show({
            title: 'Refresh Failed',
            message: 'Failed to refresh graph data',
            color: 'red',
            autoClose: 3000,
          });
        }
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    },
    [query, graphName]
  );

  // Exposed refresh function for manual triggers (e.g., refresh button)
  const refresh = useCallback(
    async (showNotification = false) => {
      setIsRefreshing(true);
      await fetchData(showNotification);
    },
    [fetchData]
  );

  // Auto-fetch effect: runs on mount + when query or refreshKey changes
  useEffect(() => {
    fetchData(false);
  }, [fetchData, refreshKey]);

  return {
    queryResult,
    loading,
    error,
    isRefreshing,
    refresh,
  };
}

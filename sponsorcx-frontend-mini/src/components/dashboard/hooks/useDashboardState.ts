import { useState, useEffect } from 'react';
import { GridItem } from '../../../types/dashboard';
import {
  getOrCreateDefaultDashboard,
  fetchGridItems,
} from '../../../api';
import { useOrganizationStore } from '../../../store';

/**
 * Hook to manage dashboard state
 */
export function useDashboardState() {
  const [gridItems, setGridItems] = useState<GridItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { organizationId, dashboardId, setDashboardId } = useOrganizationStore();

  // Load graphs on mount and when organization/dashboard changes
  useEffect(() => {
    loadGraphs();
  }, [organizationId, dashboardId]);

  const loadGraphs = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get or create default dashboard if no dashboard ID is set
      let currentDashboardId = dashboardId;
      if (!currentDashboardId) {
        const dashboard = await getOrCreateDefaultDashboard(organizationId);
        currentDashboardId = dashboard.id;
        setDashboardId(currentDashboardId);
      }

      // Fetch all grid items (graphs with grid layouts)
      const items = await fetchGridItems(currentDashboardId);
      setGridItems(items);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      setGridItems([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshDashboard = () => {
    loadGraphs();
  };

  /**
   * Update a graph's position in memory (without reloading from storage)
   */
  const updateGraphPosition = (id: string, column: number, row: number) => {
    setGridItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, gridColumn: column, gridRow: row } : item
      )
    );
  };

  /**
   * Update a graph's size in memory (without reloading from storage)
   */
  const updateGraphSize = (id: string, width: number, height: number) => {
    setGridItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, gridWidth: width, gridHeight: height } : item
      )
    );
  };

  return {
    gridItems,
    loading,
    error,
    refreshDashboard,
    updateGraphPosition,
    updateGraphSize,
  };
}

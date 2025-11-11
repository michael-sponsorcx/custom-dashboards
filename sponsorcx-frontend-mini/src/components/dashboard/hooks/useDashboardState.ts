import { useState, useEffect } from 'react';
import { DashboardItem } from '../../../types/dashboard';
import {
  getOrCreateDefaultDashboard,
  fetchDashboardItems,
} from '../../../services/backendCube';
import { useOrganizationStore } from '../../../store';

/**
 * Hook to manage dashboard state
 */
export function useDashboardState() {
  const [graphs, setGraphs] = useState<DashboardItem[]>([]);
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

      // Fetch all dashboard items (graphs with grid layouts)
      const items = await fetchDashboardItems(currentDashboardId);
      setGraphs(items);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      setGraphs([]);
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
    setGraphs((prev) =>
      prev.map((graph) =>
        graph.id === id ? { ...graph, gridColumn: column, gridRow: row } : graph
      )
    );
  };

  /**
   * Update a graph's size in memory (without reloading from storage)
   */
  const updateGraphSize = (id: string, width: number, height: number) => {
    setGraphs((prev) =>
      prev.map((graph) =>
        graph.id === id ? { ...graph, gridWidth: width, gridHeight: height } : graph
      )
    );
  };

  return {
    graphs,
    loading,
    error,
    refreshDashboard,
    updateGraphPosition,
    updateGraphSize,
  };
}

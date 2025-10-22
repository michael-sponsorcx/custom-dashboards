import { useState, useEffect } from 'react';
import { DashboardItem } from '../../../types/dashboard';
import { getAllDashboardItems } from '../../../utils/storage';

/**
 * Hook to manage dashboard state
 */
export function useDashboardState() {
  const [graphs, setGraphs] = useState<DashboardItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load graphs on mount
  useEffect(() => {
    loadGraphs();
  }, []);

  const loadGraphs = () => {
    setLoading(true);
    const items = getAllDashboardItems();
    setGraphs(items);
    setLoading(false);
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
    refreshDashboard,
    updateGraphPosition,
    updateGraphSize,
  };
}

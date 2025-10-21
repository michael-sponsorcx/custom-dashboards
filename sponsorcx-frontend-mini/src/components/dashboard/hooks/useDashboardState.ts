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

  return {
    graphs,
    loading,
    refreshDashboard,
  };
}

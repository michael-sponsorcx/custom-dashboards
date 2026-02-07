import { useNavigate } from 'react-router-dom';
import {
  deleteGraph,
  fetchGraph,
  updateDashboardGridItem,
  removeGraphFromDashboard,
  fetchDashboardGridItems,
} from '../../../services/backendCube';
import { GridItem } from '../../../types/dashboard';
import { useOrganizationStore } from '../../../store';

interface UseDashboardActionsOptions {
  onRefresh: () => void;
  onUpdatePosition?: (id: string, column: number, row: number) => void;
  onUpdateSize?: (id: string, width: number, height: number) => void;
}

/**
 * Hook to manage dashboard actions (delete, edit, resize, move)
 */
export function useDashboardActions({
  onRefresh,
  onUpdatePosition,
  onUpdateSize,
}: UseDashboardActionsOptions) {
  const navigate = useNavigate();
  const { dashboardId } = useOrganizationStore();

  const handleDeleteGraph = async (graphId: string) => {
    if (
      !window.confirm('Are you sure you want to delete this graph? This action cannot be undone.')
    ) {
      return;
    }

    try {
      if (!dashboardId) {
        throw new Error('No dashboard selected');
      }

      // First, find the grid item ID for this graph
      const gridItems = await fetchDashboardGridItems(dashboardId);
      const gridItem = gridItems.find((item) => item.graphId === graphId);

      if (gridItem) {
        // Remove from dashboard grid first
        await removeGraphFromDashboard(gridItem.id);
      }

      // Then delete the graph itself
      await deleteGraph(graphId);

      // Refresh dashboard to reflect changes
      onRefresh();
    } catch (error) {
      console.error('Failed to delete graph:', error);
      alert('Failed to delete graph. Please try again.');
    }
  };

  const handleEditGraph = async (graphId: string) => {
    try {
      const template = await fetchGraph(graphId);
      if (template) {
        navigate('/configure-graph', { state: { template } });
      }
    } catch (error) {
      console.error('Failed to fetch graph for editing:', error);
      alert('Failed to load graph. Please try again.');
    }
  };

  const handleResizeGraph = async (graphId: string, width: number, height: number) => {
    // Update in memory first for immediate UI feedback
    if (onUpdateSize) {
      onUpdateSize(graphId, width, height);
    }

    // Then persist to backend (no refresh needed)
    try {
      if (!dashboardId) {
        throw new Error('No dashboard selected');
      }

      // Find the grid item ID for this graph
      const gridItems = await fetchDashboardGridItems(dashboardId);
      const gridItem = gridItems.find((item) => item.graphId === graphId);

      if (gridItem) {
        await updateDashboardGridItem(gridItem.id, graphId, {
          gridColumn: gridItem.gridColumn,
          gridRow: gridItem.gridRow,
          gridWidth: width,
          gridHeight: height,
        });
      }
    } catch (error) {
      console.error('Failed to update graph size:', error);
      // Don't show alert for resize failures to avoid annoying the user
    }
  };

  const handleMoveGraph = async (graphId: string, column: number, row: number) => {
    // Update in memory first for immediate UI feedback
    if (onUpdatePosition) {
      onUpdatePosition(graphId, column, row);
    }

    // Then persist to backend (no refresh needed)
    try {
      if (!dashboardId) {
        throw new Error('No dashboard selected');
      }

      // Find the grid item ID for this graph
      const gridItems = await fetchDashboardGridItems(dashboardId);
      const gridItem = gridItems.find((item) => item.graphId === graphId);

      if (gridItem) {
        await updateDashboardGridItem(gridItem.id, graphId, {
          gridColumn: column,
          gridRow: row,
          gridWidth: gridItem.gridWidth,
          gridHeight: gridItem.gridHeight,
        });
      }
    } catch (error) {
      console.error('Failed to update graph position:', error);
      // Don't show alert for move failures to avoid annoying the user
    }
  };

  const handleBatchMoveGraph = async (items: GridItem[]) => {
    // Persist all layout changes to backend
    // React-grid-layout already updated the visual positions
    // No need to call setGraphs - it would cause redundant re-renders
    try {
      if (!dashboardId) {
        throw new Error('No dashboard selected');
      }

      // Get all grid items to map graph IDs to grid item IDs
      const gridItems = await fetchDashboardGridItems(dashboardId);

      // Update each item
      await Promise.all(
        items.map(async (item) => {
          const gridItem = gridItems.find((gi) => gi.graphId === item.id);
          if (gridItem) {
            await updateDashboardGridItem(gridItem.id, item.id, {
              gridColumn: item.gridColumn,
              gridRow: item.gridRow,
              gridWidth: item.gridWidth,
              gridHeight: item.gridHeight,
            });
          }
        })
      );
    } catch (error) {
      console.error('Failed to batch update graph positions:', error);
      // Don't show alert for batch move failures to avoid annoying the user
    }
  };

  const handleCreateGraph = () => {
    navigate('/configure-graph');
  };

  return {
    handleDeleteGraph,
    handleEditGraph,
    handleResizeGraph,
    handleMoveGraph,
    handleBatchMoveGraph,
    handleCreateGraph,
  };
}

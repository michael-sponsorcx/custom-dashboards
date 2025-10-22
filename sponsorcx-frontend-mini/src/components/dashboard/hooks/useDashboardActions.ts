import { useNavigate } from 'react-router-dom';
import { deleteGraphTemplate, getGraphTemplate } from '../../../utils/storage';
import { deleteGridLayout, removeGraphFromDashboard, saveGridLayout, DASHBOARD_ITEMS_KEY } from '../../../utils/storage';
import { DashboardItem } from '../../../types/dashboard';

interface UseDashboardActionsOptions {
  onRefresh: () => void;
  onUpdatePosition?: (id: string, column: number, row: number) => void;
  onUpdateSize?: (id: string, width: number, height: number) => void;
}

/**
 * Hook to manage dashboard actions (delete, edit, resize, move)
 */
export function useDashboardActions({ onRefresh, onUpdatePosition, onUpdateSize }: UseDashboardActionsOptions) {
  const navigate = useNavigate();

  const handleDeleteGraph = (id: string) => {
    if (window.confirm('Are you sure you want to delete this graph? This action cannot be undone.')) {
      deleteGraphTemplate(id);
      deleteGridLayout(id);
      removeGraphFromDashboard(id);
      onRefresh();
    }
  };

  const handleEditGraph = (id: string) => {
    const template = getGraphTemplate(id);
    if (template) {
      navigate('/configure-graph', { state: { template } });
    }
  };

  const handleResizeGraph = (id: string, width: number, height: number) => {
    // Update in memory first for immediate UI feedback
    if (onUpdateSize) {
      onUpdateSize(id, width, height);
    }
    // Then persist to storage (no refresh needed)
    saveGridLayout(id, { gridWidth: width, gridHeight: height });
  };

  const handleMoveGraph = (id: string, column: number, row: number) => {
    const layoutToSave = { gridColumn: column, gridRow: row };

    console.log('----------------------------------------');
    console.log('[SAVE TO LOCALSTORAGE - MOVE]');
    console.log('Item ID:', id);
    console.log('GridLayout being saved:', layoutToSave);

    // Update in memory first for immediate UI feedback
    if (onUpdatePosition) {
      onUpdatePosition(id, column, row);
    }

    // Then persist to storage (no refresh needed)
    saveGridLayout(id, layoutToSave);

    // Log what's in localStorage after save
    const allLayouts = JSON.parse(localStorage.getItem(DASHBOARD_ITEMS_KEY) || '{}');
    console.log('All layouts in localStorage after save:');
    Object.entries(allLayouts).forEach(([itemId, layout]: [string, any]) => {
      console.log(`  ${itemId}:`, {
        gridColumn: layout.gridColumn,
        gridRow: layout.gridRow,
        gridWidth: layout.gridWidth,
        gridHeight: layout.gridHeight,
      });
    });
    console.log('----------------------------------------');
  };

  const handleBatchMoveGraph = (items: DashboardItem[]) => {
    console.log('[RGL] Batch move - saving to localStorage');

    // Just persist to localStorage
    // React-grid-layout already updated the visual positions
    // No need to call setGraphs - it would cause redundant re-renders
    items.forEach(item => {
      const layoutToSave = {
        gridColumn: item.gridColumn,
        gridRow: item.gridRow,
        gridWidth: item.gridWidth,
        gridHeight: item.gridHeight,
      };
      saveGridLayout(item.id, layoutToSave);
    });
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

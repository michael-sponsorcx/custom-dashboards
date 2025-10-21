import { useNavigate } from 'react-router-dom';
import { deleteGraphTemplate, getGraphTemplate } from '../../../utils/storage';
import { deleteGridLayout, removeGraphFromDashboard, saveGridLayout } from '../../../utils/storage';

interface UseDashboardActionsOptions {
  onRefresh: () => void;
}

/**
 * Hook to manage dashboard actions (delete, edit, resize, move)
 */
export function useDashboardActions({ onRefresh }: UseDashboardActionsOptions) {
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
    saveGridLayout(id, { gridWidth: width, gridHeight: height });
    onRefresh();
  };

  const handleMoveGraph = (id: string, column: number, row: number) => {
    saveGridLayout(id, { gridColumn: column, gridRow: row });
    onRefresh();
  };

  const handleCreateGraph = () => {
    navigate('/configure-graph');
  };

  return {
    handleDeleteGraph,
    handleEditGraph,
    handleResizeGraph,
    handleMoveGraph,
    handleCreateGraph,
  };
}

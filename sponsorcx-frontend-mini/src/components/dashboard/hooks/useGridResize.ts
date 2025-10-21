import { useState, useEffect } from 'react';
import { DashboardItem } from '../../../types/dashboard';
import { GRID_COLUMNS, GAP_SIZE } from '../utils/gridCalculations';

interface ResizeState {
  id: string;
  startWidth: number;
  startHeight: number;
  startX: number;
  startY: number;
}

interface UseGridResizeOptions {
  cellSize: number;
  positionedGraphs: DashboardItem[];
  onResize?: (id: string, width: number, height: number) => void;
}

/**
 * Hook to handle grid item resizing
 */
export function useGridResize({
  cellSize,
  positionedGraphs,
  onResize,
}: UseGridResizeOptions) {
  const [resizing, setResizing] = useState<ResizeState | null>(null);

  /**
   * Start resizing a graph
   */
  const handleResizeStart = (e: React.MouseEvent, graph: DashboardItem) => {
    e.preventDefault();
    e.stopPropagation();

    setResizing({
      id: graph.id,
      startWidth: graph.gridWidth || 2,
      startHeight: graph.gridHeight || 2,
      startX: e.clientX,
      startY: e.clientY,
    });
  };

  /**
   * Handle mouse move and mouse up during resize
   */
  useEffect(() => {
    if (!resizing) return;

    let lastMouseEvent: MouseEvent | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      lastMouseEvent = e;
      const deltaX = e.clientX - resizing.startX;
      const deltaY = e.clientY - resizing.startY;

      // Calculate how many cells we've moved
      const cellsX = Math.round(deltaX / (cellSize + GAP_SIZE));
      const cellsY = Math.round(deltaY / (cellSize + GAP_SIZE));

      // Calculate new width and height
      const newWidth = Math.max(1, Math.min(GRID_COLUMNS, resizing.startWidth + cellsX));
      const newHeight = Math.max(1, resizing.startHeight + cellsY);

      // Find the graph and update its size temporarily
      const graph = positionedGraphs.find((g) => g.id === resizing.id);
      if (graph) {
        // Check if new width fits within grid bounds
        const maxWidth = GRID_COLUMNS - (graph.gridColumn || 1) + 1;
        const finalWidth = Math.min(newWidth, maxWidth);

        // Update in DOM (visual feedback)
        const element = document.querySelector(`[data-graph-id="${resizing.id}"]`) as HTMLElement;
        if (element) {
          const cardWidth = finalWidth * cellSize + (finalWidth - 1) * GAP_SIZE;
          const cardHeight = newHeight * cellSize + (newHeight - 1) * GAP_SIZE;
          element.style.width = `${cardWidth}px`;
          element.style.height = `${cardHeight}px`;
        }
      }
    };

    const handleMouseUp = () => {
      if (resizing && onResize && lastMouseEvent) {
        const deltaX = lastMouseEvent.clientX - resizing.startX;
        const deltaY = lastMouseEvent.clientY - resizing.startY;

        const cellsX = Math.round(deltaX / (cellSize + GAP_SIZE));
        const cellsY = Math.round(deltaY / (cellSize + GAP_SIZE));

        const newWidth = Math.max(1, Math.min(GRID_COLUMNS, resizing.startWidth + cellsX));
        const newHeight = Math.max(1, resizing.startHeight + cellsY);

        // Check bounds
        const graph = positionedGraphs.find((g) => g.id === resizing.id);
        if (graph) {
          const maxWidth = GRID_COLUMNS - (graph.gridColumn || 1) + 1;
          const finalWidth = Math.min(newWidth, maxWidth);

          // Only call onResize if size actually changed
          if (finalWidth !== resizing.startWidth || newHeight !== resizing.startHeight) {
            onResize(resizing.id, finalWidth, newHeight);
          }
        }
      }
      setResizing(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizing, cellSize, positionedGraphs, onResize]);

  return {
    handleResizeStart,
    isResizing: !!resizing,
  };
}

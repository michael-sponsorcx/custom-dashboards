import { useState, useEffect } from 'react';
import { DashboardItem } from '../../../types/dashboard';
import { GRID_COLUMNS, GAP_SIZE } from '../utils';

interface DragState {
  id: string;
  startX: number;
  startY: number;
  startColumn: number;
  startRow: number;
  width: number;
  height: number;
  currentColumn: number;
  currentRow: number;
}

interface UseGridDragOptions {
  cellSize: number;
  positionedGraphs: DashboardItem[];
  onMove?: (id: string, column: number, row: number) => void;
}

/**
 * Hook to handle grid item dragging with snap-to-grid positioning
 */
export function useGridDrag({
  cellSize,
  positionedGraphs,
  onMove,
}: UseGridDragOptions) {
  const [dragging, setDragging] = useState<DragState | null>(null);

  /**
   * Check if a position would cause collision with other items
   */
  const wouldCollide = (
    column: number,
    row: number,
    width: number,
    height: number,
    excludeId: string
  ): boolean => {
    // Check if position is within grid bounds
    if (column < 1 || column + width - 1 > GRID_COLUMNS || row < 1) {
      return true;
    }

    // Check collision with other items
    for (const item of positionedGraphs) {
      if (item.id === excludeId) continue;

      const itemCol = item.gridColumn || 1;
      const itemRow = item.gridRow || 1;
      const itemWidth = item.gridWidth || 2;
      const itemHeight = item.gridHeight || 2;

      // Check if rectangles overlap
      const horizontalOverlap =
        column < itemCol + itemWidth && column + width > itemCol;
      const verticalOverlap =
        row < itemRow + itemHeight && row + height > itemRow;

      if (horizontalOverlap && verticalOverlap) {
        return true;
      }
    }

    return false;
  };

  /**
   * Start dragging an item
   */
  const handleDragStart = (e: React.MouseEvent, item: DashboardItem) => {
    e.preventDefault();
    e.stopPropagation();

    const column = item.gridColumn || 1;
    const row = item.gridRow || 1;

    setDragging({
      id: item.id,
      startX: e.clientX,
      startY: e.clientY,
      startColumn: column,
      startRow: row,
      width: item.gridWidth || 2,
      height: item.gridHeight || 2,
      currentColumn: column,
      currentRow: row,
    });
  };

  /**
   * Handle mouse move and mouse up during drag
   */
  useEffect(() => {
    if (!dragging) return;

    let lastMouseEvent: MouseEvent | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      lastMouseEvent = e;
      const deltaX = e.clientX - dragging.startX;
      const deltaY = e.clientY - dragging.startY;

      // Calculate how many cells we've moved
      const cellsX = Math.round(deltaX / (cellSize + GAP_SIZE));
      const cellsY = Math.round(deltaY / (cellSize + GAP_SIZE));

      // Calculate new position
      let newColumn = Math.max(1, dragging.startColumn + cellsX);
      let newRow = Math.max(1, dragging.startRow + cellsY);

      // Clamp to grid bounds
      newColumn = Math.min(newColumn, GRID_COLUMNS - dragging.width + 1);

      // Check for collision
      if (wouldCollide(newColumn, newRow, dragging.width, dragging.height, dragging.id)) {
        // Keep previous valid position if this one would collide
        newColumn = dragging.currentColumn;
        newRow = dragging.currentRow;
      }

      // Update dragging state with new position
      setDragging((prev) =>
        prev
          ? {
              ...prev,
              currentColumn: newColumn,
              currentRow: newRow,
            }
          : null
      );

      // Update DOM for visual feedback
      const element = document.querySelector(`[data-graph-id="${dragging.id}"]`) as HTMLElement;
      if (element) {
        const left = (newColumn - 1) * (cellSize + GAP_SIZE);
        const top = (newRow - 1) * (cellSize + GAP_SIZE);
        element.style.left = `${left}px`;
        element.style.top = `${top}px`;
        element.style.cursor = 'grabbing';
        element.style.opacity = '0.7';
      }
    };

    const handleMouseUp = () => {
      if (dragging && onMove && lastMouseEvent) {
        const { currentColumn, currentRow, startColumn, startRow } = dragging;

        // Only call onMove if position actually changed
        if (currentColumn !== startColumn || currentRow !== startRow) {
          onMove(dragging.id, currentColumn, currentRow);
        }
      }

      // Reset opacity and cursor
      const element = document.querySelector(`[data-graph-id="${dragging.id}"]`) as HTMLElement;
      if (element) {
        element.style.cursor = '';
        element.style.opacity = '1';
      }

      setDragging(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, cellSize, positionedGraphs, onMove]);

  return {
    handleDragStart,
    isDragging: !!dragging,
    dragPreview: dragging
      ? {
          column: dragging.currentColumn,
          row: dragging.currentRow,
          width: dragging.width,
          height: dragging.height,
        }
      : null,
  };
}

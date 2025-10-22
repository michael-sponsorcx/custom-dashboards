import { useState, useEffect, useRef } from 'react';
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
  const [draggingId, setDraggingId] = useState<string | null>(null);
  
  // Store all drag state and latest props in refs
  const dragStateRef = useRef<DragState | null>(null);
  const positionedGraphsRef = useRef(positionedGraphs);
  const cellSizeRef = useRef(cellSize);
  const onMoveRef = useRef(onMove);

  // Keep refs in sync with props
  positionedGraphsRef.current = positionedGraphs;
  cellSizeRef.current = cellSize;
  onMoveRef.current = onMove;

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
    if (column < 1 || column + width - 1 > GRID_COLUMNS || row < 1) {
      return true;
    }

    for (const item of positionedGraphsRef.current) {
      if (item.id === excludeId) continue;

      const itemCol = item.gridColumn || 1;
      const itemRow = item.gridRow || 1;
      const itemWidth = item.gridWidth || 2;
      const itemHeight = item.gridHeight || 2;

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

    console.log('========================================');
    console.log('[DRAG START]');
    console.log('Item ID:', item.id);
    console.log('GridLayout:', {
      gridColumn: column,
      gridRow: row,
      gridWidth: item.gridWidth || 2,
      gridHeight: item.gridHeight || 2,
    });
    console.log('========================================');

    dragStateRef.current = {
      id: item.id,
      startX: e.clientX,
      startY: e.clientY,
      startColumn: column,
      startRow: row,
      width: item.gridWidth || 2,
      height: item.gridHeight || 2,
      currentColumn: column,
      currentRow: row,
    };

    setDraggingId(item.id);
  };

  /**
   * Handle mouse move and mouse up during drag
   */
  useEffect(() => {
    if (!draggingId || !dragStateRef.current) return;

    const state = dragStateRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStateRef.current) return;

      const deltaX = e.clientX - state.startX;
      const deltaY = e.clientY - state.startY;

      const currentCellSize = cellSizeRef.current;

      // Calculate how many cells we've moved
      const cellsX = Math.round(deltaX / (currentCellSize + GAP_SIZE));
      const cellsY = Math.round(deltaY / (currentCellSize + GAP_SIZE));

      // Calculate new position
      let newColumn = Math.max(1, state.startColumn + cellsX);
      let newRow = Math.max(1, state.startRow + cellsY);

      // Clamp to grid bounds
      newColumn = Math.min(newColumn, GRID_COLUMNS - state.width + 1);

      // Check for collision
      if (wouldCollide(newColumn, newRow, state.width, state.height, state.id)) {
        newColumn = dragStateRef.current.currentColumn;
        newRow = dragStateRef.current.currentRow;
      }

      // Update ref
      dragStateRef.current = {
        ...dragStateRef.current,
        currentColumn: newColumn,
        currentRow: newRow,
      };

      // Update DOM for visual feedback
      const element = document.querySelector(`[data-graph-id="${state.id}"]`) as HTMLElement;
      if (element) {
        const left = (newColumn - 1) * (currentCellSize + GAP_SIZE);
        const top = (newRow - 1) * (currentCellSize + GAP_SIZE);
        element.style.left = `${left}px`;
        element.style.top = `${top}px`;
        element.style.cursor = 'grabbing';
        element.style.opacity = '0.7';
      }
    };

    const handleMouseUp = () => {
      if (!dragStateRef.current) return;

      const { id, startColumn, startRow, currentColumn, currentRow, width, height } = dragStateRef.current;
      const currentOnMove = onMoveRef.current;

      console.log('========================================');
      console.log('[DRAG END]');
      console.log('Item ID:', id);
      console.log('Final GridLayout:', {
        gridColumn: currentColumn,
        gridRow: currentRow,
        gridWidth: width,
        gridHeight: height,
      });
      console.log('Position changed:', currentColumn !== startColumn || currentRow !== startRow);
      console.log('========================================');

      // Only call onMove if position actually changed
      if (currentOnMove && (currentColumn !== startColumn || currentRow !== startRow)) {
        currentOnMove(id, currentColumn, currentRow);
      }

      // Reset inline styles
      const element = document.querySelector(`[data-graph-id="${id}"]`) as HTMLElement;
      if (element) {
        element.style.cursor = '';
        element.style.opacity = '1';
      }

      dragStateRef.current = null;
      setDraggingId(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);

      // Cleanup inline styles if unmounting during drag
      if (dragStateRef.current) {
        const element = document.querySelector(`[data-graph-id="${dragStateRef.current.id}"]`) as HTMLElement;
        if (element) {
          element.style.cursor = '';
          element.style.opacity = '1';
        }
      }
    };
  }, [draggingId]);

  return {
    handleDragStart,
    isDragging: !!draggingId,
    dragPreview: dragStateRef.current
      ? {
          column: dragStateRef.current.currentColumn,
          row: dragStateRef.current.currentRow,
          width: dragStateRef.current.width,
          height: dragStateRef.current.height,
        }
      : null,
  };
}

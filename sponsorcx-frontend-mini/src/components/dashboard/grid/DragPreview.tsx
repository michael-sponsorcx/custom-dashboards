import { calculateItemPosition, calculateItemSize } from '../utils';

interface DragPreviewProps {
  column: number;
  row: number;
  width: number;
  height: number;
  cellSize: number;
  isVisible: boolean;
}

/**
 * DragPreview - Shows where a dragged item will snap to
 *
 * Displays a dotted outline showing the target position
 * for the item being dragged
 */
export function DragPreview({
  column,
  row,
  width,
  height,
  cellSize,
  isVisible,
}: DragPreviewProps) {
  if (!isVisible || cellSize === 0) return null;

  // Calculate position and size
  const { left, top } = calculateItemPosition(column, row, cellSize);
  const { width: previewWidth, height: previewHeight } = calculateItemSize(
    width,
    height,
    cellSize
  );

  return (
    <div
      style={{
        position: 'absolute',
        left: `${left}px`,
        top: `${top}px`,
        width: `${previewWidth}px`,
        height: `${previewHeight}px`,
        border: '3px dashed rgba(34, 139, 230, 0.6)',
        borderRadius: '8px',
        backgroundColor: 'rgba(34, 139, 230, 0.1)',
        pointerEvents: 'none',
        zIndex: 5, // Between grid overlay and items
        transition: 'all 0.1s ease-out',
      }}
    />
  );
}

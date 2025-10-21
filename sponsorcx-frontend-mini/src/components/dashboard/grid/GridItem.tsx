import { useState } from 'react';
import { DashboardItem } from '../../../types/dashboard';
import { GraphCard } from './GraphCard';
import { ResizeHandle } from './ResizeHandle';
import { calculateItemPosition, calculateItemSize } from '../utils';

interface GridItemProps {
  item: DashboardItem;
  cellSize: number;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onResizeStart: (e: React.MouseEvent, item: DashboardItem) => void;
  onDragStart: (e: React.MouseEvent, item: DashboardItem) => void;
}

/**
 * GridItem - A positioned item in the dashboard grid
 *
 * Handles positioning and rendering of a single graph card with drag and resize handles
 */
export function GridItem({
  item,
  cellSize,
  onDelete,
  onEdit,
  onResizeStart,
  onDragStart,
}: GridItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const column = item.gridColumn || 1;
  const row = item.gridRow || 1;
  const width = item.gridWidth || 2;
  const height = item.gridHeight || 2;

  // Calculate position and size
  const { left, top } = calculateItemPosition(column, row, cellSize);
  const { width: cardWidth, height: cardHeight } = calculateItemSize(width, height, cellSize);

  return (
    <div
      data-graph-id={item.id}
      style={{
        position: 'absolute',
        left: `${left}px`,
        top: `${top}px`,
        width: `${cardWidth}px`,
        height: `${cardHeight}px`,
        zIndex: 10, // Above grid overlay
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <GraphCard template={item} onDelete={onDelete} onEdit={onEdit} onDragStart={onDragStart} isHovered={isHovered}/>

      {/* Resize Handle - Bottom Right */}
      <ResizeHandle onMouseDown={(e) => onResizeStart(e, item)} />
    </div>
  );
}

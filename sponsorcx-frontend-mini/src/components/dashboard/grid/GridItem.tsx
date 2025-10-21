import { DashboardItem } from '../../../types/dashboard';
import { GraphCard } from '../grid/GraphCard';
import { calculateItemPosition, calculateItemSize } from '../utils/gridCalculations';

interface GridItemProps {
  item: DashboardItem;
  cellSize: number;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onResizeStart: (e: React.MouseEvent, item: DashboardItem) => void;
}

/**
 * GridItem - A positioned item in the dashboard grid
 *
 * Handles positioning and rendering of a single graph card with resize handle
 */
export function GridItem({
  item,
  cellSize,
  onDelete,
  onEdit,
  onResizeStart,
}: GridItemProps) {
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
    >
      <GraphCard template={item} onDelete={onDelete} onEdit={onEdit} />

      {/* Resize Handle */}
      <div
        onMouseDown={(e) => onResizeStart(e, item)}
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '20px',
          height: '20px',
          cursor: 'nwse-resize',
          background: 'linear-gradient(135deg, transparent 50%, #228be6 50%)',
          borderBottomRightRadius: '4px',
          zIndex: 10,
        }}
        title="Drag to resize"
      />
    </div>
  );
}

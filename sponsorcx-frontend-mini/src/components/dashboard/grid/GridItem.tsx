import { useState } from 'react';
import { Tooltip, ActionIcon } from '@mantine/core';
import { IconGripVertical } from '@tabler/icons-react';
import { DashboardItem } from '../../../types/dashboard';
import { GraphCard } from './GraphCard';
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
      <GraphCard template={item} onDelete={onDelete} onEdit={onEdit} />

      {/* Drag Handle - Top Left */}
      <Tooltip label="Drag to move" position="right" withArrow>
        <ActionIcon
          variant="subtle"
          size="sm"
          onMouseDown={(e) => {
            e.stopPropagation();
            onDragStart(e, item);
          }}
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            cursor: 'grab',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.2s',
            zIndex: 15,
          }}
        >
          <IconGripVertical size={16} />
        </ActionIcon>
      </Tooltip>

      {/* Resize Handle - Bottom Right */}
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

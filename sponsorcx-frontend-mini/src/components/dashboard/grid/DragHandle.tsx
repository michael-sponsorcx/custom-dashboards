import { Tooltip, ActionIcon } from '@mantine/core';
import { IconGripVertical } from '@tabler/icons-react';

interface DragHandleProps {
  onMouseDown: (e: React.MouseEvent) => void;
  isVisible: boolean;
}

/**
 * DragHandle - A draggable handle for moving grid items
 *
 * Displays a grip icon next to the title that users can drag to reposition items
 */
export function DragHandle({ onMouseDown, isVisible }: DragHandleProps) {
  return (
    <Tooltip label="Drag to move" position="top" withArrow>
      <ActionIcon
        variant="subtle"
        size="lg"
        onMouseDown={(e) => {
          e.stopPropagation();
          onMouseDown(e);
        }}
        style={{
          cursor: 'grab',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.2s',
        }}
      >
        <IconGripVertical size={24} />
      </ActionIcon>
    </Tooltip>
  );
}

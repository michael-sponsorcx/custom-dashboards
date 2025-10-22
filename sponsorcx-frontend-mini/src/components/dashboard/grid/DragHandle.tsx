import { Tooltip, ActionIcon } from '@mantine/core';
import { IconGripVertical } from '@tabler/icons-react';

/**
 * DragHandle - A draggable handle for moving grid items
 *
 * Displays a grip icon next to the title that users can drag to reposition items.
 * React-grid-layout automatically handles dragging via the 'drag-handle' className.
 */
export function DragHandle() {
  return (
    <Tooltip label="Drag to move" position="top" withArrow>
      <ActionIcon
        className="drag-handle" // React-grid-layout uses this to identify the drag handle
        variant="subtle"
        size="lg"
        style={{
          cursor: 'grab',
        }}
      >
        <IconGripVertical size={24} />
      </ActionIcon>
    </Tooltip>
  );
}

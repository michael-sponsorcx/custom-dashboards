interface ResizeHandleProps {
  onMouseDown: (e: React.MouseEvent) => void;
}

/**
 * ResizeHandle - A draggable handle for resizing grid items
 *
 * Displays a triangular handle in the bottom-right corner that users can drag to resize items
 */
export function ResizeHandle({ onMouseDown }: ResizeHandleProps) {
  return (
    <div
      onMouseDown={onMouseDown}
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
  );
}

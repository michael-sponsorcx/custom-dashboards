import { GRID_COLUMNS, GAP_SIZE } from '../utils/gridCalculations';

interface GridOverlayProps {
  cellSize: number;
  gridHeight: number;
  isVisible: boolean;
}

/**
 * GridOverlay - Shows the grid structure during resize operations
 *
 * Displays a light grayish-blue overlay of all grid cells to help
 * users visualize the grid structure while resizing items
 */
export function GridOverlay({ cellSize, gridHeight, isVisible }: GridOverlayProps) {
  if (!isVisible || cellSize === 0) return null;

  // Calculate number of rows based on grid height, plus 1 extra row below
  const numRows = Math.ceil(gridHeight / (cellSize + GAP_SIZE)) + 1;

  // Generate grid cells
  const cells: JSX.Element[] = [];
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < GRID_COLUMNS; col++) {
      const left = col * (cellSize + GAP_SIZE);
      const top = row * (cellSize + GAP_SIZE);

      cells.push(
        <div
          key={`${row}-${col}`}
          style={{
            position: 'absolute',
            left: `${left}px`,
            top: `${top}px`,
            width: `${cellSize}px`,
            height: `${cellSize}px`,
            backgroundColor: 'rgba(34, 139, 230, 0.08)', // Light grayish-blue
            border: '1px solid rgba(34, 139, 230, 0.15)',
            borderRadius: '4px',
            pointerEvents: 'none',
            transition: 'opacity 0.2s ease',
          }}
        />
      );
    }
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 0, // Behind graphs
      }}
    >
      {cells}
    </div>
  );
}

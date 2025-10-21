import { DashboardItem } from '../../../types/dashboard';

export const GRID_COLUMNS = 6;
export const GAP_SIZE = 16; // pixels between grid items

/**
 * Calculate the size of each grid cell based on container width
 */
export function calculateCellSize(containerWidth: number): number {
  const totalGaps = GAP_SIZE * (GRID_COLUMNS - 1);
  const availableWidth = containerWidth - totalGaps;
  return availableWidth / GRID_COLUMNS;
}

/**
 * Calculate position (left, top) for a grid item
 */
export function calculateItemPosition(
  column: number,
  row: number,
  cellSize: number
): { left: number; top: number } {
  return {
    left: (column - 1) * (cellSize + GAP_SIZE),
    top: (row - 1) * (cellSize + GAP_SIZE),
  };
}

/**
 * Calculate dimensions (width, height) for a grid item
 */
export function calculateItemSize(
  width: number,
  height: number,
  cellSize: number
): { width: number; height: number } {
  return {
    width: width * cellSize + (width - 1) * GAP_SIZE,
    height: height * cellSize + (height - 1) * GAP_SIZE,
  };
}

/**
 * Calculate total grid height based on positioned items
 */
export function calculateGridHeight(
  items: DashboardItem[],
  cellSize: number
): number {
  if (cellSize === 0 || items.length === 0) return 0;

  const maxRow = Math.max(
    ...items.map((item) => (item.gridRow || 1) + (item.gridHeight || 1) - 1)
  );

  return maxRow * cellSize + (maxRow - 1) * GAP_SIZE;
}

/**
 * Check if a cell is occupied in the grid
 */
function isCellOccupied(
  row: number,
  col: number,
  occupiedCells: Map<string, boolean>
): boolean {
  return occupiedCells.get(`${row},${col}`) || false;
}

/**
 * Mark cells as occupied in the grid
 */
function markCellsOccupied(
  row: number,
  col: number,
  width: number,
  height: number,
  occupiedCells: Map<string, boolean>
): void {
  for (let r = row; r < row + height; r++) {
    for (let c = col; c < col + width; c++) {
      occupiedCells.set(`${r},${c}`, true);
    }
  }
}

/**
 * Find the next available position for an item using greedy algorithm
 */
function findNextAvailablePosition(
  width: number,
  height: number,
  occupiedCells: Map<string, boolean>
): { row: number; col: number } {
  // Start from row 0, scan left to right, top to bottom
  for (let row = 0; row < 1000; row++) {
    // Safety limit
    for (let col = 0; col <= GRID_COLUMNS - width; col++) {
      // Check if this position fits
      let fits = true;
      checkFit: for (let r = row; r < row + height; r++) {
        for (let c = col; c < col + width; c++) {
          if (isCellOccupied(r, c, occupiedCells)) {
            fits = false;
            break checkFit;
          }
        }
      }

      if (fits) {
        return { row, col };
      }
    }
  }
  return { row: 0, col: 0 }; // Fallback
}

/**
 * Auto-layout graphs using efficient grid packing algorithm
 * Returns items with calculated positions
 */
export function autoLayoutItems(items: DashboardItem[]): DashboardItem[] {
  const result: DashboardItem[] = [];
  const occupiedCells = new Map<string, boolean>();

  items.forEach((item) => {
    const width = Math.min(item.gridWidth || 2, GRID_COLUMNS); // Default: 2 columns, max 6
    const height = item.gridHeight || 2; // Default: 2 rows

    let column: number;
    let row: number;

    // Use existing position if specified and valid
    if (
      item.gridColumn !== undefined &&
      item.gridRow !== undefined &&
      item.gridColumn >= 1 &&
      item.gridColumn + width - 1 <= GRID_COLUMNS
    ) {
      column = item.gridColumn - 1; // Convert to 0-based
      row = item.gridRow - 1; // Convert to 0-based
    } else {
      // Auto-place using greedy algorithm
      const pos = findNextAvailablePosition(width, height, occupiedCells);
      row = pos.row;
      column = pos.col;
    }

    // Mark cells as occupied
    markCellsOccupied(row, column, width, height, occupiedCells);

    result.push({
      ...item,
      gridColumn: column + 1, // Convert back to 1-based for display
      gridRow: row + 1,
      gridWidth: width,
      gridHeight: height,
    });
  });

  return result;
}

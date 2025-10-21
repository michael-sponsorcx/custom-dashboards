import { useEffect, useRef, useState, useMemo } from 'react';
import { DashboardItem } from '../../types/dashboard';
import { GridItem } from './GridItem';
import { GridOverlay } from './GridOverlay';
import { calculateCellSize, calculateGridHeight, autoLayoutItems } from './utils/gridCalculations';
import { useGridResize } from './hooks/useGridResize';

interface DashboardGridProps {
  graphs: DashboardItem[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onResize?: (id: string, width: number, height: number) => void;
}

/**
 * DashboardGrid - A responsive 6-column grid with perfect squares
 *
 * Features:
 * - Always 6 columns wide
 * - Square cells that maintain aspect ratio
 * - Graphs can span multiple columns and rows
 * - Responsive to viewport changes
 * - Auto-layout with collision detection
 */
export function DashboardGrid({ graphs, onDelete, onEdit, onResize }: DashboardGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(0);

  // Calculate cell size on mount and window resize
  useEffect(() => {
    const updateCellSize = () => {
      if (!gridRef.current) return;
      const size = calculateCellSize(gridRef.current.offsetWidth);
      setCellSize(size);
    };

    updateCellSize();
    window.addEventListener('resize', updateCellSize);
    return () => window.removeEventListener('resize', updateCellSize);
  }, []);

  // Auto-layout graphs using efficient grid packing
  const positionedGraphs = useMemo(() => autoLayoutItems(graphs), [graphs]);

  // Calculate total grid height
  const gridHeight = useMemo(
    () => calculateGridHeight(positionedGraphs, cellSize),
    [positionedGraphs, cellSize]
  );

  // Handle resize logic
  const { handleResizeStart, isResizing } = useGridResize({
    cellSize,
    positionedGraphs,
    onResize,
  });

  return (
    <div
      ref={gridRef}
      style={{
        position: 'relative',
        width: '100%',
        height: gridHeight > 0 ? `${gridHeight}px` : 'auto',
        minHeight: cellSize > 0 ? `${cellSize}px` : 'auto',
      }}
    >
      {/* Grid overlay - shows during resize */}
      <GridOverlay cellSize={cellSize} gridHeight={gridHeight} isVisible={isResizing} />

      {/* Grid items */}
      {cellSize > 0 &&
        positionedGraphs.map((graph) => (
          <GridItem
            key={graph.id}
            item={graph}
            cellSize={cellSize}
            onDelete={onDelete}
            onEdit={onEdit}
            onResizeStart={handleResizeStart}
          />
        ))}
    </div>
  );
}

import { useMemo } from 'react';
import RGL, { Layout, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { DashboardItem } from '../../../types/dashboard';
import { GraphCard } from './GraphCard';

// @ts-ignore - WidthProvider type issue
const GridLayout = WidthProvider(RGL);

interface DashboardGridProps {
  graphs: DashboardItem[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onResize?: (id: string, width: number, height: number) => void;
  onMove?: (id: string, column: number, row: number) => void;
  onBatchMove?: (items: DashboardItem[]) => void;
}

/**
 * DashboardGrid using react-grid-layout
 *
 * Features:
 * - Drag and drop with live collision resolution
 * - Resizable items
 * - Automatic compaction
 * - 6-column responsive grid
 */
export function DashboardGrid({
  graphs,
  onDelete,
  onEdit,
  onResize,
  onBatchMove,
}: DashboardGridProps) {
  // Convert DashboardItem[] to react-grid-layout Layout[]
  const layout: Layout[] = useMemo(() => {
    return graphs.map((graph: DashboardItem) => ({
      i: graph.id, // Unique identifier
      x: (graph.gridColumn || 1) - 1, // RGL uses 0-based columns
      y: (graph.gridRow || 1) - 1, // RGL uses 0-based rows
      w: graph.gridWidth || 2, // Width in columns
      h: graph.gridHeight || 2, // Height in rows
      minW: 1, // Minimum width
      minH: 1, // Minimum height
    }));
  }, [graphs]);

  // Handle layout changes (drag/resize) - called on drag stop
  const handleDragStop = (newLayout: Layout[]) => {
    if (!onBatchMove) return;

    // Convert Layout[] back to DashboardItem[]
    const updatedItems = graphs.map((graph: DashboardItem) => {
      const layoutItem = newLayout.find(l => l.i === graph.id);
      if (!layoutItem) return graph;

      return {
        ...graph,
        gridColumn: layoutItem.x + 1, // Convert back to 1-based
        gridRow: layoutItem.y + 1,
        gridWidth: layoutItem.w,
        gridHeight: layoutItem.h,
      };
    });

    // Only save to localStorage, don't update state
    // React-grid-layout already updated the visual positions
    onBatchMove(updatedItems);
  };

  // Handle resize stop
  const handleResizeStop = (layout: Layout[], oldItem: Layout, newItem: Layout) => {
    if (onResize) {
      onResize(newItem.i, newItem.w, newItem.h);
    }
  };

  return (
    // @ts-ignore - WidthProvider wrapped component
    <GridLayout
      className="layout"
      layout={layout}
      cols={6}
      rowHeight={150}
      margin={[16, 16]}
      containerPadding={[0, 0]}
      compactType="vertical"
      preventCollision={false}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      draggableHandle=".drag-handle"
      isDraggable={true}
      isResizable={true}
      useCSSTransforms={true}
    >
      {graphs.map((graph: DashboardItem) => (
        <div key={graph.id}>
          <GraphCard
            template={graph}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        </div>
      ))}
    </GridLayout>
  );
}

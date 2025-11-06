import { BarSelectionView } from './BarSelectionView';
import { DrillDownDimensionSelection } from './DrillDownDimensionSelection';
import type { ClickedBarState } from './useDrillDown';

/**
 * DrillDownPanel - Main panel component that manages drill-down UI state
 *
 * This component displays below the chart when a bar is clicked.
 * It switches between two views:
 * 1. BarSelectionView - Shows selected bar info and "Drill Down" button
 * 2. DrillDownDimensionSelection - Shows list of dimensions to drill into
 *
 * @example
 * // Input: User clicks on a bar
 * // Output: Panel showing "Bar Selected: Q1 2024" with drill-down options
 * <DrillDownPanel
 *   clickedBar={{ data: { quarter: 'Q1', value: 1000 }, position: { x: 100, y: 200 } }}
 *   dimensionField="quarter"
 *   drillDownDimensions={['Product', 'Region']}
 *   canDrillDown={true}
 *   showDrillDown={false}
 *   onDrillDownClick={() => setShowDrillDown(true)}
 *   onDimensionSelect={(dim) => handleDrillDown(dim, clickedBar.data)}
 *   onBack={() => setShowDrillDown(false)}
 *   onClose={() => setClickedBar(null)}
 * />
 */

interface DrillDownPanelProps {
  /** The currently clicked bar state */
  clickedBar: ClickedBarState;
  /** The dimension field name used for the X-axis label */
  dimensionField: string;
  /** Available dimensions for drill-down */
  drillDownDimensions: string[];
  /** Whether drill-down is available */
  canDrillDown: boolean;
  /** Whether to show the dimension selection view */
  showDrillDown: boolean;
  /** Callback when user clicks "Drill Down" button */
  onDrillDownClick: () => void;
  /** Callback when user selects a dimension */
  onDimensionSelect: (dimension: string) => void;
  /** Callback when user clicks "Back" in dimension selection */
  onBack: () => void;
  /** Callback when user closes the panel */
  onClose: () => void;
}

export function DrillDownPanel({
  clickedBar,
  dimensionField,
  drillDownDimensions,
  canDrillDown,
  showDrillDown,
  onDrillDownClick,
  onDimensionSelect,
  onBack,
  onClose,
}: DrillDownPanelProps) {
  return (
    <div
      style={{
        padding: '10px',
        borderTop: '1px solid #e0e0e0',
        backgroundColor: '#f9f9f9',
        maxHeight: '200px',
        overflowY: 'auto',
      }}
    >
      {!showDrillDown ? (
        <BarSelectionView
          selectedLabel={String(clickedBar.data[dimensionField])}
          canDrillDown={canDrillDown}
          onDrillDownClick={onDrillDownClick}
          onClose={onClose}
        />
      ) : (
        <DrillDownDimensionSelection
          dimensions={drillDownDimensions}
          onDimensionSelect={onDimensionSelect}
          onBack={onBack}
        />
      )}
    </div>
  );
}

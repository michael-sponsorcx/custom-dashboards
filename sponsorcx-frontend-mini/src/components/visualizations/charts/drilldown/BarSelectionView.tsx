/**
 * BarSelectionView - Displays information about a selected bar and drill-down options
 *
 * This component is shown when a user clicks on a bar in the chart.
 * It displays the selected bar's label and provides options to:
 * - Drill down into other dimensions
 * - Close the selection panel
 *
 * @example
 * // Input: selectedLabel: "Q1 2024", canDrillDown: true
 * // Output: Panel showing "Bar Selected: Q1 2024" with "Drill Down" button
 * <BarSelectionView
 *   selectedLabel="Q1 2024"
 *   canDrillDown={true}
 *   onDrillDownClick={() => setShowDimensionSelection(true)}
 *   onClose={() => setSelectedBar(null)}
 * />
 */

interface BarSelectionViewProps {
  /** The label/value of the selected bar */
  selectedLabel: string;
  /** Whether drill-down is available */
  canDrillDown: boolean;
  /** Callback when user clicks the "Drill Down" button */
  onDrillDownClick: () => void;
  /** Callback when user clicks the "Close" button */
  onClose: () => void;
}

export function BarSelectionView({
  selectedLabel,
  canDrillDown,
  onDrillDownClick,
  onClose,
}: BarSelectionViewProps) {
  return (
    <div>
      <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
        Bar Selected: {selectedLabel}
      </div>
      {canDrillDown ? (
        <button
          onClick={onDrillDownClick}
          style={{
            padding: '8px 16px',
            backgroundColor: '#228be6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Drill Down
        </button>
      ) : (
        <div style={{ color: '#888' }}>No dimensions available for drill down</div>
      )}
      <button
        onClick={onClose}
        style={{
          marginLeft: '8px',
          padding: '8px 16px',
          backgroundColor: '#adb5bd',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Close
      </button>
    </div>
  );
}

/**
 * DrillDownDimensionSelection - Displays a list of dimensions available for drill-down
 *
 * This component is shown after the user clicks "Drill Down" in the BarSelectionView.
 * It presents a list of available dimensions that the user can select to drill into.
 *
 * @example
 * // Input: dimensions: ['Product', 'Region', 'Channel']
 * // Output: List of clickable buttons for each dimension with a Back button
 * <DrillDownDimensionSelection
 *   dimensions={['Product', 'Region', 'Channel']}
 *   onDimensionSelect={(dim) => handleDrillDown(dim)}
 *   onBack={() => setShowDimensionSelection(false)}
 * />
 */

interface DrillDownDimensionSelectionProps {
  /** Array of dimension names available for drill-down */
  dimensions: string[];
  /** Callback when user selects a dimension */
  onDimensionSelect: (dimension: string) => void;
  /** Callback when user clicks the "Back" button */
  onBack: () => void;
}

export function DrillDownDimensionSelection({
  dimensions,
  onDimensionSelect,
  onBack,
}: DrillDownDimensionSelectionProps) {
  return (
    <div>
      <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
        Select Dimension to Drill Down:
      </div>
      {dimensions.map((dimension) => (
        <button
          key={dimension}
          onClick={() => onDimensionSelect(dimension)}
          style={{
            display: 'block',
            width: '100%',
            padding: '8px',
            marginBottom: '4px',
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          {dimension}
        </button>
      ))}
      <button
        onClick={onBack}
        style={{
          marginTop: '8px',
          padding: '8px 16px',
          backgroundColor: '#adb5bd',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Back
      </button>
    </div>
  );
}

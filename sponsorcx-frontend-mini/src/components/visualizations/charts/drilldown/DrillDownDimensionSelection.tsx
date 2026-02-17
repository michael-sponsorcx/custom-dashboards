import { Stack, Text, Button } from '@mantine/core';

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

export const DrillDownDimensionSelection = ({
  dimensions,
  onDimensionSelect,
  onBack,
}: DrillDownDimensionSelectionProps) => {
  return (
    <Stack gap="xs">
      <Text fw={700}>Select Dimension to Drill Down:</Text>
      {dimensions.map((dimension) => (
        <Button
          key={dimension}
          variant="outline"
          color="gray"
          fullWidth
          justify="flex-start"
          size="xs"
          onClick={() => onDimensionSelect(dimension)}
        >
          {dimension}
        </Button>
      ))}
      <Button size="xs" variant="outline" color="gray" onClick={onBack}>
        Back
      </Button>
    </Stack>
  );
};

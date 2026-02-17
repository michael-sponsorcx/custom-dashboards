import { Group, Text, Button } from '@mantine/core';

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

export const BarSelectionView = ({
  selectedLabel,
  canDrillDown,
  onDrillDownClick,
  onClose,
}: BarSelectionViewProps) => {
  return (
    <div>
      <Text fw={700} mb="xs">
        Bar Selected: {selectedLabel}
      </Text>
      <Group gap="xs">
        {canDrillDown ? (
          <Button size="xs" onClick={onDrillDownClick}>
            Drill Down
          </Button>
        ) : (
          <Text size="sm" c="dimmed">
            No dimensions available for drill down
          </Text>
        )}
        <Button size="xs" variant="outline" color="gray" onClick={onClose}>
          Close
        </Button>
      </Group>
    </div>
  );
};

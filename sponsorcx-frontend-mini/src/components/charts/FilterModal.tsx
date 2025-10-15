import { Modal, Button, Stack, Title } from '@mantine/core';

export interface FilterConfig {
  // Filter configuration will be defined later
  // Placeholder for now
  enabled: boolean;
}

interface FilterModalProps {
  /** Whether the modal is open */
  opened: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** Current filter configuration */
  filterConfig: FilterConfig;
  /** Callback when filter is applied */
  onApplyFilter: (config: FilterConfig) => void;
}

/**
 * FilterModal Component
 *
 * Modal dialog for configuring chart data filters.
 * Allows users to set up filtering rules that will be applied to chart data.
 */
export function FilterModal({
  opened,
  onClose,
  filterConfig,
  onApplyFilter,
}: FilterModalProps) {
  const handleApply = () => {
    // Apply the current filter configuration
    onApplyFilter(filterConfig);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Title order={4}>Filter Chart Data</Title>}
      size="lg"
      centered
    >
      <Stack gap="md">
        {/* Filter configuration UI will go here */}
        <div style={{ padding: '2rem', textAlign: 'center', color: '#868e96' }}>
          Filter configuration UI will be added here
        </div>

        {/* Action Buttons */}
        <Stack gap="sm">
          <Button onClick={handleApply} fullWidth>
            Apply Filter
          </Button>
          <Button onClick={onClose} variant="outline" fullWidth>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}

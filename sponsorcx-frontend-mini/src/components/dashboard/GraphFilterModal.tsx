import { Modal, Stack, Title, Text, Button } from '@mantine/core';

interface GraphFilterModalProps {
  opened: boolean;
  onClose: () => void;
  graphId: string | null;
  graphName: string;
}

/**
 * GraphFilterModal Component
 *
 * Modal for filtering individual graph data on the dashboard.
 * Currently a placeholder - will be implemented with actual filter logic.
 */
export function GraphFilterModal({ opened, onClose, graphId, graphName }: GraphFilterModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Title order={3}>Filter: {graphName}</Title>}
      size="lg"
      centered
    >
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Graph ID: {graphId}
        </Text>

        <Text>
          Filter configuration UI will be implemented here.
        </Text>

        <Text size="sm" c="dimmed">
          This will allow you to:
        </Text>
        <ul>
          <li>Apply filters to dimensions</li>
          <li>Set measure thresholds</li>
          <li>Filter by date ranges</li>
          <li>Save filter configurations</li>
        </ul>

        <Button onClick={onClose} fullWidth>
          Close
        </Button>
      </Stack>
    </Modal>
  );
}

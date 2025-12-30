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
 * Modal for configuring permanent graph-level filters (GraphTemplate.filters).
 * These filters are saved with the graph configuration and always applied to this specific graph.
 *
 * **Filter Architecture Context:**
 * - Graph-level filters (this modal): Permanent filters stored in GraphTemplate.filters
 * - Dashboard-level filters: Temporary filters that apply to ALL graphs
 * - Drill-down filters: Ephemeral filters from clicking chart elements
 *
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
          Configure permanent filters that will always be applied to this specific graph.
        </Text>

        <Text size="sm" c="dimmed">
          This modal will allow you to:
        </Text>
        <ul>
          <li>Apply permanent filters to dimensions (stored in GraphTemplate.filters)</li>
          <li>Set measure thresholds that are always enforced</li>
          <li>Filter by date ranges specific to this graph</li>
          <li>Save filter configurations with the graph template</li>
        </ul>

        <Text size="sm" c="dimmed" mt="md">
          Note: These are different from dashboard-level filters (which apply to ALL graphs)
          and drill-down filters (which are temporary per-session).
        </Text>

        <Button onClick={onClose} fullWidth>
          Close
        </Button>
      </Stack>
    </Modal>
  );
}

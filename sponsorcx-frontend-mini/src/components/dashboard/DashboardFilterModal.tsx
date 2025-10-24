import { Modal, Stack, Title, Text, Button } from '@mantine/core';

interface DashboardFilterModalProps {
  opened: boolean;
  onClose: () => void;
}

/**
 * DashboardFilterModal Component
 *
 * Modal for applying filters across all graphs on the dashboard.
 * This modal will contain filter controls that affect every graph.
 */
export function DashboardFilterModal({ opened, onClose }: DashboardFilterModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Title order={3}>Dashboard Filters</Title>}
      size="lg"
      centered
    >
      <Stack gap="md">
        <Text>
          Dashboard-wide filter configuration UI will be implemented here.
        </Text>

        <Text size="sm" c="dimmed">
          These filters will apply to all graphs on the dashboard.
        </Text>

        <Button onClick={onClose} fullWidth>
          Close
        </Button>
      </Stack>
    </Modal>
  );
}

import { Modal, Stack, Title, Text, Button, Divider, Group, Box } from '@mantine/core';

interface KPIAlertModalProps {
  opened: boolean;
  onClose: () => void;
  graphId: string | null;
  graphName: string;
}

/**
 * KPIAlertModal Component
 *
 * Modal for creating and managing KPI alerts for a specific graph.
 * KPI alerts can notify users when certain thresholds or conditions are met.
 *
 * Structure:
 * - Header: "Create KPI Alert" (subtitle) + "Select an alert type" (main title)
 * - Body: Alert configuration content
 * - Footer: Cancel and Next buttons
 */
export function KPIAlertModal({ opened, onClose, graphId, graphName }: KPIAlertModalProps) {
  const handleCancel = () => {
    onClose();
  };

  const handleNext = () => {
    // TODO: Implement next step logic
    console.log('Next clicked');
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="lg"
      centered
      withCloseButton={true}
      title={
        <Stack gap="xs">
          <Text size="sm" c="dimmed" fw={500}>
            Create KPI Alert
          </Text>
          <Title order={2}>Select an alert type</Title>
        </Stack>
      }
    >
      <Divider mb="lg" />

      {/* Body Section */}
      <Box mb="xl">
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Graph: {graphName}
          </Text>

          <Text size="sm" c="dimmed">
            Graph ID: {graphId}
          </Text>

          <Text>
            Configure KPI alerts to get notified when specific conditions are met on this graph.
          </Text>

          <Text size="sm" c="dimmed">
            This modal will allow you to:
          </Text>
          <ul>
            <li>Set threshold alerts (e.g., notify when value exceeds X)</li>
            <li>Configure trend alerts (e.g., notify on X% increase/decrease)</li>
            <li>Set up anomaly detection alerts</li>
            <li>Define alert recipients and delivery methods</li>
            <li>Schedule alert checking frequency</li>
          </ul>
        </Stack>
      </Box>

      {/* Footer Section */}
      <Group justify="flex-end" gap="sm">
        <Button variant="default" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleNext}>
          Next
        </Button>
      </Group>
    </Modal>
  );
}

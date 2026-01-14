import { Modal, Title, Button, Divider, Group, ScrollArea } from '@mantine/core';

interface ManageSchedulesModalProps {
  opened: boolean;
  onClose: () => void;
}

/**
 * ManageSchedulesModal Component
 *
 * Modal for viewing and managing existing schedules.
 *
 * Structure:
 * - Header: "Manage Schedules" title with close button
 * - Body: Scrollable content area (to be populated with schedule list)
 * - Footer: Cancel button
 */
export const ManageSchedulesModal = ({ opened, onClose }: ManageSchedulesModalProps) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="lg"
      centered
      withCloseButton={true}
      title={<Title order={2}>Manage Schedules</Title>}
    >
      <Divider mb="lg" />

      {/* Body Section - Scrollable Content */}
      <ScrollArea style={{ height: 400 }} mb="lg">
        {/* TODO: Add schedule list here */}
      </ScrollArea>

      {/* Footer Section */}
      <Group justify="flex-end" gap="sm">
        <Button variant="default" onClick={onClose}>
          Cancel
        </Button>
      </Group>
    </Modal>
  );
};

import { Modal, Text, ScrollArea } from '@mantine/core';
import { RunHistoryTable } from './RunHistoryTable';
import { useRunHistory } from './useRunHistory';

interface RunHistoryModalProps {
  opened: boolean;
  onClose: () => void;
  scheduleId: string | null;
}

export const RunHistoryModal = ({
  opened,
  onClose,
  scheduleId,
}: RunHistoryModalProps) => {
  const { scheduleName, runs, loading } = useRunHistory(scheduleId);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="xl"
      centered
      title={<Text fw={600} size="lg">Run History — {scheduleName}</Text>}
    >
      <ScrollArea style={{ minHeight: 200 }}>
        <RunHistoryTable runs={runs} loading={loading} />
      </ScrollArea>
    </Modal>
  );
};

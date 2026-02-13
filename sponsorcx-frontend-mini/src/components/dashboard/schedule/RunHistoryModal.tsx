import { Modal, Title, ScrollArea } from '@mantine/core';
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
      title={<Title order={3}>Run History — {scheduleName}</Title>}
    >
      <ScrollArea style={{ minHeight: 200 }}>
        <RunHistoryTable runs={runs} loading={loading} />
      </ScrollArea>
    </Modal>
  );
};

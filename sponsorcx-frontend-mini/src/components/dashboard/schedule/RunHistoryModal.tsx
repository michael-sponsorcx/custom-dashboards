import { useState } from 'react';
import { Modal, Text, ScrollArea, Group, Box, Stack, CloseButton, Divider, Code } from '@mantine/core';
import { RunHistoryTable } from './RunHistoryTable';
import { useRunHistory } from './useRunHistory';
import type { RunHistoryRow } from './RunHistoryTable';
import type { ScheduleRow } from './ScheduleTable';

interface RunHistoryModalProps {
  opened: boolean;
  onClose: () => void;
  schedule: ScheduleRow | null;
  dashboardName: string;
}

const formatDateTimeForDetail = (timestamp: string): string => {
  const date = new Date(timestamp);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${mm}/${dd}/${yyyy} ${hh}:${min}:${ss}`;
};

const formatRunDetails = (
  run: RunHistoryRow,
  schedule: ScheduleRow,
  dashboardName: string,
): string => {
  const lines: string[] = [];

  lines.push(`Job Started at: ${formatDateTimeForDetail(run.startedAt)}`);
  lines.push('');
  lines.push(`Created by: ${schedule.createdBy} (${schedule.createdByEmail})`);
  lines.push('');
  lines.push(`File Type: ${schedule.format}`);

  if (dashboardName) {
    lines.push('');
    lines.push(`Dashboard: ${dashboardName} (${schedule.format})`);
  }

  if (schedule.recipients.length > 0) {
    lines.push('');
    lines.push(`Recipients: ${schedule.recipients.join(', ')}`);
  }

  if (run.notes) {
    const notes = run.notes;
    if (typeof notes.alert_type === 'string') {
      lines.push('');
      lines.push(`Alert type: ${notes.alert_type}`);
    }
    if (typeof notes.message === 'string') {
      lines.push('');
      lines.push(`Message: ${notes.message}`);
    }
  }

  return lines.join('\n');
};

export const RunHistoryModal = ({
  opened,
  onClose,
  schedule,
  dashboardName,
}: RunHistoryModalProps) => {
  const { runs, loading } = useRunHistory(schedule?.cronJobId ?? null);
  const [selectedRun, setSelectedRun] = useState<RunHistoryRow | null>(null);

  const handleClose = () => {
    setSelectedRun(null);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      size="xl"
      centered
      title={<Text fw={600} size="lg">Run History - {schedule?.name}</Text>}
    >
      <Group align="stretch" gap={0} wrap="nowrap" style={{ minHeight: 500 }}>
        {/* Run history table — takes remaining space */}
        <Box style={{ flex: selectedRun ? 2 : 1, overflow: 'hidden' }}>
          <ScrollArea style={{ minHeight: 500 }}>
            <RunHistoryTable
              runs={runs}
              loading={loading}
              selectedRunId={selectedRun?.id}
              onSelectRun={setSelectedRun}
            />
          </ScrollArea>
        </Box>

        {/* Detail slide-out panel — 1/3 width */}
        {selectedRun && schedule && (
          <>
            <Divider orientation="vertical" />
            <Box
              style={{
                flex: 1,
                minWidth: 0,
                overflow: 'hidden',
              }}
            >
              <ScrollArea style={{ minHeight: 500 }} p="md">
                <Stack gap="sm">
                  <Group justify="space-between" align="center">
                    <Text fw={600} size="sm">Run Details</Text>
                    <CloseButton size="sm" onClick={() => setSelectedRun(null)} />
                  </Group>
                  <Divider />
                  <Code block style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>
                    {formatRunDetails(selectedRun, schedule, dashboardName)}
                  </Code>
                </Stack>
              </ScrollArea>
            </Box>
          </>
        )}
      </Group>
    </Modal>
  );
};

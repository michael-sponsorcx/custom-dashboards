import { Paper, Stack, Text, Progress, ActionIcon, Group } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

interface DownloadPDFToastProps {
  current: number;
  total: number;
  onCancel: () => void;
}

/**
 * Toast notification displayed during PDF download
 * Small non-blocking notification at bottom right of screen
 */
export function DownloadPDFToast({ current, total, onCancel }: DownloadPDFToastProps) {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <Paper
      shadow="lg"
      p="md"
      radius="md"
      withBorder
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        width: 320,
        zIndex: 1000,
        backgroundColor: 'white',
      }}
    >
      <Stack gap="sm">
        <Group justify="space-between" align="center">
          <Text fw={600} size="sm">
            Generating PDF
          </Text>
          <ActionIcon
            size="sm"
            variant="subtle"
            color="gray"
            onClick={onCancel}
            aria-label="Cancel PDF generation"
          >
            <IconX size={16} />
          </ActionIcon>
        </Group>
        <Text size="xs" c="dimmed">
          Capturing page {current} of {total}...
        </Text>
        <Progress value={percentage} size="md" animated />
      </Stack>
    </Paper>
  );
}

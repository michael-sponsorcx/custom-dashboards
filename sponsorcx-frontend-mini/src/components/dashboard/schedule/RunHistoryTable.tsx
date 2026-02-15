import { Table, Badge, Text, Center, Loader } from '@mantine/core';

export interface RunHistoryRow {
  id: string;
  cronJobId: string;
  completed: boolean;
  startedAt: string;
  notes: Record<string, unknown> | null;
}

interface RunHistoryTableProps {
  runs: RunHistoryRow[];
  loading?: boolean;
  selectedRunId?: string | null;
  onSelectRun?: (run: RunHistoryRow) => void;
}

const formatTimeSince = (timestamp: string): string => {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'just now';
};

export const RunHistoryTable = ({ runs, loading = false, selectedRunId, onSelectRun }: RunHistoryTableProps) => {
  if (loading) {
    return (
      <Center py="xl">
        <Loader size="md" />
      </Center>
    );
  }

  if (runs.length === 0) {
    return (
      <Center py="xl">
        <Text c="dimmed">No run history found.</Text>
      </Center>
    );
  }

  return (
    <Table highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Started At</Table.Th>
          <Table.Th>Status</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {runs.map((run) => (
          <Table.Tr
            key={run.id}
            onClick={() => onSelectRun?.(run)}
            style={{
              cursor: onSelectRun ? 'pointer' : undefined,
              backgroundColor: selectedRunId === run.id ? 'var(--mantine-color-blue-light)' : undefined,
            }}
          >
            <Table.Td>
              <Text size="sm">{formatTimeSince(run.startedAt)}</Text>
            </Table.Td>
            <Table.Td>
              <Badge
                color={run.completed ? 'green' : 'red'}
                variant="light"
              >
                {run.completed ? 'Completed' : 'Failed'}
              </Badge>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
};

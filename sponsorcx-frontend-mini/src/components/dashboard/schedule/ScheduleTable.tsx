import { useState } from 'react';
import { Table, Checkbox, Menu, ActionIcon, Badge, Text, Center, Loader } from '@mantine/core';
import { IconDots, IconPlayerPlay, IconEdit, IconEye, IconHistory, IconTrash } from '@tabler/icons-react';

export interface ScheduleRow {
  id: string;
  name: string;
  status: 'active' | 'paused';
  createdBy: string;
  createdByEmail: string;
  recipients: string[];
  frequency: string;
  format: string;
  cronJobId: string;
}

interface ScheduleTableProps {
  schedules: ScheduleRow[];
  loading?: boolean;
  onResume?: (id: string) => void;
  onEdit?: (id: string) => void;
  onView?: (id: string) => void;
  onRunHistory?: (schedule: ScheduleRow) => void;
  onDelete?: (id: string) => void;
}

export const ScheduleTable = ({
  schedules,
  loading = false,
  onResume,
  onEdit,
  onView,
  onRunHistory,
  onDelete,
}: ScheduleTableProps) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const allSelected = schedules.length > 0 && selectedIds.size === schedules.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(schedules.map((s) => s.id)));
    }
  };

  const toggleRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (loading) {
    return (
      <Center py="xl">
        <Loader size="md" />
      </Center>
    );
  }

  return (
    <Table highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th w={40}>
            <Checkbox
              checked={allSelected}
              indeterminate={someSelected}
              onChange={toggleAll}
            />
          </Table.Th>
          <Table.Th>Name</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th>Created By</Table.Th>
          <Table.Th>Recipients</Table.Th>
          <Table.Th>Frequency</Table.Th>
          <Table.Th>Format</Table.Th>
          <Table.Th w={50} />
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {schedules.map((schedule) => (
          <Table.Tr key={schedule.id}>
            <Table.Td>
              <Checkbox
                checked={selectedIds.has(schedule.id)}
                onChange={() => toggleRow(schedule.id)}
              />
            </Table.Td>
            <Table.Td>
              <Text fw={500}>{schedule.name}</Text>
            </Table.Td>
            <Table.Td>
              <Badge
                color={schedule.status === 'active' ? 'green' : 'gray'}
                variant="light"
              >
                {schedule.status === 'active' ? 'Active' : 'Paused'}
              </Badge>
            </Table.Td>
            <Table.Td>{schedule.createdBy}</Table.Td>
            <Table.Td>
              {schedule.recipients.length > 0
                ? schedule.recipients.join(', ')
                : '-'}
            </Table.Td>
            <Table.Td>{schedule.frequency}</Table.Td>
            <Table.Td>{schedule.format}</Table.Td>
            <Table.Td>
              <Menu shadow="md" width={160} position="bottom-end">
                <Menu.Target>
                  <ActionIcon variant="subtle" color="gray">
                    <IconDots size={16} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={<IconPlayerPlay size={14} />}
                    onClick={() => onResume?.(schedule.id)}
                  >
                    Resume
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconEdit size={14} />}
                    onClick={() => onEdit?.(schedule.id)}
                  >
                    Edit
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconEye size={14} />}
                    onClick={() => onView?.(schedule.id)}
                  >
                    View
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconHistory size={14} />}
                    onClick={() => onRunHistory?.(schedule)}
                  >
                    Run History
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                    leftSection={<IconTrash size={14} />}
                    color="red"
                    onClick={() => onDelete?.(schedule.id)}
                  >
                    Delete
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
};

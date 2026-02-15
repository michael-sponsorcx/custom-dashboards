import { useState, useEffect } from 'react';
import { Container, Title, Button, Group, Stack, TextInput } from '@mantine/core';
import { IconSearch, IconPlus } from '@tabler/icons-react';
import { CreateScheduleModal } from './CreateScheduleModal';
import { ScheduleTable, type ScheduleRow } from './ScheduleTable';
import { RunHistoryModal } from './RunHistoryModal';
import { useSchedules } from './useSchedules';
import { useOrganizationStore } from '../../../store';
import { getOrCreateDefaultDashboard, toggleDashboardScheduleActive, fetchDashboardSchedule } from '../../../api';
import type { DashboardSchedule } from '../../../types/backend-graphql';

export const ManageSchedules = () => {
  const { organizationId, dashboardId, setDashboardId, userId } = useOrganizationStore();
  const [search, setSearch] = useState('');
  const [dashboardName, setDashboardName] = useState('');
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<DashboardSchedule | null>(null);
  const [runHistorySchedule, setRunHistorySchedule] = useState<ScheduleRow | null>(null);
  const { schedules, loading, refresh } = useSchedules(dashboardId ?? '', search);

  const handleToggleStatus = async (id: string, status: 'active' | 'paused') => {
    await toggleDashboardScheduleActive(id, status === 'active');
    refresh();
  };

  const handleEdit = async (id: string) => {
    const schedule = await fetchDashboardSchedule(id);
    if (schedule) {
      setEditingSchedule(schedule);
      setScheduleModalOpen(true);
    }
  };

  const handleScheduleModalClose = () => {
    setScheduleModalOpen(false);
    setEditingSchedule(null);
    refresh();
  };

  // Resolve dashboardId on mount if not already set (e.g. direct page refresh)
  useEffect(() => {
    if (!dashboardId && organizationId) {
      getOrCreateDefaultDashboard(organizationId).then((dashboard) => {
        setDashboardId(dashboard.id);
        setDashboardName(dashboard.name);
      });
    }
  }, [dashboardId, organizationId, setDashboardId]);

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        {/* Header */}
        <Title order={2}>Manage Schedules</Title>

        {/* Action Bar */}
        <Group justify="space-between">
          <TextInput
            placeholder="Search schedules..."
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            style={{ flex: 1 }}
          />
          <Button leftSection={<IconPlus size={16} />} onClick={() => setScheduleModalOpen(true)}>
            Create Schedule
          </Button>
        </Group>

        {/* Schedule List */}
        <ScheduleTable
          schedules={schedules}
          loading={loading}
          onToggleStatus={handleToggleStatus}
          onEdit={handleEdit}
          onRunHistory={setRunHistorySchedule}
        />
      </Stack>

      {organizationId && dashboardId && userId && (
        <CreateScheduleModal
          opened={scheduleModalOpen}
          onClose={handleScheduleModalClose}
          organizationId={organizationId}
          dashboardId={dashboardId}
          userId={userId}
          schedule={editingSchedule}
        />
      )}

      <RunHistoryModal
        opened={runHistorySchedule !== null}
        onClose={() => setRunHistorySchedule(null)}
        schedule={runHistorySchedule}
        dashboardName={dashboardName}
      />
    </Container>
  );
};

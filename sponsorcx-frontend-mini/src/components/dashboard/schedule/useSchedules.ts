import { useState, useEffect, useMemo } from 'react';
import { fetchDashboardSchedulesByDashboard } from '../../../api';
import type { DashboardSchedule } from '../../../api';
import type { ScheduleRow } from './ScheduleTable';

const toScheduleRow = (schedule: DashboardSchedule): ScheduleRow => ({
  id: schedule.id,
  name: schedule.scheduleName,
  status: schedule.isActive ? 'active' : 'paused',
  createdBy: schedule.createdByName,
  recipients: (schedule.recipients ?? []).filter((r): r is string => r != null),
  frequency: schedule.frequencyInterval,
  format: schedule.attachmentType ?? '-',
});

export const useSchedules = (dashboardId: string, search: string) => {
  const [schedules, setSchedules] = useState<ScheduleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSchedules = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDashboardSchedulesByDashboard(dashboardId);
      setSchedules(data.map(toScheduleRow));
    } catch (err) {
      console.error('Failed to load schedules:', err);
      setError(err instanceof Error ? err.message : 'Failed to load schedules');
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!dashboardId) return;
    loadSchedules();
  }, [dashboardId]);

  const filteredSchedules = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return schedules;
    return schedules.filter(
      (s) =>
        s.name.toLowerCase().includes(term) ||
        s.createdBy.toLowerCase().includes(term) ||
        s.recipients.some((r) => r.toLowerCase().includes(term)) ||
        s.frequency.toLowerCase().includes(term) ||
        s.format.toLowerCase().includes(term)
    );
  }, [schedules, search]);

  return {
    schedules: filteredSchedules,
    loading,
    error,
    refresh: loadSchedules,
  };
};

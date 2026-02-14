import { useState, useEffect } from 'react';
import { fetchDashboardSchedule, fetchCronJobResults } from '../../../api';
import type { CronJobResult } from '../../../types/backend-graphql';
import type { RunHistoryRow } from './RunHistoryTable';

const toCronJobResultRow = (result: CronJobResult): RunHistoryRow => ({
  id: result.id,
  cronJobId: result.cronJobId,
  completed: result.completed,
  startedAt: result.jobStartTimestamp,
});

export const useRunHistory = (scheduleId: string | null) => {
  const [scheduleName, setScheduleName] = useState('');
  const [runs, setRuns] = useState<RunHistoryRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!scheduleId) {
      setScheduleName('');
      setRuns([]);
      setError(null);
      return;
    }

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const schedule = await fetchDashboardSchedule(scheduleId);
        if (!schedule) {
          setError('Schedule not found');
          return;
        }

        setScheduleName(schedule.scheduleName);

        const results = await fetchCronJobResults(schedule.cronJobId);
        setRuns(results.map(toCronJobResultRow));
      } catch (err) {
        console.error('Failed to load run history:', err);
        setError(err instanceof Error ? err.message : 'Failed to load run history');
        setRuns([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [scheduleId]);

  return { scheduleName, runs, loading, error };
};

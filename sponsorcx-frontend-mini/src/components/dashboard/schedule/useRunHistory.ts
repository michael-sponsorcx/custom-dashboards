import { useState, useEffect } from 'react';
import { fetchCronJobResults } from '../../../api';
import type { CronJobResult } from '../../../types/backend-graphql';
import type { RunHistoryRow } from './RunHistoryTable';

const toCronJobResultRow = (result: CronJobResult): RunHistoryRow => ({
  id: result.id,
  cronJobId: result.cronJobId,
  completed: result.completed,
  startedAt: result.jobStartTimestamp,
  notes: result.notes ?? null,
});

export const useRunHistory = (cronJobId: string | null) => {
  const [runs, setRuns] = useState<RunHistoryRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cronJobId) {
      setRuns([]);
      setError(null);
      return;
    }

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const results = await fetchCronJobResults(cronJobId);
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
  }, [cronJobId]);

  return { runs, loading, error };
};

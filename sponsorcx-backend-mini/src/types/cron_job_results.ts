export interface CronJobResult {
    id: bigint;
    cron_job_id: bigint;
    notes: Record<string, unknown> | null;
    completed: boolean;
    job_start_timestamp: Date | null;
    trigger: 'manual' | 'cron';
    organization_id: bigint;
}

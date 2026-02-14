/** Database row type for cron_job_results table (snake_case) */
export interface CronJobResultRow {
    id: string;
    cron_job_id: string;
    notes: Record<string, unknown> | null;
    completed: boolean;
    job_start_timestamp: string;
    trigger: string;
    organization_id: string;
}

/** Resolved CronJobResult type (camelCase for GraphQL) */
export interface CronJobResult {
    id: string;
    cronJobId: string;
    notes: Record<string, unknown> | null;
    completed: boolean;
    jobStartTimestamp: string;
    trigger: string;
    organizationId: string;
}

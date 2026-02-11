/** Database row type for cron_jobs table (snake_case) */
export interface CronJobRow {
    id: string;
    job_name: string;
    locked: boolean;
    master_locked: boolean;
    last_ran_at_date: string;
    last_ran_at_hour: string;
    last_ran_at_minute: string;
}

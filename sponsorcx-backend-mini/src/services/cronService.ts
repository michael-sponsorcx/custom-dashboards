// TODO: we'll need to delete this file after migration
import { pool } from '../db/connection';

const isDev = process.env.NODE_ENV === 'development';

interface CronJob {
    id: string;
    job_name: string;
    locked: boolean;
    master_locked: boolean;
    last_ran_at_date: Date;
    last_ran_at_hour: string;
    last_ran_at_minute: string;
}

/**
 * Checks if a cron job can run safely by preventing duplicate execution
 * Uses database locking via transaction and triggers
 *
 * @param jobName - The name of the cron job to check
 * @returns true if the job can run, false if it should be skipped
 */
export const cronJobCanRunSafely = async (jobName: string): Promise<boolean> => {
    const currentDate = new Date().toISOString().split('T')[0];
    const currentHour = new Date().getHours().toString().padStart(2, '0');
    const currentMinutes = new Date().getMinutes().toString().padStart(2, '0');

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Fetch the cron job record
        const result = await client.query<CronJob>(
            'SELECT * FROM cron_jobs WHERE job_name = $1 FOR UPDATE',
            [jobName]
        );

        if (result.rows.length === 0) {
            if (isDev) console.log(`${jobName}: No cronjob found`);
            await client.query('ROLLBACK');
            return false;
        }

        const cronjob = result.rows[0];
        const lastRanAtDate = new Date(cronjob.last_ran_at_date)
            .toISOString()
            .split('T')[0];

        // Check if the job should run
        if (
            lastRanAtDate !== currentDate ||
            cronjob.last_ran_at_hour !== currentHour ||
            (cronjob.id === '1' && surpassedWaitTime(cronjob, 600000))
        ) {
            try {
                // Update the last run time
                await client.query(
                    `UPDATE cron_jobs
                     SET last_ran_at_date = $1,
                         last_ran_at_hour = $2,
                         last_ran_at_minute = $3
                     WHERE id = $4`,
                    [currentDate, currentHour, currentMinutes, cronjob.id]
                );

                await client.query('COMMIT');
                return true;
            } catch (err) {
                await client.query('ROLLBACK');
                const error = err as Error;
                if (
                    error.message.includes(
                        'This cron job has already been executed in the current hour'
                    )
                ) {
                    if (isDev) console.log(
                        `${jobName}: This cronjob has already been executed, skipping`
                    );
                } else {
                    throw err;
                }
            }
        } else {
            await client.query('ROLLBACK');
            if (isDev) console.log(
                `${jobName}: This cronjob has already been executed this hour, skipping`
            );
        }
        return false;
    } catch (e) {
        await client.query('ROLLBACK');
        if (isDev) console.error(e);
        return false;
    } finally {
        client.release();
    }
};

/**
 * Checks if the wait time since last execution has been surpassed
 *
 * @param cronJob - The cron job record
 * @param waitTime - Wait time in milliseconds
 * @returns true if wait time has been exceeded
 */
const surpassedWaitTime = (cronJob: CronJob, waitTime: number): boolean => {
    const currentTime = new Date();

    const cronJobTime = new Date(cronJob.last_ran_at_date);
    cronJobTime.setHours(
        parseInt(cronJob.last_ran_at_hour),
        parseInt(cronJob.last_ran_at_minute),
        0
    );

    return currentTime.getTime() - cronJobTime.getTime() >= waitTime;
};

/**
 * Logger utility for cron jobs
 * Only logs in development mode
 */
export const logger = {
    info: (message: string, meta?: Record<string, unknown>) => {
        if (isDev) {
            console.log(`ℹ️  ${message}`, meta || '');
        }
    },
    error: (message: string, meta?: Record<string, unknown>) => {
        if (isDev) {
            console.error(`❌ ${message}`, meta || '');
        }
    },
};

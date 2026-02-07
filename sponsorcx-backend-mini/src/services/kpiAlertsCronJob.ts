import { CronJob } from 'cron';
import { pool } from '../db/connection';
import { logger } from './cronService';

interface AlertData {
    cron_job_id: string;
    kpi_alert_id: bigint;
    organization_id: bigint;
    graph_id: bigint | null;
    dashboard_id: bigint;
    created_by_id: bigint;
    alert_name: string;
    alert_type: 'schedule' | 'threshold';
    comment: string | null;
    recipients: string[];
    is_active: boolean;
}

interface KpiSchedule {
    id: bigint;
    kpi_alert_id: bigint;
    frequency_interval: 'n_minute' | 'hour' | 'day' | 'week' | 'month';
    minute_interval: number | null;
    hour_interval: number | null;
    schedule_hour: number | null;
    schedule_minute: number | null;
    selected_days: string[];
    exclude_weekends: boolean;
    month_dates: number[];
    time_zone: string;
    has_gating_condition: boolean;
    gating_condition: Record<string, unknown> | null;
    attachment_type: 'PDF' | 'Excel' | 'CSV' | null;
    cron_expression: string | null;
}

interface KpiThreshold {
    id: bigint;
    kpi_alert_id: bigint;
    condition: 'GREATER_THAN' | 'GREATER_THAN_OR_EQUAL' | 'LESS_THAN' | 'LESS_THAN_OR_EQUAL' | 'EQUAL_TO' | 'NOT_EQUAL_TO';
    threshold_value: number;
    time_zone: string;
}

interface ScheduleAlertWithConfig extends AlertData {
    frequency_interval: 'n_minute' | 'hour' | 'day' | 'week' | 'month';
    minute_interval: number | null;
    hour_interval: number | null;
    schedule_hour: number | null;
    schedule_minute: number | null;
    selected_days: string[];
    exclude_weekends: boolean;
    month_dates: number[];
    time_zone: string;
    has_gating_condition: boolean;
    gating_condition: Record<string, unknown> | null;
    attachment_type: 'PDF' | 'Excel' | 'CSV' | null;
}

// Track registered cron jobs for cleanup
const registeredCronJobs = new Map<string, CronJob>();

/**
 * Generate cron expression from schedule configuration
 */
const generateCronExpression = (schedule: Pick<ScheduleAlertWithConfig, 'frequency_interval' | 'minute_interval' | 'hour_interval' | 'schedule_hour' | 'schedule_minute' | 'selected_days' | 'month_dates'>): string => {
    const { frequency_interval, minute_interval, hour_interval, schedule_hour,
            schedule_minute, selected_days, month_dates } = schedule;

    switch (frequency_interval) {
        case 'n_minute':
            // Every N minutes: */5, */10, */15, etc.
            if (!minute_interval) {
                throw new Error('minute_interval is required for n_minute frequency');
            }
            return `*/${minute_interval} * * * *`;

        case 'hour':
            // Every N hours at minute 0: 0 */2 * * *
            if (!hour_interval) {
                throw new Error('hour_interval is required for hour frequency');
            }
            return `0 */${hour_interval} * * *`;

        case 'day':
            // Daily at specific time: 30 9 * * * (9:30 AM daily)
            if (schedule_hour === null || schedule_minute === null) {
                throw new Error('schedule_hour and schedule_minute are required for day frequency');
            }
            return `${schedule_minute} ${schedule_hour} * * *`;

        case 'week':
            // Specific days of week at specific time
            // selected_days: ['M', 'W', 'F'] → 1,3,5
            if (schedule_hour === null || schedule_minute === null) {
                throw new Error('schedule_hour and schedule_minute are required for week frequency');
            }
            if (!selected_days || selected_days.length === 0) {
                throw new Error('selected_days is required for week frequency');
            }
            const dayMap: Record<string, number> = { Su: 0, M: 1, T: 2, W: 3, Th: 4, F: 5, S: 6 };
            const days = selected_days.map(d => dayMap[d]).join(',');
            return `${schedule_minute} ${schedule_hour} * * ${days}`;

        case 'month':
            // Specific dates of month at specific time
            // month_dates: [1, 15] → 0 9 1,15 * *
            if (schedule_hour === null || schedule_minute === null) {
                throw new Error('schedule_hour and schedule_minute are required for month frequency');
            }
            if (!month_dates || month_dates.length === 0) {
                throw new Error('month_dates is required for month frequency');
            }
            const dates = month_dates.join(',');
            return `${schedule_minute} ${schedule_hour} ${dates} * *`;

        default:
            throw new Error(`Unknown frequency_interval: ${frequency_interval}`);
    }
};

/**
 * Register a single schedule alert wrapper with its own cron expression
 */
export const registerScheduleAlertWrapper = (alert: ScheduleAlertWithConfig): void => {
    try {
        const cronExpression = generateCronExpression(alert);

        const cronJob = new CronJob(
            cronExpression,
            async function () {
                await processScheduledAlert(alert);
            },
            null,
            true,
            alert.time_zone || 'America/Los_Angeles'
        );

        registeredCronJobs.set(alert.cron_job_id, cronJob);
        logger.info(`Registered schedule alert: ${alert.alert_name} (${cronExpression}) [timezone: ${alert.time_zone}]`);
    } catch (error) {
        logger.error(`Failed to register schedule alert ${alert.alert_name}:`, { error });
    }
};

/**
 * Deregister a schedule alert wrapper
 */
export const deregisterScheduleAlertWrapper = (cronJobId: string): void => {
    const cronJob = registeredCronJobs.get(cronJobId);
    if (cronJob) {
        cronJob.stop();
        registeredCronJobs.delete(cronJobId);
        logger.info(`Deregistered schedule alert: ${cronJobId}`);
    }
};

/**
 * Register wrapper for all threshold alerts (single wrapper)
 */
const registerThresholdAlertsWrapper = (): void => {
    console.log('[1-threshold] registerThresholdAlertsWrapper() called - setting up threshold alerts cron job');

    const cronJob = new CronJob(
        '*/5 * * * *',  // Every 5 minutes
        async function () {
            console.log('[3-threshold] Threshold cron job TRIGGERED (every 5 min) - calling processAllThresholdAlerts()');
            await processAllThresholdAlerts();
        },
        null,
        true,
        'America/Los_Angeles'
    );

    registeredCronJobs.set('__threshold_alerts__', cronJob);
    console.log('[2-threshold] registerThresholdAlertsWrapper() complete - cron job registered with expression "*/5 * * * *"');
    logger.info('Registered threshold alerts wrapper (every 5 minutes)');
};

/**
 * Register all schedule alert wrappers on server startup
 */
const registerScheduleAlertsWrappers = async (): Promise<void> => {
    const client = await pool.connect();
    try {
        // Query all active schedule alerts with their schedule config
        const result = await client.query<ScheduleAlertWithConfig>(`
            SELECT
                ka.cron_job_id,
                ka.id as kpi_alert_id,
                ka.organization_id,
                ka.graph_id,
                ka.dashboard_id,
                ka.created_by_id,
                ka.alert_name,
                ka.alert_type,
                ka.comment,
                ka.recipients,
                ka.is_active,
                ks.frequency_interval,
                ks.minute_interval,
                ks.hour_interval,
                ks.schedule_hour,
                ks.schedule_minute,
                ks.selected_days,
                ks.exclude_weekends,
                ks.month_dates,
                ks.time_zone,
                ks.has_gating_condition,
                ks.gating_condition,
                ks.attachment_type
            FROM kpi_alerts ka
            INNER JOIN kpi_schedules ks ON ks.kpi_alert_id = ka.id
            WHERE ka.alert_type = 'schedule' AND ka.is_active = true
        `);

        for (const alert of result.rows) {
            registerScheduleAlertWrapper(alert);
        }

        logger.info(`Registered ${result.rows.length} schedule alert wrappers`);
    } catch (error) {
        logger.error('Failed to register schedule alerts wrappers:', { error });
    } finally {
        client.release();
    }
};

/**
 * Initialize all KPI alerts cron jobs
 */
export const initializeKpiAlertsCronJobs = async (): Promise<void> => {
    logger.info('Initializing KPI alerts cron jobs...');

    // 1. Register threshold alerts wrapper (single wrapper for all)
    registerThresholdAlertsWrapper();

    // 2. Register schedule alerts wrappers (one per alert)
    await registerScheduleAlertsWrappers();

    logger.info('KPI alerts cron jobs initialized successfully');
};

/**
 * Process a single scheduled alert (called by individual wrapper)
 */
const processScheduledAlert = async (alert: ScheduleAlertWithConfig): Promise<void> => {
    console.log(`[1-scheduled] processScheduledAlert() started for "${alert.alert_name}"`);
    const client = await pool.connect();

    try {
        console.log('[2-scheduled] BEGIN transaction');
        await client.query('BEGIN');

        // 1. Lock the cron job record
        console.log(`[3-scheduled] Locking cron_jobs record with id: ${alert.cron_job_id}`);
        const cronJobResult = await client.query(
            'SELECT * FROM cron_jobs WHERE id = $1 FOR UPDATE',
            [alert.cron_job_id]
        );
        const cronJob = cronJobResult.rows[0];
        console.log('[3a-scheduled] cron_jobs query result:', JSON.stringify(cronJob, null, 2));

        if (!cronJob) {
            console.log(`[ERROR-scheduled] No cron_jobs record found for cron_job_id: ${alert.cron_job_id}`);
            await client.query('ROLLBACK');
            logger.error(`No cron_jobs record found for alert ${alert.kpi_alert_id}`);
            return;
        }

        // 2. Check if already ran this hour (time window protection) - using UTC
        const now = new Date();
        const currentDate = now.toISOString().split('T')[0];
        const currentHour = now.getUTCHours().toString().padStart(2, '0');
        const currentMinute = now.getUTCMinutes().toString().padStart(2, '0');
        console.log(`[4-scheduled] Checking hourly protection - currentDate: ${currentDate}, currentHour: ${currentHour}, last_ran_at_date: ${cronJob.last_ran_at_date}, last_ran_at_hour: ${cronJob.last_ran_at_hour}`);

        if (cronJob.last_ran_at_date === currentDate &&
            cronJob.last_ran_at_hour === currentHour) {
            console.log('[4a-scheduled] Already ran this hour - SKIPPING');
            await client.query('ROLLBACK');
            logger.info(`Already ran ${alert.cron_job_id} this hour, skipping`);
            return;
        }

        // 3. Update last_ran_at (UTC)
        console.log(`[5-scheduled] Updating cron_jobs last_ran_at: date=${currentDate}, hour=${currentHour}, minute=${currentMinute} (UTC)`);
        await client.query(
            `UPDATE cron_jobs SET last_ran_at_date = $1, last_ran_at_hour = $2,
             last_ran_at_minute = $3 WHERE id = $4`,
            [currentDate, currentHour, currentMinute, cronJob.id]
        );

        // 4. Check gating condition (if applicable)
        if (alert.has_gating_condition && alert.gating_condition) {
            console.log('[6-scheduled] Evaluating gating condition...');
            const shouldExecute = await evaluateGatingCondition(alert, alert.gating_condition);
            if (!shouldExecute) {
                console.log('[6a-scheduled] Gating condition NOT met - SKIPPING');
                logger.info(`Gating condition not met for alert ${alert.kpi_alert_id}, skipping`);
                await client.query(
                    `INSERT INTO cron_job_results (cron_job_id, notes, completed,
                     job_start_timestamp, trigger, organization_id)
                     VALUES ($1, $2, $3, $4, $5, $6)`,
                    [
                        cronJob.id,
                        JSON.stringify({ alert_type: 'schedule', message: 'Gating condition not met' }),
                        true,
                        new Date(),
                        'cron',
                        alert.organization_id,
                    ]
                );
                await client.query('COMMIT');
                return;
            }
        }

        // 5. Fetch dashboard/graph data and generate report
        // TODO: Implement data fetching and report generation
        console.log(`[7-scheduled] TODO: SEND EMAIL to ${alert.recipients.length} recipients: ${JSON.stringify(alert.recipients)}`);
        console.log(`[7a-scheduled] Email details: attachmentType=${alert.attachment_type}`);
        logger.info(`Would send scheduled alert to ${alert.recipients.length} recipients`, {
            kpiAlertId: alert.kpi_alert_id,
            recipients: alert.recipients,
            attachmentType: alert.attachment_type,
        });

        // 6. Record success
        console.log('[8-scheduled] Recording success to cron_job_results');
        await client.query(
            `INSERT INTO cron_job_results (cron_job_id, notes, completed,
             job_start_timestamp, trigger, organization_id)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
                cronJob.id,
                JSON.stringify({ alert_type: 'schedule', message: 'Completed successfully' }),
                true,
                new Date(),
                'cron',
                alert.organization_id,
            ]
        );

        await client.query('COMMIT');
        console.log(`[8a-scheduled] COMMIT successful - scheduled alert "${alert.alert_name}" processed`);
        logger.info(`Successfully processed scheduled alert ${alert.kpi_alert_id}`);

    } catch (error) {
        const errorMessage = (error as Error).message || '';

        // Check if this is the "already executed" scenario - this is normal flow, not an error
        if (errorMessage.includes('already been executed')) {
            logger.info(`Scheduled alert ${alert.kpi_alert_id} already executed this hour, skipping`);
            await client.query('ROLLBACK');
            return;
        }

        // Actual error - log and record
        logger.error(`Error processing scheduled alert ${alert.kpi_alert_id}:`, { error });

        try {
            const cronJobId = alert.cron_job_id;
            await client.query(
                `INSERT INTO cron_job_results (cron_job_id, notes, completed,
                 job_start_timestamp, trigger, organization_id)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [
                    cronJobId,
                    JSON.stringify({ alert_type: 'schedule', message: `Failed: ${errorMessage}` }),
                    false,
                    new Date(),
                    'cron',
                    alert.organization_id,
                ]
            );
            await client.query('COMMIT');
        } catch (nestedError) {
            logger.error('Failed to record error result:', { nestedError });
            await client.query('ROLLBACK');
        }
    } finally {
        client.release();
    }
};

/**
 * Process all threshold alerts (called by single wrapper every 5 minutes)
 */
const processAllThresholdAlerts = async (): Promise<void> => {
    console.log('[4-threshold] processAllThresholdAlerts() started - querying active threshold alerts from DB');
    const client = await pool.connect();

    try {
        // Query all active threshold alerts
        const result = await client.query<AlertData>(`
            SELECT
                ka.cron_job_id,
                ka.id as kpi_alert_id,
                ka.organization_id,
                ka.graph_id,
                ka.dashboard_id,
                ka.created_by_id,
                ka.alert_name,
                ka.alert_type,
                ka.comment,
                ka.recipients,
                ka.is_active
            FROM kpi_alerts ka
            WHERE ka.alert_type = 'threshold' AND ka.is_active = true
        `);

        console.log(`[5-threshold] Query complete - found ${result.rows.length} active threshold alerts`);
        console.log('[5a-threshold] Alert data:', JSON.stringify(result.rows, null, 2));

        logger.info(`Found ${result.rows.length} active threshold alerts to check`);

        for (let i = 0; i < result.rows.length; i++) {
            const alert = result.rows[i];
            console.log(`[6-threshold] Processing alert ${i + 1}/${result.rows.length}: "${alert.alert_name}" (kpi_alert_id: ${alert.kpi_alert_id}, cron_job_id: ${alert.cron_job_id})`);
            // Process each threshold alert independently
            // Each gets its own transaction and lock
            await processThresholdAlert(alert);
        }
        console.log('[17-threshold] processAllThresholdAlerts() complete - all alerts processed');
    } catch (error) {
        console.log('[ERROR-threshold] processAllThresholdAlerts() failed:', error);
        logger.error('Error in threshold alerts processor:', { error });
    } finally {
        client.release();
    }
};

/**
 * Process a single threshold alert
 */
const processThresholdAlert = async (alert: AlertData): Promise<void> => {
    console.log(`[7-threshold] processThresholdAlert() started for "${alert.alert_name}"`);
    const client = await pool.connect();

    try {
        console.log('[8-threshold] BEGIN transaction');
        await client.query('BEGIN');

        // 1. Lock the cron job record
        console.log(`[9-threshold] Locking cron_jobs record with id: ${alert.cron_job_id}`);
        const cronJobResult = await client.query(
            'SELECT * FROM cron_jobs WHERE id = $1 FOR UPDATE',
            [alert.cron_job_id]
        );
        const cronJob = cronJobResult.rows[0];
        console.log('[9a-threshold] cron_jobs query result:', JSON.stringify(cronJob, null, 2));

        if (!cronJob) {
            console.log(`[ERROR-threshold] No cron_jobs record found for cron_job_id: ${alert.cron_job_id}`);
            await client.query('ROLLBACK');
            logger.error(`No cron_jobs record found for alert ${alert.kpi_alert_id}`);
            return;
        }

        // 2. Check if already ran TODAY (not this hour) - threshold alerts fire once per day
        const currentDate = new Date().toISOString().split('T')[0];
        console.log(`[10-threshold] Checking daily protection - currentDate: ${currentDate}, last_ran_at_date: ${cronJob.last_ran_at_date}`);

        if (cronJob.last_ran_at_date === currentDate) {
            console.log('[10a-threshold] Already fired today - SKIPPING');
            await client.query('ROLLBACK');
            logger.info(`Threshold alert ${alert.cron_job_id} already fired today, skipping`);
            return;
        }

        // 3. Fetch threshold config
        console.log(`[11-threshold] Fetching kpi_thresholds with kpi_alert_id: ${alert.kpi_alert_id}`);
        const thresholdResult = await client.query<KpiThreshold>(
            'SELECT * FROM kpi_thresholds WHERE kpi_alert_id = $1',
            [alert.kpi_alert_id]
        );
        console.log('[11a-threshold] kpi_thresholds query result:', JSON.stringify(thresholdResult.rows, null, 2));

        if (thresholdResult.rows.length === 0) {
            console.log(`[ERROR-threshold] No threshold config found for kpi_alert_id: ${alert.kpi_alert_id}`);
            await client.query('ROLLBACK');
            logger.error(`No threshold found for alert ${alert.kpi_alert_id}`);
            return;
        }

        const threshold = thresholdResult.rows[0];

        // 4. Fetch current KPI value and evaluate condition
        // TODO: Implement KPI value fetching from Cube.js
        // For now, always consider the condition met (testing purposes)
        const currentValue = 0; // Placeholder
        const conditionMet = true; // Always true until Cube integration is complete
        console.log(`[12-threshold] Evaluating condition: ${threshold.condition} ${threshold.threshold_value} (currentValue: ${currentValue}, conditionMet: ${conditionMet} - hardcoded for testing)`);

        // Uncomment when Cube integration is ready:
        // const conditionMet = evaluateThresholdCondition(
        //     currentValue,
        //     threshold.condition,
        //     threshold.threshold_value
        // );

        if (!conditionMet) {
            console.log('[12a-threshold] Condition NOT met - SKIPPING');
            await client.query('ROLLBACK');
            logger.info(`Threshold condition not met for ${alert.alert_name}`);
            return;
        }

        console.log('[13-threshold] Condition MET - proceeding with alert');
        logger.info(`Threshold condition met for ${alert.alert_name} (testing mode - always true)`);


        // 5. Update last_ran_at to TODAY (using UTC to match currentDate)
        const now = new Date();
        const currentHour = now.getUTCHours().toString().padStart(2, '0');
        const currentMinute = now.getUTCMinutes().toString().padStart(2, '0');
        console.log(`[14-threshold] Updating cron_jobs last_ran_at: date=${currentDate}, hour=${currentHour}, minute=${currentMinute} (UTC)`);

        await client.query(
            `UPDATE cron_jobs SET last_ran_at_date = $1, last_ran_at_hour = $2,
             last_ran_at_minute = $3 WHERE id = $4`,
            [currentDate, currentHour, currentMinute, cronJob.id]
        );

        // 6. Send alert email
        // TODO: Implement email sending
        console.log(`[15-threshold] TODO: SEND EMAIL to ${alert.recipients.length} recipients: ${JSON.stringify(alert.recipients)}`);
        console.log(`[15a-threshold] Email details: condition=${threshold.condition}, thresholdValue=${threshold.threshold_value}, currentValue=${currentValue}`);
        logger.info(`Would send threshold alert to ${alert.recipients.length} recipients`, {
            kpiAlertId: alert.kpi_alert_id,
            recipients: alert.recipients,
            condition: threshold.condition,
            thresholdValue: threshold.threshold_value,
            currentValue,
        });

        // 7. Record success
        console.log('[16-threshold] Recording success to cron_job_results');
        await client.query(
            `INSERT INTO cron_job_results (cron_job_id, notes, completed,
             job_start_timestamp, trigger, organization_id)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
                cronJob.id,
                JSON.stringify({
                    alert_type: 'threshold',
                    message: 'Threshold breached, alert sent',
                    condition: threshold.condition,
                    threshold_value: threshold.threshold_value,
                    current_value: currentValue,
                }),
                true,
                new Date(),
                'cron',
                alert.organization_id,
            ]
        );

        await client.query('COMMIT');
        console.log(`[16a-threshold] COMMIT successful - threshold alert "${alert.alert_name}" processed`);
        logger.info(`Successfully sent threshold alert: ${alert.alert_name}`);

    } catch (error) {
        const errorMessage = (error as Error).message || '';

        // Check if this is the "already executed" scenario - this is normal flow, not an error
        if (errorMessage.includes('already been executed')) {
            console.log(`[10a-threshold] Threshold alert "${alert.alert_name}" already executed today (via DB trigger), skipping`);
            logger.info(`Threshold alert ${alert.kpi_alert_id} already executed today, skipping`);
            await client.query('ROLLBACK');
            return;
        }

        // Actual error - log and record
        console.log(`[ERROR-threshold] processThresholdAlert() failed for "${alert.alert_name}":`, error);
        logger.error(`Error processing threshold alert ${alert.kpi_alert_id}:`, { error });

        try {
            await client.query(
                `INSERT INTO cron_job_results (cron_job_id, notes, completed,
                 job_start_timestamp, trigger, organization_id)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [
                    alert.cron_job_id,
                    JSON.stringify({ alert_type: 'threshold', message: `Failed: ${errorMessage}` }),
                    false,
                    new Date(),
                    'cron',
                    alert.organization_id,
                ]
            );
            await client.query('COMMIT');
        } catch (nestedError) {
            console.log('[ERROR-threshold] Failed to record error result:', nestedError);
            logger.error('Failed to record error result:', { nestedError });
            await client.query('ROLLBACK');
        }
    } finally {
        client.release();
    }
};

/**
 * Evaluate a threshold condition
 */
const evaluateThresholdCondition = (
    currentValue: number,
    condition: string,
    thresholdValue: number
): boolean => {
    switch (condition) {
        case 'GREATER_THAN':
            return currentValue > thresholdValue;
        case 'GREATER_THAN_OR_EQUAL':
            return currentValue >= thresholdValue;
        case 'LESS_THAN':
            return currentValue < thresholdValue;
        case 'LESS_THAN_OR_EQUAL':
            return currentValue <= thresholdValue;
        case 'EQUAL_TO':
            return currentValue === thresholdValue;
        case 'NOT_EQUAL_TO':
            return currentValue !== thresholdValue;
        default:
            throw new Error(`Unknown condition: ${condition}`);
    }
};

/**
 * Evaluate a gating condition for a scheduled alert
 */
const evaluateGatingCondition = async (
    alert: AlertData,
    condition: Record<string, unknown>
): Promise<boolean> => {
    // TODO: Implement gating condition evaluation logic
    // This would check if the current data meets the condition specified
    logger.info(`Evaluating gating condition for alert ${alert.kpi_alert_id}`, { condition });
    return true; // Placeholder
};

# KPI Alerts Cron Job Implementation

This document describes the cron job system implemented for processing KPI alerts in the SponsorCX backend.

## Overview

The KPI alerts cron job system provides automated monitoring and notification capabilities for:
- **Scheduled Alerts**: Time-based reports sent on a recurring schedule (e.g., daily, weekly, monthly)
- **Threshold Alerts**: Condition-based alerts triggered when KPI values meet certain criteria

## Architecture

### Database Tables - Inheritance Hierarchy

The system uses a 4-level table inheritance hierarchy where each level contains only the data unique to that level:

```
cron_jobs (execution scheduling - TOP LEVEL)
    ↓ 1:1
kpi_alerts (KPI-specific data)
    ↓ 1:1
kpi_schedules OR kpi_thresholds (type-specific data)
```

**Why this hierarchy?**
- **cron_jobs** is the top level that actually gets checked and run
- Each KPI alert creates its own `cron_jobs` record with auto-increment ID
- Data is organized by specificity: execution → KPI → type-specific

**Table Details:**

1. **`cron_jobs`** (already exists in database) - **Top of hierarchy**
   - Controls WHEN jobs execute via `last_ran_at_date`, `last_ran_at_hour`, `last_ran_at_minute`
   - Uses database-level locking via triggers to prevent duplicate execution
   - Prevents multiple server instances from running the same job simultaneously
   - Each KPI alert gets its own cron_jobs record (auto-increment ID)

2. **`kpi_alerts`** - **1:1 with cron_jobs**
   - References `cron_jobs.id` via `cron_job_id` (UNIQUE constraint)
   - Contains KPI-specific data common to all alert types
   - Fields: organization_id, graph_id, dashboard_id, alert_name, recipients, is_active, etc.
   - **Does NOT contain**: execution timing data (that's in cron_jobs)
   - See migration [002_add_kpi_alerts_tables.sql](src/db/migrations/002_add_kpi_alerts_tables.sql)

3. **`kpi_schedules`** - **1:1 with kpi_alerts (for alert_type='schedule')**
   - References `kpi_alerts.id` via `kpi_alert_id` (UNIQUE constraint)
   - Contains ONLY schedule-specific data: frequency_interval, schedule_hour, schedule_minute, selected_days, timezone, gating_condition, attachment_type

4. **`kpi_thresholds`** - **1:1 with kpi_alerts (for alert_type='threshold')**
   - References `kpi_alerts.id` via `kpi_alert_id` (UNIQUE constraint)
   - Contains ONLY threshold-specific data: condition, threshold_value, timezone

5. **`cron_job_results`** (already exists) - Execution history
   - Records each job execution with metadata
   - Tracks success/failure status
   - Links to organization for auditing

### Code Structure

```
sponsorcx-backend-mini/
├── server.ts                              # Initializes cron jobs on startup
├── src/
│   ├── services/
│   │   ├── cronService.ts                 # Core cron job utilities
│   │   ├── kpiAlertsCronJob.ts            # KPI alerts processing logic
│   │   └── schedules/
│   │       └── calculateNextExecution.ts  # Schedule calculation
│   ├── types/
│   │   ├── cron_job.ts                    # CronJob type definition
│   │   └── cron_job_results.ts            # CronJobResult type definition
│   └── db/
│       └── migrations/
│           └── 002_add_kpi_alerts_tables.sql    # KPI alerts hierarchy
```

## Key Components

### 1. cronService.ts

Provides core utilities for cron job execution:

#### `cronJobCanRunSafely(jobName: string): Promise<boolean>`

Checks if a cron job can run safely by:
1. Looking up the cron job by its name in the `cron_jobs` database table
2. Using database transactions and row-level locking (`FOR UPDATE`)
3. Comparing current time with last execution time
4. Updating last execution time atomically
5. Catching database trigger exceptions for duplicate prevention

**Returns:**
- `true` if the job can run
- `false` if it should be skipped (already running)

**Note:** This function will be deleted after migration since KPI alerts have their own cron_jobs records.

#### `logger`

Simple logging utility with `info()` and `error()` methods.

### 2. kpiAlertsCronJob.ts

Main processing logic for KPI alerts following the inheritance hierarchy:

#### Main Process Flow

```typescript
const processKpiAlerts = async (): Promise<void>
```

1. **Query the hierarchy** - Joins cron_jobs → kpi_alerts
   ```sql
   SELECT cj.*, ka.*
   FROM cron_jobs cj
   INNER JOIN kpi_alerts ka ON ka.cron_job_id = cj.id
   WHERE ka.is_active = true
   ```

2. **Process by type** - Routes to schedule or threshold handler based on `alert_type`

3. **Execute alert logic** - Fetches type-specific data and processes

#### Scheduled Alerts Processing

```typescript
const processScheduledAlert = async (alert: AlertData): Promise<void>
```

- Fetches `kpi_schedules` record for schedule-specific data
- Checks gating conditions (if applicable)
- Generates and sends report (TODO)
- Execution timing is controlled by parent `cron_jobs` record

#### Threshold Alerts Processing

```typescript
const processThresholdAlert = async (alert: AlertData): Promise<void>
```

- Fetches `kpi_thresholds` record for threshold-specific data
- Queries current KPI value (TODO)
- Evaluates threshold condition
- Sends alert if condition is met (TODO)

#### Main Cron Job

```typescript
export const kpiAlertsCronJob = (): void
```

- Runs every 5 minutes (`*/5 * * * *`)
- Uses `cronJobCanRunSafely(jobName)` for duplicate prevention
- Timezone: `America/Los_Angeles`
- Only runs in production (`NODE_ENV === 'production'`)

## How the Hierarchy Works

### Creating a New Alert

When creating a new KPI alert, you must create records in order:

```sql
-- 1. Create cron_jobs record (top level)
-- Note: Using random bigint for id (future system will auto-increment)
INSERT INTO cron_jobs (id, job_name, locked, master_locked)
VALUES ((floor(random() * 9000000000) + 1000000000)::bigint::text, 'kpi_alert_123', false, false)
RETURNING id;

-- 2. Create kpi_alerts record (references cron_jobs)
INSERT INTO kpi_alerts (cron_job_id, organization_id, dashboard_id, ...)
VALUES ('bigint-from-step-1', 1, 1, ...)
RETURNING id;

-- 3. Create type-specific record (references kpi_alerts)
-- For schedules:
INSERT INTO kpi_schedules (kpi_alert_id, frequency_interval, ...)
VALUES (kpi_alert_id_from_step_2, 'day', ...);

-- OR for thresholds:
INSERT INTO kpi_thresholds (kpi_alert_id, condition, threshold_value, ...)
VALUES (kpi_alert_id_from_step_2, 'GREATER_THAN', 100);
```

### How Execution Works

1. **Cron job runs every 5 minutes**
2. **Checks `cron_jobs` table** for all records
3. **Joins to `kpi_alerts`** to find active alerts
4. **For each alert:**
   - Reads execution timing from `cron_jobs` (last_ran_at_*)
   - Reads KPI data from `kpi_alerts` (recipients, dashboard_id, etc.)
   - Reads type-specific data from `kpi_schedules` or `kpi_thresholds`
   - Processes the alert
5. **Updates `cron_jobs`** with new execution time

The `cron_jobs` table is the **single source of truth** for when things run.

## Setup & Installation

### 1. Install Dependencies

```bash
cd sponsorcx-backend-mini
yarn add cron@^1.8.2
yarn add -D @types/cron@^1.7.3
```

### 2. Run Migrations

```bash
yarn migrate
```

This will create:
- `kpi_alerts` table with `cron_job_id` reference
- `kpi_schedules` table
- `kpi_thresholds` table

**Note:** `cron_jobs` and `cron_job_results` tables already exist in the database.

### 3. Environment Variables

Ensure `NODE_ENV` is set correctly:

```bash
# Development (cron jobs won't run)
NODE_ENV=development

# Production (cron jobs will run)
NODE_ENV=production
```

### 4. Start Server

```bash
# Development
yarn start

# Production
yarn start:prod
```

## Cron Schedule Format

The system uses standard cron expression format:

```
┌────────────── minute (0-59)
│ ┌──────────── hour (0-23)
│ │ ┌────────── day of month (1-31)
│ │ │ ┌──────── month (1-12)
│ │ │ │ ┌────── day of week (0-6, Sunday=0)
│ │ │ │ │
* * * * *
```

### Current Schedule

- KPI Alerts Processor: `*/5 * * * *` (every 5 minutes)

## Database Trigger Logic

The `prevent_multiple_updates()` function prevents duplicate execution:

```sql
CREATE OR REPLACE FUNCTION prevent_multiple_updates() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.last_ran_at_date = OLD.last_ran_at_date AND
       NEW.last_ran_at_hour = OLD.last_ran_at_hour THEN
        RAISE EXCEPTION 'This cron job has already been executed in the current hour';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

This ensures that if two server instances try to update the same cron job record in the same hour, only the first succeeds.

## TODO: Implementation Next Steps

The following features are marked as TODO in the code and need to be completed:

### 1. Report Generation

**File:** [src/services/kpiAlertsCronJob.ts:134-138](src/services/kpiAlertsCronJob.ts#L134-L138)

**Requirements:**
- Integrate with Cube.js API to fetch KPI data
- Generate PDF reports (consider using puppeteer or pdfkit)
- Generate Excel reports (consider using exceljs)
- Generate CSV reports (use built-in CSV libraries)
- Send emails with attachments (integrate with email service)

### 2. Threshold Evaluation

**File:** [src/services/kpiAlertsCronJob.ts:174-178](src/services/kpiAlertsCronJob.ts#L174-L178)

**Requirements:**
- Query current KPI value from Cube.js
- Implement threshold comparison logic
- Send alert emails when thresholds are breached
- Track alert history to prevent spam (e.g., don't send same alert repeatedly)

### 3. Gating Condition Evaluation

**File:** [src/services/kpiAlertsCronJob.ts:191-198](src/services/kpiAlertsCronJob.ts#L191-L198)

**Requirements:**
- Parse gating condition JSON structure
- Query data to evaluate condition
- Return true/false based on whether condition is met
- Example: "Only send weekly report if revenue > $10k"

## Best Practices

1. **Follow the hierarchy** - Always create cron_jobs first, then kpi_alerts, then type-specific tables
2. **Use transactions** when creating new alerts to ensure atomicity
3. **Log extensively** - helps with debugging production issues
4. **Handle errors gracefully** - don't let one alert failure stop all processing
5. **Consider timezone conversions** carefully when working with schedules

## Troubleshooting

### Issue: Cron job not running

**Check:**
1. Is `NODE_ENV` set to `production`?
2. Are cron jobs initialized in [server.ts](server.ts)?
3. Check server logs for initialization message

### Issue: Job runs multiple times

**Check:**
1. Is the `prevent_multiple_updates` trigger active?
2. Check `cron_jobs` table for correct last execution time
3. Verify `cronJobCanRunSafely()` is being called with the correct job name

### Issue: Alerts not being sent

**Check:**
1. Are there `kpi_alerts` records with `is_active = true`?
2. Do the alerts have corresponding `cron_jobs` records?
3. Review error logs for processing failures
4. Verify email service integration (TODO)

## How Duplicate Prevention Works

Each KPI alert has its own `cron_jobs` record. When the cron job runs every minute:

1. **Queries all active alerts** - Gets all `kpi_alerts` with `is_active = true`
2. **For each alert:**
   - Calls `cronJobCanRunSafely(alert.cron_job_id)`
   - This locks that specific alert's `cron_jobs` record
   - Checks if it already ran this hour
   - If not, updates execution time and proceeds
   - If yes, skips processing

**Example with 2 server instances:**
- Server 1 processes Alert A at 2:00 PM → locks Alert A's cron_jobs record
- Server 2 tries to process Alert A at 2:00 PM → sees it already ran, skips
- Both servers can process different alerts simultaneously without conflict

**The job name** in `cron_jobs.job_name` is unique per alert (e.g., `kpi_alert_schedule_456` or `kpi_alert_threshold_789`) and is used by `cronJobCanRunSafely()` to look up the correct record.

## References

- [Cron npm package](https://www.npmjs.com/package/cron)
- [Cron expression syntax](https://crontab.guru/)
- [PostgreSQL triggers](https://www.postgresql.org/docs/current/trigger-definition.html)
- [Node.js pg transactions](https://node-postgres.com/features/transactions)

/**
 * Calculate Next Execution Time for KPI Schedules
 *
 * This module provides functions to calculate the next execution time
 * for KPI schedules based on their frequency configuration.
 *
 * Used by the cron job that polls kpi_schedules every 5 minutes.
 */

// Day of week mapping: JS getDay() returns 0=Sunday, 1=Monday, etc.
const DAY_MAP: Record<string, number> = {
  Su: 0,
  M: 1,
  T: 2,
  W: 3,
  Th: 4,
  F: 5,
  S: 6,
};

// Reverse mapping: JS day number to our day code
const DAY_CODE_MAP: Record<number, string> = {
  0: 'Su',
  1: 'M',
  2: 'T',
  3: 'W',
  4: 'Th',
  5: 'F',
  6: 'S',
};

export type FrequencyInterval = 'n_minute' | 'hour' | 'day' | 'week' | 'month';

export interface KpiScheduleRecord {
  frequency_interval: FrequencyInterval;
  minute_interval: number | null; // For n_minute: 5, 10, 15, ..., 45
  hour_interval: number | null; // For hour: 1-12
  schedule_hour: number | null; // 0-23, time of day for day/week/month
  schedule_minute: number | null; // 0-55 in 5-min increments
  selected_days: string[]; // ['M', 'T', 'W', 'Th', 'F', 'S', 'Su']
  exclude_weekends: boolean; // For day frequency
  month_dates: number[]; // Days of month [1-31]
  time_zone: string; // IANA timezone (e.g., 'America/Los_Angeles')
  last_executed_at: Date | null;
}

/**
 * Main function to calculate the next execution time for a schedule.
 *
 * @param schedule - The KPI schedule record from the database
 * @param referenceTime - Optional reference time (defaults to now). Useful for testing.
 * @returns The next execution timestamp as a Date object
 */
export const calculateNextExecution = (
  schedule: KpiScheduleRecord,
  referenceTime?: Date
): Date => {
  const now = referenceTime ?? new Date();

  switch (schedule.frequency_interval) {
    case 'n_minute':
      return calculateNextNMinute(schedule, now);
    case 'hour':
      return calculateNextHour(schedule, now);
    case 'day':
      return calculateNextDay(schedule, now);
    case 'week':
      return calculateNextWeek(schedule, now);
    case 'month':
      return calculateNextMonth(schedule, now);
    default:
      throw new Error(`Unknown frequency interval: ${schedule.frequency_interval}`);
  }
};

/**
 * Convert a Date to a specific timezone and return components.
 * Uses Intl.DateTimeFormat for timezone-aware date manipulation.
 */
const getDateInTimezone = (
  date: Date,
  timeZone: string
): { year: number; month: number; day: number; hour: number; minute: number; dayOfWeek: number } => {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    weekday: 'short',
  });

  const parts = formatter.formatToParts(date);
  const getPart = (type: string): string => parts.find((p) => p.type === type)?.value ?? '';

  const weekdayStr = getPart('weekday');
  const weekdayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

  return {
    year: parseInt(getPart('year'), 10),
    month: parseInt(getPart('month'), 10),
    day: parseInt(getPart('day'), 10),
    hour: parseInt(getPart('hour'), 10),
    minute: parseInt(getPart('minute'), 10),
    dayOfWeek: weekdayMap[weekdayStr] ?? 0,
  };
};

/**
 * Create a Date object for a specific time in a timezone.
 * This handles the conversion from local timezone time to UTC.
 */
const createDateInTimezone = (
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string
): Date => {
  // Create a date string in ISO format
  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;

  // Start with a rough estimate and iteratively adjust
  let targetDate = new Date(dateStr);

  // Adjust by checking what the local time would be
  for (let i = 0; i < 3; i++) {
    const localParts = getDateInTimezone(targetDate, timeZone);
    const diffMinutes =
      (hour - localParts.hour) * 60 + (minute - localParts.minute) + (day - localParts.day) * 24 * 60;
    targetDate = new Date(targetDate.getTime() + diffMinutes * 60 * 1000);
  }

  return targetDate;
};

/**
 * Check if a day of week (0-6) is in the selected days array.
 */
const isDaySelected = (dayOfWeek: number, selectedDays: string[]): boolean => {
  if (selectedDays.length === 0) return true; // If no days specified, all days are valid
  const dayCode = DAY_CODE_MAP[dayOfWeek];
  return selectedDays.includes(dayCode);
};

/**
 * Check if a day is a weekend (Saturday or Sunday).
 */
const isWeekend = (dayOfWeek: number): boolean => {
  return dayOfWeek === 0 || dayOfWeek === 6;
};

/**
 * Add days to a date while respecting timezone.
 */
const addDays = (date: Date, days: number): Date => {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
};

/**
 * Calculate next execution for N_MINUTE frequency.
 * Adds minute_interval minutes, skips days not in selected_days.
 */
const calculateNextNMinute = (schedule: KpiScheduleRecord, now: Date): Date => {
  const interval = schedule.minute_interval ?? 5;
  let nextTime = new Date(now.getTime() + interval * 60 * 1000);

  // If selected_days is specified, we need to check if the next time falls on a valid day
  if (schedule.selected_days.length > 0) {
    const maxIterations = 7 * 24 * 60; // Max 1 week of minutes to prevent infinite loop
    let iterations = 0;

    while (iterations < maxIterations) {
      const tzDate = getDateInTimezone(nextTime, schedule.time_zone);

      if (isDaySelected(tzDate.dayOfWeek, schedule.selected_days)) {
        return nextTime;
      }

      // Move to the start of the next day in the target timezone
      const nextDay = addDays(
        createDateInTimezone(tzDate.year, tzDate.month, tzDate.day, 0, 0, schedule.time_zone),
        1
      );
      nextTime = nextDay;
      iterations++;
    }
  }

  return nextTime;
};

/**
 * Calculate next execution for HOUR frequency.
 * Adds hour_interval hours, skips days not in selected_days.
 */
const calculateNextHour = (schedule: KpiScheduleRecord, now: Date): Date => {
  const interval = schedule.hour_interval ?? 1;
  let nextTime = new Date(now.getTime() + interval * 60 * 60 * 1000);

  // If selected_days is specified, check if the next time falls on a valid day
  if (schedule.selected_days.length > 0) {
    const maxIterations = 7 * 24; // Max 1 week of hours
    let iterations = 0;

    while (iterations < maxIterations) {
      const tzDate = getDateInTimezone(nextTime, schedule.time_zone);

      if (isDaySelected(tzDate.dayOfWeek, schedule.selected_days)) {
        return nextTime;
      }

      // Move to the start of the next day in the target timezone
      const nextDay = addDays(
        createDateInTimezone(tzDate.year, tzDate.month, tzDate.day, 0, 0, schedule.time_zone),
        1
      );
      nextTime = nextDay;
      iterations++;
    }
  }

  return nextTime;
};

/**
 * Calculate next execution for DAY frequency.
 * Next day at schedule_hour:schedule_minute, skip weekends if exclude_weekends.
 */
const calculateNextDay = (schedule: KpiScheduleRecord, now: Date): Date => {
  const hour = schedule.schedule_hour ?? 0;
  const minute = schedule.schedule_minute ?? 0;
  const tzNow = getDateInTimezone(now, schedule.time_zone);

  // Start with today's scheduled time
  let targetDate = createDateInTimezone(tzNow.year, tzNow.month, tzNow.day, hour, minute, schedule.time_zone);

  // If the scheduled time today has passed, move to tomorrow
  if (targetDate <= now) {
    targetDate = addDays(targetDate, 1);
  }

  // Skip weekends if exclude_weekends is true
  if (schedule.exclude_weekends) {
    const maxIterations = 7;
    let iterations = 0;

    while (iterations < maxIterations) {
      const tzTarget = getDateInTimezone(targetDate, schedule.time_zone);

      if (!isWeekend(tzTarget.dayOfWeek)) {
        return targetDate;
      }

      targetDate = addDays(targetDate, 1);
      iterations++;
    }
  }

  return targetDate;
};

/**
 * Calculate next execution for WEEK frequency.
 * Next selected_days occurrence at schedule_hour:schedule_minute.
 */
const calculateNextWeek = (schedule: KpiScheduleRecord, now: Date): Date => {
  const hour = schedule.schedule_hour ?? 0;
  const minute = schedule.schedule_minute ?? 0;
  const selectedDays = schedule.selected_days;

  // If no days selected, default to Monday
  if (selectedDays.length === 0) {
    selectedDays.push('M');
  }

  const tzNow = getDateInTimezone(now, schedule.time_zone);

  // Start with today's scheduled time
  let targetDate = createDateInTimezone(tzNow.year, tzNow.month, tzNow.day, hour, minute, schedule.time_zone);

  // Check if today's time has passed
  const todayPassed = targetDate <= now;

  // Look for the next valid day (up to 7 days)
  for (let dayOffset = todayPassed ? 1 : 0; dayOffset < 8; dayOffset++) {
    const checkDate = addDays(
      createDateInTimezone(tzNow.year, tzNow.month, tzNow.day, hour, minute, schedule.time_zone),
      dayOffset
    );
    const tzCheck = getDateInTimezone(checkDate, schedule.time_zone);

    if (isDaySelected(tzCheck.dayOfWeek, selectedDays)) {
      return checkDate;
    }
  }

  // Fallback: return tomorrow (shouldn't reach here with valid config)
  return addDays(targetDate, 1);
};

/**
 * Calculate next execution for MONTH frequency.
 * Next month_dates occurrence at schedule_hour:schedule_minute.
 */
const calculateNextMonth = (schedule: KpiScheduleRecord, now: Date): Date => {
  const hour = schedule.schedule_hour ?? 0;
  const minute = schedule.schedule_minute ?? 0;
  const monthDates = schedule.month_dates.sort((a, b) => a - b);

  // If no dates specified, default to 1st of month
  if (monthDates.length === 0) {
    monthDates.push(1);
  }

  const tzNow = getDateInTimezone(now, schedule.time_zone);

  // Find the next valid date
  // First, check remaining dates in current month
  for (const date of monthDates) {
    if (date >= tzNow.day) {
      const targetDate = createDateInTimezone(
        tzNow.year,
        tzNow.month,
        date,
        hour,
        minute,
        schedule.time_zone
      );

      // Check if this date is valid (handles months with fewer days)
      const tzTarget = getDateInTimezone(targetDate, schedule.time_zone);
      if (tzTarget.day === date && targetDate > now) {
        return targetDate;
      }
    }
  }

  // No valid dates left in current month, move to next month
  let nextMonth = tzNow.month + 1;
  let nextYear = tzNow.year;

  if (nextMonth > 12) {
    nextMonth = 1;
    nextYear++;
  }

  // Find the first valid date in the next month
  for (const date of monthDates) {
    const targetDate = createDateInTimezone(nextYear, nextMonth, date, hour, minute, schedule.time_zone);

    // Check if this date is valid
    const tzTarget = getDateInTimezone(targetDate, schedule.time_zone);
    if (tzTarget.day === date) {
      return targetDate;
    }
  }

  // Fallback: first of next month
  return createDateInTimezone(nextYear, nextMonth, 1, hour, minute, schedule.time_zone);
};

/**
 * Generate a cron expression from a schedule configuration.
 * This is a helper function for display/debugging purposes.
 *
 * Note: Cron expressions have limitations and can't represent all schedule configurations
 * (e.g., "every 7 hours" or timezone-aware scheduling). This is a best-effort representation.
 */
export const generateCronExpression = (schedule: KpiScheduleRecord): string => {
  switch (schedule.frequency_interval) {
    case 'n_minute':
      return `*/${schedule.minute_interval ?? 5} * * * *`;

    case 'hour':
      return `0 */${schedule.hour_interval ?? 1} * * *`;

    case 'day': {
      const hour = schedule.schedule_hour ?? 0;
      const minute = schedule.schedule_minute ?? 0;
      if (schedule.exclude_weekends) {
        return `${minute} ${hour} * * 1-5`;
      }
      return `${minute} ${hour} * * *`;
    }

    case 'week': {
      const hour = schedule.schedule_hour ?? 0;
      const minute = schedule.schedule_minute ?? 0;
      const days = schedule.selected_days
        .map((d) => DAY_MAP[d])
        .sort((a, b) => a - b)
        .join(',');
      return `${minute} ${hour} * * ${days || '*'}`;
    }

    case 'month': {
      const hour = schedule.schedule_hour ?? 0;
      const minute = schedule.schedule_minute ?? 0;
      const dates = schedule.month_dates.sort((a, b) => a - b).join(',');
      return `${minute} ${hour} ${dates || '1'} * *`;
    }

    default:
      return '* * * * *';
  }
};

/**
 * Tests for calculateNextExecution
 *
 * Run with: yarn test calculateNextExecution
 */

import { describe, it, expect } from 'vitest';
import { calculateNextExecution, generateCronExpression, KpiScheduleRecord } from './calculateNextExecution';

// Helper to create a base schedule with defaults
const createSchedule = (overrides: Partial<KpiScheduleRecord>): KpiScheduleRecord => ({
  frequency_interval: 'day',
  minute_interval: null,
  hour_interval: null,
  schedule_hour: 9,
  schedule_minute: 0,
  selected_days: [],
  exclude_weekends: false,
  month_dates: [],
  time_zone: 'UTC',
  last_executed_at: null,
  ...overrides,
});

describe('calculateNextExecution', () => {
  describe('n_minute frequency', () => {
    it('should add minute_interval to current time', () => {
      const schedule = createSchedule({
        frequency_interval: 'n_minute',
        minute_interval: 15,
        selected_days: [],
      });

      const now = new Date('2024-01-15T10:00:00Z');
      const result = calculateNextExecution(schedule, now);

      expect(result.getTime()).toBe(new Date('2024-01-15T10:15:00Z').getTime());
    });

    it('should skip days not in selected_days', () => {
      const schedule = createSchedule({
        frequency_interval: 'n_minute',
        minute_interval: 30,
        selected_days: ['M', 'T', 'W', 'Th', 'F'], // Weekdays only
        time_zone: 'UTC',
      });

      // Saturday at 23:45 - adding 30 min would be Sunday
      const now = new Date('2024-01-13T23:45:00Z'); // Saturday
      const result = calculateNextExecution(schedule, now);

      // Should skip to Monday (next weekday)
      const resultDate = new Date(result);
      expect(resultDate.getUTCDay()).toBe(1); // Monday
    });

    it('should use default 5 minutes if minute_interval is null', () => {
      const schedule = createSchedule({
        frequency_interval: 'n_minute',
        minute_interval: null,
        selected_days: [],
      });

      const now = new Date('2024-01-15T10:00:00Z');
      const result = calculateNextExecution(schedule, now);

      expect(result.getTime()).toBe(new Date('2024-01-15T10:05:00Z').getTime());
    });
  });

  describe('hour frequency', () => {
    it('should add hour_interval to current time', () => {
      const schedule = createSchedule({
        frequency_interval: 'hour',
        hour_interval: 3,
        selected_days: [],
      });

      const now = new Date('2024-01-15T10:00:00Z');
      const result = calculateNextExecution(schedule, now);

      expect(result.getTime()).toBe(new Date('2024-01-15T13:00:00Z').getTime());
    });

    it('should skip days not in selected_days', () => {
      const schedule = createSchedule({
        frequency_interval: 'hour',
        hour_interval: 2,
        selected_days: ['M', 'T', 'W', 'Th', 'F'], // Weekdays only
        time_zone: 'UTC',
      });

      // Saturday at 23:00 - adding 2 hours would still be Sunday
      const now = new Date('2024-01-13T23:00:00Z'); // Saturday
      const result = calculateNextExecution(schedule, now);

      // Should skip to Monday
      const resultDate = new Date(result);
      expect(resultDate.getUTCDay()).toBe(1); // Monday
    });
  });

  describe('day frequency', () => {
    it('should schedule for next day at specified time', () => {
      const schedule = createSchedule({
        frequency_interval: 'day',
        schedule_hour: 9,
        schedule_minute: 30,
      });

      // Current time is after today's scheduled time
      const now = new Date('2024-01-15T10:00:00Z');
      const result = calculateNextExecution(schedule, now);

      expect(result.getUTCDate()).toBe(16);
      expect(result.getUTCHours()).toBe(9);
      expect(result.getUTCMinutes()).toBe(30);
    });

    it('should schedule for today if scheduled time has not passed', () => {
      const schedule = createSchedule({
        frequency_interval: 'day',
        schedule_hour: 14,
        schedule_minute: 0,
      });

      const now = new Date('2024-01-15T10:00:00Z');
      const result = calculateNextExecution(schedule, now);

      expect(result.getUTCDate()).toBe(15);
      expect(result.getUTCHours()).toBe(14);
    });

    it('should skip weekends when exclude_weekends is true', () => {
      const schedule = createSchedule({
        frequency_interval: 'day',
        schedule_hour: 9,
        schedule_minute: 0,
        exclude_weekends: true,
      });

      // Friday afternoon - next day would be Saturday
      const now = new Date('2024-01-12T18:00:00Z'); // Friday
      const result = calculateNextExecution(schedule, now);

      // Should skip to Monday
      expect(result.getUTCDay()).toBe(1); // Monday
      expect(result.getUTCDate()).toBe(15);
    });
  });

  describe('week frequency', () => {
    it('should schedule for next occurrence of selected day', () => {
      const schedule = createSchedule({
        frequency_interval: 'week',
        schedule_hour: 10,
        schedule_minute: 0,
        selected_days: ['M', 'W', 'F'], // Monday, Wednesday, Friday
      });

      // Monday at noon - next should be Wednesday
      const now = new Date('2024-01-15T12:00:00Z'); // Monday
      const result = calculateNextExecution(schedule, now);

      expect(result.getUTCDay()).toBe(3); // Wednesday
      expect(result.getUTCDate()).toBe(17);
    });

    it('should schedule for same day if time has not passed', () => {
      const schedule = createSchedule({
        frequency_interval: 'week',
        schedule_hour: 14,
        schedule_minute: 0,
        selected_days: ['M', 'W', 'F'],
      });

      // Monday morning - should schedule for later today
      const now = new Date('2024-01-15T08:00:00Z'); // Monday 8am
      const result = calculateNextExecution(schedule, now);

      expect(result.getUTCDay()).toBe(1); // Monday
      expect(result.getUTCDate()).toBe(15);
      expect(result.getUTCHours()).toBe(14);
    });

    it('should wrap to next week if no more days this week', () => {
      const schedule = createSchedule({
        frequency_interval: 'week',
        schedule_hour: 10,
        schedule_minute: 0,
        selected_days: ['M'], // Monday only
      });

      // Tuesday - next Monday is next week
      const now = new Date('2024-01-16T12:00:00Z'); // Tuesday
      const result = calculateNextExecution(schedule, now);

      expect(result.getUTCDay()).toBe(1); // Monday
      expect(result.getUTCDate()).toBe(22); // Next Monday
    });
  });

  describe('month frequency', () => {
    it('should schedule for next occurrence of month_dates', () => {
      const schedule = createSchedule({
        frequency_interval: 'month',
        schedule_hour: 9,
        schedule_minute: 0,
        month_dates: [1, 15],
      });

      // January 10th - next should be January 15th
      const now = new Date('2024-01-10T12:00:00Z');
      const result = calculateNextExecution(schedule, now);

      expect(result.getUTCDate()).toBe(15);
      expect(result.getUTCMonth()).toBe(0); // January
    });

    it('should wrap to next month if no more dates this month', () => {
      const schedule = createSchedule({
        frequency_interval: 'month',
        schedule_hour: 9,
        schedule_minute: 0,
        month_dates: [1, 15],
      });

      // January 20th - next should be February 1st
      const now = new Date('2024-01-20T12:00:00Z');
      const result = calculateNextExecution(schedule, now);

      expect(result.getUTCDate()).toBe(1);
      expect(result.getUTCMonth()).toBe(1); // February
    });

    it('should skip invalid dates (e.g., Feb 30)', () => {
      const schedule = createSchedule({
        frequency_interval: 'month',
        schedule_hour: 9,
        schedule_minute: 0,
        month_dates: [30, 31],
      });

      // February - should skip to March
      const now = new Date('2024-02-15T12:00:00Z');
      const result = calculateNextExecution(schedule, now);

      // February 2024 doesn't have 30 or 31, should go to March
      expect(result.getUTCMonth()).toBe(2); // March
    });
  });

  describe('timezone handling', () => {
    it('should respect timezone for day frequency', () => {
      const schedule = createSchedule({
        frequency_interval: 'day',
        schedule_hour: 9,
        schedule_minute: 0,
        time_zone: 'America/Los_Angeles', // PST/PDT
      });

      // 9am in LA should be 17:00 UTC (during standard time)
      const now = new Date('2024-01-15T00:00:00Z'); // Midnight UTC
      const result = calculateNextExecution(schedule, now);

      // 9am LA = 17:00 UTC in January (PST = UTC-8)
      expect(result.getUTCHours()).toBe(17);
    });
  });
});

describe('generateCronExpression', () => {
  it('should generate correct cron for n_minute', () => {
    const schedule = createSchedule({
      frequency_interval: 'n_minute',
      minute_interval: 15,
    });

    expect(generateCronExpression(schedule)).toBe('*/15 * * * *');
  });

  it('should generate correct cron for hour', () => {
    const schedule = createSchedule({
      frequency_interval: 'hour',
      hour_interval: 4,
    });

    expect(generateCronExpression(schedule)).toBe('0 */4 * * *');
  });

  it('should generate correct cron for day', () => {
    const schedule = createSchedule({
      frequency_interval: 'day',
      schedule_hour: 9,
      schedule_minute: 30,
    });

    expect(generateCronExpression(schedule)).toBe('30 9 * * *');
  });

  it('should generate correct cron for day with exclude_weekends', () => {
    const schedule = createSchedule({
      frequency_interval: 'day',
      schedule_hour: 9,
      schedule_minute: 0,
      exclude_weekends: true,
    });

    expect(generateCronExpression(schedule)).toBe('0 9 * * 1-5');
  });

  it('should generate correct cron for week', () => {
    const schedule = createSchedule({
      frequency_interval: 'week',
      schedule_hour: 10,
      schedule_minute: 0,
      selected_days: ['M', 'W', 'F'],
    });

    expect(generateCronExpression(schedule)).toBe('0 10 * * 1,3,5');
  });

  it('should generate correct cron for month', () => {
    const schedule = createSchedule({
      frequency_interval: 'month',
      schedule_hour: 8,
      schedule_minute: 0,
      month_dates: [1, 15],
    });

    expect(generateCronExpression(schedule)).toBe('0 8 1,15 * *');
  });
});

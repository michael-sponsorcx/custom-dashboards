import { FrequencyInterval } from '../types/backend-graphql';

/**
 * Common time-related options used across the application
 * Shared between KPI alerts and schedules
 */

/**
 * Frequency options for scheduling (hourly, daily, weekly, monthly)
 */
export const FREQUENCY_OPTIONS: Array<{ value: FrequencyInterval; label: string }> = [
  { value: FrequencyInterval.Hour, label: 'Hourly' },
  { value: FrequencyInterval.Day, label: 'Daily' },
  { value: FrequencyInterval.Week, label: 'Weekly' },
  { value: FrequencyInterval.Month, label: 'Monthly' },
];

/**
 * Hour options (00-23)
 */
export const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => ({
  value: i.toString().padStart(2, '0'),
  label: i.toString().padStart(2, '0'),
}));

/**
 * Minute options (00, 05, 10, ..., 55)
 * In 5-minute increments
 */
export const MINUTE_OPTIONS = Array.from({ length: 12 }, (_, i) => {
  const minute = (i * 5).toString().padStart(2, '0');
  return {
    value: minute,
    label: minute,
  };
});

/**
 * Common time zones
 */
export const TIME_ZONE_OPTIONS = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEDT/AEST)' },
];

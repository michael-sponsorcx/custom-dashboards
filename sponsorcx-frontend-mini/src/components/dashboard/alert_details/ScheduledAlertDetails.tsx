import { useState } from 'react';
import { Stack, Text, Select, Flex, Checkbox } from '@mantine/core';
import type { KPIFormData, AlertFrequency, ScheduledAlertDetails as ScheduledAlertDetailsType } from '../../../types/kpi-alerts';

// Frequency options derived from AlertFrequency type
const FREQUENCY_OPTIONS: Array<{ value: AlertFrequency; label: string }> = [
  { value: 'hourly', label: 'Hourly' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

// Generate hour options (00-23)
const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => ({
  value: i.toString().padStart(2, '0'),
  label: i.toString().padStart(2, '0'),
}));

// Generate minute options (00, 05, 10, ..., 55)
const MINUTE_OPTIONS = Array.from({ length: 12 }, (_, i) => {
  const minute = (i * 5).toString().padStart(2, '0');
  return {
    value: minute,
    label: minute,
  };
});

// Common time zones
const TIME_ZONE_OPTIONS = [
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

/**
 * ScheduledAlertDetails Component
 *
 * Alert detail fields specific to the "scheduled" alert type.
 * Used when the alert type is "Regular KPI updates".
 *
 * Fields:
 * - Frequency: How often to send (hourly, daily, weekly, monthly)
 * - Time: Hour (00-23) and Minute (00, 05, 10, ..., 55) selection
 * - Exclude Weekends: Checkbox option
 * - Time Zone: Selector for time zone
 */

interface ScheduledAlertDetailsProps {
  /** Function to update KPI form data */
  setKpiFormData: (data: KPIFormData | ((prev: KPIFormData) => KPIFormData)) => void;
}

export const ScheduledAlertDetails = ({ setKpiFormData }: ScheduledAlertDetailsProps) => {
  const [frequency, setFrequency] = useState<string>('');
  const [hour, setHour] = useState<string>('');
  const [minute, setMinute] = useState<string>('');
  const [excludeWeekends, setExcludeWeekends] = useState(false);
  const [timeZone, setTimeZone] = useState<string>('');

  const handleFrequencyChange = (value: string | null) => {
    if (value) {
      setFrequency(value);
      setKpiFormData((prev) => ({
        ...prev,
        alertDetails: {
          ...prev.alertDetails,
          frequency: value as AlertFrequency,
        } as ScheduledAlertDetailsType,
      }));
    }
  };

  const handleHourChange = (value: string | null) => {
    if (value) {
      setHour(value);
      setKpiFormData((prev) => ({
        ...prev,
        alertDetails: {
          ...prev.alertDetails,
          hour: value,
        } as ScheduledAlertDetailsType,
      }));
    }
  };

  const handleMinuteChange = (value: string | null) => {
    if (value) {
      setMinute(value);
      setKpiFormData((prev) => ({
        ...prev,
        alertDetails: {
          ...prev.alertDetails,
          minute: value,
        } as ScheduledAlertDetailsType,
      }));
    }
  };

  const handleExcludeWeekendsChange = (checked: boolean) => {
    setExcludeWeekends(checked);
    setKpiFormData((prev) => ({
      ...prev,
      alertDetails: {
        ...prev.alertDetails,
        excludeWeekends: checked,
      } as ScheduledAlertDetailsType,
    }));
  };

  const handleTimeZoneChange = (value: string | null) => {
    if (value) {
      setTimeZone(value);
      setKpiFormData((prev) => ({
        ...prev,
        alertDetails: {
          ...prev.alertDetails,
          timeZone: value,
        } as ScheduledAlertDetailsType,
      }));
    }
  };

  return (
    <Stack gap="md">
      {/* Frequency and Time Row */}
      <Flex gap="xs" align="flex-end" wrap="wrap">
        <Text size="sm" fw={500} style={{ alignSelf: 'flex-end', lineHeight: '36px' }}>
          Send every
        </Text>
        <Select
          placeholder="Select frequency"
          value={frequency}
          onChange={handleFrequencyChange}
          data={FREQUENCY_OPTIONS}
          style={{ width: '150px' }}
        />
        <Text size="sm" fw={500} style={{ alignSelf: 'flex-end', lineHeight: '36px' }}>
          at
        </Text>
        <Select
          placeholder="HH"
          value={hour}
          onChange={handleHourChange}
          data={HOUR_OPTIONS}
          style={{ width: '80px' }}
        />
        <Text size="sm" fw={500} style={{ alignSelf: 'flex-end', lineHeight: '36px' }}>
          :
        </Text>
        <Select
          placeholder="MM"
          value={minute}
          onChange={handleMinuteChange}
          data={MINUTE_OPTIONS}
          style={{ width: '80px' }}
        />
        <Text size="sm" fw={500} style={{ alignSelf: 'flex-end', lineHeight: '36px' }}>
          hours
        </Text>
      </Flex>

      {/* Exclude Weekends Checkbox */}
      <Checkbox
        label="Exclude weekends"
        checked={excludeWeekends}
        onChange={(event) => handleExcludeWeekendsChange(event.currentTarget.checked)}
      />

      {/* Time Zone Selector */}
      <Stack gap="xs">
        <Text size="sm" fw={500}>
          Time Zone
        </Text>
        <Select
          placeholder="Select time zone"
          value={timeZone}
          onChange={handleTimeZoneChange}
          data={TIME_ZONE_OPTIONS}
          searchable
        />
      </Stack>
    </Stack>
  );
};

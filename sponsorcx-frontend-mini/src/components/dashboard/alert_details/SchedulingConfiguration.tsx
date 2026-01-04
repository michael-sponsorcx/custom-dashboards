import { Stack, Text, Select, Flex, Checkbox } from '@mantine/core';
import { useState } from 'react';

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
 * SchedulingConfiguration Component
 *
 * Reusable component for configuring alert scheduling options.
 * Used in both ScheduledAlertDetails and AttributeScheduledAlertDetails.
 *
 * Fields:
 * - Frequency: How often to send (hourly, daily, weekly, monthly)
 * - Time: Hour (00-23) and Minute (00, 05, 10, ..., 55) selection
 * - Exclude Weekends: Checkbox option
 * - Time Zone: Selector for time zone
 */
export const SchedulingConfiguration = () => {
  const [excludeWeekends, setExcludeWeekends] = useState(false);

  return (
    <>
      {/* Frequency and Time Row */}
      <Flex gap="xs" align="flex-end" wrap="wrap">
        <Text size="sm" fw={500} style={{ alignSelf: 'flex-end', lineHeight: '36px' }}>
          Send every
        </Text>
        <Select
          placeholder="Select frequency"
          data={[
            { value: 'hourly', label: 'Hourly' },
            { value: 'daily', label: 'Daily' },
            { value: 'weekly', label: 'Weekly' },
            { value: 'monthly', label: 'Monthly' },
          ]}
          style={{ width: '150px' }}
        />
        <Text size="sm" fw={500} style={{ alignSelf: 'flex-end', lineHeight: '36px' }}>
          at
        </Text>
        <Select
          placeholder="HH"
          data={HOUR_OPTIONS}
          style={{ width: '80px' }}
        />
        <Text size="sm" fw={500} style={{ alignSelf: 'flex-end', lineHeight: '36px' }}>
          :
        </Text>
        <Select
          placeholder="MM"
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
        onChange={(event) => setExcludeWeekends(event.currentTarget.checked)}
      />

      {/* Time Zone Selector */}
      <Stack gap="xs">
        <Text size="sm" fw={500}>
          Time Zone
        </Text>
        <Select
          placeholder="Select time zone"
          data={TIME_ZONE_OPTIONS}
          searchable
        />
      </Stack>
    </>
  );
};

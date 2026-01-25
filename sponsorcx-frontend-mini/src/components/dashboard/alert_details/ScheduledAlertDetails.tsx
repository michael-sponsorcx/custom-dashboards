import { useState } from 'react';
import { Stack, Text, Select, Flex, Checkbox } from '@mantine/core';
import { FREQUENCY_OPTIONS, HOUR_OPTIONS, MINUTE_OPTIONS, TIME_ZONE_OPTIONS } from '../../../constants/timeOptions';
import { FrequencyInterval } from '../../../types/backend-graphql';
import type { KPIFormData, ScheduledAlertDetails as ScheduledAlertDetailsType } from '../../../types/kpi-alerts';

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
          frequency: value as FrequencyInterval,
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

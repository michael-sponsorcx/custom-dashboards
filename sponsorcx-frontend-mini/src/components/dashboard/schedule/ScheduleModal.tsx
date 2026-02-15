import { Modal, Button, Divider, Group, ScrollArea, Stack, Text, TextInput, Checkbox, Select, Flex, Badge, CloseButton } from '@mantine/core';
import { useState, useEffect } from 'react';
import { notifications } from '@mantine/notifications';
import { DaySelector } from './DaySelector';
import { HOUR_OPTIONS, MINUTE_OPTIONS, TIME_ZONE_OPTIONS } from '../../../constants/timeOptions';
import { type DashboardScheduleFormData, type DayOfWeek, AttachmentType, type FrequencyInterval } from '../../../types/dashboard-schedules';
import { createDashboardSchedule, updateDashboardSchedule } from '../../../api';
import type { DashboardSchedule } from '../../../types/backend-graphql';

interface ScheduleModalProps {
  opened: boolean;
  onClose: () => void;
  organizationId: string;
  dashboardId: string;
  userId: string;
  schedule?: DashboardSchedule | null;
}

// Frequency interval options
const FREQUENCY_INTERVAL_OPTIONS = [
  { value: 'n_minute', label: 'N Minutes' },
  { value: 'hour', label: 'Hour' },
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

// Minute interval options (5, 10, 15, ..., 45)
const MINUTE_INTERVAL_OPTIONS = Array.from({ length: 9 }, (_, i) => {
  const value = ((i + 1) * 5).toString();
  return { value, label: value };
});

// Hour interval options (1-12)
const HOUR_INTERVAL_OPTIONS = Array.from({ length: 12 }, (_, i) => {
  const value = (i + 1).toString();
  return { value, label: value };
});

// Attachment type options
const ATTACHMENT_TYPE_OPTIONS: Array<{ value: AttachmentType; label: string }> = [
  { value: AttachmentType.Pdf, label: 'PDF' },
  { value: AttachmentType.Excel, label: 'Excel' },
  { value: AttachmentType.Csv, label: 'CSV' },
];

/**
 * ScheduleModal Component
 *
 * Modal for creating or editing a dashboard report schedule.
 * Follows the same pattern as KPIAlertModal with form state management.
 *
 * Structure:
 * - Header: "Create Schedule" or "Edit Schedule" title with close button
 * - Body: Scrollable content area with all form fields
 * - Footer: Cancel and Create/Update Schedule buttons
 */
const toFormData = (schedule: DashboardSchedule): DashboardScheduleFormData => ({
  scheduleName: schedule.scheduleName,
  comment: schedule.comment ?? undefined,
  frequencyInterval: schedule.frequencyInterval as FrequencyInterval,
  minuteInterval: schedule.minuteInterval?.toString(),
  hourInterval: schedule.hourInterval?.toString(),
  hour: schedule.scheduleHour?.toString().padStart(2, '0'),
  minute: schedule.scheduleMinute?.toString().padStart(2, '0'),
  selectedDays: (schedule.selectedDays ?? []).filter((d): d is DayOfWeek => d != null),
  excludeWeekends: schedule.excludeWeekends ?? false,
  monthDates: (schedule.monthDates ?? []).filter((d): d is number => d != null).join(','),
  timeZone: schedule.timeZone ?? undefined,
  attachmentType: (schedule.attachmentType as AttachmentType) ?? undefined,
  recipients: (schedule.recipients ?? []).filter((r): r is string => r != null),
});

export const ScheduleModal = ({ opened, onClose, organizationId, dashboardId, userId, schedule }: ScheduleModalProps) => {
  const isEditMode = !!schedule;
  const [scheduleFormData, setScheduleFormData] = useState<DashboardScheduleFormData>({});
  const [emailInput, setEmailInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (opened && schedule) {
      setScheduleFormData(toFormData(schedule));
    }
  }, [opened, schedule]);

  const resetModalState = () => {
    setScheduleFormData({});
    setEmailInput('');
  };

  const handleCancel = () => {
    resetModalState();
    onClose();
  };

  const handleScheduleNameChange = (value: string) => {
    setScheduleFormData((prev) => ({
      ...prev,
      scheduleName: value,
    }));
  };

  const handleCommentChange = (value: string) => {
    setScheduleFormData((prev) => ({
      ...prev,
      comment: value,
    }));
  };

  const handleFrequencyIntervalChange = (value: string | null) => {
    if (value) {
      setScheduleFormData((prev) => ({
        ...prev,
        frequencyInterval: value as FrequencyInterval,
      }));
    }
  };

  const handleMinuteIntervalChange = (value: string | null) => {
    if (value) {
      setScheduleFormData((prev) => ({
        ...prev,
        minuteInterval: value,
      }));
    }
  };

  const handleHourIntervalChange = (value: string | null) => {
    if (value) {
      setScheduleFormData((prev) => ({
        ...prev,
        hourInterval: value,
      }));
    }
  };

  const handleHourChange = (value: string | null) => {
    if (value) {
      setScheduleFormData((prev) => ({
        ...prev,
        hour: value,
      }));
    }
  };

  const handleMinuteChange = (value: string | null) => {
    if (value) {
      setScheduleFormData((prev) => ({
        ...prev,
        minute: value,
      }));
    }
  };

  const handleExcludeWeekendsChange = (checked: boolean) => {
    setScheduleFormData((prev) => ({
      ...prev,
      excludeWeekends: checked,
    }));
  };

  const handleMonthDatesChange = (value: string) => {
    setScheduleFormData((prev) => ({
      ...prev,
      monthDates: value,
    }));
  };

  const handleDaysChange = (days: DayOfWeek[]) => {
    setScheduleFormData((prev) => ({
      ...prev,
      selectedDays: days,
    }));
  };

  const handleTimeZoneChange = (value: string | null) => {
    if (value) {
      setScheduleFormData((prev) => ({
        ...prev,
        timeZone: value,
      }));
    }
  };

  const handleAttachmentTypeChange = (value: string | null) => {
    if (value) {
      setScheduleFormData((prev) => ({
        ...prev,
        attachmentType: value as AttachmentType,
      }));
    }
  };

  const handleEmailKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && emailInput.trim()) {
      event.preventDefault();
      const newRecipients = [...(scheduleFormData.recipients || []), emailInput.trim()];
      setScheduleFormData((prev) => ({
        ...prev,
        recipients: newRecipients,
      }));
      setEmailInput('');
    }
  };

  const handleRemoveRecipient = (index: number) => {
    const newRecipients = (scheduleFormData.recipients || []).filter((_, i) => i !== index);
    setScheduleFormData((prev) => ({
      ...prev,
      recipients: newRecipients,
    }));
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!scheduleFormData.scheduleName?.trim()) {
      notifications.show({
        title: 'Validation Error',
        message: 'Please enter a schedule name',
        color: 'red',
        autoClose: 3000,
      });
      return;
    }

    if (!scheduleFormData.frequencyInterval) {
      notifications.show({
        title: 'Validation Error',
        message: 'Please select a frequency interval',
        color: 'red',
        autoClose: 3000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditMode) {
        await updateDashboardSchedule(schedule.id, scheduleFormData, dashboardId, userId);
      } else {
        await createDashboardSchedule(scheduleFormData, organizationId, dashboardId, userId);
      }

      notifications.show({
        title: isEditMode ? 'Schedule Updated' : 'Schedule Created',
        message: isEditMode ? 'Your schedule has been updated successfully' : 'Your schedule has been created successfully',
        color: 'green',
        autoClose: 3000,
      });

      resetModalState();
      onClose();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: `Failed to ${isEditMode ? 'update' : 'create'} schedule. Please try again.`,
        color: 'red',
        autoClose: 5000,
      });
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} schedule:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    resetModalState();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleModalClose}
      size="lg"
      centered
      withCloseButton={true}
      title={<Text fw={700} size="xl">{isEditMode ? 'Edit Schedule' : 'Create Schedule'}</Text>}
    >
      <Divider mb="lg" />

      {/* Body Section - Scrollable Content */}
      <ScrollArea style={{ height: 400 }} mb="lg">
        <Stack gap="xl">
          {/* Schedule Name */}
          <Stack gap="xs">
            <Text size="sm" fw={500}>
              Schedule Name
            </Text>
            <TextInput
              placeholder="Enter schedule name"
              value={scheduleFormData.scheduleName || ''}
              onChange={(event) => handleScheduleNameChange(event.currentTarget.value)}
            />
          </Stack>

          {/* Comment */}
          <Stack gap="xs">
            <Text size="sm" fw={500}>
              Comment
            </Text>
            <TextInput
              placeholder="Ex. Confidential. Do not share."
              value={scheduleFormData.comment || ''}
              onChange={(event) => handleCommentChange(event.currentTarget.value)}
            />
          </Stack>

          {/* Schedule Frequency Section */}
          <Stack gap="xs">
            <Text size="sm" fw={500}>
              Schedule
            </Text>
            <Flex gap="xs" align="flex-end" wrap="wrap">
              <Text size="sm" fw={500} style={{ alignSelf: 'flex-end', lineHeight: '36px' }}>
                Send every
              </Text>
              <Select
                placeholder="Select interval"
                value={scheduleFormData.frequencyInterval || null}
                onChange={handleFrequencyIntervalChange}
                data={FREQUENCY_INTERVAL_OPTIONS}
                style={{ width: '150px' }}
              />

              {/* N Minutes variation */}
              {scheduleFormData.frequencyInterval === 'n_minute' && (
                <>
                  <Select
                    placeholder="Select minutes"
                    value={scheduleFormData.minuteInterval || null}
                    onChange={handleMinuteIntervalChange}
                    data={MINUTE_INTERVAL_OPTIONS}
                    style={{ width: '100px' }}
                  />
                  <Text size="sm" fw={500} style={{ alignSelf: 'flex-end', lineHeight: '36px' }}>
                    minutes
                  </Text>
                </>
              )}

              {/* Hour variation */}
              {scheduleFormData.frequencyInterval === 'hour' && (
                <>
                  <Select
                    placeholder="Select hours"
                    value={scheduleFormData.hourInterval || null}
                    onChange={handleHourIntervalChange}
                    data={HOUR_INTERVAL_OPTIONS}
                    style={{ width: '100px' }}
                  />
                  <Text size="sm" fw={500} style={{ alignSelf: 'flex-end', lineHeight: '36px' }}>
                    hour
                  </Text>
                </>
              )}

              {/* Day variation */}
              {scheduleFormData.frequencyInterval === 'day' && (
                <>
                  <Text size="sm" fw={500} style={{ alignSelf: 'flex-end', lineHeight: '36px' }}>
                    at
                  </Text>
                  <Select
                    placeholder="HH"
                    value={scheduleFormData.hour || null}
                    onChange={handleHourChange}
                    data={HOUR_OPTIONS}
                    style={{ width: '80px' }}
                  />
                  <Text size="sm" fw={500} style={{ alignSelf: 'flex-end', lineHeight: '36px' }}>
                    :
                  </Text>
                  <Select
                    placeholder="MM"
                    value={scheduleFormData.minute || null}
                    onChange={handleMinuteChange}
                    data={MINUTE_OPTIONS}
                    style={{ width: '80px' }}
                  />
                  <Text size="sm" fw={500} style={{ alignSelf: 'flex-end', lineHeight: '36px' }}>
                    hours
                  </Text>
                </>
              )}

              {/* Week variation */}
              {scheduleFormData.frequencyInterval === 'week' && (
                <>
                  <Text size="sm" fw={500} style={{ alignSelf: 'flex-end', lineHeight: '36px' }}>
                    at
                  </Text>
                  <Select
                    placeholder="HH"
                    value={scheduleFormData.hour || null}
                    onChange={handleHourChange}
                    data={HOUR_OPTIONS}
                    style={{ width: '80px' }}
                  />
                  <Text size="sm" fw={500} style={{ alignSelf: 'flex-end', lineHeight: '36px' }}>
                    :
                  </Text>
                  <Select
                    placeholder="MM"
                    value={scheduleFormData.minute || null}
                    onChange={handleMinuteChange}
                    data={MINUTE_OPTIONS}
                    style={{ width: '80px' }}
                  />
                  <Text size="sm" fw={500} style={{ alignSelf: 'flex-end', lineHeight: '36px' }}>
                    hours
                  </Text>
                </>
              )}

              {/* Month variation */}
              {scheduleFormData.frequencyInterval === 'month' && (
                <>
                  <Text size="sm" fw={500} style={{ alignSelf: 'flex-end', lineHeight: '36px' }}>
                    at
                  </Text>
                  <Select
                    placeholder="HH"
                    value={scheduleFormData.hour || null}
                    onChange={handleHourChange}
                    data={HOUR_OPTIONS}
                    style={{ width: '80px' }}
                  />
                  <Text size="sm" fw={500} style={{ alignSelf: 'flex-end', lineHeight: '36px' }}>
                    :
                  </Text>
                  <Select
                    placeholder="MM"
                    value={scheduleFormData.minute || null}
                    onChange={handleMinuteChange}
                    data={MINUTE_OPTIONS}
                    style={{ width: '80px' }}
                  />
                  <Text size="sm" fw={500} style={{ alignSelf: 'flex-end', lineHeight: '36px' }}>
                    hours
                  </Text>
                </>
              )}
            </Flex>

            {/* Exclude Weekends - Only for Day */}
            {scheduleFormData.frequencyInterval === 'day' && (
              <Checkbox
                label="Exclude Weekends"
                checked={scheduleFormData.excludeWeekends || false}
                onChange={(event) => handleExcludeWeekendsChange(event.currentTarget.checked)}
              />
            )}

            {/* Month Dates Input - Only for Month */}
            {scheduleFormData.frequencyInterval === 'month' && (
              <TextInput
                placeholder="Enter dates separated by commas (e.g., 2,10,15)"
                value={scheduleFormData.monthDates || ''}
                onChange={(event) => handleMonthDatesChange(event.currentTarget.value)}
              />
            )}
          </Stack>

          {/* Day Selector - For N Minutes, Hour, and Week */}
          {(scheduleFormData.frequencyInterval === 'n_minute' ||
            scheduleFormData.frequencyInterval === 'hour' ||
            scheduleFormData.frequencyInterval === 'week') && (
            <Stack gap="xs">
              <Text size="sm" fw={500}>
                Days of Week
              </Text>
              <DaySelector
                selectedDays={scheduleFormData.selectedDays || []}
                onChange={handleDaysChange}
              />
            </Stack>
          )}

          {/* Time Zone - For Day, Week, and Month */}
          {(scheduleFormData.frequencyInterval === 'day' ||
            scheduleFormData.frequencyInterval === 'week' ||
            scheduleFormData.frequencyInterval === 'month') && (
            <Stack gap="xs">
              <Text size="sm" fw={500}>
                Time Zone
              </Text>
              <Select
                placeholder="Select time zone"
                value={scheduleFormData.timeZone || null}
                onChange={handleTimeZoneChange}
                data={TIME_ZONE_OPTIONS}
                searchable
              />
            </Stack>
          )}

          {/* Attachment Type */}
          <Stack gap="xs">
            <Text size="sm" fw={500}>
              Attachment Type
            </Text>
            <Select
              placeholder="Select attachment type"
              value={scheduleFormData.attachmentType || null}
              onChange={handleAttachmentTypeChange}
              data={ATTACHMENT_TYPE_OPTIONS}
            />
          </Stack>

          {/* Recipients */}
          <Stack gap="xs">
            <Text size="sm" fw={500}>
              Recipients
            </Text>
            <Text size="sm" c="dimmed">
              Type an email and press Enter
            </Text>
            <TextInput
              placeholder="Enter email address"
              value={emailInput}
              onChange={(event) => setEmailInput(event.currentTarget.value)}
              onKeyDown={handleEmailKeyDown}
            />
            {scheduleFormData.recipients && scheduleFormData.recipients.length > 0 && (
              <Group gap="xs">
                {scheduleFormData.recipients.map((email, index) => (
                  <Badge
                    key={index}
                    size="lg"
                    rightSection={
                      <CloseButton
                        size="xs"
                        onClick={() => handleRemoveRecipient(index)}
                        aria-label={`Remove ${email}`}
                      />
                    }
                    style={{ paddingRight: 3 }}
                  >
                    {email}
                  </Badge>
                ))}
              </Group>
            )}
          </Stack>
        </Stack>
      </ScrollArea>

      {/* Footer Section */}
      <Group justify="flex-end" gap="sm">
        <Button variant="default" onClick={handleCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} loading={isSubmitting} disabled={isSubmitting}>
          {isEditMode ? 'Update Schedule' : 'Create Schedule'}
        </Button>
      </Group>
    </Modal>
  );
};

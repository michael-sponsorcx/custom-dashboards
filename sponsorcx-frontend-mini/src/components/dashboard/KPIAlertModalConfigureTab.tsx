import { Stack, Text, Title, Textarea, TextInput, Badge, CloseButton, Group } from '@mantine/core';
import { useState } from 'react';
import type { KPIAlertModalConfigureTabProps, ComparisonOperator, ThresholdAlertDetails as ThresholdAlertDetailsType } from '../../types/kpi-alerts';
import { ThresholdAlertDetails } from './alert_details/ThresholdAlertDetails';
import { ScheduledAlertDetails } from './alert_details/ScheduledAlertDetails';
// import { AttributeThresholdAlertDetails } from './alert_details/AttributeThresholdAlertDetails';
// import { AttributeScheduledAlertDetails } from './alert_details/AttributeScheduledAlertDetails';

/**
 * KPIAlertModalConfigureTab Component
 *
 * Configuration tab content for the KPI Alert Modal.
 * This is where users will configure the details of their selected alert type.
 * The alert details section changes based on the selected alert type.
 */
export const KPIAlertModalConfigureTab = ({ alertTypeId, alertTypeTitle: _alertTypeTitle, alertTypeExample: _alertTypeExample, kpiFormData: _kpiFormData, setKpiFormData }: KPIAlertModalConfigureTabProps) => {
  const [alertName, setAlertName] = useState('');
  const [condition, setCondition] = useState<string>('');
  const [thresholdValue, setThresholdValue] = useState<string>('');
  const [customMessage, setCustomMessage] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [recipients, setRecipients] = useState<string[]>([]);

  const handleAlertNameChange = (value: string) => {
    setAlertName(value);

    // Update KPI form data with alert details
    setKpiFormData((prev) => ({
      ...prev,
      alertDetails: {
        ...prev.alertDetails,
        alertName: value,
      } as ThresholdAlertDetailsType,
    }));
  };

  const handleConditionChange = (newCondition: ComparisonOperator) => {
    setCondition(newCondition);

    // Update KPI form data with alert details
    setKpiFormData((prev) => ({
      ...prev,
      alertDetails: {
        ...prev.alertDetails,
        condition: newCondition,
      } as ThresholdAlertDetailsType,
    }));
  };

  const handleThresholdValueChange = (value: string) => {
    setThresholdValue(value);

    // Update KPI form data with alert details
    setKpiFormData((prev) => ({
      ...prev,
      alertDetails: {
        ...prev.alertDetails,
        thresholdValue: parseFloat(value) || 0,
      } as ThresholdAlertDetailsType,
    }));
  };

  const handleEmailKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && emailInput.trim()) {
      event.preventDefault();
      const newRecipients = [...recipients, emailInput.trim()];
      setRecipients(newRecipients);
      setEmailInput('');

      // Update KPI form data
      setKpiFormData((prev) => ({
        ...prev,
        recipients: newRecipients,
      }));
    }
  };

  const handleRemoveRecipient = (index: number) => {
    const newRecipients = recipients.filter((_, i) => i !== index);
    setRecipients(newRecipients);

    // Update KPI form data
    setKpiFormData((prev) => ({
      ...prev,
      recipients: newRecipients,
    }));
  };

  const handleCustomMessageChange = (value: string) => {
    setCustomMessage(value);

    // Update KPI form data
    setKpiFormData((prev) => ({
      ...prev,
      alertBodyContent: value,
    }));
  };

  return (
    <Stack gap="xl">
      {/* Section 1: Alert Details */}
      <Stack gap="md">
        <Title order={3}>Alert Details</Title>
        {/* Alert Name - Common to all alert types */}
        <Stack gap="xs">
          <Text size="sm" fw={500}>
            Alert Name
          </Text>
          <TextInput
            placeholder="e.g. 'Alert on total sign net revenue'"
            value={alertName}
            onChange={(event) => handleAlertNameChange(event.currentTarget.value)}
          />
        </Stack>

        {/* Alert Type Specific Details */}
        {alertTypeId === 'threshold' && (
          <ThresholdAlertDetails
            condition={condition}
            thresholdValue={thresholdValue}
            onConditionChange={handleConditionChange}
            onThresholdValueChange={handleThresholdValueChange}
          />
        )}
        {alertTypeId === 'scheduled' && <ScheduledAlertDetails />}
        {/* {alertTypeId === 'attribute-threshold' && <AttributeThresholdAlertDetails />}
        {alertTypeId === 'attribute-scheduled' && <AttributeScheduledAlertDetails />}
        {alertTypeId === 'anomaly' && (
          <Text size="sm" c="dimmed" fs="italic">
            Anomaly alert details will be added here
          </Text>
        )} */}
      </Stack>

      {/* Section 2: Alert Body Content */}
      <Stack gap="md">
        <Title order={3}>Alert Body Content</Title>
        <Text size="sm" c="dimmed">
          Add a custom message to be sent in the alert (Optional)
        </Text>
        <Textarea
          placeholder="Enter your custom message here..."
          value={customMessage}
          onChange={(event) => handleCustomMessageChange(event.currentTarget.value)}
          minRows={4}
          autosize
        />
      </Stack>

      {/* Section 3: Manage Recipients */}
      <Stack gap="md">
        <Title order={3}>Manage Recipients</Title>
        <Text size="sm" c="dimmed">
          Send alerts to users or groups
        </Text>
        <TextInput
          placeholder="Type an email and press Enter"
          value={emailInput}
          onChange={(event) => setEmailInput(event.currentTarget.value)}
          onKeyDown={handleEmailKeyDown}
        />
        {recipients.length > 0 && (
          <Group gap="xs">
            {recipients.map((email, index) => (
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

      {/* Section 4: KPI Details */}
      <Stack gap="md">
        <Title order={3}>KPI Details</Title>
        <Text size="sm" c="dimmed">
          Details about the KPI metric being monitored
        </Text>
        {/* Placeholder for KPI details - to be filled in later */}
        <Text size="sm" c="dimmed" fs="italic">
          KPI metric details will be displayed here
        </Text>
      </Stack>
    </Stack>
  );
};

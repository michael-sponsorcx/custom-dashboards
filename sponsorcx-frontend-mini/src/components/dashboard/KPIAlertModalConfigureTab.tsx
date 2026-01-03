import { Stack, Text, Title, Textarea, TextInput, Badge, CloseButton, Group } from '@mantine/core';
import { useState } from 'react';
import type { KPIAlertTypeId } from './KPIAlertModal';
import { ThresholdAlertDetails } from './alert_details/ThresholdAlertDetails';
import { ScheduledAlertDetails } from './alert_details/ScheduledAlertDetails';

interface KPIAlertModalConfigureTabProps {
  /** ID of the selected alert type */
  alertTypeId: KPIAlertTypeId;
  /** Title of the selected alert type */
  alertTypeTitle: string;
  /** Example description of the selected alert type */
  alertTypeExample: string;
}

/**
 * KPIAlertModalConfigureTab Component
 *
 * Configuration tab content for the KPI Alert Modal.
 * This is where users will configure the details of their selected alert type.
 * The alert details section changes based on the selected alert type.
 */
export function KPIAlertModalConfigureTab({ alertTypeId, alertTypeTitle: _alertTypeTitle, alertTypeExample: _alertTypeExample }: KPIAlertModalConfigureTabProps) {
  const [customMessage, setCustomMessage] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [recipients, setRecipients] = useState<string[]>([]);

  const handleEmailKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && emailInput.trim()) {
      event.preventDefault();
      setRecipients([...recipients, emailInput.trim()]);
      setEmailInput('');
    }
  };

  const handleRemoveRecipient = (index: number) => {
    setRecipients(recipients.filter((_, i) => i !== index));
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
          <TextInput placeholder="e.g. 'Alert on total sign net revenue'" />
        </Stack>

        {/* Alert Type Specific Details */}
        {alertTypeId === 'threshold' && <ThresholdAlertDetails />}
        {alertTypeId === 'scheduled' && <ScheduledAlertDetails />}
        {alertTypeId === 'attribute-threshold' && (
          <Text size="sm" c="dimmed" fs="italic">
            Attribute threshold alert details will be added here
          </Text>
        )}
        {alertTypeId === 'attribute-scheduled' && (
          <Text size="sm" c="dimmed" fs="italic">
            Attribute scheduled alert details will be added here
          </Text>
        )}
        {alertTypeId === 'anomaly' && (
          <Text size="sm" c="dimmed" fs="italic">
            Anomaly alert details will be added here
          </Text>
        )}
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
          onChange={(event) => setCustomMessage(event.currentTarget.value)}
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
}

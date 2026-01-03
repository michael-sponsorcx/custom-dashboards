import { Modal, Stack, Title, Text, Button, Divider, Group, SimpleGrid, Tabs } from '@mantine/core';
import { useState } from 'react';
import { KPIAlertTile } from './KPIAlertTile';
import { KPIAlertModalConfigureTab } from './KPIAlertModalConfigureTab';

interface KPIAlertModalProps {
  opened: boolean;
  onClose: () => void;
  graphId: string | null;
  graphName: string;
}

/**
 * Type of all possible KPI Alert IDs
 */
export type KPIAlertTypeId =
  | 'threshold'
  | 'scheduled'
  | 'attribute-threshold'
  | 'attribute-scheduled'
  | 'anomaly';

/**
 * KPI Alert Type Definition
 */
interface KPIAlertType {
  id: KPIAlertTypeId;
  title: string;
  example: string;
}

/**
 * Fixed list of KPI alert types available to users
 */
const KPI_ALERT_TYPES: KPIAlertType[] = [
  {
    id: 'threshold',
    title: 'KPI crosses a set limit',
    example: 'Receive an alert when monthly sales is less than 50,000',
  },
  {
    id: 'scheduled',
    title: 'Regular KPI updates',
    example: 'Receive a weekly update from monthly sales every Monday at 9 a.m.',
  },
  {
    id: 'attribute-threshold',
    title: 'Values of an attribute crosses a set limit',
    example: 'Receive an alert if monthly sales for any product decreases by 10%',
  },
  {
    id: 'attribute-scheduled',
    title: 'Regular updates on values of an attribute',
    example: 'Receive a daily update monthly sales for any product at 9am',
  },
  {
    id: 'anomaly',
    title: 'Unexpected changes in KPI',
    example: 'Receive an alert if monthly sales is outside the expected range',
  },
];

/**
 * KPIAlertModal Component
 *
 * Modal for creating and managing KPI alerts for a specific graph.
 * KPI alerts can notify users when certain thresholds or conditions are met.
 *
 * Structure:
 * - Header: "Create KPI Alert" (subtitle) + "Select an alert type" (main title)
 * - Body: Alert configuration content
 * - Footer: Cancel and Next buttons
 */
export function KPIAlertModal({ opened, onClose, graphId: _graphId, graphName: _graphName }: KPIAlertModalProps) {
  const [selectedAlertType, setSelectedAlertType] = useState<KPIAlertType | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>('select-type');

  const resetModalState = () => {
    setSelectedAlertType(null);
    setActiveTab('select-type');
  };

  const handleCancel = () => {
    resetModalState();
    onClose();
  };

  const handleBack = () => {
    setActiveTab('select-type');
  };

  const handleSelectAlertType = (alertTypeId: string) => {
    const alertType = KPI_ALERT_TYPES.find((type) => type.id === alertTypeId);
    if (alertType) {
      setSelectedAlertType(alertType);
      console.log('Selected alert type:', alertType);
    }
  };

  const handleNext = () => {
    if (selectedAlertType) {
      setActiveTab('configure');
      console.log('Moving to configure tab with alert type:', selectedAlertType);
    }
  };

  const handleCreateAlert = () => {
    console.log('Creating alert with type:', selectedAlertType);
    // TODO: Implement alert creation logic
    resetModalState();
    onClose();
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
      title={
        <Stack gap="xs">
          <Text size="sm" c="dimmed" fw={500}>
            Create KPI Alert
          </Text>
          <Title order={2}>{activeTab === 'select-type' ? 'Select an alert type' : 'Configure'}</Title>
        </Stack>
      }
    >
      <Divider mb="lg" />

      {/* Body Section - Tabs */}
      <Tabs value={activeTab} mb="xl">
        <Tabs.List style={{ pointerEvents: 'none', cursor: 'default' }}>
          <Tabs.Tab value="select-type" style={{ flex: 1 }}>
            {/* Empty tab - no text */}
          </Tabs.Tab>
          <Tabs.Tab value="configure" style={{ flex: 1 }}>
            {/* Empty tab - no text */}
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="select-type" pt="md">
          <SimpleGrid cols={2} spacing="md">
            {KPI_ALERT_TYPES.map((alertType) => (
              <KPIAlertTile
                key={alertType.id}
                title={alertType.title}
                example={alertType.example}
                isSelected={selectedAlertType?.id === alertType.id}
                onClick={() => handleSelectAlertType(alertType.id)}
              />
            ))}
          </SimpleGrid>
        </Tabs.Panel>

        <Tabs.Panel value="configure" pt="md">
          {selectedAlertType && (
            <KPIAlertModalConfigureTab
              alertTypeId={selectedAlertType.id}
              alertTypeTitle={selectedAlertType.title}
              alertTypeExample={selectedAlertType.example}
            />
          )}
        </Tabs.Panel>
      </Tabs>

      {/* Footer Section */}
      <Group justify="flex-end" gap="sm">
        {activeTab === 'select-type' ? (
          <Button variant="default" onClick={handleCancel}>
            Cancel
          </Button>
        ) : (
          <Button variant="default" onClick={handleBack}>
            Back
          </Button>
        )}
        {activeTab === 'select-type' ? (
          <Button onClick={handleNext}>Next</Button>
        ) : (
          <Button onClick={handleCreateAlert}>Create Alert</Button>
        )}
      </Group>
    </Modal>
  );
}

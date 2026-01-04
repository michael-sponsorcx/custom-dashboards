import { Modal, Stack, Title, Text, Button, Divider, Group, SimpleGrid, Tabs } from '@mantine/core';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { KPIAlertTile } from './KPIAlertTile';
import { KPIAlertModalConfigureTab } from './KPIAlertModalConfigureTab';
import type { KPIAlertModalProps, KPIAlertTypeDefinition, KPIFormData } from '../../types/kpi-alerts';

/**
 * Fixed list of KPI alert types available to users
 */
const KPI_ALERT_TYPES: KPIAlertTypeDefinition[] = [
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
  // {
  //   id: 'attribute-threshold',
  //   title: 'Values of an attribute crosses a set limit',
  //   example: 'Receive an alert if monthly sales for any product decreases by 10%',
  // },
  // {
  //   id: 'attribute-scheduled',
  //   title: 'Regular updates on values of an attribute',
  //   example: 'Receive a daily update monthly sales for any product at 9am',
  // },
  // {
  //   id: 'anomaly',
  //   title: 'Unexpected changes in KPI',
  //   example: 'Receive an alert if monthly sales is outside the expected range',
  // },
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
export const KPIAlertModal = ({ opened, onClose, graphId, graphName: _graphName }: KPIAlertModalProps) => {
  const [selectedAlertType, setSelectedAlertType] = useState<KPIAlertTypeDefinition | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>('select-type');
  const [kpiFormData, setKpiFormData] = useState<KPIFormData>({});

  const resetModalState = () => {
    setSelectedAlertType(null);
    setActiveTab('select-type');
    setKpiFormData({});
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
      if (process.env.NODE_ENV === 'development') {
        // console.log('Selected alert type:', alertType);
      }
    }
  };

  const handleNext = () => {
    if (selectedAlertType) {
      setActiveTab('configure');
      // Set the alertType in the KPI form data to the selected alert type's id
      setKpiFormData((prev) => ({
        ...prev,
        alertType: selectedAlertType.id,
      }));
      // console.log('Moving to configure tab with alert type:', selectedAlertType);
    }
  };

  const handleCreateAlert = async () => {
    try {
      if (!selectedAlertType || !graphId) {
        throw new Error('Missing required alert information');
      }

      // Log the alert object
      console.log('KPI Form Data:', kpiFormData);

      // TODO: Implement actual API call here
      // await createKPIAlert(alertObject);

      // Show success notification
      notifications.show({
        title: 'Alert Created',
        message: 'Your KPI alert has been created successfully',
        color: 'green',
        autoClose: 3000,
      });

      resetModalState();
      onClose();
    } catch (error) {
      // Show error notification
      notifications.show({
        title: 'Error',
        message: 'Failed to create KPI alert. Please try again.',
        color: 'red',
        autoClose: 5000,
      });
      console.error('Error creating alert:', error);
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

      {/* Body Section - Tab Content */}
      <Tabs value={activeTab}>
        <Tabs.Panel value="select-type">
          <SimpleGrid cols={2} spacing="md" mb="xl">
            {KPI_ALERT_TYPES.map((alertType) => (
              <KPIAlertTile
                key={alertType.id}
                title={alertType.title}
                example={alertType.example}
                isSelected={selectedAlertType?.id === alertType.id}
                onClick={() => handleSelectAlertType(alertType.id)}
                // disabled={alertType.id === 'anomaly'}
              />
            ))}
          </SimpleGrid>
        </Tabs.Panel>

        <Tabs.Panel value="configure">
          {selectedAlertType && (
            <Stack mb="xl">
              <KPIAlertModalConfigureTab
                alertTypeId={selectedAlertType.id}
                setKpiFormData={setKpiFormData}
              />
            </Stack>
          )}
        </Tabs.Panel>

        {/* Tab Progress Bar - Between Body and Footer */}
        <Tabs.List style={{ pointerEvents: 'none', cursor: 'default' }} mb="lg">
          <Tabs.Tab value="select-type" style={{ flex: 1 }}>
            {/* Empty tab - no text */}
          </Tabs.Tab>
          <Tabs.Tab value="configure" style={{ flex: 1 }}>
            {/* Empty tab - no text */}
          </Tabs.Tab>
        </Tabs.List>
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
};

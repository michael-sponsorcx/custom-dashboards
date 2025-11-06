import { Modal, Stack, Title, Button, Group, Stepper } from '@mantine/core';
import { useState, useEffect } from 'react';
import { useDashboardFilterContext } from './context';
import { DataSourceSelection } from './filter_config/DataSourceSelection';
import { CommonFieldsSelection } from './filter_config/CommonFieldsSelection';

interface DashboardFilterModalProps {
  opened: boolean;
  onClose: () => void;
}

/**
 * DashboardFilterModal Component
 *
 * Multi-step modal for configuring dashboard-wide filters:
 * Step 1: Select data sources (views) to filter
 * Step 2: Select common fields across those views
 */
export function DashboardFilterModal({ opened, onClose }: DashboardFilterModalProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedViews, setSelectedViews] = useState<string[]>([]);
  const {
    selectedViews: savedSelectedViews,
    setSelectedViews: saveSelectedViews,
    setAvailableFields,
    reset,
  } = useDashboardFilterContext();

  // Reset to step 0 when modal opens
  useEffect(() => {
    if (opened) {
      setActiveStep(0);
      setSelectedViews(savedSelectedViews);
    }
  }, [opened, savedSelectedViews]);

  const handleNext = () => {
    if (activeStep === 0) {
      // Moving from data source selection to field selection
      setActiveStep(1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleSave = (
    selectedFields: Array<{
      fieldName: string;
      fieldTitle: string;
      fieldType: 'measure' | 'dimension' | 'date';
    }>
  ) => {
    // Save the selected views and available fields
    saveSelectedViews(selectedViews);
    setAvailableFields(selectedFields);
    onClose();
  };

  const handleCancel = () => {
    setActiveStep(0);
    setSelectedViews([]);
    onClose();
  };

  const handleClearFilters = () => {
    reset();
    setSelectedViews([]);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleCancel}
      title={<Title order={3}>Add Dashboard Filters</Title>}
      size="xl"
      centered
    >
      <Stack gap="md">
        <Stepper active={activeStep} size="sm">
          <Stepper.Step label="Select Data Sources" description="Choose views to filter">
            <DataSourceSelection selectedViews={selectedViews} onViewsChange={setSelectedViews} />
          </Stepper.Step>

          <Stepper.Step label="Select Fields" description="Choose common fields">
            <CommonFieldsSelection selectedViews={selectedViews} onSave={handleSave} />
          </Stepper.Step>
        </Stepper>

        <Group justify="space-between" mt="xl">
          <Button variant="default" onClick={handleCancel}>
            Cancel
          </Button>

          <Group>
            {activeStep > 0 && (
              <Button variant="default" onClick={handleBack}>
                Back
              </Button>
            )}

            {activeStep === 0 && (
              <>
                <Button color="red" variant="light" onClick={handleClearFilters}>
                  Clear Filters
                </Button>
                <Button onClick={handleNext} disabled={selectedViews.length === 0}>
                  Next
                </Button>
              </>
            )}
          </Group>
        </Group>
      </Stack>
    </Modal>
  );
}

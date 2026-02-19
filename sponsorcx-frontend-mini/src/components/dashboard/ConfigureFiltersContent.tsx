/**
 * ConfigureFiltersContent — Data source + field selection wizard.
 * Used as the "Configure" tab content inside the filter slideout.
 */

import { Button, Group, Stack, Stepper } from '@mantine/core';
import { useState, useEffect } from 'react';
import { useDashboardFilterStore } from '../../store';
import { DataSourceSelection } from './filter_config/DataSourceSelection';
import { CommonFieldsSelection } from './filter_config/CommonFieldsSelection';

interface ConfigureFiltersContentProps {
  onClose: () => void;
}

export const ConfigureFiltersContent = ({ onClose }: ConfigureFiltersContentProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedViews, setSelectedViews] = useState<string[]>([]);
  const {
    selectedViews: savedSelectedViews,
    setSelectedViews: saveSelectedViews,
    setAvailableFields,
    reset,
  } = useDashboardFilterStore();

  // Reset to step 0 when mounted (slideout opens)
  useEffect(() => {
    setActiveStep(0);
    setSelectedViews(savedSelectedViews);
  }, [savedSelectedViews]);

  const handleNext = () => {
    if (activeStep === 0) {
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
    saveSelectedViews(selectedViews);
    setAvailableFields(selectedFields);
    onClose();
  };

  const handleClearFilters = () => {
    reset();
    setSelectedViews([]);
    onClose();
  };

  return (
    <Stack gap="md">
      <Stepper active={activeStep} size="sm">
        <Stepper.Step label="Data Sources" description="Choose views to filter">
          <DataSourceSelection
            selectedViews={selectedViews}
            onViewsChange={setSelectedViews}
          />
        </Stepper.Step>

        <Stepper.Step label="Select Fields" description="Choose common fields">
          <CommonFieldsSelection
            selectedViews={selectedViews}
            onSave={handleSave}
          />
        </Stepper.Step>
      </Stepper>

      <Group justify="flex-end" mt="md">
        {activeStep > 0 && (
          <Button variant="default" onClick={handleBack}>
            Back
          </Button>
        )}
        {activeStep === 0 && (
          <>
            <Button variant="light" color="red" onClick={handleClearFilters}>
              Clear Filters
            </Button>
            <Button onClick={handleNext} disabled={selectedViews.length === 0}>
              Next
            </Button>
          </>
        )}
      </Group>
    </Stack>
  );
};

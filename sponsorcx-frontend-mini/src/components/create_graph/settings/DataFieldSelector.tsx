import { Stack, Select, Text } from '@mantine/core';
import { useEffect } from 'react';

interface DataFieldSelectorProps {
  /** Available dimensions from the query */
  dimensions: string[];
  /** Available measures from the query */
  measures: string[];

  /** Currently selected primary dimension */
  primaryDimension?: string;
  /** Currently selected secondary dimension (optional) */
  secondaryDimension?: string;
  /** Currently selected measure */
  selectedMeasure?: string;

  /** Whether the current chart type supports secondary dimension (e.g., stacked charts) */
  supportsSecondaryDimension?: boolean;

  /** Callbacks for selection changes */
  onPrimaryDimensionChange?: (dimension: string) => void;
  onSecondaryDimensionChange?: (dimension: string | null) => void;
  onMeasureChange?: (measure: string) => void;
}

/**
 * DataFieldSelector Component
 *
 * Allows users to select which dimension(s) and measure to use for chart visualization:
 * - Primary Dimension: The main grouping/category axis
 * - Secondary Dimension: For stacked/grouped charts (optional, only shown if 2+ dimensions)
 * - Measure: The metric to display (only shown if 2+ measures)
 */
export function DataFieldSelector({
  dimensions,
  measures,
  primaryDimension,
  secondaryDimension,
  selectedMeasure,
  supportsSecondaryDimension = false,
  onPrimaryDimensionChange,
  onSecondaryDimensionChange,
  onMeasureChange,
}: DataFieldSelectorProps) {
  // Only show secondary dimension if:
  // 1. There are 2+ dimensions available AND
  // 2. The current chart type supports secondary dimension (e.g., stacked charts)
  const showSecondaryDimension = dimensions.length >= 2 && supportsSecondaryDimension;

  // Only show measure selector if there are 2+ measures
  const showMeasureSelector = measures.length >= 2;

  // If nothing to configure, don't render
  if (dimensions.length === 0 && measures.length === 0) {
    return null;
  }

  // Format dimension/measure names for display (remove view prefix)
  const formatFieldName = (fieldName: string): string => {
    const parts = fieldName.split('.');
    return parts.length > 1 ? parts[1] : fieldName;
  };

  // Create options for dropdowns
  const dimensionOptions = dimensions.map((dim) => ({
    value: dim,
    label: formatFieldName(dim),
  }));

  const measureOptions = measures.map((measure) => ({
    value: measure,
    label: formatFieldName(measure),
  }));

  // For secondary dimension, exclude the currently selected primary dimension
  const availableSecondaryDimensions = dimensions.filter((dim) => dim !== primaryDimension);
  const secondaryDimensionOptions = availableSecondaryDimensions.map((dim) => ({
    value: dim,
    label: formatFieldName(dim),
  }));

  // If the secondary dimension is the same as primary, or not set when required,
  // automatically switch to the first available different dimension
  useEffect(() => {
    if (showSecondaryDimension && availableSecondaryDimensions.length > 0) {
      if (!secondaryDimension || secondaryDimension === primaryDimension) {
        // Auto-select the first available dimension that's different from primary
        onSecondaryDimensionChange?.(availableSecondaryDimensions[0]);
      }
    }
  }, [
    primaryDimension,
    secondaryDimension,
    showSecondaryDimension,
    availableSecondaryDimensions,
    onSecondaryDimensionChange,
  ]);

  return (
    <Stack gap="md">
      <Text size="sm" fw={500}>
        Data Configuration
      </Text>

      {/* Primary Dimension */}
      {dimensions.length > 0 && (
        <Select
          label="Primary Dimension"
          description="Main category/grouping for the chart"
          data={dimensionOptions}
          value={primaryDimension}
          onChange={(value) => value && onPrimaryDimensionChange?.(value)}
          placeholder="Select primary dimension"
          searchable
          clearable={false}
        />
      )}

      {/* Secondary Dimension (only if 2+ dimensions and chart supports it) */}
      {showSecondaryDimension && (
        <Select
          label="Secondary Dimension"
          description="For stacked/grouped charts (must be different from primary)"
          data={secondaryDimensionOptions}
          value={secondaryDimension}
          onChange={(value) => value && onSecondaryDimensionChange?.(value)}
          placeholder="Select secondary dimension"
          searchable
          clearable={false}
        />
      )}

      {/* Measure Selector (only if 2+ measures) */}
      {showMeasureSelector && (
        <Select
          label="Measure"
          description="Metric to display on the chart"
          data={measureOptions}
          value={selectedMeasure}
          onChange={(value) => value && onMeasureChange?.(value)}
          placeholder="Select measure"
          searchable
          clearable={false}
        />
      )}
    </Stack>
  );
}

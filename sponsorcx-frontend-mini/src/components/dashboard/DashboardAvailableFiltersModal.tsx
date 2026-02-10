import { useState, useEffect } from 'react';
import { useDashboardFilterStore } from '../../store';
import {
  FilterRule,
  ComparisonOperator,
  MeasureFilterRule,
  DimensionFilterRule,
  DateFilterRule,
} from '../../types/filters';
import { fetchDistinctDimensionValues } from '../../api';
import { SharedFilterModalUI } from '../shared/filters/SharedFilterModalUI';

interface DashboardAvailableFiltersModalProps {
  opened: boolean;
  onClose: () => void;
  fieldName: string | null;
}

/**
 * DashboardAvailableFiltersModal Component
 *
 * Modal for configuring the value/criteria for a dashboard filter field.
 * Handles in-memory filter state, delegates UI to SharedFilterModalUI.
 */
export function DashboardAvailableFiltersModal({
  opened,
  onClose,
  fieldName,
}: DashboardAvailableFiltersModalProps) {
  const { availableFields, activeFilters, selectedViews, addFilter, updateFilter, removeFilter } =
    useDashboardFilterStore();

  // Find the field config and existing filter
  const fieldConfig = availableFields.find((f) => f.fieldName === fieldName);
  const existingFilterIndex = activeFilters.findIndex((f) => f.fieldName === fieldName);
  const existingFilter = existingFilterIndex >= 0 ? activeFilters[existingFilterIndex] : null;

  // Measure filter state
  const [measureOperator, setMeasureOperator] = useState<ComparisonOperator>('=');
  const [measureValue, setMeasureValue] = useState<number | string>('');

  // Dimension filter state
  const [dimensionMode, setDimensionMode] = useState<'include' | 'exclude'>('include');
  const [dimensionValues, setDimensionValues] = useState<string[]>([]);
  const [selectedValues, setSelectedValues] = useState<Set<string>>(new Set());
  const [loadingValues, setLoadingValues] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Date filter state
  const [dateOperator, setDateOperator] = useState<ComparisonOperator>('=');
  const [dateValue, setDateValue] = useState<string>('');

  // Load existing filter when modal opens
  useEffect(() => {
    if (!opened || !existingFilter) {
      // Reset to defaults
      setMeasureOperator('=');
      setMeasureValue('');
      setDimensionMode('include');
      setSelectedValues(new Set());
      setDateOperator('=');
      setDateValue('');
      return;
    }

    // Load existing filter values based on type
    if (existingFilter.fieldType === 'measure') {
      const filter = existingFilter as MeasureFilterRule;
      setMeasureOperator(filter.operator);
      setMeasureValue(filter.value);
    } else if (existingFilter.fieldType === 'dimension') {
      const filter = existingFilter as DimensionFilterRule;
      setDimensionMode(filter.mode);
      setSelectedValues(new Set(filter.values));
    } else if (existingFilter.fieldType === 'date') {
      const filter = existingFilter as DateFilterRule;
      setDateOperator(filter.operator);
      setDateValue(filter.value);
    }
  }, [opened, existingFilter]);

  // Fetch dimension values when modal opens for a dimension
  // Dashboard-specific: fetch from ALL selected views and combine
  useEffect(() => {
    if (!opened || !fieldConfig || fieldConfig.fieldType !== 'dimension' || !fieldName) {
      return;
    }

    /**
     * Fetches distinct values for the dimension filter from all selected dashboard views.
     * Combines results, removes duplicates, and sorts for display.
     * Sets loading and error states accordingly.
     */
    const fetchValuesFromAllViews = async () => {
      setLoadingValues(true);
      setLoadError(null);
      try {
        // Fetch values from each view and combine them
        const allValuesPromises = selectedViews.map((viewName) =>
          fetchDistinctDimensionValues(viewName, fieldName)
        );

        const allValuesArrays = await Promise.all(allValuesPromises);

        // Combine and deduplicate values
        const combinedValues = Array.from(new Set(allValuesArrays.flat()));
        combinedValues.sort();

        setDimensionValues(combinedValues);
      } catch (error) {
        setLoadError('Failed to load filter options');
      } finally {
        setLoadingValues(false);
      }
    };

    fetchValuesFromAllViews();
  }, [opened, fieldConfig, fieldName, selectedViews]);

  const handleApply = () => {
    if (!fieldName || !fieldConfig) return;

    let filter: FilterRule | null = null;

    if (fieldConfig.fieldType === 'measure') {
      const numValue =
        typeof measureValue === 'number' ? measureValue : parseFloat(measureValue as string);
      if (!isNaN(numValue)) {
        filter = {
          fieldName,
          fieldTitle: fieldConfig.fieldTitle,
          fieldType: 'measure',
          operator: measureOperator,
          value: numValue,
        };
      }
    } else if (fieldConfig.fieldType === 'dimension') {
      if (selectedValues.size > 0) {
        filter = {
          fieldName,
          fieldTitle: fieldConfig.fieldTitle,
          fieldType: 'dimension',
          mode: dimensionMode,
          values: Array.from(selectedValues),
        };
      }
    } else if (fieldConfig.fieldType === 'date') {
      if (dateValue.trim()) {
        filter = {
          fieldName,
          fieldTitle: fieldConfig.fieldTitle,
          fieldType: 'date',
          operator: dateOperator,
          value: dateValue,
        };
      }
    }

    // Dashboard-specific: update in-memory filter state
    if (filter) {
      if (existingFilterIndex >= 0) {
        updateFilter(existingFilterIndex, filter);
      } else {
        addFilter(filter);
      }
    }

    onClose();
  };

  const handleRemoveFilter = () => {
    if (existingFilterIndex >= 0) {
      removeFilter(existingFilterIndex);
    }
    onClose();
  };

  const handleToggleValue = (value: string) => {
    setSelectedValues((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    setSelectedValues(new Set(dimensionValues));
  };

  const handleDeselectAll = () => {
    setSelectedValues(new Set());
  };

  const isValidFilter = () => {
    if (!fieldConfig) return false;

    if (fieldConfig.fieldType === 'measure') {
      const numValue =
        typeof measureValue === 'number' ? measureValue : parseFloat(measureValue as string);
      return !isNaN(numValue);
    } else if (fieldConfig.fieldType === 'dimension') {
      return selectedValues.size > 0;
    } else if (fieldConfig.fieldType === 'date') {
      return dateValue.trim() !== '';
    }
    return false;
  };

  if (!fieldConfig) {
    return null;
  }

  return (
    <SharedFilterModalUI
      opened={opened}
      onClose={onClose}
      title={`Filter: ${fieldConfig.fieldTitle}`}
      fieldType={fieldConfig.fieldType}
      measureOperator={measureOperator}
      measureValue={measureValue}
      onMeasureOperatorChange={setMeasureOperator}
      onMeasureValueChange={setMeasureValue}
      dimensionMode={dimensionMode}
      dimensionValues={dimensionValues}
      selectedValues={selectedValues}
      loadingValues={loadingValues}
      loadError={loadError}
      onDimensionModeChange={setDimensionMode}
      onToggleValue={handleToggleValue}
      onSelectAll={handleSelectAll}
      onDeselectAll={handleDeselectAll}
      dateOperator={dateOperator}
      dateValue={dateValue}
      onDateOperatorChange={setDateOperator}
      onDateValueChange={setDateValue}
      onApply={handleApply}
      onRemove={handleRemoveFilter}
      isValidFilter={isValidFilter()}
      hasExistingFilter={!!existingFilter}
    />
  );
}

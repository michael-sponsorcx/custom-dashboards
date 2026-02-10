import { useState, useEffect } from 'react';
import {
  FilterRule,
  FieldType,
  ComparisonOperator,
  MeasureFilterRule,
  DimensionFilterRule,
  DateFilterRule,
} from '../../types/filters';
import { fetchDistinctDimensionValues } from '../../api';
import { SharedFilterModalUI } from '../shared/filters/SharedFilterModalUI';

interface CreateGraphFilterModalProps {
  /** Whether the modal is open */
  opened: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** The field being filtered */
  fieldName: string | null;
  fieldTitle: string | null;
  fieldType: FieldType | null;
  /** The current view name (for fetching dimension values) */
  viewName: string | null;
  /** Existing filter for this field (if any) */
  existingFilter: FilterRule | null;
  /** Callback when filter is applied or removed */
  onApplyFilter: (filter: FilterRule | null) => void;
  /** Cache for dimension values */
  dimensionValuesCache?: Record<string, string[]>;
  /** Callback to update cache */
  onUpdateCache?: (key: string, values: string[]) => void;
}

/**
 * CreateGraphFilterModal Component
 *
 * Modal dialog for configuring field-specific filters in CreateGraph.
 * Handles filter logic and query generation, delegates UI to SharedFilterModalUI.
 * - Measures: Numeric comparison (=, >, <, >=, <=)
 * - Dimensions: Include/Exclude lists
 * - Dates: Date comparison (=, >, <, >=, <=)
 */
export function CreateGraphFilterModal({
  opened,
  onClose,
  fieldName,
  fieldTitle,
  fieldType,
  viewName,
  existingFilter,
  onApplyFilter,
  dimensionValuesCache = {},
  onUpdateCache,
}: CreateGraphFilterModalProps) {
  // Measure filter state
  const [measureOperator, setMeasureOperator] = useState<ComparisonOperator>('=');
  const [measureValue, setMeasureValue] = useState<number | string>('');

  // Dimension filter state
  const [dimensionMode, setDimensionMode] = useState<'include' | 'exclude'>('include');
  const [dimensionValues, setDimensionValues] = useState<string[]>([]); // Available values
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
  useEffect(() => {
    if (!opened || fieldType !== 'dimension' || !viewName || !fieldName) {
      return;
    }

    // Create cache key
    const cacheKey = `${viewName}.${fieldName}`;

    // Check if we have cached values
    if (dimensionValuesCache[cacheKey]) {
      setDimensionValues(dimensionValuesCache[cacheKey]);
      return;
    }

    const fetchValues = async () => {
      setLoadingValues(true);
      setLoadError(null);
      try {
        const values = await fetchDistinctDimensionValues(viewName, fieldName);
        setDimensionValues(values);

        // Update cache
        if (onUpdateCache) {
          onUpdateCache(cacheKey, values);
        }
      } catch (error) {
        setLoadError('Failed to load filter options');
      } finally {
        setLoadingValues(false);
      }
    };

    fetchValues();
  }, [opened, fieldType, viewName, fieldName, dimensionValuesCache, onUpdateCache]);

  const handleApply = () => {
    if (!fieldName || !fieldTitle || !fieldType) return;

    let filter: FilterRule | null = null;

    if (fieldType === 'measure') {
      const numValue =
        typeof measureValue === 'number' ? measureValue : parseFloat(measureValue as string);
      if (!isNaN(numValue)) {
        filter = {
          fieldName,
          fieldTitle,
          fieldType: 'measure',
          operator: measureOperator,
          value: numValue,
        };
      }
    } else if (fieldType === 'dimension') {
      if (selectedValues.size > 0) {
        filter = {
          fieldName,
          fieldTitle,
          fieldType: 'dimension',
          mode: dimensionMode,
          values: Array.from(selectedValues),
        };
      }
    } else if (fieldType === 'date') {
      if (dateValue.trim()) {
        filter = {
          fieldName,
          fieldTitle,
          fieldType: 'date',
          operator: dateOperator,
          value: dateValue,
        };
      }
    }

    onApplyFilter(filter);
    onClose();
  };

  const handleRemoveFilter = () => {
    onApplyFilter(null);
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
    if (fieldType === 'measure') {
      const numValue =
        typeof measureValue === 'number' ? measureValue : parseFloat(measureValue as string);
      return !isNaN(numValue);
    } else if (fieldType === 'dimension') {
      return selectedValues.size > 0;
    } else if (fieldType === 'date') {
      return dateValue.trim() !== '';
    }
    return false;
  };

  return (
    <SharedFilterModalUI
      opened={opened}
      onClose={onClose}
      title={`Filter: ${fieldTitle || 'Unknown'}`}
      fieldType={fieldType}
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

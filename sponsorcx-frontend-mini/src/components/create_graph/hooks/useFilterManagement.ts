/**
 * useFilterManagement Hook
 *
 * Manages filter state and operations including:
 * - Filter modal state
 * - Active filters
 * - Filter application and removal
 * - Dimension values caching
 */

import { useState, useCallback, useMemo } from 'react';
import { FilterRule, FieldType } from '../../../types/filters';
import { FilterFieldInfo } from '../types';
import { GraphTemplate } from '../../../types/graphTemplate';

interface UseFilterManagementOptions {
  initialTemplate?: GraphTemplate;
}

export function useFilterManagement(options: UseFilterManagementOptions = {}) {
  const { initialTemplate } = options;

  // Filter state
  const [filters, setFilters] = useState<FilterRule[]>(
    initialTemplate?.filters || []
  );
  const [filterModalOpened, setFilterModalOpened] = useState(false);
  const [currentFilterField, setCurrentFilterField] = useState<FilterFieldInfo | null>(null);

  // Dimension values cache
  const [dimensionValuesCache, setDimensionValuesCache] = useState<Record<string, string[]>>({});

  // Get active filter field names for UI highlighting
  const activeFilterFields = useMemo(() => {
    return new Set(filters.map(f => f.fieldName));
  }, [filters]);

  // Get existing filter for current field
  const currentExistingFilter = useMemo(() => {
    if (!currentFilterField) return null;
    return filters.find(f => f.fieldName === currentFilterField.fieldName) || null;
  }, [filters, currentFilterField]);

  // Open filter modal
  const openFilterModal = useCallback((
    fieldName: string,
    fieldTitle: string,
    fieldType: FieldType
  ) => {
    setCurrentFilterField({ fieldName, fieldTitle, fieldType });
    setFilterModalOpened(true);
  }, []);

  // Close filter modal
  const closeFilterModal = useCallback(() => {
    setFilterModalOpened(false);
  }, []);

  // Apply or remove filter
  const applyFilter = useCallback((filter: FilterRule | null) => {
    if (!currentFilterField) return;

    setFilters(prev => {
      // Remove existing filter for this field
      const filtered = prev.filter(f => f.fieldName !== currentFilterField.fieldName);

      // Add new filter if provided (null means remove filter)
      if (filter) {
        return [...filtered, filter];
      }

      return filtered;
    });
  }, [currentFilterField]);

  // Update dimension values cache
  const updateDimensionCache = useCallback((key: string, values: string[]) => {
    setDimensionValuesCache(prev => ({
      ...prev,
      [key]: values,
    }));
  }, []);

  return {
    // Filter state
    filters,
    activeFilterFields,

    // Modal state
    filterModalOpened,
    currentFilterField,
    currentExistingFilter,
    openFilterModal,
    closeFilterModal,

    // Filter operations
    applyFilter,

    // Cache
    dimensionValuesCache,
    updateDimensionCache,
  };
}

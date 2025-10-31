import { useState, useEffect, useCallback } from 'react';
import { loadDashboardFilters, saveDashboardFilters } from '../../../services/dashboardFilterPersistence';
import { FilterRule } from '../../../types/filters';

export interface DashboardFilterField {
  fieldName: string;
  fieldTitle: string;
  fieldType: 'measure' | 'dimension' | 'date';
}

export interface DashboardFilterState {
  // Selected data sources (views) for filtering
  selectedViews: string[];
  // Available filter fields (common across selected views)
  availableFields: DashboardFilterField[];
  // Active filter rules
  activeFilters: FilterRule[];
}

/**
 * Hook to manage dashboard filters with persistence
 *
 * This hook manages dashboard filter state with automatic persistence.
 * - Loads filter config from localStorage on mount
 * - Saves filter config to localStorage on state changes
 * - Will be updated to use backend API calls instead of localStorage
 */
export function useDashboardFilters() {
  const [selectedViews, setSelectedViews] = useState<string[]>([]);
  const [availableFields, setAvailableFields] = useState<DashboardFilterField[]>([]);
  const [activeFilters, setActiveFilters] = useState<FilterRule[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load filter config on mount
  useEffect(() => {
    const loadConfig = async () => {
      const config = await loadDashboardFilters();
      if (config) {
        setSelectedViews(config.selectedViews);
        setAvailableFields(config.availableFields);
        setActiveFilters(config.activeFilters);
      }
      setIsLoaded(true);
    };

    loadConfig();
  }, []);

  // Save to persistence whenever state changes (after initial load)
  useEffect(() => {
    if (!isLoaded) return;

    const saveConfig = async () => {
      await saveDashboardFilters({
        selectedViews,
        availableFields,
        activeFilters,
      });
    };

    // Don't save on initial mount (when everything is empty)
    if (selectedViews.length > 0 || availableFields.length > 0 || activeFilters.length > 0) {
      saveConfig();
    }
  }, [selectedViews, availableFields, activeFilters, isLoaded]);

  // Filter management actions
  const addFilter = useCallback((filter: FilterRule) => {
    setActiveFilters(prev => [...prev, filter]);
  }, []);

  const updateFilter = useCallback((index: number, filter: FilterRule) => {
    setActiveFilters(prev => prev.map((f, i) => (i === index ? filter : f)));
  }, []);

  const removeFilter = useCallback((index: number) => {
    setActiveFilters(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearAllFilters = useCallback(() => {
    setActiveFilters([]);
  }, []);

  const reset = useCallback(() => {
    setSelectedViews([]);
    setAvailableFields([]);
    setActiveFilters([]);
  }, []);

  return {
    // State
    selectedViews,
    availableFields,
    activeFilters,

    // Actions
    setSelectedViews,
    setAvailableFields,
    addFilter,
    updateFilter,
    removeFilter,
    clearAllFilters,
    reset,
  };
}

/**
 * Hook to access just the filter state (for components that only read)
 *
 * Note: This hook creates its own state instance. If you need to share state
 * with components that modify filters, they should use the same useDashboardFilters instance.
 */
export function useDashboardFilterState() {
  const [state, setState] = useState<DashboardFilterState>({
    selectedViews: [],
    availableFields: [],
    activeFilters: [],
  });

  useEffect(() => {
    const loadConfig = async () => {
      const config = await loadDashboardFilters();
      if (config) {
        setState(config);
      }
    };

    loadConfig();
  }, []);

  return state;
}
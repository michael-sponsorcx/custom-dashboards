import { useState, useEffect, useCallback } from 'react';
import {
  fetchDashboardFilter,
  saveDashboardFilter,
  type DashboardFilterState,
  type DashboardFilterField,
} from '../../../services/backendCube';
import { useOrganizationStore } from '../../../store';
import { FilterRule } from '../../../types/filters';

// Re-export types for backward compatibility
export type { DashboardFilterField, DashboardFilterState };

/**
 * Hook to manage dashboard filters with persistence
 *
 * This hook manages dashboard filter state with automatic persistence to backend.
 * - Loads filter config from backend on mount
 * - Saves filter config to backend on state changes
 */
export function useDashboardFilters() {
  const [selectedViews, setSelectedViews] = useState<string[]>([]);
  const [availableFields, setAvailableFields] = useState<DashboardFilterField[]>([]);
  const [activeFilters, setActiveFilters] = useState<FilterRule[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { dashboardId } = useOrganizationStore();

  // Load filter config on mount and when dashboard changes
  useEffect(() => {
    const loadConfig = async () => {
      if (!dashboardId) {
        setIsLoaded(true);
        return;
      }

      try {
        const config = await fetchDashboardFilter(dashboardId);
        if (config) {
          setSelectedViews(config.selectedViews);
          setAvailableFields(config.availableFields);
          setActiveFilters(config.activeFilters);
        }
      } catch (error) {
        console.error('Failed to load dashboard filters:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadConfig();
  }, [dashboardId]);

  // Save to backend whenever state changes (after initial load)
  useEffect(() => {
    if (!isLoaded || !dashboardId) return;

    const saveConfig = async () => {
      try {
        await saveDashboardFilter(dashboardId, {
          selectedViews,
          availableFields,
          activeFilters,
        });
      } catch (error) {
        console.error('Failed to save dashboard filters:', error);
      }
    };

    // Don't save on initial mount (when everything is empty)
    if (selectedViews.length > 0 || availableFields.length > 0 || activeFilters.length > 0) {
      saveConfig();
    }
  }, [selectedViews, availableFields, activeFilters, isLoaded, dashboardId]);

  // Filter management actions
  const addFilter = useCallback((filter: FilterRule) => {
    setActiveFilters((prev) => {
      // Check if filter for this field already exists
      const existingIndex = prev.findIndex((f) => f.fieldName === filter.fieldName);
      if (existingIndex >= 0) {
        // Replace existing filter
        return prev.map((f, i) => (i === existingIndex ? filter : f));
      }
      // Add new filter
      return [...prev, filter];
    });
  }, []);

  const updateFilter = useCallback((index: number, filter: FilterRule) => {
    setActiveFilters((prev) => prev.map((f, i) => (i === index ? filter : f)));
  }, []);

  const removeFilter = useCallback((index: number) => {
    setActiveFilters((prev) => prev.filter((_, i) => i !== index));
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
  const { dashboardId } = useOrganizationStore();

  useEffect(() => {
    const loadConfig = async () => {
      if (!dashboardId) return;

      try {
        const config = await fetchDashboardFilter(dashboardId);
        if (config) {
          setState(config);
        }
      } catch (error) {
        console.error('Failed to load dashboard filters:', error);
      }
    };

    loadConfig();
  }, [dashboardId]);

  return state;
}

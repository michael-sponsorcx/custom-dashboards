/**
 * Dashboard Filter Store
 *
 * Zustand store for managing dashboard filter state with backend persistence.
 * Replaces the previous Context-based implementation for consistency.
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import {
  fetchDashboardFilter,
  saveDashboardFilter,
  type DashboardFilterField,
  type DashboardFilterState,
} from '../services/backendCube';
import type { FilterRule } from '../types/filters';

// Re-export types for convenience
export type { DashboardFilterField, DashboardFilterState };

interface DashboardFilterStore {
  // State
  selectedViews: string[];
  availableFields: DashboardFilterField[];
  activeFilters: FilterRule[];
  isLoaded: boolean;
  currentDashboardId: string | undefined;

  // Actions
  setSelectedViews: (views: string[]) => void;
  setAvailableFields: (fields: DashboardFilterField[]) => void;
  addFilter: (filter: FilterRule) => void;
  updateFilter: (index: number, filter: FilterRule) => void;
  removeFilter: (index: number) => void;
  clearAllFilters: () => void;
  reset: () => void;

  // Persistence
  loadFilters: (dashboardId: string) => Promise<void>;
  saveFilters: () => Promise<void>;
}

export const useDashboardFilterStore = create<DashboardFilterStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    selectedViews: [],
    availableFields: [],
    activeFilters: [],
    isLoaded: false,
    currentDashboardId: undefined,

    // Actions
    setSelectedViews: (views) => {
      set({ selectedViews: views });
      get().saveFilters();
    },

    setAvailableFields: (fields) => {
      set({ availableFields: fields });
      get().saveFilters();
    },

    addFilter: (filter) => {
      set((state) => {
        const existingIndex = state.activeFilters.findIndex(
          (f) => f.fieldName === filter.fieldName
        );
        if (existingIndex >= 0) {
          // Replace existing filter
          const newFilters = [...state.activeFilters];
          newFilters[existingIndex] = filter;
          return { activeFilters: newFilters };
        }
        return { activeFilters: [...state.activeFilters, filter] };
      });
      get().saveFilters();
    },

    updateFilter: (index, filter) => {
      set((state) => ({
        activeFilters: state.activeFilters.map((f, i) => (i === index ? filter : f)),
      }));
      get().saveFilters();
    },

    removeFilter: (index) => {
      set((state) => ({
        activeFilters: state.activeFilters.filter((_, i) => i !== index),
      }));
      get().saveFilters();
    },

    clearAllFilters: () => {
      set({ activeFilters: [] });
      get().saveFilters();
    },

    reset: () => {
      set({
        selectedViews: [],
        availableFields: [],
        activeFilters: [],
        isLoaded: false,
        currentDashboardId: undefined,
      });
    },

    // Persistence
    loadFilters: async (dashboardId) => {
      const { currentDashboardId } = get();

      // Skip if already loaded for this dashboard
      if (currentDashboardId === dashboardId && get().isLoaded) {
        return;
      }

      // Reset state when switching dashboards
      if (currentDashboardId !== dashboardId) {
        set({
          selectedViews: [],
          availableFields: [],
          activeFilters: [],
          isLoaded: false,
          currentDashboardId: dashboardId,
        });
      }

      try {
        const config = await fetchDashboardFilter(dashboardId);
        if (config) {
          set({
            selectedViews: config.selectedViews,
            availableFields: config.availableFields,
            activeFilters: config.activeFilters,
            isLoaded: true,
          });
        } else {
          set({ isLoaded: true });
        }
      } catch (error) {
        console.error('Failed to load dashboard filters:', error);
        set({ isLoaded: true });
      }
    },

    saveFilters: async () => {
      const { isLoaded, currentDashboardId, selectedViews, availableFields, activeFilters } = get();

      if (!isLoaded || !currentDashboardId) return;

      // Don't save empty state
      if (selectedViews.length === 0 && availableFields.length === 0 && activeFilters.length === 0) {
        return;
      }

      try {
        await saveDashboardFilter(currentDashboardId, {
          selectedViews,
          availableFields,
          activeFilters,
        });
      } catch (error) {
        console.error('Failed to save dashboard filters:', error);
      }
    },
  }))
);


import { createContext, useContext, ReactNode } from 'react';
import { useDashboardFilters, DashboardFilterField } from '../hooks/useDashboardFilters';
import type { FilterRule } from '@/types/filters';

/**
 * Context interface for dashboard filter state and actions
 * Matches the return type of useDashboardFilters hook
 */
interface DashboardFilterContextValue {
  // State
  selectedViews: string[];
  availableFields: DashboardFilterField[];
  activeFilters: FilterRule[];

  // Actions
  setSelectedViews: (views: string[]) => void;
  setAvailableFields: (fields: DashboardFilterField[]) => void;
  addFilter: (filter: FilterRule) => void;
  updateFilter: (index: number, filter: FilterRule) => void;
  removeFilter: (index: number) => void;
  clearAllFilters: () => void;
  reset: () => void;
}

/**
 * Dashboard Filter Context - Provides shared filter state across all dashboard components
 * Ensures that filter updates are immediately reflected in all components (GraphCards, modals, etc.)
 */
const DashboardFilterContext = createContext<DashboardFilterContextValue | undefined>(undefined);

interface DashboardFilterProviderProps {
  children: ReactNode;
}

/**
 * Provider component that wraps the dashboard and provides filter state
 */
export function DashboardFilterProvider({ children }: DashboardFilterProviderProps) {
  const filterState = useDashboardFilters();

  return (
    <DashboardFilterContext.Provider value={filterState}>
      {children}
    </DashboardFilterContext.Provider>
  );
}

/**
 * Hook to access dashboard filter state and actions
 * Must be used within a DashboardFilterProvider
 */
export function useDashboardFilterContext() {
  const context = useContext(DashboardFilterContext);

  if (context === undefined) {
    throw new Error('useDashboardFilterContext must be used within a DashboardFilterProvider');
  }

  return context;
}

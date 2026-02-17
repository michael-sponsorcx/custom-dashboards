/**
 * Reusable hook that bridges PageHeader filters ↔ URL query params.
 *
 * Mirrors the Stadium useFilterHelpers pattern used by useUploadsFilters.
 * Reads current filter values from query params, writes updates back to the URL,
 * and derives the appliedFilterValues / filtersAreApplied state for PageHeader.
 */

import { useMemo, useCallback } from 'react';
import type { SetQuery, DecodedValueMap, QueryParamConfigMap } from 'use-query-params';
import type {
  PageHeaderFilter,
  FilterValueType,
} from '@/stadiumDS/applicationComponents/PageHeader/PageHeaderFilters/PageHeaderFilters.type';

interface UseFilterHelpersProps<QPCMap extends QueryParamConfigMap> {
  defaultFilters: PageHeaderFilter[];
  setQueryParams: SetQuery<QPCMap>;
  queryParams: DecodedValueMap<QPCMap>;
  filtersToIgnoreOnReset: string[];
  tableName: string;
}

interface UseFilterHelpersReturn {
  appliedFilterValues: Record<string, FilterValueType>;
  updateFilters: (updatedParams: Record<string, FilterValueType>) => void;
  handleResetFilters: () => void;
  filtersAreApplied: boolean;
  filterResetValues: Record<string, FilterValueType>;
}

const useFilterHelpers = <QPCMap extends QueryParamConfigMap>({
  defaultFilters,
  setQueryParams,
  queryParams,
  filtersToIgnoreOnReset,
}: UseFilterHelpersProps<QPCMap>): UseFilterHelpersReturn => {
  // Build the reset-value map from filter definitions
  const filterResetValues = useMemo(() => {
    const values: Record<string, FilterValueType> = {};
    defaultFilters.forEach((filter) => {
      values[filter.key] = filter.resetValue as FilterValueType;
    });
    return values;
  }, [defaultFilters]);

  // Derive appliedFilterValues from query params by reading each filter's key
  const appliedFilterValues = useMemo(() => {
    const values: Record<string, FilterValueType> = {};
    defaultFilters.forEach((filter) => {
      const raw = queryParams[filter.key as keyof QPCMap];

      if (filter.type === 'multiselect' || filter.type === 'paginatedMultiselect' || filter.type === 'togglePills') {
        const arr = (raw as (string | null)[] | null | undefined)?.filter(Boolean) as string[] | undefined;
        values[filter.key] = arr && arr.length > 0 ? arr : [];
      } else if (filter.type === 'dateRange') {
        const arr = raw as (string | null)[] | null | undefined;
        values[filter.key] = [arr?.[0] ?? '', arr?.[1] ?? ''];
      } else if (filter.type === 'range') {
        const arr = raw as (string | null)[] | null | undefined;
        values[filter.key] = [
          arr?.[0] ? Number(arr[0]) : null,
          arr?.[1] ? Number(arr[1]) : null,
        ];
      } else if (filter.type === 'boolean') {
        const val = raw as string | null | undefined;
        values[filter.key] = val === 'true' ? true : val === 'false' ? false : undefined;
      } else {
        // select | customFields
        const val = raw as string | null | undefined;
        values[filter.key] = val ?? undefined;
      }
    });
    return values;
  }, [defaultFilters, queryParams]);

  // Write filter updates to URL query params
  const updateFilters = useCallback(
    (updatedParams: Record<string, FilterValueType>) => {
      const update: Record<string, unknown> = {};

      Object.entries(updatedParams).forEach(([key, value]) => {
        if (value === undefined || value === null) {
          update[key] = undefined;
        } else if (Array.isArray(value)) {
          // For array types (multiselect, dateRange, range, togglePills)
          const arr = value as (string | number | null | boolean)[];
          const isEmpty = arr.length === 0 || arr.every((v) => v === '' || v === null);
          update[key] = isEmpty ? undefined : arr.map(String);
        } else if (typeof value === 'boolean') {
          update[key] = String(value);
        } else {
          update[key] = value || undefined;
        }
      });

      setQueryParams(update as Partial<DecodedValueMap<QPCMap>>, 'replaceIn');
    },
    [setQueryParams]
  );

  // Reset all filters to their resetValue (clear from URL)
  const handleResetFilters = useCallback(() => {
    const reset: Record<string, unknown> = {};
    defaultFilters.forEach((filter) => {
      if (filtersToIgnoreOnReset.includes(filter.key)) return;
      reset[filter.key] = undefined;
    });
    setQueryParams(reset as Partial<DecodedValueMap<QPCMap>>, 'replaceIn');
  }, [defaultFilters, filtersToIgnoreOnReset, setQueryParams]);

  // Determine if any filters are applied (differ from reset values)
  const filtersAreApplied = useMemo(() => {
    return defaultFilters.some((filter) => {
      const current = appliedFilterValues[filter.key];
      const resetVal = filter.resetValue as FilterValueType;

      if (Array.isArray(current) && Array.isArray(resetVal)) {
        if (current.length !== resetVal.length) return true;
        return current.some((v, i) => v !== resetVal[i]);
      }
      return current !== resetVal && current !== undefined;
    });
  }, [defaultFilters, appliedFilterValues]);

  return {
    appliedFilterValues,
    updateFilters,
    handleResetFilters,
    filtersAreApplied,
    filterResetValues,
  };
};

export default useFilterHelpers;

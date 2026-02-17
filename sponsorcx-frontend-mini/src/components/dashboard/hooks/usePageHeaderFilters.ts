/**
 * Bridge hook between Dashboard filter store, URL query params, and Stadium PageHeader.
 *
 * URL query params are the source of truth for active dimension filter values.
 * Zustand's activeFilters is kept in sync (via _syncDimensionFiltersFromUrl) so
 * downstream consumers (GraphCard, DownloadPDF, Present) continue to work.
 *
 * Uses useDashboardFilterQueryParams for dynamic query param config and
 * useFilterHelpers for the standard PageHeader filter bridge pattern.
 */

import { useState, useEffect, useMemo } from 'react';
import { useDashboardFilterStore } from '@/store';
import { fetchDistinctDimensionValues } from '@/api';
import useFilterHelpers from '@/hooks/useFilterHelpers';
import type { PageHeaderFilter } from '@/stadiumDS/applicationComponents/PageHeader/PageHeaderFilters/PageHeaderFilters.type';
import { useDashboardFilterQueryParams } from './useDashboardFilterQueryParams';

export const usePageHeaderFilters = () => {
  const {
    availableFields,
    selectedViews,
    isLoaded,
    _syncDimensionFiltersFromUrl,
  } = useDashboardFilterStore();

  const {
    queryParams,
    setQueryParams,
    filtersFromUrl,
    FILTER_PREFIX,
  } = useDashboardFilterQueryParams();

  // Sync URL → Zustand whenever URL-derived filters change
  useEffect(() => {
    if (!isLoaded) return;
    _syncDimensionFiltersFromUrl(filtersFromUrl);
  }, [filtersFromUrl, isLoaded, _syncDimensionFiltersFromUrl]);

  // Cache dimension values per field
  const [dimensionOptions, setDimensionOptions] = useState<Record<string, string[]>>({});

  // Fetch dimension values for all dimension fields
  useEffect(() => {
    const dimensionFields = availableFields.filter((f) => f.fieldType === 'dimension');

    if (dimensionFields.length === 0 || selectedViews.length === 0) return;

    const fetchAll = async () => {
      const results: Record<string, string[]> = {};

      await Promise.all(
        dimensionFields.map(async (field) => {
          try {
            const allValuesArrays = await Promise.all(
              selectedViews.map((viewName) =>
                fetchDistinctDimensionValues(viewName, field.fieldName)
              )
            );
            const combined = Array.from(new Set(allValuesArrays.flat()));
            combined.sort();
            results[field.fieldName] = combined;
          } catch {
            results[field.fieldName] = [];
          }
        })
      );

      setDimensionOptions(results);
    };

    fetchAll();
  }, [availableFields, selectedViews]);

  // Build PageHeaderFilter[] from dimension fields
  // defaultValue reads from URL query params (following the useUploadsFilters pattern)
  const defaultFilters: PageHeaderFilter[] = useMemo(() => {
    return availableFields
      .filter((field) => field.fieldType === 'dimension')
      .map((field) => {
        const paramKey = `${FILTER_PREFIX}${field.fieldName}`;
        const urlValues = (queryParams[paramKey] as (string | null)[] | null | undefined)?.filter(Boolean) as string[] | undefined;

        return {
          key: paramKey,
          label: field.fieldTitle,
          type: 'multiselect' as const,
          options: (dimensionOptions[field.fieldName] || []).map((v) => ({
            value: v,
            label: v,
          })),
          defaultValue: urlValues && urlValues.length > 0 ? urlValues : ([] as string[]),
          resetValue: [] as string[],
          showInHeader: true,
        };
      });
  }, [availableFields, dimensionOptions, queryParams, FILTER_PREFIX]);

  // Use the reusable filter helpers for the standard PageHeader bridge
  const {
    appliedFilterValues,
    updateFilters,
    handleResetFilters,
    filtersAreApplied,
    filterResetValues,
  } = useFilterHelpers({
    defaultFilters,
    setQueryParams,
    queryParams,
    filtersToIgnoreOnReset: [],
    tableName: 'dashboard',
  });

  return {
    defaultFilters,
    appliedFilterValues,
    updateFilters,
    handleResetFilters,
    filtersAreApplied,
    queryParams,
    setQueryParams,
    filterResetValues,
  };
};

/**
 * Dashboard-specific hook that builds a dynamic useQueryParams config
 * from the available dimension fields in the filter store.
 *
 * Each dimension field gets an ArrayParam keyed as f_{fieldName}.
 * The "f_" prefix avoids collisions with other query params (e.g. "search").
 *
 * Also handles seeding the URL from backend-loaded filters on initial load.
 */

import { useMemo, useEffect, useRef, useCallback } from 'react';
import { ArrayParam, useQueryParams } from 'use-query-params';
import { useDashboardFilterStore } from '@/store';
import type { DimensionFilterRule } from '@/types/filters';

const FILTER_PREFIX = 'f_';

export const useDashboardFilterQueryParams = () => {
  const {
    availableFields,
    activeFilters,
    isLoaded,
    currentDashboardId,
  } = useDashboardFilterStore();

  // Build dynamic config from available dimension fields
  const queryParamConfig = useMemo(() => {
    const config: Record<string, typeof ArrayParam> = {};
    availableFields
      .filter((f) => f.fieldType === 'dimension')
      .forEach((field) => {
        config[`${FILTER_PREFIX}${field.fieldName}`] = ArrayParam;
      });
    return config;
  }, [availableFields]);

  const [queryParams, setQueryParams] = useQueryParams(queryParamConfig);

  // Convert URL params → DimensionFilterRule[]
  const filtersFromUrl = useMemo((): DimensionFilterRule[] => {
    const filters: DimensionFilterRule[] = [];
    availableFields
      .filter((f) => f.fieldType === 'dimension')
      .forEach((field) => {
        const paramKey = `${FILTER_PREFIX}${field.fieldName}`;
        const values = (queryParams[paramKey] as (string | null)[] | null | undefined)?.filter(Boolean) as string[] | undefined;
        if (values && values.length > 0) {
          filters.push({
            fieldName: field.fieldName,
            fieldTitle: field.fieldTitle,
            fieldType: 'dimension',
            mode: 'include',
            values,
          });
        }
      });
    return filters;
  }, [queryParams, availableFields]);

  // Track whether we've seeded the URL from backend state
  const hasSeededUrl = useRef(false);
  const prevDashboardId = useRef(currentDashboardId);

  // Reset seed flag and clear URL params when switching dashboards
  useEffect(() => {
    if (prevDashboardId.current !== currentDashboardId) {
      prevDashboardId.current = currentDashboardId;
      hasSeededUrl.current = false;

      // Clear existing filter params from URL
      const cleared: Record<string, undefined> = {};
      availableFields
        .filter((f) => f.fieldType === 'dimension')
        .forEach((field) => {
          cleared[`${FILTER_PREFIX}${field.fieldName}`] = undefined;
        });
      if (Object.keys(cleared).length > 0) {
        setQueryParams(cleared, 'replaceIn');
      }
    }
  }, [currentDashboardId, availableFields, setQueryParams]);

  // Seed URL from backend on initial load (only when URL is empty)
  useEffect(() => {
    if (!isLoaded || hasSeededUrl.current) return;
    hasSeededUrl.current = true;

    const dimensionFilters = activeFilters.filter(
      (f): f is DimensionFilterRule => f.fieldType === 'dimension'
    );

    // Only seed if URL has no filter params and backend has saved filters
    if (dimensionFilters.length > 0 && filtersFromUrl.length === 0) {
      const params: Record<string, string[]> = {};
      dimensionFilters.forEach((f) => {
        params[`${FILTER_PREFIX}${f.fieldName}`] = f.values;
      });
      setQueryParams(params, 'replaceIn');
    }
  }, [isLoaded, activeFilters, filtersFromUrl.length, setQueryParams]);

  // Helper to clear all filter params from URL
  const clearAllUrlFilters = useCallback(() => {
    const cleared: Record<string, undefined> = {};
    availableFields
      .filter((f) => f.fieldType === 'dimension')
      .forEach((field) => {
        cleared[`${FILTER_PREFIX}${field.fieldName}`] = undefined;
      });
    setQueryParams(cleared, 'replaceIn');
  }, [availableFields, setQueryParams]);

  return {
    queryParams,
    setQueryParams,
    filtersFromUrl,
    clearAllUrlFilters,
    FILTER_PREFIX,
  };
};

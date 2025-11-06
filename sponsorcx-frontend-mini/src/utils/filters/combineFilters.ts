import {
  FilterRule,
  MeasureFilterRule,
  DimensionFilterRule,
  DateFilterRule,
  isMeasureFilter,
  isDimensionFilter,
  isDateFilter,
} from '../../types/filters';

/**
 * Combines graph filters and dashboard filters into a single set of effective filters.
 *
 * Dashboard filters REFINE graph filters (they build on top of them, not replace):
 * - For dimensions: Dashboard filters intersect with graph filters
 * - For measures: Dashboard filters combine with graph filters (AND logic)
 * - For dates: Dashboard filters combine with graph filters (AND logic)
 *
 * @param graphFilters - Filters defined on the graph itself (applied at query level)
 * @param dashboardFilters - Filters defined on the dashboard (refine graph results)
 * @returns Combined filters that should be applied to the query
 */
export function combineFilters(
  graphFilters: FilterRule[],
  dashboardFilters: FilterRule[]
): FilterRule[] {
  // Deduplicate input arrays first
  const uniqueGraphFilters = deduplicateFilters(graphFilters);
  const uniqueDashboardFilters = deduplicateFilters(dashboardFilters);

  const result: FilterRule[] = [];
  const processedFields = new Set<string>();

  // For each graph filter, check if there's a dashboard filter for the same field
  for (const graphFilter of uniqueGraphFilters) {
    const dashboardFilter = uniqueDashboardFilters.find(
      (df) => df.fieldName === graphFilter.fieldName && df.fieldType === graphFilter.fieldType
    );

    if (dashboardFilter) {
      // Combine based on filter type
      const combined = combineFilterPair(graphFilter, dashboardFilter);
      if (combined) {
        result.push(...combined);
      }
    } else {
      // No dashboard override, keep graph filter as-is
      result.push(graphFilter);
    }
    processedFields.add(graphFilter.fieldName);
  }

  // Add any dashboard filters that don't have corresponding graph filters
  for (const dashboardFilter of uniqueDashboardFilters) {
    if (!processedFields.has(dashboardFilter.fieldName)) {
      result.push(dashboardFilter);
      processedFields.add(dashboardFilter.fieldName);
    }
  }

  // Final deduplication to ensure no duplicates in result
  // Note: For measures and dates, we may have multiple filters for the same field (AND logic)
  return deduplicateFilters(result);
}

/**
 * Deduplicates filters, but allows multiple measure/date filters for the same field.
 * For dimensions, keeps the last occurrence only.
 * For measures and dates, keeps all unique combinations (to support range queries).
 */
function deduplicateFilters(filters: FilterRule[]): FilterRule[] {
  const dimensionMap = new Map<string, FilterRule>();
  const measureDateFilters: FilterRule[] = [];
  const seen = new Set<string>();

  for (const filter of filters) {
    if (isDimensionFilter(filter)) {
      // For dimensions, keep only the last occurrence
      dimensionMap.set(filter.fieldName, filter);
    } else if (isMeasureFilter(filter) || isDateFilter(filter)) {
      // For measures and dates, keep all unique combinations
      const key = `${filter.fieldName}:${filter.operator}:${filter.value}`;
      if (!seen.has(key)) {
        seen.add(key);
        measureDateFilters.push(filter);
      }
    } else {
      // Unknown filter type, keep it
      measureDateFilters.push(filter);
    }
  }

  return [...Array.from(dimensionMap.values()), ...measureDateFilters];
}

/**
 * Combines a single pair of graph filter and dashboard filter for the same field.
 * Returns an array because some combinations might result in multiple filters.
 */
function combineFilterPair(
  graphFilter: FilterRule,
  dashboardFilter: FilterRule
): FilterRule[] | null {
  // Type safety check
  if (graphFilter.fieldType !== dashboardFilter.fieldType) {
    console.warn(
      `Filter type mismatch for field ${graphFilter.fieldName}: ` +
        `graph=${graphFilter.fieldType}, dashboard=${dashboardFilter.fieldType}`
    );
    return [dashboardFilter]; // Dashboard wins in case of mismatch
  }

  if (isDimensionFilter(graphFilter) && isDimensionFilter(dashboardFilter)) {
    return combineDimensionFilters(graphFilter, dashboardFilter);
  }

  if (isMeasureFilter(graphFilter) && isMeasureFilter(dashboardFilter)) {
    return combineMeasureFilters(graphFilter, dashboardFilter);
  }

  if (isDateFilter(graphFilter) && isDateFilter(dashboardFilter)) {
    return combineDateFilters(graphFilter, dashboardFilter);
  }

  return [dashboardFilter];
}

/**
 * Combines dimension filters.
 * Dashboard filters refine the graph's dimension set.
 */
function combineDimensionFilters(
  graphFilter: DimensionFilterRule,
  dashboardFilter: DimensionFilterRule
): FilterRule[] {
  // Both include: Intersection
  if (graphFilter.mode === 'include' && dashboardFilter.mode === 'include') {
    const intersection = dashboardFilter.values.filter((v) => graphFilter.values.includes(v));
    return [
      {
        ...dashboardFilter,
        values: intersection.length > 0 ? intersection : dashboardFilter.values,
      },
    ];
  }

  // Graph includes, dashboard excludes: Remove excluded values from graph's included set
  if (graphFilter.mode === 'include' && dashboardFilter.mode === 'exclude') {
    const remaining = graphFilter.values.filter((v) => !dashboardFilter.values.includes(v));
    if (remaining.length === 0) {
      // All values excluded, return empty include
      return [
        {
          ...graphFilter,
          values: [],
        },
      ];
    }
    return [
      {
        ...graphFilter,
        values: remaining,
      },
    ];
  }

  // Graph excludes, dashboard includes: Dashboard include must not be in graph's exclude
  if (graphFilter.mode === 'exclude' && dashboardFilter.mode === 'include') {
    const validIncludes = dashboardFilter.values.filter((v) => !graphFilter.values.includes(v));
    return [
      {
        ...dashboardFilter,
        values: validIncludes.length > 0 ? validIncludes : dashboardFilter.values,
      },
    ];
  }

  // Both exclude: Union of excluded values (exclude both sets)
  if (graphFilter.mode === 'exclude' && dashboardFilter.mode === 'exclude') {
    const allExcluded = Array.from(new Set([...graphFilter.values, ...dashboardFilter.values]));
    return [
      {
        ...dashboardFilter,
        values: allExcluded,
      },
    ];
  }

  return [dashboardFilter];
}

/**
 * Combines measure filters.
 * Both filters are applied together (intersection/AND logic).
 * This creates the most restrictive filter combination.
 *
 * Examples:
 * - Graph: revenue >= 5000, Dashboard: revenue <= 10000 → Both applied (5000 <= revenue <= 10000)
 * - Graph: revenue >= 5000, Dashboard: revenue >= 3000 → Both applied (effectively >= 5000)
 */
function combineMeasureFilters(
  graphFilter: MeasureFilterRule,
  dashboardFilter: MeasureFilterRule
): FilterRule[] {
  // Return both filters to create intersection (AND logic)
  // The most restrictive constraint naturally wins
  return [graphFilter, dashboardFilter];
}

/**
 * Combines date filters.
 * Both filters are applied together (intersection/AND logic).
 * This creates the most restrictive date range.
 *
 * Examples:
 * - Graph: date >= "2024-01-01", Dashboard: date <= "2024-12-31" → Both applied (date range)
 * - Graph: "last 10 days", Dashboard: "last 1 day" → Both applied (effectively last 1 day)
 */
function combineDateFilters(
  graphFilter: DateFilterRule,
  dashboardFilter: DateFilterRule
): FilterRule[] {
  // Return both filters to create intersection (AND logic)
  // The most restrictive constraint naturally wins
  return [graphFilter, dashboardFilter];
}

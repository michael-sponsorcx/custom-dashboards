import { useMemo } from 'react';
import type { DashboardItem } from '../../../../../types/dashboard';
import type { FilterRule } from '../../../../../types/filters';
import { buildQueryFromTemplate } from '../../../../../utils/graphql/builder/builders/buildQueryFromTemplate';
import { combineAllFilters } from '../utils/graphFilterHelpers';
import type { DrillDownFilter } from '../utils/graphFilterHelpers';

/**
 * Builds GraphQL query from template with combined filters
 *
 * **Purpose:** Centralize query building logic with filter combination
 * **Pattern:** Template + dashboard filters + drill-down → GraphQL query string
 *
 * @input template: DashboardItem - Graph configuration
 * @input dashboardFilters: FilterRule[] - Global dashboard filters
 * @input drillDownFilters: DrillDownFilter[] - Drill-down filter stack
 * @input effectivePrimaryDimension: string - Current primary dimension (may be overridden)
 * @output string - GraphQL query string
 *
 * @example
 * // Input: template with filters, dashboard filters, drill-down filters
 * // Output: "query { cube(where: {...}) { Revenue { region sales } } }"
 * const query = useGraphQuery(template, dashboardFilters, drillDownFilters, "Product");
 */
export function useGraphQuery(
  template: DashboardItem,
  dashboardFilters: FilterRule[],
  drillDownFilters: DrillDownFilter[],
  effectivePrimaryDimension?: string
): string {
  // Combine all filter sources
  const effectiveFilters = useMemo(() => {
    return combineAllFilters(
      template.filters || [],
      dashboardFilters,
      drillDownFilters
    );
  }, [template.filters, dashboardFilters, drillDownFilters]);

  // Build query with combined filters and effective dimension
  const query = useMemo(() => {
    return buildQueryFromTemplate({
      ...template,
      primaryDimension: effectivePrimaryDimension,
      filters: effectiveFilters,
    });
  }, [
    template.viewName,
    template.measures,
    template.dimensions,
    template.dates,
    effectiveFilters,
    effectivePrimaryDimension,
    template.orderByField,
    template.orderByDirection,
  ]);

  return query;
}

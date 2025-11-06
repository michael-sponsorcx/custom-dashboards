import { combineFilters } from '../../../../../utils/filters/combineFilters';
import type { FilterRule } from '../../../../../types/filters';

/**
 * Drill-down filter structure - accumulated filters from each drill-down action
 */
export interface DrillDownFilter {
  field: string;
  value: any | any[]; // Single value or array for accumulated filters
}

/**
 * Combines graph filters, dashboard filters, and drill-down filters into single array
 *
 * **Purpose:** Create complete filter set for Cube.js query
 * **Pattern:** Graph filters → combine with dashboard → add drill-down filters
 *
 * @input graphFilters: FilterRule[] - Filters from graph template
 * @input dashboardFilters: FilterRule[] - Global dashboard filters
 * @input drillDownFilters: DrillDownFilter[] - Accumulated drill-down filters
 * @output FilterRule[] - Combined filter array for query
 *
 * @example
 * // Input: graph: [{field: "status", values: ["active"]}], dashboard: [], drillDown: [{field: "region", value: "North"}]
 * // Output: [{field: "status", ...}, {field: "region", values: ["North"], ...}]
 * combineAllFilters(graphFilters, dashboardFilters, drillDownFilters);
 */
export function combineAllFilters(
  graphFilters: FilterRule[],
  dashboardFilters: FilterRule[],
  drillDownFilters: DrillDownFilter[]
): FilterRule[] {
  // First combine graph + dashboard filters
  const combined = combineFilters(graphFilters, dashboardFilters);

  // Add drill-down filters if any exist
  if (drillDownFilters.length === 0) {
    return combined;
  }

  // Convert drill-down filters to FilterRule format
  const drillDownFilterRules: FilterRule[] = drillDownFilters.map((filter) => ({
    fieldName: filter.field,
    fieldTitle: filter.field,
    fieldType: 'dimension' as const,
    mode: 'include' as const,
    values: Array.isArray(filter.value) ? filter.value : [filter.value],
  }));

  return [...combined, ...drillDownFilterRules];
}

/**
 * Updates drill-down filter stack - adds new filter or accumulates values
 *
 * **Pattern:** If field exists → add value to array, else → create new filter
 * **Purpose:** Support multiple drill-downs on same dimension
 *
 * @input existingFilters: DrillDownFilter[] - Current filter stack
 * @input field: string - Dimension field to filter
 * @input value: any - Value to filter by
 * @output DrillDownFilter[] - Updated filter stack
 *
 * @example
 * // Input: existing: [{field: "region", value: ["North"]}], field: "region", value: "South"
 * // Output: [{field: "region", value: ["North", "South"]}] (accumulated)
 * updateDrillDownFilters(existing, "region", "South");
 *
 * @example
 * // Input: existing: [{field: "region", value: "North"}], field: "product", value: "Widget"
 * // Output: [{field: "region", value: "North"}, {field: "product", value: "Widget"}] (stacked)
 * updateDrillDownFilters(existing, "product", "Widget");
 */
export function updateDrillDownFilters(
  existingFilters: DrillDownFilter[],
  field: string,
  value: any
): DrillDownFilter[] {
  // Check if filter for this field already exists
  const existingFilterIndex = existingFilters.findIndex((f) => f.field === field);

  // Field already has filter - accumulate the value
  if (existingFilterIndex >= 0) {
    const existingFilter = existingFilters[existingFilterIndex];

    // Convert to array if needed
    const existingValues = Array.isArray(existingFilter.value)
      ? existingFilter.value
      : [existingFilter.value];

    // Add new value if not already present
    const newValues = existingValues.includes(value) ? existingValues : [...existingValues, value];

    const updatedFilters = [...existingFilters];
    updatedFilters[existingFilterIndex] = {
      field,
      value: newValues,
    };

    return updatedFilters;
  }

  // New field - add to stack
  return [...existingFilters, { field, value }];
}

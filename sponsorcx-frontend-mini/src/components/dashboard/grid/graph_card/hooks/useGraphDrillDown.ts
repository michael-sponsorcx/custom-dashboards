import { useState, useCallback, useMemo } from 'react';
import type { DashboardItem } from '../../../../../types/dashboard';
import type { ChartDataPoint } from '../../../../../utils/chartDataTransformations/types';
import type { DrillDownFilter } from '../utils/graphFilterHelpers';
import { updateDrillDownFilters } from '../utils/graphFilterHelpers';
import { resolveFullDimensionName, extractDimensionValue } from '../utils/dimensionHelpers';

/**
 * Drill-down state tracking dimension swaps and accumulated filters
 */
export interface DrillDownState {
  newPrimaryDimension: string;
  drillDownFilters: DrillDownFilter[];
}

/**
 * Return type for useGraphDrillDown hook
 */
export interface GraphDrillDownResult {
  drillDownState: DrillDownState | null;
  effectivePrimaryDimension: string | undefined;
  isResetting: boolean;
  handleDrillDown: (dimension: string, dataPoint: ChartDataPoint) => void;
  resetDrillDown: () => void;
}

/**
 * Manages drill-down state for graph cards
 *
 * **Purpose:** Handle dimension swapping + filter stacking when user drills down
 * **Pattern:** Click bar → swap dimension → add filter → stack on subsequent drills
 *
 * @input template: DashboardItem - Graph configuration with dimensions
 * @output GraphDrillDownResult - State and handlers for drill-down
 *
 * @example
 * // User clicks bar showing "North" region, drills down to "Product"
 * const { handleDrillDown, effectivePrimaryDimension } = useGraphDrillDown(template);
 * handleDrillDown("Product", { region: "North", sales: 1000 });
 * // Result: effectivePrimaryDimension = "Product", filter = {field: "region", value: "North"}
 */
export function useGraphDrillDown(template: DashboardItem): GraphDrillDownResult {
  const [drillDownState, setDrillDownState] = useState<DrillDownState | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  // Effective primary dimension: use drill-down override if present, else template default
  const effectivePrimaryDimension = useMemo(() => {
    return drillDownState?.newPrimaryDimension || template.primaryDimension;
  }, [drillDownState, template.primaryDimension]);

  /**
   * Handle drill-down action: swap dimension and add filter
   *
   * @param dimension - New primary dimension to drill into
   * @param dataPoint - Chart data point that was clicked
   */
  const handleDrillDown = useCallback(
    (dimension: string, dataPoint: ChartDataPoint) => {
      // Get current dimension field (what's displayed NOW, before drill-down)
      let currentDimensionField =
        drillDownState?.newPrimaryDimension || template.primaryDimension;

      if (!currentDimensionField) return;

      // Resolve to full qualified name for filter
      currentDimensionField = resolveFullDimensionName(
        currentDimensionField,
        template.dimensions || []
      );

      // Extract value from data point (handles both qualified and simple names)
      const currentDimensionValue = extractDimensionValue(dataPoint, currentDimensionField);

      if (currentDimensionValue === undefined) {
        console.warn(
          `Could not find value for dimension "${currentDimensionField}" in data point`,
          dataPoint
        );
        return;
      }

      // Update filter stack (accumulate if field exists, else add new)
      const existingFilters = drillDownState?.drillDownFilters || [];
      const updatedFilters = updateDrillDownFilters(
        existingFilters,
        currentDimensionField,
        currentDimensionValue
      );

      // Set new drill-down state
      setDrillDownState({
        newPrimaryDimension: dimension,
        drillDownFilters: updatedFilters,
      });
    },
    [drillDownState, template.primaryDimension, template.dimensions]
  );

  /**
   * Reset drill-down to original state
   */
  const resetDrillDown = useCallback(() => {
    setIsResetting(true);
    // Brief animation delay before reset
    setTimeout(() => {
      setDrillDownState(null);
      setIsResetting(false);
    }, 300);
  }, []);

  return {
    drillDownState,
    effectivePrimaryDimension,
    isResetting,
    handleDrillDown,
    resetDrillDown,
  };
}

import { useMemo, useState } from 'react';
import type { ChartDataPoint } from '../../../../utils/chartDataTransformations/types';

/**
 * State for a clicked bar in the chart
 */
export interface ClickedBarState {
  data: ChartDataPoint;
  position: { x: number; y: number };
}

/**
 * Return type for the useDrillDown hook
 */
export interface UseDrillDownReturn {
  /** Available dimensions that can be drilled down into */
  drillDownDimensions: string[];
  /** Whether drill-down functionality is available */
  canDrillDown: boolean;
  /** Currently clicked bar state (if any) */
  clickedBar: ClickedBarState | null;
  /** Whether the drill-down dimension selection view is shown */
  showDrillDown: boolean;
  /** Handler to set the clicked bar state */
  setClickedBar: (state: ClickedBarState | null) => void;
  /** Handler to toggle the drill-down view */
  setShowDrillDown: (show: boolean) => void;
  /** Handler to execute drill-down on a selected dimension */
  handleDrillDown: (dimension: string, dataPoint: ChartDataPoint) => void;
}

/**
 * Calculate dimensions available for drill-down by filtering out the current primary dimension
 *
 * Handles both simple dimension names and qualified names (e.g., "Revenue.property_name")
 * by comparing the field name portion of the dimension string.
 *
 * @param availableDimensions - All dimensions available in the dataset
 * @param primaryDimension - The currently selected primary dimension to filter out
 * @returns Array of dimension names available for drill-down
 *
 * @example
 * // Input: availableDimensions: ['region', 'product', 'channel'], primaryDimension: 'region'
 * // Output: ['product', 'channel']
 * getDrillDownDimensions(['region', 'product', 'channel'], 'region');
 *
 * @example
 * // Input with qualified names: availableDimensions: ['Revenue.region', 'Revenue.product'], primaryDimension: 'region'
 * // Output: ['Revenue.product']
 * getDrillDownDimensions(['Revenue.region', 'Revenue.product'], 'region');
 *
 * @example
 * // Input: No primary dimension specified
 * // Output: All dimensions (no filtering)
 * getDrillDownDimensions(['region', 'product', 'channel'], undefined);
 * // Returns: ['region', 'product', 'channel']
 */
export function getDrillDownDimensions(
  availableDimensions: string[],
  primaryDimension?: string
): string[] {
  if (!primaryDimension) {
    return availableDimensions;
  }

  // Filter out the current primary dimension from the drill-down options
  // Handle both "property_name" and "Revenue.property_name" formats
  return availableDimensions.filter((dim) => {
    // Check exact match first
    if (dim === primaryDimension) {
      return false;
    }

    // Check if dimension ends with the primary dimension (e.g., "Revenue.property_name" ends with "property_name")
    const dimFieldName = dim.includes('.') ? dim.split('.').pop() : dim;
    const primaryFieldName = primaryDimension.includes('.')
      ? primaryDimension.split('.').pop()
      : primaryDimension;

    return dimFieldName !== primaryFieldName;
  });
}

/**
 * Custom hook to manage drill-down state and interactions for chart components
 *
 * Provides state management and handlers for:
 * - Tracking clicked bars/data points
 * - Managing drill-down UI state
 * - Filtering available dimensions
 * - Executing drill-down actions
 *
 * @param availableDimensions - Array of all available dimension names
 * @param primaryDimension - The currently active primary dimension
 * @param onDrillDown - Callback function to execute when user selects a dimension to drill down
 * @returns Object containing state and handlers for drill-down functionality
 *
 * @example
 * // Basic usage in a chart component
 * const {
 *   drillDownDimensions,
 *   canDrillDown,
 *   clickedBar,
 *   showDrillDown,
 *   setClickedBar,
 *   setShowDrillDown,
 *   handleDrillDown
 * } = useDrillDown(
 *   ['region', 'product', 'channel'],
 *   'region',
 *   (dimension, dataPoint) => {
 *     console.log('Drilling down into', dimension, 'with data', dataPoint);
 *   }
 * );
 */
export function useDrillDown(
  availableDimensions: string[] = [],
  primaryDimension?: string,
  onDrillDown?: (dimension: string, dataPoint: ChartDataPoint) => void
): UseDrillDownReturn {
  // State for tracking clicked bar and dropdown menu
  const [clickedBar, setClickedBar] = useState<ClickedBarState | null>(null);

  // State for drill-down view
  const [showDrillDown, setShowDrillDown] = useState(false);

  // Calculate available dimensions for drill-down
  const drillDownDimensions = useMemo(() => {
    return getDrillDownDimensions(availableDimensions, primaryDimension);
  }, [availableDimensions, primaryDimension]);

  // Check if drill-down is available
  const canDrillDown = drillDownDimensions.length > 0 && !!onDrillDown;

  /**
   * Handler to execute drill-down on a selected dimension
   *
   * @param dimension - The dimension to drill down into
   * @param dataPoint - The data point associated with the drill-down
   */
  const handleDrillDown = (dimension: string, dataPoint: ChartDataPoint) => {
    if (onDrillDown) {
      onDrillDown(dimension, dataPoint);
    }
    setClickedBar(null);
    setShowDrillDown(false);
  };

  return {
    drillDownDimensions,
    canDrillDown,
    clickedBar,
    showDrillDown,
    setClickedBar,
    setShowDrillDown,
    handleDrillDown,
  };
}

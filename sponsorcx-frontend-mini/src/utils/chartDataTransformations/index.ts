/**
 * Chart Data Transformation Utilities
 *
 * This module contains all data transformation logic for different visualization types.
 * Each transformation is clearly labeled and designed to handle specific requirements.
 *
 * IMPORTANT: This is the SINGLE SOURCE OF TRUTH for transforming Cube GraphQL data.
 * All visualization components (charts, tables, KPIs) should use transformChartData().
 */

import {
  TransformChartDataOptions,
  TransformationResult,
  ChartSpecificTransformOptions,
} from './types';
import { barChartTransformation } from './transformations/barChart';
import { barStackedTransformation } from './transformations/barStacked';
import { lineChartTransformation, areaChartTransformation } from './transformations/lineChart';
import { pieChartTransformation } from './transformations/pieChart';
import { kpiChartTransformation } from './transformations/kpi';

// Re-export types for convenience
export type { ChartType, TransformationResult, TransformChartDataOptions } from './types';

/**
 * Transforms Cube GraphQL response to the appropriate format for any visualization type.
 * This is the ONLY function that should parse Cube API responses.
 *
 * Cube returns data in the format:
 * { data: { cube: [{ viewName: { field1: value1, ... } }, ...] } }
 *
 * This function:
 * 1. Parses the Cube response to extract raw data
 * 2. Routes to the appropriate transformation based on chart type
 * 3. Returns data ready for the specific visualization component
 *
 * @param options - Configuration object containing chart type and raw Cube data
 * @returns Transformed data ready for rendering
 */
export function transformChartData(options: TransformChartDataOptions): TransformationResult {
  const { chartType, cubeData } = options;

  // Step 1: Parse Cube GraphQL response to flat data format
  // This is the ONLY place where Cube response parsing should happen
  if (!cubeData?.data?.cube || !Array.isArray(cubeData.data.cube)) {
    return { data: [] };
  }

  const cubeArray = cubeData.data.cube;
  if (cubeArray.length === 0) {
    return { data: [] };
  }

  const chartData = cubeArray.map((item: unknown) => {
    if (!item || typeof item !== 'object') {
      return {};
    }
    const viewName = Object.keys(item)[0];
    const viewData = (item as Record<string, unknown>)[viewName];
    return viewData as Record<string, unknown>;
  });

  // Step 2: For 'table' type, return raw parsed data without further transformation
  if (chartType === 'table') {
    return {
      data: chartData,
      dimensionField: undefined,
      series: [],
    };
  }

  // Step 3: Route to chart-specific transformations for all other types
  const transformOptions: ChartSpecificTransformOptions = {
    chartData,
    primaryColor: options.primaryColor,
    getColorFn: options.getColorFn,
    primaryDimension: options.primaryDimension,
    secondaryDimension: options.secondaryDimension,
    selectedMeasure: options.selectedMeasure,
    maxDataPoints: options.maxDataPoints,
  };

  switch (chartType) {
    case 'bar':
      return barChartTransformation(transformOptions);
    case 'bar_stacked':
      return barStackedTransformation(transformOptions);
    case 'line':
      return lineChartTransformation(transformOptions);
    case 'area':
      return areaChartTransformation(transformOptions);
    case 'pie':
      return pieChartTransformation(transformOptions);
    case 'kpi':
      return kpiChartTransformation(transformOptions);
    default:
      // Unknown chart type - return raw parsed data
      return {
        data: chartData,
        dimensionField: options.primaryDimension,
        series: [],
      };
  }
}

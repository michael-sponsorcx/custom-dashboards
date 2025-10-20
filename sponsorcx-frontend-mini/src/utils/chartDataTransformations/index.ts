/**
 * Chart Data Transformation Utilities
 *
 * This module contains all data transformation logic for different chart types.
 * Each transformation is clearly labeled and designed to handle specific chart requirements.
 *
 * IMPORTANT: This is the ONLY place where Cube GraphQL data should be transformed to chart format.
 * All chart components should pass raw Cube data to these functions.
 */

import { TransformChartDataOptions, TransformationResult, ChartSpecificTransformOptions } from './types';
import { barChartTransformation } from './transformations/barChart';
import { barStackedTransformation } from './transformations/barStacked';
import { lineChartTransformation, areaChartTransformation } from './transformations/lineChart';
import { pieChartTransformation } from './transformations/pieChart';
import { numberChartTransformation } from './transformations/numberChart';

// Re-export types for convenience
export type { ChartType, TransformationResult, TransformChartDataOptions } from './types';

/**
 * Transforms Cube GraphQL response to flat chart data format
 * INTERNAL USE ONLY - not exported
 *
 * @param cubeResponse - Raw Cube GraphQL response
 * @returns Flattened array of data points
 */
function transformCubeDataToChartData(cubeResponse: any): any[] {
  if (!cubeResponse?.data?.cube || !Array.isArray(cubeResponse.data.cube)) {
    return [];
  }

  return cubeResponse.data.cube.map((item: any) => {
    const viewName = Object.keys(item)[0];
    return item[viewName];
  });
}

/**
 * Main entry point for chart data transformations.
 * Automatically routes to the appropriate transformation based on chart type.
 * Accepts raw Cube GraphQL data and handles the transformation internally.
 *
 * @param options - Configuration object containing chart type and raw Cube data
 * @returns Transformed data ready for chart rendering
 */
export function transformChartData(options: TransformChartDataOptions): TransformationResult {
  const { chartType, cubeData } = options;

  // Transform Cube data to flat chart format (this is the only place this should happen)
  const chartData = transformCubeDataToChartData(cubeData);

  if (!chartData || chartData.length === 0) {
    return { data: [] };
  }

  // Prepare common options for all transformations
  const transformOptions: ChartSpecificTransformOptions = {
    chartData,
    primaryColor: options.primaryColor,
    getColorFn: options.getColorFn,
    primaryDimension: options.primaryDimension,
    secondaryDimension: options.secondaryDimension,
    selectedMeasure: options.selectedMeasure,
  };

  // Route to appropriate transformation based on chart type
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
    case 'number':
      return numberChartTransformation(transformOptions);
    default:
      console.warn(`Unknown chart type: ${chartType}. Returning raw data.`);
      return { data: chartData };
  }
}

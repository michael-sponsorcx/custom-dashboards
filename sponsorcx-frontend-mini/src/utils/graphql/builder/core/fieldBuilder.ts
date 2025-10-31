/**
 * Field Builder
 *
 * Builds field selections for GraphQL queries.
 */

import { CubeMeasure, CubeDimension } from '../../../../types/cube';
import { stripCubePrefix } from './utils';

/**
 * Build fields list from measures, dimensions, and time dimensions
 *
 * @param measures - Measures to include
 * @param dimensions - Regular dimensions to include
 * @param timeDimensions - Time dimensions to include
 * @returns Array of field strings
 */
export function buildFieldsList(
  measures: CubeMeasure[],
  dimensions: CubeDimension[],
  timeDimensions: CubeDimension[]
): string[] {
  const fields: string[] = [];

  // Add measures
  measures.forEach((measure) => {
    const fieldName = stripCubePrefix(measure.name);
    fields.push(`      ${fieldName}`);
  });

  // Add regular dimensions
  dimensions.forEach((dimension) => {
    const fieldName = stripCubePrefix(dimension.name);
    fields.push(`      ${fieldName}`);
  });

  // Add time dimensions with granularity
  timeDimensions.forEach((timeDim) => {
    const fieldName = stripCubePrefix(timeDim.name);
    // Default to 'value' for time dimensions
    fields.push(`      ${fieldName} {
        value
      }`);
  });

  return fields;
}

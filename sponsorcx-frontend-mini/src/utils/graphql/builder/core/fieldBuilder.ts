/**
 * Field Builder
 *
 * Builds field selections for GraphQL queries.
 */

import { stripCubePrefix } from './utils';

/**
 * Build fields list from measures, dimensions, and time dimensions
 *
 * @param measures - Measure field names
 * @param dimensions - Dimension field names
 * @param timeDimensions - Time dimension field names
 * @returns Array of field strings
 */
export const buildFieldsList = (
  measures: string[],
  dimensions: string[],
  timeDimensions: string[]
): string[] => {
  const fields: string[] = [];

  // Add measures
  measures.forEach((name) => {
    const fieldName = stripCubePrefix(name);
    fields.push(`      ${fieldName}`);
  });

  // Add regular dimensions
  dimensions.forEach((name) => {
    const fieldName = stripCubePrefix(name);
    fields.push(`      ${fieldName}`);
  });

  // Add time dimensions with granularity
  timeDimensions.forEach((name) => {
    const fieldName = stripCubePrefix(name);
    // Default to 'value' for time dimensions
    fields.push(`      ${fieldName} {
        value
      }`);
  });

  return fields;
};

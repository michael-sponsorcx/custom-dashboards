/**
 * Build Query From Template
 *
 * Utility function to dynamically build a GraphQL query from a GraphTemplate.
 * This allows queries to be reconstructed on-the-fly instead of storing them.
 */

import { GraphTemplate } from '../../../../types/graph';
import { buildSimpleCubeQuery } from './cubeQuery';
import { CubeMeasure, CubeDimension } from '../../../../types/cube';

/**
 * Build a GraphQL query from a GraphTemplate
 *
 * Converts the template's stored field names into the format expected by the query builder
 * and generates a fresh query.
 *
 * @param template - Graph template containing view, measures, dimensions, etc.
 * @returns GraphQL query string
 */
export function buildQueryFromTemplate(template: GraphTemplate): string {
  // Convert string arrays to CubeMeasure/CubeDimension objects
  const measures: CubeMeasure[] = template.measures.map((name) => ({
    name,
    type: 'number', // Default type, actual type isn't critical for query building
  }));

  const dimensions: CubeDimension[] = template.dimensions.map((name) => ({
    name,
    type: 'string', // Default type
  }));

  const timeDimensions: CubeDimension[] = template.dates.map((name) => ({
    name,
    type: 'time', // Time dimensions
  }));

  // Build orderBy parameter if specified
  const orderBy =
    template.orderByField && template.orderByDirection
      ? { field: template.orderByField, direction: template.orderByDirection }
      : undefined;

  // Use the query builder to generate the query
  return buildSimpleCubeQuery({
    cubeName: template.viewName,
    measures,
    dimensions,
    timeDimensions,
    filters: template.filters,
    orderBy,
  });
}

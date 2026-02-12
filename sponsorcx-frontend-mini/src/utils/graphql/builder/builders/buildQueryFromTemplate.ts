/**
 * Build Query From Template
 *
 * Utility function to dynamically build a GraphQL query from a GraphUI.
 * This allows queries to be reconstructed on-the-fly instead of storing them.
 */

import { GraphUI } from '../../../../types/graph';
import { buildSimpleCubeQuery } from './cubeQuery';

/**
 * Build a GraphQL query from a GraphUI
 *
 * @param template - Graph template containing view, measures, dimensions, etc.
 * @returns GraphQL query string
 */
export const buildQueryFromTemplate = (template: GraphUI): string => {
  const { measures, dimensions, dates: timeDimensions } = template;

  if (measures.length === 0 && dimensions.length === 0 && timeDimensions.length === 0) {
    console.warn('[buildQueryFromTemplate] No measures, dimensions, or time dimensions configured for template:', template.viewName);
    return '';
  }

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

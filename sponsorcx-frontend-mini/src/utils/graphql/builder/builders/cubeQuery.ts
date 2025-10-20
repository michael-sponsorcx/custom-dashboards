/**
 * Cube Query Builder
 *
 * Main query builder that composes all core utilities to build complete GraphQL queries.
 */

import { QueryBuilderParams } from '../../types';
import { buildFieldsList } from '../core/fieldBuilder';
import { buildCubeArguments, buildCubeNameArguments } from '../core/argumentBuilder';

/**
 * Build a complete Cube GraphQL query from parameters
 *
 * @param params - Query builder parameters
 * @returns Complete GraphQL query string
 */
export function buildCubeQuery(params: QueryBuilderParams): string {
  const {
    cubeName,
    measures,
    dimensions,
    timeDimensions,
    orderBy,
    limit,
    timezone,
    filters
  } = params;

  // Build the fields list
  const fields = buildFieldsList(measures, dimensions, timeDimensions);

  // Build cube arguments (limit, timezone, where)
  const cubeArgs = buildCubeArguments(cubeName, {
    filters,
    limit,
    timezone,
  });

  // Build cube name arguments (orderBy)
  const cubeNameArgs = buildCubeNameArguments(orderBy);

  // Construct the complete query
  const lowercaseCubeName = cubeName.toLowerCase();

  return `
query {
  cube${cubeArgs} {
    ${lowercaseCubeName}${cubeNameArgs} {
${fields.join('\n')}
    }
  }
}`.trim();
}

/**
 * Build a simple Cube query (alias for buildCubeQuery)
 * Maintains backward compatibility with existing code
 *
 * @param params - Query builder parameters
 * @returns Complete GraphQL query string
 */
export function buildSimpleCubeQuery(params: QueryBuilderParams): string {
  return buildCubeQuery(params);
}

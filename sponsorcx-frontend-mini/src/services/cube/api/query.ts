/**
 * Cube GraphQL Query Execution
 *
 * Handles execution of GraphQL queries against the Cube API.
 */

import { cubeApiRequest } from '../core/client';
import { handleApiError } from '../core/errorHandler';
import { CubeQueryResult } from '../types';

/**
 * Execute a GraphQL query against Cube API
 *
 * @param query - GraphQL query string
 * @returns Query result with data or errors
 *
 * @example
 * ```typescript
 * const result = await executeCubeGraphQL(`
 *   query {
 *     cube {
 *       orders {
 *         count
 *       }
 *     }
 *   }
 * `);
 * ```
 */
export async function executeCubeGraphQL(query: string): Promise<CubeQueryResult> {
  try {
    const result = await cubeApiRequest<CubeQueryResult>('/graphql', {
      method: 'POST',
      body: JSON.stringify({ query }),
    });

    return result;
  } catch (error) {
    throw handleApiError(error, 'executeCubeGraphQL');
  }
}

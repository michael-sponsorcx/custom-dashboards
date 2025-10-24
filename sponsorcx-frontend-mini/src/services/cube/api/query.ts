/**
 * Cube GraphQL Query Execution
 *
 * Handles execution of GraphQL queries against the Cube API.
 */

import { cubeApiRequest } from '../core/client';
import { handleApiError } from '../core/errorHandler';
import { CubeQueryResult } from '../types';

/**
 * Flattens time dimension values in query results
 * Converts { value: "date" } to just "date"
 *
 * @param data - Raw query result data
 * @returns Transformed data with flattened time dimensions
 */
export function flattenTimeDimensions(data: any): any {
  if (!data) return data;

  // Handle array of results
  if (Array.isArray(data)) {
    return data.map(item => flattenTimeDimensions(item));
  }

  // Handle object
  if (typeof data === 'object') {
    const flattened: any = {};

    for (const key in data) {
      const value = data[key];

      // If it's an object with only a 'value' property, extract the value
      if (value && typeof value === 'object' && 'value' in value && Object.keys(value).length === 1) {
        flattened[key] = value.value;
      } else {
        // Recursively flatten nested objects/arrays
        flattened[key] = flattenTimeDimensions(value);
      }
    }

    return flattened;
  }

  return data;
}

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

    // Flatten time dimension values in the response data
    if (result.data) {
      result.data = flattenTimeDimensions(result.data);
    }

    return result;
  } catch (error) {
    throw handleApiError(error, 'executeCubeGraphQL');
  }
}

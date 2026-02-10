/**
 * Backend Cube GraphQL Query Execution
 *
 * Proxies GraphQL query execution through the backend API instead of calling Cube Cloud directly.
 */

import { executeBackendGraphQL } from '../core/client';
import { CubeQueryResult } from '../core/types';

/**
 * Flattens time dimension values in query results
 * Converts { value: "date" } to just "date"
 *
 * @param data - Raw query result data
 * @returns Transformed data with flattened time dimensions
 */
export function flattenTimeDimensions(data: unknown): unknown {
  if (!data) return data;

  // Handle array of results
  if (Array.isArray(data)) {
    return data.map((item) => flattenTimeDimensions(item));
  }

  // Handle object
  if (typeof data === 'object') {
    const flattened: Record<string, unknown> = {};

    for (const key in data) {
      const value = (data as Record<string, unknown>)[key];

      // If it's an object with only a 'value' property, extract the value
      if (
        value &&
        typeof value === 'object' &&
        'value' in value &&
        Object.keys(value).length === 1
      ) {
        flattened[key] = (value as { value: unknown }).value;
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
 * Execute a GraphQL query against Cube API via backend proxy
 *
 * @param query - GraphQL query string to execute
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
    // Escape the query string for GraphQL
    const escapedQuery = query.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');

    // Build the backend GraphQL query that wraps the Cube query
    const backendQuery = `
      query {
        cubeQuery(query: "${escapedQuery}")
      }
    `;

    // Execute the query through the backend
    const response = await executeBackendGraphQL<{ cubeQuery: CubeQueryResult }>(backendQuery);

    // Extract the cube query result from the backend wrapper
    const cubeResult = response.data?.cubeQuery;

    if (!cubeResult) {
      throw new Error('No data returned from Cube query');
    }

    // The backend returns the Cube API response directly
    // Flatten time dimensions if data exists
    if (cubeResult.data) {
      cubeResult.data = flattenTimeDimensions(cubeResult.data) as CubeQueryResult['data'];
    }

    return cubeResult;
  } catch (error) {
    // Re-throw with context
    if (error instanceof Error) {
      throw new Error(`Failed to execute Cube query via backend: ${error.message}`);
    }
    throw error;
  }
}

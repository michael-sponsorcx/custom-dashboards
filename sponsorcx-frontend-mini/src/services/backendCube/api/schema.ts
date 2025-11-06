/**
 * Backend Cube GraphQL Schema API
 *
 * Fetches schema and filter operators through the backend proxy instead of calling Cube Cloud directly.
 */

import { executeBackendGraphQL } from '../core/backendClient';
import { getCached, clearCache } from '../core/cache';

/**
 * Fetch available filter operators from backend via Cube schema
 * Results are cached for 30 minutes to avoid repeated API calls
 *
 * @returns Array of valid operator names
 */
export async function getValidFilterOperators(): Promise<string[]> {
  const cacheKey = 'cube:filterOperators';
  const ttl = 30 * 60 * 1000; // 30 minutes

  try {
    return await getCached(
      cacheKey,
      async () => {
        // Build the backend GraphQL query
        const backendQuery = `
          query {
            cubeSchema {
              operators
            }
          }
        `;

        // Execute the query through the backend
        const response = await executeBackendGraphQL<{
          cubeSchema: { operators: string[] };
        }>(backendQuery);

        // Extract the operators from the backend wrapper
        const operators = response.data?.cubeSchema?.operators;

        if (!operators || operators.length === 0) {
          // Fallback to known operators if none returned
          return [
            'equals',
            'notEquals',
            'in',
            'notIn',
            'contains',
            'notContains',
            'set',
            'notSet',
            'gt',
            'gte',
            'lt',
            'lte',
            'inDateRange',
            'notInDateRange',
            'beforeDate',
            'afterDate',
          ];
        }

        return operators;
      },
      ttl
    );
  } catch (error) {
    // Fallback to known operators if schema fetch fails
    return [
      'equals',
      'notEquals',
      'in',
      'notIn',
      'contains',
      'notContains',
      'set',
      'notSet',
      'gt',
      'gte',
      'lt',
      'lte',
      'inDateRange',
      'notInDateRange',
      'beforeDate',
      'afterDate',
    ];
  }
}

/**
 * Clear the cached schema
 * Useful for testing or when schema changes
 */
export function clearSchemaCache(): void {
  clearCache();
}

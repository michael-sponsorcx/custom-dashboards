/**
 * Backend Cube Dimension Values API
 *
 * Fetches distinct dimension values through the backend proxy instead of calling Cube Cloud directly.
 */

import { executeBackendGraphQL } from '../core/backendClient';

/**
 * Strip cube prefix from field name
 * Example: "ViewName.fieldName" -> "fieldName"
 *
 * @param fieldName - Field name possibly with cube prefix
 * @returns Stripped field name
 */
function stripCubePrefix(fieldName: string): string {
  const parts = fieldName.split('.');
  return parts.length > 1 ? parts[parts.length - 1] : fieldName;
}

/**
 * Fetch distinct values for a specific dimension field via backend proxy
 * Used for populating filter dropdown options
 *
 * @param viewName - Cube view name
 * @param dimensionName - Dimension field name
 * @returns Sorted array of distinct values
 *
 * @example
 * ```typescript
 * const values = await fetchDistinctDimensionValues('Orders', 'status');
 * // Returns: ['pending', 'shipped', 'delivered']
 * ```
 */
export async function fetchDistinctDimensionValues(
  viewName: string,
  dimensionName: string
): Promise<string[]> {
  try {
    // Strip cube prefix if present (e.g., "Revenue.Revenue" -> "Revenue", "Revenue.property_name" -> "property_name")
    const cleanViewName = stripCubePrefix(viewName);
    const cleanDimensionName = stripCubePrefix(dimensionName);

    // Build the backend GraphQL query
    const backendQuery = `
      query {
        cubeDimensionValues(view: "${cleanViewName}", dimension: "${cleanDimensionName}") {
          values
        }
      }
    `;

    // Execute the query through the backend
    const response = await executeBackendGraphQL<{
      cubeDimensionValues: { values: string[] };
    }>(backendQuery);

    // Extract the values from the backend wrapper
    const values = response.data?.cubeDimensionValues?.values;

    if (!values) {
      return [];
    }

    // Return sorted array
    return values.sort();
  } catch (error) {
    // Re-throw with context
    if (error instanceof Error) {
      throw new Error(`Failed to fetch dimension values via backend: ${error.message}`);
    }
    throw error;
  }
}

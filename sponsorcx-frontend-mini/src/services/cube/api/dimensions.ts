/**
 * Cube Dimension Values API
 *
 * Fetches distinct values for dimension fields.
 * Used for populating filter options.
 */

import { executeCubeGraphQL } from './query';
import { handleApiError } from '../core/errorHandler';

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
 * Fetch distinct values for a specific dimension field
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
  console.log('fetchDistinctDimensionValues called with:', { viewName, dimensionName });

  // Strip cube prefix if present
  const fieldNameStripped = stripCubePrefix(dimensionName);
  const lowercaseViewName = viewName.toLowerCase();

  // Build GraphQL query to fetch distinct values
  const query = `query {
  cube {
    ${lowercaseViewName} {
      ${fieldNameStripped}
    }
  }
}`;

  console.log('Generated query for dimension values:', query);

  try {
    const result = await executeCubeGraphQL(query);
    console.log('Query result:', result);

    // Extract unique values from result
    const values = new Set<string>();

    // Result structure: { data: { cube: [ { viewname: { fieldname: value } }, ... ] } }
    // Note: cube is an ARRAY, not an object
    if (result?.data?.cube && Array.isArray(result.data.cube)) {
      const rows = result.data.cube;
      console.log('Found rows:', rows);

      rows.forEach((row: any) => {
        // Each row is structured as { viewName: { fieldName: value } }
        if (row[lowercaseViewName]) {
          const value = row[lowercaseViewName][fieldNameStripped];
          console.log('Processing row:', row, 'extracted value:', value);

          if (value !== null && value !== undefined) {
            values.add(String(value));
          }
        }
      });
    }

    console.log('Extracted unique values:', Array.from(values));

    // Return sorted array of distinct values
    return Array.from(values).sort();
  } catch (error) {
    throw handleApiError(error, 'fetchDistinctDimensionValues');
  }
}

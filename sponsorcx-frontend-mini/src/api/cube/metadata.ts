/**
 * Backend Cube Metadata API
 *
 * Fetches cube definitions through the backend proxy instead of calling Cube Cloud directly.
 */

import { executeBackendGraphQL } from '../core/client';
import { CubeMetadata } from '../core/types';

/**
 * Fetch Cube metadata via backend proxy
 * Returns information about available cubes, measures, and dimensions
 *
 * @returns Cube metadata object
 *
 * @example
 * ```typescript
 * const metadata = await fetchCubeMetadata();
 * console.log(metadata.cubes); // Array of cube definitions
 * ```
 */
export async function fetchCubeMetadata(): Promise<CubeMetadata> {
  try {
    // Build the backend GraphQL query
    const backendQuery = `
      query {
        cubeMetadata {
          cubes {
            name
            title
            type
            measures {
              name
              title
              shortTitle
              type
            }
            dimensions {
              name
              title
              shortTitle
              type
            }
          }
        }
      }
    `;

    // Execute the query through the backend
    const response = await executeBackendGraphQL<{ cubeMetadata: CubeMetadata }>(backendQuery);

    // Extract the metadata from the backend wrapper
    const metadata = response.data?.cubeMetadata;

    if (!metadata) {
      throw new Error('No metadata returned from backend');
    }

    return metadata;
  } catch (error) {
    // Re-throw with context
    if (error instanceof Error) {
      throw new Error(`Failed to fetch Cube metadata via backend: ${error.message}`);
    }
    throw error;
  }
}

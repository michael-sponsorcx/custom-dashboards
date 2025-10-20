/**
 * Cube Metadata API
 *
 * Fetches cube definitions, including available cubes, measures, and dimensions.
 */

import { cubeApiRequest } from '../core/client';
import { handleApiError } from '../core/errorHandler';
import { CubeMetadata } from '../types';

/**
 * Fetch Cube metadata
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
    const data = await cubeApiRequest<CubeMetadata>('/v1/meta', {
      method: 'GET',
    });

    return data;
  } catch (error) {
    throw handleApiError(error, 'fetchCubeMetadata');
  }
}

/**
 * Cube Service Layer
 *
 * Centralized service for all Cube API interactions.
 * Provides a clean, typed interface for querying Cube data.
 *
 * @example
 * ```typescript
 * import { executeCubeGraphQL, fetchCubeMetadata } from '@/services/cube';
 *
 * // Execute a GraphQL query
 * const result = await executeCubeGraphQL('query { ... }');
 *
 * // Fetch metadata
 * const metadata = await fetchCubeMetadata();
 * ```
 */

// Export all API functions
export { executeCubeGraphQL } from './api/query';
export { fetchCubeMetadata } from './api/metadata';
export {
  fetchCubeGraphQLSchema,
  clearSchemaCache,
  getFilterOperatorsFromSchema,
  getValidFilterOperators,
} from './api/schema';
export { fetchDistinctDimensionValues } from './api/dimensions';

// Export types
export type {
  CubeConfig,
  RequestOptions,
  ApiResponse,
  CubeQueryResult,
  CubeMetadata,
  CacheEntry,
  CubeApiError,
} from './types';

// Export utility functions
export { getCacheStats, clearCache } from './core/cache';
export {
  getUserFriendlyErrorMessage,
  isNetworkError,
  isAuthError,
} from './core/errorHandler';

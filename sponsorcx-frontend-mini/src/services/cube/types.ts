/**
 * Shared types for Cube API services
 */

/**
 * Configuration for Cube API client
 */
export interface CubeConfig {
  baseUrl: string;
  token: string;
}

/**
 * Options for API requests
 */
export interface RequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
}

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = any> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
  }>;
}

/**
 * GraphQL query result structure
 */
export interface CubeQueryResult {
  data?: {
    cube?: any[];
    __schema?: any;
  };
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
  }>;
}

/**
 * Metadata response structure
 */
export interface CubeMetadata {
  cubes: Array<{
    name: string;
    title?: string;
    measures: any[];
    dimensions: any[];
  }>;
}

/**
 * Cache entry structure
 */
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

/**
 * API error class
 */
export class CubeApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: any
  ) {
    super(message);
    this.name = 'CubeApiError';
  }
}

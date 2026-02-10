/**
 * Shared types for Cube API services
 */

import type { CubeMeasure, CubeDimension } from '../../types/cube';

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
export interface ApiResponse<T = unknown> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
  }>;
}

/**
 * GraphQL introspection schema type
 */
export interface GraphQLSchema {
  queryType: { name: string } | null;
  mutationType: { name: string } | null;
  subscriptionType: { name: string } | null;
  types: Array<{
    kind: string;
    name: string;
    description?: string;
    fields?: Array<{
      name: string;
      description?: string;
      args?: unknown[];
      type: unknown;
      isDeprecated?: boolean;
      deprecationReason?: string;
    }>;
    inputFields?: unknown[];
    interfaces?: unknown[];
    enumValues?: Array<{
      name: string;
      description?: string;
      isDeprecated?: boolean;
      deprecationReason?: string;
    }>;
    possibleTypes?: unknown[];
  }>;
  directives: Array<{
    name: string;
    description?: string;
    locations: string[];
    args?: unknown[];
  }>;
}

/**
 * Cube data row - each row is a view name mapped to field data
 * Example: { "Revenue": { "date": "2024-01", "amount": 1000 } }
 */
export type CubeDataRow = Record<string, Record<string, string | number | null | { value: string | number }>>;

/**
 * GraphQL query result structure
 */
export interface CubeQueryResult {
  data?: {
    cube?: CubeDataRow[];
    __schema?: GraphQLSchema;
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
    measures: CubeMeasure[];
    dimensions: CubeDimension[];
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
  constructor(message: string, public statusCode?: number, public response?: unknown) {
    super(message);
    this.name = 'CubeApiError';
  }
}

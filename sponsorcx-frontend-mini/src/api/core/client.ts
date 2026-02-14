/**
 * Backend GraphQL Client
 *
 * HTTP client for communicating with the backend GraphQL API using axios.
 * This replaces direct calls to Cube Cloud API by proxying through our backend.
 */

import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { setupAxiosCache } from './axiosCacheInterceptor';

const isDev = import.meta.env.DEV;
const showCacheLogs = isDev && import.meta.env.VITE_SHOW_CACHE_LOGS === 'true';
const showGraphQLLogs = isDev && import.meta.env.VITE_SHOW_GRAPHQL_LOGS === 'true';

/**
 * Cube operations that should be cached.
 * These are read-only queries to the Cube server.
 */
const CACHEABLE_CUBE_OPERATIONS = [
  'cubeQuery',
  'cubeMetadata',
  'cubeSchema',
  'cubeDimensionValues',
];

/**
 * Check if a GraphQL request is a Cube operation that should be cached.
 * Inspects the request body to find the operation name.
 */
const isCacheableCubeOperation = (config: InternalAxiosRequestConfig): boolean => {
  try {
    const data = config.data;
    if (!data) return false;

    const body = typeof data === 'string' ? JSON.parse(data) : data;
    const query = body?.query;
    if (!query || typeof query !== 'string') return false;

    // Check if it's a cacheable Cube operation
    const cubeOp = CACHEABLE_CUBE_OPERATIONS.find((op) => query.includes(op));
    const isCacheable = !!cubeOp;

    // Get operation name for logging
    if (showCacheLogs) {
      const opMatch = query.match(/(?:query|mutation)\s+(\w+)/);
      const opName = opMatch?.[1] || cubeOp || 'anonymous';
      console.log(`🔍 [Cacheable] ${isCacheable ? '✅ CACHEABLE' : '❌ NOT CACHEABLE'} ${opName}${cubeOp ? ` (${cubeOp})` : ''}`);
    }

    return isCacheable;
  } catch {
    return false;
  }
};

interface GraphQLResponse<T = unknown> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
  }>;
}

/**
 * Create configured axios instance for Backend GraphQL API
 */
function createBackendGraphQLClient(): AxiosInstance {
  const apiUrl = import.meta.env.VITE_API_URL;

  if (!apiUrl) {
    if (import.meta.env.DEV) {
      console.error('VITE_API_URL is not configured in environment variables');
    }
    throw new Error('VITE_API_URL is not configured in environment variables');
  }

  const client = axios.create({
    baseURL: apiUrl,
    timeout: 30000, // 30 second timeout
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Set up localStorage caching for GraphQL requests FIRST
  // Note: GraphQL uses POST requests, so we configure the cache to handle POST
  // IMPORTANT: Cache interceptor must be added before other interceptors
  // Only cache Cube-related operations (cubeQuery, cubeMetadata, cubeSchema, cubeDimensionValues)
  setupAxiosCache(client, {
    defaultTTL: 30000, // 30 second default cache
    enabled: true,
    methods: ['post'], // Cache POST requests (GraphQL uses POST)
    debug: showCacheLogs,
    shouldCacheRequest: isCacheableCubeOperation, // Only cache Cube operations
  });

  // Request interceptor - log requests in development
  client.interceptors.request.use(
    (config) => {
      if (showGraphQLLogs) {
        console.log(`📡 Backend GraphQL Request: ${config.method?.toUpperCase()} ${config.url}`);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - handle errors globally
  client.interceptors.response.use(
    (response) => {
      if (showGraphQLLogs) {
        console.log(`✅ Backend GraphQL Response: ${response.config.method?.toUpperCase()} ${response.config.url}`);
      }
      return response;
    },
    (error: AxiosError) => {
      if (error.response) {
        // Server responded with error status
        const errorMsg = `Backend API error: ${error.response.statusText} (${error.response.status})`;
        console.error(errorMsg, error.response.data);
        throw new Error(errorMsg);
      } else if (error.request) {
        // Request made but no response
        const errorMsg = 'No response from Backend API';
        console.error(errorMsg, error.request);
        throw new Error(errorMsg);
      } else {
        // Error setting up request
        console.error('Backend API request error:', error.message);
        throw new Error(error.message || 'Unknown Backend API error');
      }
    }
  );

  return client;
}

// Singleton instance
let backendClient: AxiosInstance | null = null;

/**
 * Get the configured Backend GraphQL axios client
 */
export function getBackendGraphQLClient(): AxiosInstance {
  if (!backendClient) {
    backendClient = createBackendGraphQLClient();
  }
  return backendClient;
}

/**
 * Execute a GraphQL query against the backend API
 *
 * @param query - GraphQL query string
 * @param variables - Optional variables for the query
 * @returns Parsed GraphQL response
 * @throws Error if the request fails or returns GraphQL errors
 */
export async function executeBackendGraphQL<T = unknown>(
  query: string,
  variables?: Record<string, unknown>
): Promise<GraphQLResponse<T>> {
  const client = getBackendGraphQLClient();

  const response = await client.post<GraphQLResponse<T>>('/graphql', {
    query,
    variables,
  });

  const result = response.data;

  // Check for GraphQL errors
  if (result.errors && result.errors.length > 0) {
    const errorMessage = result.errors.map((e) => e.message).join(', ');
    throw new Error(`GraphQL error: ${errorMessage}`);
  }
  
  return result;
}

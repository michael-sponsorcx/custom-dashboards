/**
 * Backend GraphQL Client
 *
 * HTTP client for communicating with the backend GraphQL API using axios.
 * This replaces direct calls to Cube Cloud API by proxying through our backend.
 */

import axios, { type AxiosInstance, type AxiosError } from 'axios';

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
    throw new Error('VITE_API_URL is not configured in environment variables');
  }

  const client = axios.create({
    baseURL: apiUrl,
    timeout: 30000, // 30 second timeout
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - log requests in development
  client.interceptors.request.use(
    (config) => {
      if (import.meta.env.DEV) {
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
      if (import.meta.env.DEV) {
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

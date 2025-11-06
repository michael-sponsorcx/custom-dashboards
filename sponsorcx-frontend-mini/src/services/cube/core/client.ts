/**
 * HTTP Client for Cube API
 *
 * Centralized client configuration for all Cube API requests using axios.
 * Handles authentication, headers, and base URL configuration with interceptors.
 */

import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { type CubeConfig, CubeApiError } from '../types';

/**
 * Get Cube API configuration from environment variables
 */
export function getCubeConfig(): CubeConfig {
  const baseUrl = import.meta.env.VITE_CUBE_API_BASE_URL;
  const token = import.meta.env.VITE_CUBE_API_TOKEN;

  if (!baseUrl || !token) {
    throw new CubeApiError('Missing Cube API configuration. Please check your .env file.', 500);
  }

  return { baseUrl, token };
}

/**
 * Create configured axios instance for Cube API
 */
function createCubeAxiosClient(): AxiosInstance {
  const config = getCubeConfig();

  const client = axios.create({
    baseURL: config.baseUrl,
    timeout: 30000, // 30 second timeout
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - add auth token to all requests
  client.interceptors.request.use(
    (requestConfig) => {
      requestConfig.headers.Authorization = `Bearer ${config.token}`;

      // Log requests in development
      if (import.meta.env.DEV) {
        console.log(`🔷 Cube API Request: ${requestConfig.method?.toUpperCase()} ${requestConfig.url}`);
      }

      return requestConfig;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - handle errors globally
  client.interceptors.response.use(
    (response) => {
      // Log responses in development
      if (import.meta.env.DEV) {
        console.log(`✅ Cube API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`);
      }
      return response;
    },
    (error) => {
      // Transform axios errors to CubeApiError
      if (error.response) {
        // Server responded with error status
        throw new CubeApiError(
          `Cube API error: ${error.response.statusText}`,
          error.response.status,
          error.response.data
        );
      } else if (error.request) {
        // Request made but no response
        throw new CubeApiError(
          'No response from Cube API',
          undefined,
          error
        );
      } else {
        // Error setting up request
        throw new CubeApiError(
          error.message || 'Unknown Cube API error',
          undefined,
          error
        );
      }
    }
  );

  return client;
}

// Singleton instance
let cubeClient: AxiosInstance | null = null;

/**
 * Get the configured Cube API axios client
 */
export function getCubeClient(): AxiosInstance {
  if (!cubeClient) {
    cubeClient = createCubeAxiosClient();
  }
  return cubeClient;
}

/**
 * Generic request wrapper for Cube API
 * Handles authentication, error handling, and response parsing
 *
 * @param endpoint - API endpoint (e.g., '/v1/meta', '/graphql')
 * @param options - Axios request config
 * @returns Parsed JSON response
 */
export async function cubeApiRequest<T = unknown>(
  endpoint: string,
  options: AxiosRequestConfig = {}
): Promise<T> {
  const client = getCubeClient();
  const response = await client.request<T>({
    url: endpoint,
    ...options,
  });
  return response.data;
}

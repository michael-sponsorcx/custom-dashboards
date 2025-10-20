/**
 * HTTP Client for Cube API
 *
 * Centralized client configuration for all Cube API requests.
 * Handles authentication, headers, and base URL configuration.
 */

import { CubeConfig, RequestOptions, CubeApiError } from '../types';

/**
 * Get Cube API configuration from environment variables
 */
export function getCubeConfig(): CubeConfig {
  const baseUrl = import.meta.env.VITE_CUBE_API_BASE_URL;
  const token = import.meta.env.VITE_CUBE_API_TOKEN;

  if (!baseUrl || !token) {
    throw new CubeApiError(
      'Missing Cube API configuration. Please check your .env file.',
      500
    );
  }

  return { baseUrl, token };
}

/**
 * Build headers for Cube API requests
 */
export function buildHeaders(
  config: CubeConfig,
  additionalHeaders?: Record<string, string>
): Record<string, string> {
  return {
    'Authorization': `Bearer ${config.token}`,
    'Content-Type': 'application/json',
    ...additionalHeaders,
  };
}

/**
 * Generic fetch wrapper for Cube API
 * Handles authentication, error handling, and response parsing
 *
 * @param endpoint - API endpoint (e.g., '/v1/meta', '/graphql')
 * @param options - Fetch options
 * @returns Parsed JSON response
 */
export async function cubeApiRequest<T = any>(
  endpoint: string,
  options: RequestInit & RequestOptions = {}
): Promise<T> {
  const config = getCubeConfig();
  const url = `${config.baseUrl}${endpoint}`;

  const headers = buildHeaders(config, options.headers);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new CubeApiError(
        `HTTP error! status: ${response.status}`,
        response.status,
        await response.text()
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof CubeApiError) {
      throw error;
    }

    // Wrap other errors in CubeApiError
    throw new CubeApiError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      undefined,
      error
    );
  }
}

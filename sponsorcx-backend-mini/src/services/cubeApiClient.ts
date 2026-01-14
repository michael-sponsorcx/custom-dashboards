/**
 * Cube API Client
 * Handles all communication with the Cube.js API
 */

import axios, { type AxiosInstance, type AxiosError } from 'axios';
import { cache } from './cache';
import type { CubeMetadataResponse } from '../graphql/types';

// Configuration from environment variables
const CUBE_API_BASE_URL = process.env.CUBE_API_BASE_URL;
const CUBE_API_TOKEN = process.env.CUBE_API_TOKEN;
const METADATA_CACHE_TTL = parseInt(process.env.CUBE_METADATA_CACHE_TTL || '5');
const SCHEMA_CACHE_TTL = parseInt(process.env.CUBE_SCHEMA_CACHE_TTL || '30');

// Validate environment variables
if (!CUBE_API_BASE_URL || !CUBE_API_TOKEN) {
  console.error('CUBE_API_BASE_URL and CUBE_API_TOKEN must be set in environment variables');
  process.exit(1);
}

// Cache keys
const CACHE_KEYS = {
  METADATA: 'cube:metadata',
  SCHEMA: 'cube:schema',
};

/**
 * Custom error class for Cube API errors
 */
export class CubeApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'CubeApiError';
  }
}

/**
 * Create axios instance for Cube API
 */
const createCubeClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: CUBE_API_BASE_URL,
    headers: {
      Authorization: `Bearer ${CUBE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 seconds
  });

  // Request interceptor - log requests in development
  client.interceptors.request.use(
    (config) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔷 Cube API Request: ${config.method?.toUpperCase()} ${config.url}`);
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
      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ Cube API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`);
      }
      return response;
    },
    (error: AxiosError) => {
      // Transform axios errors to CubeApiError
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const data = error.response.data as Record<string, unknown>;
        const message = (data?.error as string) || (data?.message as string) || 'Cube API request failed';

        console.error(`Cube API Error [${status}]:`, message);
        throw new CubeApiError(message, status, error);
      } else if (error.request) {
        // Request made but no response received
        console.error('Cube API Error: No response received', error.message);
        throw new CubeApiError('Failed to reach Cube API', undefined, error);
      } else {
        // Error setting up request
        console.error('Cube API Error:', error.message);
        throw new CubeApiError(error.message, undefined, error);
      }
    }
  );

  return client;
};

// Singleton instance
let cubeClient: AxiosInstance | null = null;

/**
 * Get the configured Cube API axios client
 */
const getCubeClient = (): AxiosInstance => {
  if (!cubeClient) {
    cubeClient = createCubeClient();
  }
  return cubeClient;
};

/**
 * Flatten time dimension values in Cube API responses
 * Converts array format [value] to single value
 */
const flattenTimeDimensions = (data: unknown): unknown => {
  if (!data || typeof data !== 'object') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(flattenTimeDimensions);
  }

  const flattened: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    // Check if this is a time dimension (typically ends with date/time fields)
    if (Array.isArray(value) && value.length === 1 &&
        (key.toLowerCase().includes('date') ||
         key.toLowerCase().includes('time') ||
         key.toLowerCase().includes('day') ||
         key.toLowerCase().includes('month') ||
         key.toLowerCase().includes('year'))) {
      flattened[key] = value[0];
    } else if (typeof value === 'object' && value !== null) {
      flattened[key] = flattenTimeDimensions(value);
    } else {
      flattened[key] = value;
    }
  }

  return flattened;
};

/**
 * Execute a GraphQL query against Cube API
 */
export const executeCubeGraphQL = async (query: string): Promise<unknown> => {
  const client = getCubeClient();
  console.log('Executing Cube GraphQL query...');

  const response = await client.post('/graphql', { query });

  // Flatten time dimensions in the response
  const flattenedData = flattenTimeDimensions(response.data);

  console.log('Cube GraphQL query executed successfully');
  return flattenedData;
};

/**
 * Fetch Cube metadata (cubes, dimensions, measures)
 * Cached for METADATA_CACHE_TTL minutes
 */
export const fetchCubeMetadata = async (): Promise<CubeMetadataResponse> => {
  // Check cache first
  const cached = cache.get<CubeMetadataResponse>(CACHE_KEYS.METADATA);
  if (cached) {
    console.log('Returning cached Cube metadata');
    return cached;
  }

  console.log('Fetching Cube metadata from API...');

  const client = getCubeClient();
  const response = await client.get<CubeMetadataResponse>('/v1/meta');
  const metadata = response.data;

  // Cache the result
  cache.set(CACHE_KEYS.METADATA, metadata, METADATA_CACHE_TTL);

  console.log('Cube metadata fetched and cached successfully');
  return metadata;
};

/**
 * Fetch GraphQL schema and extract filter operators
 * Cached for SCHEMA_CACHE_TTL minutes
 */
export const fetchCubeSchema = async (): Promise<string[]> => {
  try {
    // Check cache first
    const cached = cache.get<string[]>(CACHE_KEYS.SCHEMA);
    if (cached) {
      console.log('Returning cached Cube schema operators');
      return cached;
    }

    console.log('Fetching Cube GraphQL schema...');

    const introspectionQuery = `
      query IntrospectionQuery {
        __schema {
          types {
            name
            kind
            enumValues {
              name
            }
          }
        }
      }
    `;

    const client = getCubeClient();
    const response = await client.post('/graphql', { query: introspectionQuery });

    // Extract filter operators from schema
    const types = response.data?.data?.__schema?.types || [];
    const filterType = types.find((t: { name: string; enumValues?: unknown }) =>
      t.name === 'FilterOperator' ||
      (t.name.includes('Filter') && t.enumValues)
    );

    let operators: string[] = [];
    if (filterType && filterType.enumValues) {
      operators = (filterType.enumValues as Array<{ name: string }>).map((ev) => ev.name);
    }

    // Fallback to common operators if not found
    if (operators.length === 0) {
      console.log('No filter operators found in schema, using fallback list');
      operators = [
        'equals', 'notEquals', 'in', 'notIn',
        'contains', 'notContains', 'set', 'notSet',
        'gt', 'gte', 'lt', 'lte',
        'inDateRange', 'notInDateRange', 'beforeDate', 'afterDate'
      ];
    }

    // Cache the result
    cache.set(CACHE_KEYS.SCHEMA, operators, SCHEMA_CACHE_TTL);

    console.log(`Cube schema operators fetched and cached: ${operators.length} operators`);
    return operators;
  } catch (error) {
    // On error, return fallback operators
    console.error('Failed to fetch Cube schema, using fallback operators');
    const fallbackOperators = [
      'equals', 'notEquals', 'in', 'notIn',
      'contains', 'notContains', 'set', 'notSet',
      'gt', 'gte', 'lt', 'lte',
      'inDateRange', 'notInDateRange', 'beforeDate', 'afterDate'
    ];
    return fallbackOperators;
  }
};

/**
 * Strip cube prefix from field name
 * Example: "ViewName.fieldName" or "Cube.ViewName.fieldName" -> "fieldName"
 */
const stripCubePrefix = (fieldName: string): string => {
  const parts = fieldName.split('.');
  return parts.length > 1 ? parts[parts.length - 1] : fieldName;
};

/**
 * Fetch distinct values for a dimension
 */
export const fetchDimensionValues = async (
  viewName: string,
  dimensionName: string
): Promise<string[]> => {
  try {
    // Strip cube prefix from view and dimension names
    const cleanViewName = stripCubePrefix(viewName);
    const cleanDimensionName = stripCubePrefix(dimensionName);
    const lowercaseViewName = cleanViewName.toLowerCase();

    console.log(`Fetching dimension values for ${cleanViewName}.${cleanDimensionName}...`);

    // Build a GraphQL query to fetch distinct values
    const query = `
      query {
        cube {
          ${lowercaseViewName} {
            ${cleanDimensionName}
          }
        }
      }
    `;

    const client = getCubeClient();
    const response = await client.post('/graphql', { query });

    // Extract values from response
    // Note: cube is an ARRAY, not an object
    const data = response.data?.data?.cube;
    if (!data || !Array.isArray(data)) {
      return [];
    }

    // Extract unique values from the array
    const values = data
      .map((row: Record<string, Record<string, unknown>>) => {
        // Each row is { viewname: { fieldname: value } }
        const viewData = row[lowercaseViewName];
        return viewData ? viewData[cleanDimensionName] : null;
      })
      .filter((value: unknown) => value !== null && value !== undefined);

    const uniqueValues = Array.from(new Set(values));

    console.log(`Found ${uniqueValues.length} distinct values for ${cleanViewName}.${cleanDimensionName}`);
    return uniqueValues as string[];
  } catch (error) {
    console.error(`Failed to fetch dimension values for ${viewName}.${dimensionName}:`, error);
    return [];
  }
};


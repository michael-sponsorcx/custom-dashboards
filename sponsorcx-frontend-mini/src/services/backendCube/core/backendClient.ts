/**
 * Backend GraphQL Client
 *
 * HTTP client for communicating with the backend GraphQL API.
 * This replaces direct calls to Cube Cloud API by proxying through our backend.
 */

interface GraphQLResponse<T = any> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
  }>;
}

/**
 * Execute a GraphQL query against the backend API
 *
 * @param query - GraphQL query string
 * @param variables - Optional variables for the query
 * @returns Parsed GraphQL response
 * @throws Error if the request fails or returns GraphQL errors
 */
export async function executeBackendGraphQL<T = any>(
  query: string,
  variables?: Record<string, any>
): Promise<GraphQLResponse<T>> {
  const apiUrl = import.meta.env.VITE_API_URL;

  if (!apiUrl) {
    throw new Error('VITE_API_URL is not configured in environment variables');
  }

  const url = `${apiUrl}/graphql`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: GraphQLResponse<T> = await response.json();

    // Check for GraphQL errors
    if (result.errors && result.errors.length > 0) {
      const errorMessage = result.errors.map((e) => e.message).join(', ');
      throw new Error(`GraphQL error: ${errorMessage}`);
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Backend API request failed: ${error.message}`);
    }
    throw new Error('Backend API request failed with unknown error');
  }
}

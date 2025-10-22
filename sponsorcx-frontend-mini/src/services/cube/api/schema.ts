/**
 * Cube GraphQL Schema Introspection
 *
 * Fetches and caches the GraphQL schema from Cube API.
 * Provides utilities to extract schema information.
 */

import { executeCubeGraphQL } from './query';
import { getCached, clearCache } from '../core/cache';
import { handleApiError } from '../core/errorHandler';

/**
 * GraphQL introspection query to fetch the full schema
 */
const INTROSPECTION_QUERY = `
  query IntrospectionQuery {
    __schema {
      queryType { name }
      mutationType { name }
      subscriptionType { name }
      types {
        ...FullType
      }
      directives {
        name
        description
        locations
        args {
          ...InputValue
        }
      }
    }
  }

  fragment FullType on __Type {
    kind
    name
    description
    fields(includeDeprecated: true) {
      name
      description
      args {
        ...InputValue
      }
      type {
        ...TypeRef
      }
      isDeprecated
      deprecationReason
    }
    inputFields {
      ...InputValue
    }
    interfaces {
      ...TypeRef
    }
    enumValues(includeDeprecated: true) {
      name
      description
      isDeprecated
      deprecationReason
    }
    possibleTypes {
      ...TypeRef
    }
  }

  fragment InputValue on __InputValue {
    name
    description
    type { ...TypeRef }
    defaultValue
  }

  fragment TypeRef on __Type {
    kind
    name
    ofType {
      kind
      name
      ofType {
        kind
        name
        ofType {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * Fetch GraphQL schema from Cube API
 * Results are cached for 30 minutes to avoid repeated API calls
 *
 * @returns GraphQL schema object
 */
export async function fetchCubeGraphQLSchema(): Promise<any> {
  const cacheKey = 'cube:schema';
  const ttl = 30 * 60 * 1000; // 30 minutes
  try {
    return await getCached(
      cacheKey,
      async () => {
        const result = await executeCubeGraphQL(INTROSPECTION_QUERY);
        if (result?.data?.__schema) {
          return result.data.__schema;
        } else {
          throw new Error('Invalid introspection response');
        }
      },
      ttl
    );
  } catch (error) {
    throw handleApiError(error, 'fetchCubeGraphQLSchema');
  }
}

/**
 * Clear the cached schema
 * Useful for testing or when schema changes
 */
export function clearSchemaCache(): void {
  clearCache();
}

/**
 * Extract available filter operators from schema
 *
 * @param schema - GraphQL schema object
 * @returns Array of operator names
 */
export function getFilterOperatorsFromSchema(schema: any): string[] {
  // Look for filter input types in the schema
  const filterTypes = schema.types?.filter((type: any) =>
    type.name?.includes('Filter') || type.name?.includes('Where')
  );

  const operators = new Set<string>();

  filterTypes?.forEach((type: any) => {
    type.inputFields?.forEach((field: any) => {
      operators.add(field.name);
    });
  });

  return Array.from(operators);
}

/**
 * Get valid filter operators with caching
 * Falls back to known operators if schema fetch fails
 *
 * @returns Array of valid operator names
 */
export async function getValidFilterOperators(): Promise<string[]> {
  const cacheKey = 'cube:filterOperators';
  const ttl = 30 * 60 * 1000; // 30 minutes

  try {
    return await getCached(
      cacheKey,
      async () => {
        const schema = await fetchCubeGraphQLSchema();
        return getFilterOperatorsFromSchema(schema);
      },
      ttl
    );
  } catch (error) {
    // Fallback to known operators if schema fetch fails
    return [
      'equals',
      'notEquals',
      'in',
      'notIn',
      'contains',
      'notContains',
      'set',
      'notSet',
      'gt',
      'gte',
      'lt',
      'lte',
      'inDateRange',
      'notInDateRange',
      'beforeDate',
      'afterDate',
    ];
  }
}

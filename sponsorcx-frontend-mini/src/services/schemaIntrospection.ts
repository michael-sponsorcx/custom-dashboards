import { executeCubeGraphQL } from './cubeApi';

/**
 * GraphQL introspection query to fetch the full schema from Cube.js
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

let cachedSchema: any = null;

/**
 * Fetches the GraphQL schema from Cube.js using introspection
 * Results are cached to avoid repeated API calls
 */
export async function fetchCubeGraphQLSchema(): Promise<any> {
  if (cachedSchema) {
    console.log('Using cached GraphQL schema');
    return cachedSchema;
  }

  console.log('Fetching GraphQL schema via introspection...');

  try {
    const result = await executeCubeGraphQL(INTROSPECTION_QUERY);

    if (result?.data?.__schema) {
      cachedSchema = result.data.__schema;
      console.log('GraphQL schema fetched successfully');
      return cachedSchema;
    } else {
      throw new Error('Invalid introspection response');
    }
  } catch (error) {
    console.error('Failed to fetch GraphQL schema:', error);
    throw error;
  }
}

/**
 * Clears the cached schema (useful for testing or when schema changes)
 */
export function clearSchemaCache(): void {
  cachedSchema = null;
}

/**
 * Helper to extract available filter operators from schema
 */
export function getFilterOperatorsFromSchema(schema: any): string[] {
  // Look for the filter input types in the schema
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

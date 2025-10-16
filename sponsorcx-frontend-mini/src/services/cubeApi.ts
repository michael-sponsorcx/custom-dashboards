const CUBE_API_BASE_URL = import.meta.env.VITE_CUBE_API_BASE_URL;
const CUBE_API_TOKEN = import.meta.env.VITE_CUBE_API_TOKEN;

export async function fetchCubeMetadata() {
  if (!CUBE_API_BASE_URL || !CUBE_API_TOKEN) {
    throw new Error('Missing Cube API configuration. Please check your .env file.');
  }

  const meta_url = `${CUBE_API_BASE_URL}/v1/meta`;

  try {
    const response = await fetch(meta_url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CUBE_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Cube metadata:', error);
    throw error;
  }
}

export async function executeCubeGraphQL(query: string) {
  if (!CUBE_API_BASE_URL || !CUBE_API_TOKEN) {
    throw new Error('Missing Cube API configuration. Please check your .env file.');
  }

  const graphql_url = `${CUBE_API_BASE_URL}/graphql`;

  try {
    const response = await fetch(graphql_url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CUBE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error executing GraphQL query:', error);
    throw error;
  }
}

/**
 * Fetches distinct values for a specific dimension field
 * Used for populating filter options for dimensions
 */
export async function fetchDistinctDimensionValues(viewName: string, dimensionName: string): Promise<string[]> {
  console.log('fetchDistinctDimensionValues called with:', { viewName, dimensionName });

  // Strip cube prefix if present (e.g., "ViewName.fieldName" -> "fieldName")
  const stripCubePrefix = (fieldName: string): string => {
    const parts = fieldName.split('.');
    return parts.length > 1 ? parts[parts.length - 1] : fieldName;
  };

  const fieldNameStripped = stripCubePrefix(dimensionName);
  const lowercaseViewName = viewName.toLowerCase();

  // Build a GraphQL query to fetch distinct values for this dimension
  const query = `query {
  cube {
    ${lowercaseViewName} {
      ${fieldNameStripped}
    }
  }
}`;

  console.log('Generated query for dimension values:', query);

  try {
    const result = await executeCubeGraphQL(query);
    console.log('Query result:', result);

    // Extract unique values from the result
    const values = new Set<string>();

    // The result structure is: { data: { cube: [ { viewname: { fieldname: value } }, ... ] } }
    // Note: cube is an ARRAY, not an object
    if (result?.data?.cube && Array.isArray(result.data.cube)) {
      const rows = result.data.cube;
      console.log('Found rows:', rows);

      rows.forEach((row: any) => {
        // Each row is structured as { viewName: { fieldName: value } }
        if (row[lowercaseViewName]) {
          const value = row[lowercaseViewName][fieldNameStripped];
          console.log('Processing row:', row, 'extracted value:', value);

          if (value !== null && value !== undefined) {
            values.add(String(value));
          }
        }
      });
    }

    console.log('Extracted unique values:', Array.from(values));

    // Return sorted array of distinct values
    return Array.from(values).sort();
  } catch (error) {
    console.error('Error fetching distinct dimension values:', error);
    throw error;
  }
}

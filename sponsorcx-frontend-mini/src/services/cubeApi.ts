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

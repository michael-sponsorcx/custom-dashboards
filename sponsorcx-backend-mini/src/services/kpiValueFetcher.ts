import { pool } from '../db/connection';
import { executeCubeGraphQL } from './cubeApiClient';

interface GraphConfig {
    view_name: string;
    measures: string[];
    filters: unknown[];
}

// Type for Cube.js GraphQL response
interface CubeResponse {
    data?: {
        cube?: Array<Record<string, Record<string, number>>>;
    };
}

/**
 * Fetches the current KPI value for a graph from Cube.js
 * Used by threshold alerts to get the current value to compare against the threshold
 */
export const fetchKpiValue = async (graphId: number): Promise<number | null> => {
    const client = await pool.connect();

    try {
        // 1. Get graph config from DB
        const result = await client.query<GraphConfig>(
            'SELECT view_name, measures, filters FROM graphs WHERE id = $1',
            [graphId]
        );

        if (result.rows.length === 0) {
            console.log(`[kpiValueFetcher] No graph found with id: ${graphId}`);
            return null;
        }

        const graph = result.rows[0];
        const viewName = graph.view_name.toLowerCase();
        const measure = graph.measures[0]; // KPI graphs have single measure
        const measureField = measure.split('.')[1]; // 'Revenue.revenue' -> 'revenue'

        // 2. Build simple KPI query
        const query = `query { cube { ${viewName} { ${measureField} } } }`;
        console.log(`[kpiValueFetcher] Built query: ${query}`);

        // 3. Execute via Cube client
        const response = (await executeCubeGraphQL(query)) as CubeResponse;
        console.log('[kpiValueFetcher] Full Cube.js response:', JSON.stringify(response, null, 2));

        // 4. Extract numeric value from response
        // Response shape: { data: { cube: [{ viewName: { measureField: 123.45 } }] } }
        const cubeData = response?.data?.cube?.[0];
        const value = cubeData?.[viewName]?.[measureField];

        console.log(`[kpiValueFetcher] Extracted value: ${value}`);
        return typeof value === 'number' ? value : null;
    } finally {
        client.release();
    }
};

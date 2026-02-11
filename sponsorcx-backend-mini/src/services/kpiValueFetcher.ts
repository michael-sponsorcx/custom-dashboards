import { query } from '../db/connection';
import { fetchMeasureValue } from './cubeProxyApiClient';

interface GraphConfig {
    view_name: string;
    measures: string[];
}

/**
 * Fetches the current KPI value for a graph from Cube.js
 * Used by threshold alerts to get the current value to compare against the threshold
 *
 * 1. Looks up the graph's view_name and measure from the database
 * 2. Delegates the actual Cube API call to cubeProxyApiClient.fetchMeasureValue
 */
export const fetchKpiValue = async (graphId: number): Promise<number | null> => {
    const result = await query(
        'SELECT view_name, measures FROM graphs WHERE id = $1',
        [graphId]
    );

    if (result.rows.length === 0) {
        console.log(`[kpiValueFetcher] No graph found with id: ${graphId}`);
        return null;
    }

    const graph = result.rows[0] as GraphConfig;
    const measure = graph.measures[0]; // KPI graphs have single measure

    return fetchMeasureValue(graph.view_name, measure);
};

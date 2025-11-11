/**
 * Graph Template API Service
 *
 * Handles all graph CRUD operations via backend GraphQL API
 */

import { executeBackendGraphQL } from '../core/backendClient';
import type { GraphTemplate } from '../../../types/graph';
import { toGraphInput } from '../utils/graphInputMapper';

// GraphQL fragments for reusability
const GRAPH_FIELDS = `
  id
  organizationId
  name
  viewName
  chartType
  chartTitle
  measures
  dimensions
  dates
  filters
  orderByField
  orderByDirection
  numberFormat
  numberPrecision
  colorPalette
  primaryColor
  sortOrder
  legendPosition
  kpiValue
  kpiLabel
  kpiSecondaryValue
  kpiSecondaryLabel
  kpiShowTrend
  kpiTrendPercentage
  showXAxisGridLines
  showYAxisGridLines
  showGridLines
  showRegressionLine
  xAxisLabel
  yAxisLabel
  maxDataPoints
  primaryDimension
  secondaryDimension
  selectedMeasure
  createdAt
  updatedAt
`;

/**
 * Fetch all graphs for an organization
 */
export async function fetchGraphs(organizationId?: string): Promise<GraphTemplate[]> {
  const query = `
    query FetchGraphs($organizationId: ID) {
      graphs(organizationId: $organizationId) {
        ${GRAPH_FIELDS}
      }
    }
  `;

  const response = await executeBackendGraphQL<{ graphs: GraphTemplate[] }>(query, {
    organizationId,
  });

  return response.data?.graphs || [];
}

/**
 * Fetch a single graph by ID
 */
export async function fetchGraph(id: string): Promise<GraphTemplate | null> {
  const query = `
    query FetchGraph($id: ID!) {
      graph(id: $id) {
        ${GRAPH_FIELDS}
      }
    }
  `;

  const response = await executeBackendGraphQL<{ graph: GraphTemplate | null }>(query, { id });

  return response.data?.graph || null;
}

/**
 * Create a new graph
 */
export async function createGraph(
  input: Omit<GraphTemplate, 'id' | 'createdAt' | 'updatedAt'>,
  organizationId?: string
): Promise<GraphTemplate> {
  const query = `
    mutation CreateGraph($input: GraphInput!, $organizationId: ID) {
      createGraph(input: $input, organizationId: $organizationId) {
        ${GRAPH_FIELDS}
      }
    }
  `;

  // Convert frontend GraphTemplate format to backend GraphInput format
  const graphInput = toGraphInput(input);

  const response = await executeBackendGraphQL<{ createGraph: GraphTemplate }>(query, {
    input: graphInput,
    organizationId,
  });

  if (!response.data?.createGraph) {
    throw new Error('Failed to create graph');
  }

  return response.data.createGraph;
}

/**
 * Update an existing graph
 */
export async function updateGraph(
  id: string,
  input: Omit<GraphTemplate, 'id' | 'createdAt' | 'updatedAt'>
): Promise<GraphTemplate> {
  const query = `
    mutation UpdateGraph($id: ID!, $input: GraphInput!) {
      updateGraph(id: $id, input: $input) {
        ${GRAPH_FIELDS}
      }
    }
  `;

  // Convert frontend GraphTemplate format to backend GraphInput format
  const graphInput = toGraphInput(input);

  const response = await executeBackendGraphQL<{ updateGraph: GraphTemplate }>(query, {
    id,
    input: graphInput,
  });

  if (!response.data?.updateGraph) {
    throw new Error('Failed to update graph');
  }

  return response.data.updateGraph;
}

/**
 * Delete a graph
 */
export async function deleteGraph(id: string): Promise<boolean> {
  const query = `
    mutation DeleteGraph($id: ID!) {
      deleteGraph(id: $id) {
        id
      }
    }
  `;

  const response = await executeBackendGraphQL<{ deleteGraph: { id: string } | null }>(query, { id });

  return !!response.data?.deleteGraph;
}

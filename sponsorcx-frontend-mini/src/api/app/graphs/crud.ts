/**
 * Graph Template API Service
 *
 * Handles all graph CRUD operations via backend GraphQL API
 */

import { executeBackendGraphQL } from '../../core/client';
import type { GraphUI } from '../../../types/graph';
import type { Graph as BackendGraph } from '../../../types/backend-graphql';
import { toGraphInput } from './mappers';

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
export const fetchGraphs = async (organizationId?: string): Promise<GraphUI[]> => {
  const query = `
    query FetchGraphs($organizationId: ID) {
      graphs(organizationId: $organizationId) {
        ${GRAPH_FIELDS}
      }
    }
  `;

  const response = await executeBackendGraphQL<{ graphs: BackendGraph[] }>(query, {
    organizationId,
  });

  return (response.data?.graphs || []) as unknown as GraphUI[];
};

/**
 * Fetch a single graph by ID
 */
export const fetchGraph = async (id: string): Promise<GraphUI | null> => {
  const query = `
    query FetchGraph($id: ID!) {
      graph(id: $id) {
        ${GRAPH_FIELDS}
      }
    }
  `;

  const response = await executeBackendGraphQL<{ graph: BackendGraph | null }>(query, { id });

  return (response.data?.graph as unknown as GraphUI) ?? null;
};

/**
 * Create a new graph
 */
export const createGraph = async (
  input: Omit<GraphUI, 'id' | 'createdAt' | 'updatedAt'>,
  organizationId?: string
): Promise<GraphUI> => {
  const query = `
    mutation CreateGraph($input: GraphInput!, $organizationId: ID) {
      createGraph(input: $input, organizationId: $organizationId) {
        ${GRAPH_FIELDS}
      }
    }
  `;

  const graphInput = toGraphInput(input);

  const response = await executeBackendGraphQL<{ createGraph: BackendGraph }>(query, {
    input: graphInput,
    organizationId,
  });

  if (!response.data?.createGraph) {
    throw new Error('Failed to create graph');
  }

  return response.data.createGraph as unknown as GraphUI;
};

/**
 * Update an existing graph
 */
export const updateGraph = async (
  id: string,
  input: Omit<GraphUI, 'id' | 'createdAt' | 'updatedAt'>
): Promise<GraphUI> => {
  const query = `
    mutation UpdateGraph($id: ID!, $input: GraphInput!) {
      updateGraph(id: $id, input: $input) {
        ${GRAPH_FIELDS}
      }
    }
  `;

  const graphInput = toGraphInput(input);

  const response = await executeBackendGraphQL<{ updateGraph: BackendGraph }>(query, {
    id,
    input: graphInput,
  });

  if (!response.data?.updateGraph) {
    throw new Error('Failed to update graph');
  }

  return response.data.updateGraph as unknown as GraphUI;
};

/**
 * Delete a graph
 */
export const deleteGraph = async (id: string): Promise<boolean> => {
  const query = `
    mutation DeleteGraph($id: ID!) {
      deleteGraph(id: $id) {
        id
      }
    }
  `;

  const response = await executeBackendGraphQL<{ deleteGraph: { id: string } | null }>(query, { id });

  return !!response.data?.deleteGraph;
};

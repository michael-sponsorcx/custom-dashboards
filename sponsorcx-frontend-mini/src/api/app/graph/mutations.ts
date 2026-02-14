/**
 * Graph Mutation Operations
 *
 * Write operations for graphs.
 */

import { executeBackendGraphQL } from '../../core/client';
import type { GraphUI } from '../../../types/graph';
import type { Graph as BackendGraph } from '../../../types/backend-graphql';
import { GRAPH_FIELDS } from './fragments';
import { toGraphInput } from './mappers';

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

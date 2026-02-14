/**
 * Graph Query Operations
 *
 * Read operations for graphs.
 */

import { executeBackendGraphQL } from '../../core/client';
import type { GraphUI } from '../../../types/graph';
import type { Graph as BackendGraph } from '../../../types/backend-graphql';
import { GRAPH_FIELDS } from './fragments';

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

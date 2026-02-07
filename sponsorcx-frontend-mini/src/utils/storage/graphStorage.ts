import { GraphUI } from '../../types/graph';

const GRAPHS_KEY = 'sponsorcx_saved_graphs';

/**
 * Save a graph to localStorage
 */
export const saveGraph = (graph: GraphUI): void => {
  const existing = getAllGraphs();
  const index = existing.findIndex((t) => t.id === graph.id);

  if (index >= 0) {
    existing[index] = graph;
  } else {
    existing.push(graph);
  }

  localStorage.setItem(GRAPHS_KEY, JSON.stringify(existing));
};

/**
 * Get all saved graphs
 */
export const getAllGraphs = (): GraphUI[] => {
  const data = localStorage.getItem(GRAPHS_KEY);
  if (!data) return [];

  try {
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

/**
 * Get a single graph by ID
 */
export const getGraph = (id: string): GraphUI | null => {
  const all = getAllGraphs();
  return all.find((t) => t.id === id) || null;
};

/**
 * Delete a graph
 */
export const deleteGraph = (id: string): void => {
  const existing = getAllGraphs();
  const filtered = existing.filter((t) => t.id !== id);
  localStorage.setItem(GRAPHS_KEY, JSON.stringify(filtered));
};

/**
 * Generate a unique ID for a graph
 */
export const generateGraphId = (): string => {
  return `graph_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
};

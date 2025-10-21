import { GraphTemplate } from '../../types/graph';

const GRAPHS_KEY = 'sponsorcx_saved_graphs';

/**
 * Save a graph template to localStorage
 */
export function saveGraphTemplate(template: GraphTemplate): void {
  const existing = getAllGraphTemplates();
  const index = existing.findIndex(t => t.id === template.id);

  if (index >= 0) {
    existing[index] = template;
  } else {
    existing.push(template);
  }

  localStorage.setItem(GRAPHS_KEY, JSON.stringify(existing));
}

/**
 * Get all saved graph templates
 */
export function getAllGraphTemplates(): GraphTemplate[] {
  const data = localStorage.getItem(GRAPHS_KEY);
  if (!data) return [];

  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to parse saved graphs:', error);
    return [];
  }
}

/**
 * Get a single graph template by ID
 */
export function getGraphTemplate(id: string): GraphTemplate | null {
  const all = getAllGraphTemplates();
  return all.find(t => t.id === id) || null;
}

/**
 * Delete a graph template
 */
export function deleteGraphTemplate(id: string): void {
  const existing = getAllGraphTemplates();
  const filtered = existing.filter(t => t.id !== id);
  localStorage.setItem(GRAPHS_KEY, JSON.stringify(filtered));
}

/**
 * Generate a unique ID for a graph
 */
export function generateGraphId(): string {
  return `graph_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

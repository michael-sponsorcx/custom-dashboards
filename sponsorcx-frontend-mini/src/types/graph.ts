import type { Graph } from './backend-graphql';
import type { FilterRule } from './filters';

/**
 * Frontend graph configuration.
 * Extends the generated backend Graph type with UI-specific field overrides:
 * - filters: typed FilterRule[] instead of generic JSON
 */
export interface GraphUI extends Omit<Graph, '__typename' | 'filters' | 'organizationId'> {
  filters: FilterRule[];
}

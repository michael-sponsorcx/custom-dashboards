/**
 * Argument Builder
 *
 * Builds GraphQL arguments for cube queries.
 */

import { buildFilterWhereClause } from './filterBuilder';
import { FilterRule } from '../../../../types/filters';

/**
 * Build cube-level arguments (limit, timezone, where)
 *
 * @param cubeName - Cube name
 * @param options - Argument options
 * @returns Argument string formatted for GraphQL
 */
export function buildCubeArguments(
  cubeName: string,
  options: {
    filters?: FilterRule[];
    limit?: number;
    timezone?: string;
  }
): string {
  const { filters, limit, timezone } = options;
  const args: string[] = [];

  // Add WHERE clause from filters
  if (filters && filters.length > 0) {
    const whereClause = buildFilterWhereClause(cubeName, filters);
    if (whereClause) {
      args.push(whereClause);
    }
  }

  // Add limit
  if (limit) {
    args.push(`limit: ${limit}`);
  }

  // Add timezone
  if (timezone) {
    args.push(`timezone: "${timezone}"`);
  }

  return args.length > 0 ? `(${args.join(', ')})` : '';
}

/**
 * Build cube name-level arguments (orderBy)
 *
 * @param orderBy - Order by configuration
 * @returns Argument string formatted for GraphQL
 */
export function buildCubeNameArguments(
  orderBy?: { field: string; direction: 'asc' | 'desc' }
): string {
  if (!orderBy) return '';

  return `(orderBy: {${orderBy.field}: ${orderBy.direction}})`;
}

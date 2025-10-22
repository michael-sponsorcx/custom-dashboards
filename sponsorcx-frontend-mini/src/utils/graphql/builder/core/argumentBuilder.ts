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

  // Direction should be lowercase (asc or desc) per Cube GraphQL API
  const direction = orderBy.direction.toLowerCase();

  // Parse field name to handle nested structure
  // For cube fields, we need to strip the cube prefix
  // Example: "dim_agreements.revenue" -> just use "revenue"
  const parts = orderBy.field.split('.');
  const fieldName = parts.length > 1 ? parts[parts.length - 1] : parts[0];

  // Simple field: orderBy: { fieldName: asc }
  return `(orderBy: {${fieldName}: ${direction}})`;
}

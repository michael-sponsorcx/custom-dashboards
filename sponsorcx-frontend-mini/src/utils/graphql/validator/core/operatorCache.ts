/**
 * Operator Cache
 *
 * Manages caching of valid filter operators from Cube schema.
 */

import { getValidFilterOperators } from '../../../../services/cube';

// Cache for valid operators fetched from schema
let cachedValidOperators: string[] | null = null;

/**
 * Fallback operators to use if schema fetch fails
 */
const FALLBACK_OPERATORS = [
  'equals',
  'notEquals',
  'in',
  'notIn',
  'contains',
  'notContains',
  'set',
  'notSet',
  'gt',
  'gte',
  'lt',
  'lte',
  'inDateRange',
  'notInDateRange',
  'beforeDate',
  'afterDate',
  'beforeOrOnDate',
  'afterOrOnDate',
];

/**
 * Fetches valid filter operators from Cube.js schema
 * Uses cached value if available
 *
 * @returns Array of valid operator strings
 */
export async function getValidOperators(): Promise<string[]> {
  if (cachedValidOperators) {
    return cachedValidOperators;
  }

  try {
    const operators = await getValidFilterOperators();
    cachedValidOperators = operators;
    return operators;
  } catch (error) {
    return FALLBACK_OPERATORS;
  }
}

/**
 * Clears the cached operators
 * Useful for testing or when schema changes
 */
export function clearOperatorCache(): void {
  cachedValidOperators = null;
}

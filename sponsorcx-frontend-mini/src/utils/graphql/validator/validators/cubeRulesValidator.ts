/**
 * Cube Rules Validator
 *
 * Validates Cube.js-specific GraphQL rules and conventions.
 */

import { ValidationError, ValidationWarning } from '../../types';
import { getValidOperators } from '../core/operatorCache';

/**
 * Valid Cube query arguments
 */
const VALID_CUBE_ARGS = ['limit', 'offset', 'timezone', 'renewQuery', 'ungrouped', 'where'];

/**
 * Valid time dimension granularities
 */
const VALID_GRANULARITIES = [
  'second',
  'minute',
  'hour',
  'day',
  'week',
  'month',
  'quarter',
  'year',
  'value',
];

/**
 * Validate Cube.js-specific rules (async version with schema validation)
 *
 * @param queryString - GraphQL query string to validate
 * @returns Validation result with errors and warnings
 */
export async function validateCubeRules(queryString: string): Promise<{
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}> {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Check for required 'cube' root field
  if (!/\bcube\s*[({]/.test(queryString)) {
    errors.push({
      type: 'cube',
      message: 'Cube queries must include the "cube" root field',
    });
  }

  // Check for cube names (should be after 'cube {')
  const cubeMatchRegex = /cube\s*(?:\([^)]*\))?\s*{([^}]+)}/;
  const cubeMatch = queryString.match(cubeMatchRegex);
  if (cubeMatch) {
    const cubeContent = cubeMatch[1];

    // Validate cube names (lowercase with underscores)
    const cubeNameMatches = cubeContent.match(/\b[a-z_][a-z0-9_]*\s*(?:\(|{)/g);
    if (!cubeNameMatches || cubeNameMatches.length === 0) {
      errors.push({
        type: 'cube',
        message: 'No cube names found. Specify at least one cube (e.g., "orders", "products")',
      });
    }
  }

  // Validate Cube query arguments
  validateCubeArguments(queryString, warnings);

  // Validate where clause with schema-based operators
  await validateWhereClause(queryString, warnings);

  // Validate time dimension granularity
  validateTimeDimensions(queryString, warnings);

  // Validate orderBy structure
  validateOrderBy(queryString, warnings);

  return { valid: errors.length === 0, errors, warnings };
}

/**
 * Validate Cube query arguments
 */
function validateCubeArguments(queryString: string, _warnings: ValidationWarning[]): void {
  const cubeArgMatches = queryString.match(/cube\s*\(([^)]+)\)/);
  if (cubeArgMatches) {
    const args = cubeArgMatches[1];
    VALID_CUBE_ARGS.forEach((arg) => {
      if (new RegExp(`\\b${arg}\\s*:`).test(args)) {
        // Argument is present - could add more specific validation here
      }
    });
  }
}

/**
 * Validate where clause using schema-based operators
 */
async function validateWhereClause(
  queryString: string,
  warnings: ValidationWarning[]
): Promise<void> {
  if (!/where\s*:\s*{/.test(queryString)) {
    return;
  }

  // Fetch valid operators from schema
  const validFilters = await getValidOperators();

  // This is a simplified check - a full implementation would parse the AST
  const hasValidFilter = validFilters.some((filter) =>
    new RegExp(`\\b${filter}\\s*:`).test(queryString)
  );

  if (!hasValidFilter && /where\s*:\s*{[^}]+}/.test(queryString)) {
    warnings.push({
      type: 'cube',
      message: `where clause may contain invalid filter operators. Valid operators from schema: ${validFilters.join(
        ', '
      )}`,
    });
  }
}

/**
 * Validate time dimension granularity
 */
function validateTimeDimensions(queryString: string, warnings: ValidationWarning[]): void {
  const timeDimensionPattern = /(\w+)\s*{\s*(\w+)\s*}/g;
  let match;

  while ((match = timeDimensionPattern.exec(queryString)) !== null) {
    const granularity = match[2];
    if (!VALID_GRANULARITIES.includes(granularity) && !/^[a-z_]+$/.test(granularity)) {
      warnings.push({
        type: 'cube',
        message: `"${granularity}" may be an invalid time granularity. Valid: ${VALID_GRANULARITIES.join(
          ', '
        )}`,
      });
    }
  }
}

/**
 * Validate orderBy structure
 */
function validateOrderBy(queryString: string, warnings: ValidationWarning[]): void {
  if (!/orderBy\s*:\s*{/.test(queryString)) {
    return;
  }

  if (!/orderBy\s*:\s*{\s*\w+\s*:\s*(asc|desc)/.test(queryString)) {
    warnings.push({
      type: 'cube',
      message: 'orderBy should use format: orderBy: { field: asc } or orderBy: { field: desc }',
    });
  }
}

/**
 * Syntax Validator
 *
 * Validates basic GraphQL syntax rules.
 */

import { ValidationError } from '../../types';

/**
 * Validate basic GraphQL syntax
 *
 * @param queryString - GraphQL query string to validate
 * @returns Validation result with errors
 */
export function validateGraphQLSyntax(queryString: string): { valid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  // Check for empty query
  if (!queryString.trim()) {
    errors.push({ type: 'syntax', message: 'Query cannot be empty' });
    return { valid: false, errors };
  }

  // Check for balanced braces
  const openBraces = (queryString.match(/{/g) || []).length;
  const closeBraces = (queryString.match(/}/g) || []).length;
  if (openBraces !== closeBraces) {
    errors.push({ type: 'syntax', message: `Unbalanced braces: ${openBraces} opening, ${closeBraces} closing` });
  }

  // Check for balanced parentheses
  const openParens = (queryString.match(/\(/g) || []).length;
  const closeParens = (queryString.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    errors.push({ type: 'syntax', message: `Unbalanced parentheses: ${openParens} opening, ${closeParens} closing` });
  }

  // Check for query/mutation keyword or shorthand
  const hasQueryKeyword = /^\s*(query|mutation|\{)/.test(queryString);
  if (!hasQueryKeyword) {
    errors.push({ type: 'syntax', message: 'Query must start with "query", "mutation", or "{"' });
  }

  return { valid: errors.length === 0, errors };
}

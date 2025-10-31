/**
 * Validator Module
 *
 * Exports all validation functionality.
 */

import { ValidationResult, ValidationError, ValidationWarning } from '../types';
import { validateGraphQLSyntax } from './validators/syntaxValidator';
import { validateCubeRules } from './validators/cubeRulesValidator';

/**
 * Validate a Cube GraphQL query
 * Performs both syntax and Cube-specific rule validation
 *
 * @param query - GraphQL query string to validate
 * @returns Validation result with errors and warnings
 */
export async function validateCubeGraphQLQuery(query: string): Promise<ValidationResult> {
  // Step 1: Validate GraphQL syntax
  const syntaxResult = validateGraphQLSyntax(query);

  // Step 2: Validate Cube-specific rules (only if syntax is valid)
  let cubeResult = {
    valid: true,
    errors: [] as ValidationError[],
    warnings: [] as ValidationWarning[],
  };
  if (syntaxResult.valid) {
    cubeResult = await validateCubeRules(query);
  }

  // Combine results
  const allErrors = [...syntaxResult.errors, ...cubeResult.errors];
  const allWarnings = cubeResult.warnings || [];

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
  };
}

// Re-export validators for direct use if needed
export { validateGraphQLSyntax } from './validators/syntaxValidator';
export { validateCubeRules } from './validators/cubeRulesValidator';
export { getValidOperators, clearOperatorCache } from './core/operatorCache';

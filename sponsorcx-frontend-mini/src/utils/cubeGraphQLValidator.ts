import { ValidationError, ValidationWarning, ValidationResult } from '../types/cube';

// Validate GraphQL syntax
const validateGraphQLSyntax = (queryString: string): { valid: boolean; errors: ValidationError[] } => {
  const errors: ValidationError[] = [];

  // Check for basic GraphQL structure
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
};

// Validate Cube-specific rules
const validateCubeRules = (queryString: string): { valid: boolean; errors: ValidationError[]; warnings: ValidationWarning[] } => {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Check for required 'cube' root field
  if (!/\bcube\s*[({]/.test(queryString)) {
    errors.push({
      type: 'cube',
      message: 'Cube queries must include the "cube" root field'
    });
  }

  // Check for cube names (should be after 'cube {')
  const cubeMatch = queryString.match(/cube\s*(?:\([^)]*\))?\s*{([^}]+)}/s);
  if (cubeMatch) {
    const cubeContent = cubeMatch[1];

    // Validate cube names (lowercase with underscores)
    const cubeNameMatches = cubeContent.match(/\b[a-z_][a-z0-9_]*\s*(?:\(|{)/g);
    if (!cubeNameMatches || cubeNameMatches.length === 0) {
      errors.push({
        type: 'cube',
        message: 'No cube names found. Specify at least one cube (e.g., "orders", "products")'
      });
    }
  }

  // Check for valid Cube query arguments
  const validCubeArgs = ['limit', 'offset', 'timezone', 'renewQuery', 'ungrouped', 'where'];
  const cubeArgMatches = queryString.match(/cube\s*\(([^)]+)\)/);
  if (cubeArgMatches) {
    const args = cubeArgMatches[1];
    validCubeArgs.forEach(arg => {
      if (new RegExp(`\\b${arg}\\s*:`).test(args)) {
        // Argument is present - could add more specific validation here
      }
    });
  }

  // Check for valid where clause structure
  if (/where\s*:\s*{/.test(queryString)) {
    const validFilters = ['equals', 'notEquals', 'in', 'notIn', 'contains', 'notContains',
                         'set', 'inDateRange', 'notInDateRange', 'beforeDate', 'afterDate'];

    // This is a simplified check - a full implementation would parse the AST
    const hasValidFilter = validFilters.some(filter =>
      new RegExp(`\\b${filter}\\s*:`).test(queryString)
    );

    if (!hasValidFilter && /where\s*:\s*{[^}]+}/.test(queryString)) {
      warnings.push({
        type: 'cube',
        message: 'where clause may contain invalid filter operators. Valid: equals, notEquals, in, notIn, contains, notContains, set, inDateRange, notInDateRange, beforeDate, afterDate'
      });
    }
  }

  // Check for time dimension granularity
  const timeDimensionPattern = /(\w+)\s*{\s*(\w+)\s*}/g;
  let match;
  const validGranularities = ['second', 'minute', 'hour', 'day', 'week', 'month', 'quarter', 'year', 'value'];

  while ((match = timeDimensionPattern.exec(queryString)) !== null) {
    const granularity = match[2];
    if (!validGranularities.includes(granularity) && !/^[a-z_]+$/.test(granularity)) {
      warnings.push({
        type: 'cube',
        message: `"${granularity}" may be an invalid time granularity. Valid: ${validGranularities.join(', ')}`
      });
    }
  }

  // Check for orderBy structure
  if (/orderBy\s*:\s*{/.test(queryString)) {
    if (!/orderBy\s*:\s*{\s*\w+\s*:\s*(asc|desc)/.test(queryString)) {
      warnings.push({
        type: 'cube',
        message: 'orderBy should use format: orderBy: { field: asc } or orderBy: { field: desc }'
      });
    }
  }

  return { valid: errors.length === 0, errors, warnings };
};

export const validateCubeGraphQLQuery = (query: string): ValidationResult => {
  // Step 1: Validate GraphQL syntax
  const syntaxResult = validateGraphQLSyntax(query);

  // Step 2: Validate Cube-specific rules (only if syntax is valid)
  let cubeResult = { valid: true, errors: [] as ValidationError[], warnings: [] as ValidationWarning[] };
  if (syntaxResult.valid) {
    cubeResult = validateCubeRules(query);
  }

  // Combine results
  const allErrors = [...syntaxResult.errors, ...cubeResult.errors];
  const allWarnings = cubeResult.warnings || [];

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings
  };
};

/**
 * Shared types for GraphQL utilities (builder and validator)
 */

import { FilterRule } from '../../types/filters';

/**
 * Parameters for building a Cube GraphQL query
 */
export interface QueryBuilderParams {
  cubeName: string;
  measures: string[];
  dimensions: string[];
  timeDimensions: string[];
  orderBy?: { field: string; direction: 'asc' | 'desc' };
  limit?: number;
  timezone?: string;
  filters?: FilterRule[];
}

/**
 * Validation error type
 */
export interface ValidationError {
  type: 'syntax' | 'cube';
  message: string;
}

/**
 * Validation warning type
 */
export interface ValidationWarning {
  type: 'syntax' | 'cube';
  message: string;
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

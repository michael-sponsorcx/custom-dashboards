/**
 * Filter Builder
 *
 * Builds WHERE clause for GraphQL queries from filter rules.
 */

import { FilterRule, isMeasureFilter, isDimensionFilter, isDateFilter } from '../../../../types/filters';
import { stripCubePrefix } from './utils';

/**
 * Operator mapping for comparison operators
 */
const COMPARISON_OPERATOR_MAP: Record<string, string> = {
  '=': 'equals',
  '>': 'gt',
  '<': 'lt',
  '>=': 'gte',
  '<=': 'lte',
};

/**
 * Build filter condition for a measure filter
 *
 * @param filter - Measure filter rule
 * @returns Filter condition string
 */
function buildMeasureFilterCondition(filter: any): string {
  const fieldName = stripCubePrefix(filter.fieldName);
  const cubeOp = COMPARISON_OPERATOR_MAP[filter.operator];
  return `${fieldName}: { ${cubeOp}: ${filter.value} }`;
}

/**
 * Build filter condition for a dimension filter
 *
 * @param filter - Dimension filter rule
 * @returns Filter condition string
 */
function buildDimensionFilterCondition(filter: any): string {
  const fieldName = stripCubePrefix(filter.fieldName);
  const valuesArray = filter.values.map((v: string) => `"${v}"`).join(', ');

  if (filter.mode === 'include') {
    return `${fieldName}: { contains: [${valuesArray}] }`;
  } else {
    return `${fieldName}: { notContains: [${valuesArray}] }`;
  }
}

/**
 * Build filter condition for a date filter
 *
 * @param filter - Date filter rule
 * @returns Filter condition string
 */
function buildDateFilterCondition(filter: any): string {
  const fieldName = stripCubePrefix(filter.fieldName);
  const cubeOp = COMPARISON_OPERATOR_MAP[filter.operator];
  return `${fieldName}: { ${cubeOp}: "${filter.value}" }`;
}

/**
 * Build WHERE clause from filter rules
 *
 * @param cubeName - Cube name
 * @param filters - Array of filter rules
 * @returns WHERE clause string (empty if no filters)
 */
export function buildFilterWhereClause(cubeName: string, filters: FilterRule[]): string {
  if (!filters || filters.length === 0) return '';

  const filterConditions: string[] = [];

  filters.forEach(filter => {
    if (isMeasureFilter(filter)) {
      filterConditions.push(buildMeasureFilterCondition(filter));
    } else if (isDimensionFilter(filter)) {
      filterConditions.push(buildDimensionFilterCondition(filter));
    } else if (isDateFilter(filter)) {
      filterConditions.push(buildDateFilterCondition(filter));
    }
  });

  if (filterConditions.length === 0) return '';

  // WHERE clause nested under cube name
  const lowercaseCubeName = cubeName.toLowerCase();
  return `where: { ${lowercaseCubeName}: { ${filterConditions.join(', ')} } }`;
}

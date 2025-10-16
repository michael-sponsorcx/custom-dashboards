import { CubeMeasure, CubeDimension } from '../types/cube';
import { FilterRule, isMeasureFilter, isDimensionFilter, isDateFilter } from '../types/filters';

interface QueryBuilderParams {
  cubeName: string;
  measures: CubeMeasure[];
  dimensions: CubeDimension[];
  timeDimensions: CubeDimension[];
  orderBy?: { field: string; direction: 'asc' | 'desc' };
  limit?: number;
  timezone?: string;
  filters?: FilterRule[];
}

/**
 * Helper function to strip cube name prefix from field names
 */
const stripCubePrefix = (fieldName: string): string => {
  // If field name contains a period, take everything after the last period
  const parts = fieldName.split('.');
  return parts.length > 1 ? parts[parts.length - 1] : fieldName;
};

/**
 * Builds filter WHERE clause for GraphQL query
 * The WHERE clause must be nested under the cube name
 */
function buildFilterWhereClause(cubeName: string, filters: FilterRule[]): string {
  if (!filters || filters.length === 0) return '';

  const filterConditions: string[] = [];

  filters.forEach(filter => {
    const fieldName = stripCubePrefix(filter.fieldName);

    if (isMeasureFilter(filter)) {
      // Measure filter: numeric comparison
      const opMap: Record<string, string> = {
        '=': 'equals',
        '>': 'gt',
        '<': 'lt',
        '>=': 'gte',
        '<=': 'lte',
      };
      const cubeOp = opMap[filter.operator];
      filterConditions.push(`${fieldName}: { ${cubeOp}: ${filter.value} }`);
    } else if (isDimensionFilter(filter)) {
      // Dimension filter: include/exclude list
      const valuesArray = filter.values.map(v => `"${v}"`).join(', ');
      if (filter.mode === 'include') {
        // Include uses "contains" operator
        filterConditions.push(`${fieldName}: { contains: [${valuesArray}] }`);
      } else {
        // Exclude uses "notContains" operator
        filterConditions.push(`${fieldName}: { notContains: [${valuesArray}] }`);
      }
    } else if (isDateFilter(filter)) {
      // Date filter: date comparison
      const opMap: Record<string, string> = {
        '=': 'equals',
        '>': 'gt',
        '<': 'lt',
        '>=': 'gte',
        '<=': 'lte',
      };
      const cubeOp = opMap[filter.operator];
      filterConditions.push(`${fieldName}: { ${cubeOp}: "${filter.value}" }`);
    }
  });

  if (filterConditions.length === 0) return '';

  // Return the where clause nested under the cube name
  const lowercaseCubeName = cubeName.toLowerCase();
  return `where: { ${lowercaseCubeName}: { ${filterConditions.join(', ')} } }`;
}

/**
 * Builds a GraphQL query for Cube semantic layer
 * @param params - Query parameters including cube name, measures, dimensions, etc.
 * @returns GraphQL query string
 */
export function buildCubeQuery(params: QueryBuilderParams): string {
  const {
    cubeName,
    measures,
    dimensions,
    timeDimensions,
    orderBy,
    limit,
    timezone,
    filters,
  } = params;

  // Build cube arguments (limit, timezone, where)
  const cubeArgs: string[] = [];

  // Add filters as WHERE clause
  if (filters && filters.length > 0) {
    const whereClause = buildFilterWhereClause(cubeName, filters);
    if (whereClause) {
      cubeArgs.push(whereClause);
    }
  }

  if (limit) {
    cubeArgs.push(`limit: ${limit}`);
  }
  if (timezone) {
    cubeArgs.push(`timezone: "${timezone}"`);
  }
  const cubeArgsStr = cubeArgs.length > 0 ? `(${cubeArgs.join(', ')})` : '';

  // Build cube-level arguments (orderBy)
  const cubeNameArgs: string[] = [];
  if (orderBy) {
    cubeNameArgs.push(`orderBy: {${orderBy.field}: ${orderBy.direction}}`);
  }
  const cubeNameArgsStr = cubeNameArgs.length > 0 ? `(${cubeNameArgs.join(', ')})` : '';

  // Build fields list
  const fields: string[] = [];

  // Add measures
  measures.forEach(measure => {
    const fieldName = stripCubePrefix(measure.name);
    fields.push(`      ${fieldName}`);
  });

  // Add regular dimensions
  dimensions.forEach(dimension => {
    const fieldName = stripCubePrefix(dimension.name);
    fields.push(`      ${fieldName}`);
  });

  // Add time dimensions with granularity
  timeDimensions.forEach(timeDim => {
    const fieldName = stripCubePrefix(timeDim.name);
    // Default to 'day' granularity for time dimensions
    fields.push(`      ${fieldName} {
        value
      }`);
  });

  // If no fields selected, return empty query
  if (fields.length === 0) {
    return '';
  }

  // Build the complete query
  // Cube names should be lowercase in GraphQL
  const lowercaseCubeName = cubeName.toLowerCase();

  const query = `query CubeQuery {
  cube${cubeArgsStr} {
    ${lowercaseCubeName}${cubeNameArgsStr} {
${fields.join('\n')}
    }
  }
}`;

  return query;
}

/**
 * Builds a simple query with just the selected fields (no ordering or limits)
 */
export function buildSimpleCubeQuery(
  cubeName: string,
  measures: CubeMeasure[],
  dimensions: CubeDimension[],
  timeDimensions: CubeDimension[],
  filters?: FilterRule[]
): string {
  return buildCubeQuery({
    cubeName,
    measures,
    dimensions,
    timeDimensions,
    filters,
  });
}

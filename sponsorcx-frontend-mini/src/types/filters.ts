/**
 * Filter Types and Interfaces
 *
 * Defines the data structures for filtering chart data by measures, dimensions, and dates.
 */

export type FieldType = 'measure' | 'dimension' | 'date';

export type ComparisonOperator = '=' | '>' | '<' | '>=' | '<=';

/**
 * Base filter rule interface
 */
interface BaseFilterRule {
  fieldName: string;
  fieldTitle: string;
  fieldType: FieldType;
}

/**
 * Filter rule for measures (numeric fields)
 * Uses comparison operators with a numeric value
 */
export interface MeasureFilterRule extends BaseFilterRule {
  fieldType: 'measure';
  operator: ComparisonOperator;
  value: number;
}

/**
 * Filter rule for dimensions (categorical fields)
 * Uses include/exclude lists
 */
export interface DimensionFilterRule extends BaseFilterRule {
  fieldType: 'dimension';
  mode: 'include' | 'exclude';
  values: string[];
}

/**
 * Filter rule for dates
 * Uses comparison operators with date values (date portion only, no time)
 */
export interface DateFilterRule extends BaseFilterRule {
  fieldType: 'date';
  operator: ComparisonOperator;
  value: string; // ISO date string (YYYY-MM-DD)
}

/**
 * Union type of all filter rules
 */
export type FilterRule = MeasureFilterRule | DimensionFilterRule | DateFilterRule;

/**
 * Helper type guards
 */
export function isMeasureFilter(rule: FilterRule): rule is MeasureFilterRule {
  return rule.fieldType === 'measure';
}

export function isDimensionFilter(rule: FilterRule): rule is DimensionFilterRule {
  return rule.fieldType === 'dimension';
}

export function isDateFilter(rule: FilterRule): rule is DateFilterRule {
  return rule.fieldType === 'date';
}

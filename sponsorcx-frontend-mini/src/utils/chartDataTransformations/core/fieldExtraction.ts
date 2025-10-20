/**
 * Field Extraction Utilities
 *
 * Handles extraction and classification of fields from chart data.
 * Identifies dimensions (string fields) and measures (numeric fields).
 */

import { FieldStructure } from '../types';

/**
 * Extract and classify fields from chart data into dimensions and measures
 *
 * @param chartData - Array of data points
 * @returns Object containing dimensionFields and measureFields arrays
 */
export function extractFields(chartData: any[]): FieldStructure {
  if (!chartData || chartData.length === 0) {
    return { dimensionFields: [], measureFields: [] };
  }

  const firstPoint = chartData[0];
  const fields = Object.keys(firstPoint);

  const dimensionFields: string[] = [];
  const measureFields: string[] = [];

  fields.forEach(field => {
    const value = firstPoint[field];
    if (typeof value === 'string') {
      dimensionFields.push(field);
    } else if (typeof value === 'number') {
      measureFields.push(field);
    }
  });

  return { dimensionFields, measureFields };
}

/**
 * Select dimension field based on user preference or default to first
 *
 * @param dimensionFields - Available dimension fields
 * @param userSelection - User-selected dimension (optional)
 * @returns Selected dimension field
 */
export function selectDimension(
  dimensionFields: string[],
  userSelection?: string
): string {
  if (userSelection && dimensionFields.includes(userSelection)) {
    return userSelection;
  }
  return dimensionFields[0];
}

/**
 * Select measure field based on user preference or default to first
 *
 * @param measureFields - Available measure fields
 * @param userSelection - User-selected measure (optional)
 * @returns Selected measure field
 */
export function selectMeasure(
  measureFields: string[],
  userSelection?: string
): string {
  if (userSelection && measureFields.includes(userSelection)) {
    return userSelection;
  }
  return measureFields[0];
}

/**
 * Validate that required fields exist for chart rendering
 *
 * @param fields - Field structure with dimensions and measures
 * @param minDimensions - Minimum required dimensions
 * @param minMeasures - Minimum required measures
 * @returns True if requirements are met
 */
export function validateFieldRequirements(
  fields: FieldStructure,
  minDimensions: number = 1,
  minMeasures: number = 1
): boolean {
  return (
    fields.dimensionFields.length >= minDimensions &&
    fields.measureFields.length >= minMeasures
  );
}

/**
 * Field Extraction Utilities
 *
 * Handles extraction and classification of fields from chart data.
 * Identifies dimensions (string fields) and measures (numeric fields).
 */

import { ChartDataPoint, FieldStructure } from '../types';

/**
 * Extract and classify fields from chart data into dimensions and measures
 *
 * @param chartData - Array of data points
 * @returns Object containing dimensionFields and measureFields arrays
 *
 * @example
 * Input: [
 *   { fiscal_year: "2023", revenue: 150000, region: "North" },
 *   { fiscal_year: "2024", revenue: 200000, region: "South" }
 * ]
 * Output: {
 *   dimensionFields: ["fiscal_year", "region"],
 *   measureFields: ["revenue"]
 * }
 */
export function extractDimensionsAndMeasureFields(chartData: ChartDataPoint[]): FieldStructure {
  if (!chartData || chartData.length === 0) {
    return { dimensionFields: [], measureFields: [] };
  }

  const firstPoint = chartData[0];
  const fields = Object.keys(firstPoint);

  const dimensionFields: string[] = [];
  const measureFields: string[] = [];

  fields.forEach((field) => {
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
 * Handles mismatches between user-selected names and actual field names
 *
 * @param dimensionFields - Available dimension fields
 * @param userSelection - User-selected dimension (optional)
 * @returns Selected dimension field
 *
 * @example
 * Input: dimensionFields = ["Revenue.fiscal_year", "Revenue.region"]
 *        userSelection = "fiscal_year"
 * Output: "Revenue.fiscal_year"
 *
 * @example
 * Input: dimensionFields = ["fiscal_year", "region"]
 *        userSelection = "Revenue.fiscal_year"
 * Output: "fiscal_year"
 *
 * @example
 * Input: dimensionFields = ["fiscal_year", "region"]
 *        userSelection = undefined
 * Output: "fiscal_year" (returns first field)
 */
export function selectDimension(dimensionFields: string[], userSelection?: string): string {
  if (!userSelection) {
    return dimensionFields[0];
  }

  // Try exact match first
  if (dimensionFields.includes(userSelection)) {
    return userSelection;
  }

  // If userSelection has a table prefix (e.g., "Revenue.fiscal_year"),
  // try to match just the field name part
  if (userSelection.includes('.')) {
    const fieldNameOnly = userSelection.split('.').pop()!;
    if (dimensionFields.includes(fieldNameOnly)) {
      console.log(`selectDimension: Matched "${userSelection}" to field "${fieldNameOnly}"`);
      return fieldNameOnly;
    }
  }

  // If userSelection doesn't have a prefix but dimensionFields do,
  // try to find a field that ends with the userSelection
  const matchingField = dimensionFields.find(
    (field) => field.endsWith(`.${userSelection}`) || field === userSelection
  );

  if (matchingField) {
    console.log(`selectDimension: Matched "${userSelection}" to field "${matchingField}"`);
    return matchingField;
  }

  console.warn(
    `selectDimension: Could not match "${userSelection}", falling back to first field "${dimensionFields[0]}"`
  );
  return dimensionFields[0];
}

/**
 * Select measure field based on user preference or default to first
 *
 * @param measureFields - Available measure fields
 * @param userSelection - User-selected measure (optional)
 * @returns Selected measure field
 *
 * @example
 * Input: measureFields = ["revenue", "profit", "cost"]
 *        userSelection = "profit"
 * Output: "profit"
 *
 * @example
 * Input: measureFields = ["revenue", "profit", "cost"]
 *        userSelection = undefined
 * Output: "revenue" (returns first field)
 */
export function selectMeasure(measureFields: string[], userSelection?: string): string {
  if (userSelection && measureFields.includes(userSelection)) {
    return userSelection;
  }
  return measureFields[0];
}

/**
 * Validate that required fields exist for chart rendering
 *
 * @param fields - Field structure with dimensions and measures
 * @param minDimensions - Minimum required dimensions (default: 1)
 * @param minMeasures - Minimum required measures (default: 1)
 * @returns True if requirements are met
 *
 * @example
 * Input: fields = { dimensionFields: ["region", "year"], measureFields: ["revenue"] }
 *        minDimensions = 1, minMeasures = 1
 * Output: true
 *
 * @example
 * Input: fields = { dimensionFields: ["region"], measureFields: ["revenue", "profit"] }
 *        minDimensions = 2, minMeasures = 1
 * Output: false (only 1 dimension, needs 2)
 */
export function validateFieldRequirements(
  fields: FieldStructure,
  minDimensions = 1,
  minMeasures = 1
): boolean {
  return (
    fields.dimensionFields.length >= minDimensions && fields.measureFields.length >= minMeasures
  );
}

/**
 * Dimension field name resolution utilities
 *
 * **Context:** Backend returns qualified names like "Revenue.region"
 * **Purpose:** Handle both qualified and simple names in drill-down logic
 * **Future:** Consider normalizing at API layer (see backlog)
 */

/**
 * Resolves dimension field to full qualified name
 *
 * @input dimensionField: "region", availableDimensions: ["Revenue.region", "Revenue.product"]
 * @output "Revenue.region"
 */
export function resolveFullDimensionName(
  dimensionField: string,
  availableDimensions: string[]
): string {
  if (dimensionField.includes('.')) {
    return dimensionField;
  }

  const fullName = availableDimensions.find(
    (dim) => dim.endsWith(`.${dimensionField}`) || dim === dimensionField
  );

  return fullName || dimensionField;
}

/**
 * Extracts dimension value from data point, trying multiple formats
 *
 * @input dataPoint: { "Revenue.region": "North" }, dimensionField: "Revenue.region"
 * @output "North"
 */
export function extractDimensionValue(
  dataPoint: Record<string, any>,
  dimensionField: string
): any {
  let value = dataPoint[dimensionField];

  if (value !== undefined) {
    return value;
  }

  // Fallback: try without table prefix
  const fieldNameOnly = dimensionField.includes('.')
    ? dimensionField.split('.').pop()!
    : dimensionField;

  return dataPoint[fieldNameOnly];
}

/**
 * Strips table prefix from qualified field name
 *
 * @input qualifiedName: "Revenue.region"
 * @output "region"
 */
export function getFieldNameOnly(qualifiedName: string): string {
  return qualifiedName.includes('.') ? qualifiedName.split('.').pop()! : qualifiedName;
}

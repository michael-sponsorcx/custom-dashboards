/**
 * Shared utilities for query building
 */

/**
 * Strip cube name prefix from field names
 * Example: "ViewName.fieldName" -> "fieldName"
 *
 * @param fieldName - Field name possibly with cube prefix
 * @returns Stripped field name
 */
export function stripCubePrefix(fieldName: string): string {
  const parts = fieldName.split('.');
  return parts.length > 1 ? parts[parts.length - 1] : fieldName;
}

/**
 * Transforms Cube query results into CSV format
 * @param queryResult - The raw query result from Cube API
 * @returns CSV string
 */
export function transformQueryResultsToCSV(queryResult: any): string {
  // Extract the data array from the query result
  // Structure: { data: { cube: [ {...}, {...} ] } }
  if (!queryResult?.data?.cube || !Array.isArray(queryResult.data.cube)) {
    console.error('Invalid query result structure:', queryResult);
    return '';
  }

  const rows = queryResult.data.cube;

  if (rows.length === 0) {
    return '';
  }

  // Flatten the nested structure
  // Each row looks like: { viewname: { field1: value1, field2: value2, ... } }
  // We need to flatten it to: { field1: value1, field2: value2, ... }
  const flattenedRows = rows.map((row: any) => {
    const flattened: Record<string, any> = {};

    // Iterate through each view object in the row
    Object.values(row).forEach((viewData: any) => {
      if (viewData && typeof viewData === 'object') {
        // Handle nested time dimension objects (which have a 'value' property)
        Object.entries(viewData).forEach(([key, value]: [string, any]) => {
          if (value && typeof value === 'object' && 'value' in value) {
            // This is a time dimension with nested value
            flattened[key] = value.value;
          } else {
            flattened[key] = value;
          }
        });
      }
    });

    return flattened;
  });

  // Get all unique column headers
  const headers = new Set<string>();
  flattenedRows.forEach((row: Record<string, any>) => {
    Object.keys(row).forEach(key => headers.add(key));
  });

  const headerArray = Array.from(headers);

  // Build CSV string
  const csvRows: string[] = [];

  // Add header row
  csvRows.push(headerArray.map(header => escapeCSVValue(header)).join(','));

  // Add data rows
  flattenedRows.forEach((row: Record<string, any>) => {
    const values = headerArray.map(header => {
      const value = row[header];
      return escapeCSVValue(value);
    });
    csvRows.push(values.join(','));
  });

  return csvRows.join('\n');
}

/**
 * Escapes a value for CSV format
 * Handles quotes, commas, and newlines
 */
function escapeCSVValue(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }

  const stringValue = String(value);

  // If value contains comma, quote, or newline, wrap in quotes and escape quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

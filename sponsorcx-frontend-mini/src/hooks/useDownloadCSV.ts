import { useCallback } from 'react';
import { transformQueryResultsToCSV } from '../utils/csvExport';

/**
 * Hook for downloading query results as CSV
 * @param queryResult - The query result data to export
 * @param filename - The name of the downloaded file (without .csv extension)
 * @returns A function that triggers the download
 */
export function useDownloadCSV(queryResult: any, filename = 'data') {
  const downloadCSV = useCallback(() => {
    if (!queryResult) {
      return;
    }

    // Transform the query result to CSV
    const csvContent = transformQueryResultsToCSV(queryResult);

    if (!csvContent) {
      return;
    }

    // Create a Blob from the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Create a download link and trigger it
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the URL object
    URL.revokeObjectURL(url);
  }, [queryResult, filename]);

  return downloadCSV;
}

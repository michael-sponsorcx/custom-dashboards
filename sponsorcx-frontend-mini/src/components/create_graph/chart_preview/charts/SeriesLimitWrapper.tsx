import { Alert, Text } from '@mantine/core';
import { ReactNode } from 'react';

interface SeriesLimitWrapperProps {
  seriesCount: number;
  maxSeries?: number;
  children: ReactNode;
}

/**
 * SeriesLimitWrapper - Checks if series count exceeds limit and shows warning
 * Use this wrapper for any chart that displays multiple series
 */
export function SeriesLimitWrapper({
  seriesCount,
  maxSeries = 100,
  children
}: SeriesLimitWrapperProps) {
  if (seriesCount > maxSeries) {
    return (
      <div style={{ width: '100%', padding: '2rem' }}>
        <Alert color="yellow" title="Too Many Series" variant="light">
          <Text size="sm">
            This chart would display {seriesCount} series, which exceeds the maximum limit of {maxSeries}.
            Please refine your query to reduce the number of series.
          </Text>
          <Text size="xs" c="dimmed" mt="sm">
            Tip: Use filters or aggregations to group your data into fewer categories.
          </Text>
        </Alert>
      </div>
    );
  }

  return <div style={{ width: '100%', minHeight: '400px' }}>{children}</div>;
}

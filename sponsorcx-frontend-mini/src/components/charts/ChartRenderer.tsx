import { Text, Alert } from '@mantine/core';
import { ChartType } from '../../utils/chartDataAnalyzer';
import { NumberTile } from './NumberTile';
import { MantineLineChart } from './MantineLineChart';
import { MantineBarChart } from './MantineBarChart';
import { extractSingleValue } from '../../utils/chartDataAnalyzer';

interface ChartRendererProps {
  queryResult: any;
  selectedChartType: ChartType;
  numberFormat: 'currency' | 'percentage' | 'number' | 'abbreviated';
  numberPrecision: number;
  primaryColor: string;
}

/**
 * ChartRenderer - Renders the appropriate chart based on selected type
 */
export function ChartRenderer({
  queryResult,
  selectedChartType,
  numberFormat,
  numberPrecision,
  primaryColor,
}: ChartRendererProps) {
  switch (selectedChartType) {
    case 'number':
      return (
        <RenderNumberTile
          queryResult={queryResult}
          formatType={numberFormat}
          precision={numberPrecision}
          primaryColor={primaryColor}
        />
      );

    case 'line':
      return <MantineLineChart queryResult={queryResult} primaryColor={primaryColor} />;

    case 'bar':
      return (
        <MantineBarChart
          queryResult={queryResult}
          primaryColor={primaryColor}
          orientation="vertical"
          type="default"
        />
      );

    case 'stackedBar':
      return (
        <MantineBarChart
          queryResult={queryResult}
          primaryColor={primaryColor}
          orientation="vertical"
          type="stacked"
        />
      );

    case 'horizontalBar':
      return (
        <MantineBarChart
          queryResult={queryResult}
          primaryColor={primaryColor}
          orientation="horizontal"
          type="default"
        />
      );

    case 'horizontalStackedBar':
      return (
        <MantineBarChart
          queryResult={queryResult}
          primaryColor={primaryColor}
          orientation="horizontal"
          type="stacked"
        />
      );

    default:
      return <PlaceholderChart chartType={selectedChartType} />;
  }
}

/**
 * Renders a Number Tile with data from query result
 */
function RenderNumberTile({
  queryResult,
  formatType,
  precision,
  primaryColor,
}: {
  queryResult: any;
  formatType: 'currency' | 'percentage' | 'number' | 'abbreviated';
  precision: number;
  primaryColor: string;
}) {
  const value = extractSingleValue(queryResult);

  if (value === null) {
    return (
      <Alert color="red" variant="light">
        <Text size="sm">Unable to extract numeric value from query result.</Text>
      </Alert>
    );
  }

  return (
    <NumberTile
      value={value}
      formatType={formatType}
      precision={precision}
      primaryColor={primaryColor}
    />
  );
}

/**
 * Placeholder component for charts not yet implemented
 */
function PlaceholderChart({ chartType }: { chartType: string }) {
  return (
    <Text size="lg" c="dimmed">
      {chartType} - Coming soon...
    </Text>
  );
}

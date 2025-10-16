import { Text, Alert } from '@mantine/core';
import { ChartType } from '../../../utils/chartDataAnalyzer';
import { NumberTile } from './charts/NumberTile';
import { MantineLineChart } from './charts/MantineLineChart';
import { MantineBarChart } from './charts/MantineBarChart';
import { extractSingleValue } from '../../../utils/chartDataAnalyzer';
import { SortOrder } from '../settings/OrderByControl';

interface ChartRendererProps {
  queryResult: any;
  selectedChartType: ChartType;
  numberFormat: 'currency' | 'percentage' | 'number' | 'abbreviated';
  numberPrecision: number;
  primaryColor: string;
  sortOrder?: SortOrder;
  // User-selected dimensions and measure
  primaryDimension?: string;
  secondaryDimension?: string;
  selectedMeasure?: string;
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
  sortOrder = 'desc',
  primaryDimension,
  secondaryDimension,
  selectedMeasure,
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
      return (
        <MantineLineChart
          queryResult={queryResult}
          primaryColor={primaryColor}
          sortOrder={sortOrder}
          primaryDimension={primaryDimension}
          selectedMeasure={selectedMeasure}
        />
      );

    case 'bar':
      return (
        <MantineBarChart
          queryResult={queryResult}
          primaryColor={primaryColor}
          orientation="vertical"
          type="default"
          sortOrder={sortOrder}
          primaryDimension={primaryDimension}
          secondaryDimension={secondaryDimension}
          selectedMeasure={selectedMeasure}
        />
      );

    case 'stackedBar':
      return (
        <MantineBarChart
          queryResult={queryResult}
          primaryColor={primaryColor}
          orientation="vertical"
          type="stacked"
          sortOrder={sortOrder}
          primaryDimension={primaryDimension}
          secondaryDimension={secondaryDimension}
          selectedMeasure={selectedMeasure}
        />
      );

    case 'horizontalBar':
      return (
        <MantineBarChart
          queryResult={queryResult}
          primaryColor={primaryColor}
          orientation="horizontal"
          type="default"
          sortOrder={sortOrder}
          primaryDimension={primaryDimension}
          secondaryDimension={secondaryDimension}
          selectedMeasure={selectedMeasure}
        />
      );

    case 'horizontalStackedBar':
      return (
        <MantineBarChart
          queryResult={queryResult}
          primaryColor={primaryColor}
          orientation="horizontal"
          type="stacked"
          sortOrder={sortOrder}
          primaryDimension={primaryDimension}
          secondaryDimension={secondaryDimension}
          selectedMeasure={selectedMeasure}
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

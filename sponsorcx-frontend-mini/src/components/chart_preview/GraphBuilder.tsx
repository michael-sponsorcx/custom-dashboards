import { Paper, Stack, Title, Text, Alert } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { ChartType } from '../../utils/chartDataAnalyzer';
import { ChartRenderer } from './ChartRenderer';
import { SortOrder } from '../settings/OrderByControl';

interface GraphBuilderProps {
  queryResult: any | null;
  selectedChartType: ChartType | null;
  chartTitle: string;

  // Number tile specific props
  numberFormat?: 'currency' | 'percentage' | 'number' | 'abbreviated';
  numberPrecision?: number;
  primaryColor?: string;

  // Sort order for charts with dimensions
  sortOrder?: SortOrder;

  // User-selected dimensions and measure
  primaryDimension?: string;
  secondaryDimension?: string;
  selectedMeasure?: string;
}

/**
 * GraphBuilder - Main component that renders the selected chart type
 * Acts as a container that delegates to specific chart components
 */
export function GraphBuilder({
  queryResult,
  selectedChartType,
  chartTitle,
  numberFormat = 'number',
  numberPrecision = 2,
  primaryColor = '#3b82f6',
  sortOrder = 'desc',
  primaryDimension,
  secondaryDimension,
  selectedMeasure,
}: GraphBuilderProps) {
  // No data state
  if (!queryResult) {
    return (
      <Paper shadow="sm" p="xl" radius="md" withBorder style={{ height: '100%', minHeight: '400px' }}>
        <Stack align="center" justify="center" style={{ height: '100%' }}>
          <Alert icon={<IconInfoCircle size={16} />} color="blue" variant="light">
            <Text size="sm">
              Execute a query to generate a chart. Select fields from the left panel and click "Execute Query".
            </Text>
          </Alert>
        </Stack>
      </Paper>
    );
  }

  // No chart type selected
  if (!selectedChartType) {
    return (
      <Paper shadow="sm" p="xl" radius="md" withBorder style={{ height: '100%', minHeight: '400px' }}>
        <Stack align="center" justify="center" style={{ height: '100%' }}>
          <Alert icon={<IconInfoCircle size={16} />} color="blue" variant="light">
            <Text size="sm">
              Select a chart type from the settings panel on the right to visualize your data.
            </Text>
          </Alert>
        </Stack>
      </Paper>
    );
  }

  // Render chart based on selected type
  return (
    <Paper shadow="sm" p="xl" radius="md" withBorder style={{ height: '100%', maxHeight: '650px', display: 'flex', flexDirection: 'column' }}>
      <Stack gap="md" style={{ height: '100%', overflow: 'hidden' }}>
        {/* Chart Title */}
        {chartTitle && (
          <Title order={3} ta="center">
            {chartTitle}
          </Title>
        )}

        {/* Chart Content */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0 }}>
          <ChartRenderer
            queryResult={queryResult}
            selectedChartType={selectedChartType}
            numberFormat={numberFormat}
            numberPrecision={numberPrecision}
            primaryColor={primaryColor}
            sortOrder={sortOrder}
            primaryDimension={primaryDimension}
            secondaryDimension={secondaryDimension}
            selectedMeasure={selectedMeasure}
          />
        </div>
      </Stack>
    </Paper>
  );
}

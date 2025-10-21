import { Paper, Stack, Title, Text, Alert } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { ChartType } from '../../../utils/chartDataAnalyzer';
import { ChartRenderer } from '../../visualizations/ChartRenderer';
import { SortOrder } from '../settings/OrderByControl';
import type { LegendPosition } from '../../../types/graph';

interface ChartPreviewProps {
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

  // Axis labels
  xAxisLabel?: string;
  yAxisLabel?: string;
  showGridLines?: boolean;
  legendPosition?: LegendPosition;
}

/**
 * ChartPreview - Main component that previews the selected chart type
 * Acts as a container that delegates to specific chart components
 */
export function ChartPreview({
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
  xAxisLabel,
  yAxisLabel,
  showGridLines = true,
  legendPosition = 'bottom',
}: ChartPreviewProps) {
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
    <Paper shadow="sm" p="xl" radius="md" withBorder style={{ height: '100%', minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
      <Stack gap="md" style={{ height: '100%', overflow: 'hidden' }}>
        {/* Chart Title */}
        {chartTitle && (
          <Title order={3} ta="center">
            {chartTitle}
          </Title>
        )}

        {/* Chart Content */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px', width: '100%' }}>
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
            xAxisLabel={xAxisLabel}
            yAxisLabel={yAxisLabel}
            showGridLines={showGridLines}
            legendPosition={legendPosition}
          />
        </div>
      </Stack>
    </Paper>
  );
}

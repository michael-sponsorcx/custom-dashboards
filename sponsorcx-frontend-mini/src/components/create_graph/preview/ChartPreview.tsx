import { Paper, Stack, Title, Text, Alert } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { ChartType, NumberFormat } from '../../../types/backend-graphql';
import { ChartRenderer } from '../../visualizations/ChartRenderer';
import { SortOrder } from '../settings/OrderByControl';
import { LegendPosition } from '../../../types/backend-graphql';
import { ColorPalette } from '../../../types/backend-graphql';

interface ChartPreviewProps {
  queryResult: any | null;
  selectedChartType: ChartType | null;
  chartTitle: string;

  // Number tile specific props
  numberFormat?: NumberFormat;
  numberPrecision?: number;
  primaryColor?: string;
  colorPalette?: ColorPalette;

  // Sort order for charts with dimensions
  sortOrder?: SortOrder;

  // User-selected dimensions and measure
  primaryDimension?: string;
  secondaryDimension?: string;
  selectedMeasure?: string;

  // Axis labels
  xAxisLabel?: string;
  yAxisLabel?: string;
  showXAxisGridLines?: boolean;
  showYAxisGridLines?: boolean;
  showRegressionLine?: boolean;
  maxDataPoints?: number;
  legendPosition?: LegendPosition;
  // KPI
  kpiValue?: number;
  kpiLabel?: string;
  kpiSecondaryValue?: number;
  kpiSecondaryLabel?: string;
  kpiShowTrend?: boolean;
  kpiTrendPercentage?: number;
}

/**
 * ChartPreview - Main component that previews the selected chart type
 * Acts as a container that delegates to specific chart components
 */
export function ChartPreview({
  queryResult,
  selectedChartType,
  chartTitle,
  numberFormat = NumberFormat.Number,
  numberPrecision = 2,
  primaryColor = '#3b82f6',
  colorPalette = ColorPalette.Sponsorcx,
  sortOrder = SortOrder.Desc,
  primaryDimension,
  secondaryDimension,
  selectedMeasure,
  xAxisLabel,
  yAxisLabel,
  showXAxisGridLines = true,
  showYAxisGridLines = true,
  showRegressionLine = false,
  maxDataPoints,
  legendPosition = LegendPosition.Bottom,
  kpiValue,
  kpiLabel,
  kpiSecondaryValue,
  kpiSecondaryLabel,
  kpiShowTrend,
  kpiTrendPercentage,
}: ChartPreviewProps) {
  // No data state
  if (!queryResult) {
    return (
      <Paper
        shadow="sm"
        p="xl"
        radius="md"
        withBorder
        style={{ height: '100%', minHeight: '400px' }}
      >
        <Stack align="center" justify="center" style={{ height: '100%' }}>
          <Alert icon={<IconInfoCircle size={16} />} color="blue" variant="light">
            <Text size="sm">
              Execute a query to generate a chart. Select fields from the left panel and click
              "Execute Query".
            </Text>
          </Alert>
        </Stack>
      </Paper>
    );
  }

  // No chart type selected
  if (!selectedChartType) {
    return (
      <Paper
        shadow="sm"
        p="xl"
        radius="md"
        withBorder
        style={{ height: '100%', minHeight: '400px' }}
      >
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
    <Paper
      shadow="sm"
      p="xl"
      radius="md"
      withBorder
      style={{
        height: '100%',
        maxHeight: '600px',
        minHeight: '600px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Stack gap="md" style={{ flex: 1, minHeight: 0 }}>
        {/* Chart Title */}
        {chartTitle && (
          <Title order={3} ta="center">
            {chartTitle}
          </Title>
        )}

        {/* Chart Content */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            width: '100%',
            overflow: 'hidden',
          }}
        >
          {(() => {
            return (
              <ChartRenderer
                queryResult={queryResult}
                selectedChartType={selectedChartType}
                numberFormat={numberFormat}
                numberPrecision={numberPrecision}
                primaryColor={primaryColor}
                colorPalette={colorPalette}
                sortOrder={sortOrder}
                primaryDimension={primaryDimension}
                secondaryDimension={secondaryDimension}
                selectedMeasure={selectedMeasure}
                xAxisLabel={xAxisLabel}
                yAxisLabel={yAxisLabel}
                showXAxisGridLines={showXAxisGridLines}
                showYAxisGridLines={showYAxisGridLines}
                showRegressionLine={showRegressionLine}
                maxDataPoints={maxDataPoints}
                legendPosition={legendPosition}
                kpiValue={kpiValue}
                kpiLabel={kpiLabel}
                kpiSecondaryValue={kpiSecondaryValue}
                kpiSecondaryLabel={kpiSecondaryLabel}
                kpiShowTrend={kpiShowTrend}
                kpiTrendPercentage={kpiTrendPercentage}
              />
            );
          })()}
        </div>
      </Stack>
    </Paper>
  );
}

import { Paper, Title, ActionIcon, Group, Loader, Text, Center, Tooltip } from '@mantine/core';
import { IconTrash, IconEdit, IconDownload, IconGripVertical, IconFilter } from '@tabler/icons-react';
import { useState, useEffect, useMemo } from 'react';
import { GraphTemplate } from '../../../types/graph';
import { ChartRenderer } from '../../visualizations/ChartRenderer';
import { executeCubeGraphQL } from '../../../services/cube';
import { useDownloadCSV } from '../../../hooks/useDownloadCSV';
import { DashboardItem } from '@/types/dashboard';
import { DragHandle } from './DragHandle';
import { buildQueryFromTemplate } from '../../../utils/graphql/builder/builders/buildQueryFromTemplate';

interface GraphCardProps {
  template: DashboardItem;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onFilter: (id: string) => void;
}

export function GraphCard({ template, onDelete, onEdit, onFilter }: GraphCardProps) {
  const [queryResult, setQueryResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create filename from template name, removing special characters
  const downloadFilename = template.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const downloadCSV = useDownloadCSV(queryResult, downloadFilename);

  // Build query dynamically from template
  const query = useMemo(() => buildQueryFromTemplate(template), [
    template.viewName,
    template.measures,
    template.dimensions,
    template.dates,
    template.filters,
    template.orderByField,
    template.orderByDirection,
  ]);

  useEffect(() => {
    // Fetch fresh data when component mounts or query changes
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await executeCubeGraphQL(query);
        setQueryResult(result);
      } catch (err) {
        setError('Failed to load graph data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  return (
    <Paper
      shadow="sm"
      p="md"
      radius="md"
      withBorder
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Header section - fixed height */}
      <Group justify="space-between" mb="md">
        <Group gap="xs">
          <DragHandle />
          <Title order={4}>{template.name || 'Untitled Graph'}</Title>
        </Group>
        <Group gap="xs">
          <Tooltip label="Filter graph">
            <ActionIcon
              color="violet"
              variant="subtle"
              onClick={() => onFilter(template.id)}
              aria-label="Filter graph"
            >
              <IconFilter size={18} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Download CSV">
            <ActionIcon
              color="green"
              variant="subtle"
              onClick={downloadCSV}
              aria-label="Download CSV"
              disabled={!queryResult || loading}
            >
              <IconDownload size={18} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Edit graph">
            <ActionIcon
              color="blue"
              variant="subtle"
              onClick={() => onEdit(template.id)}
              aria-label="Edit graph"
            >
              <IconEdit size={18} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete graph">
            <ActionIcon
              color="red"
              variant="subtle"
              onClick={() => onDelete(template.id)}
              aria-label="Delete graph"
            >
              <IconTrash size={18} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>

      {/* Chart container - flexible height, fills remaining space */}
      <div style={{
        flex: 1,
        minHeight: 0,
        width: '100%',
        position: 'relative'
      }}>
        {loading && (
          <Center style={{ height: '100%' }}>
            <Loader size="md" />
          </Center>
        )}

        {error && (
          <Center style={{ height: '100%' }}>
            <Text c="red">{error}</Text>
          </Center>
        )}

        {!loading && !error && queryResult && template.chartType && (
          <ChartRenderer
            queryResult={queryResult}
            selectedChartType={template.chartType}
            numberFormat={template.numberFormat || 'number'}
            numberPrecision={template.numberPrecision || 2}
            primaryColor={template.primaryColor || '#3b82f6'}
            colorPalette={template.colorPalette}
            sortOrder={template.sortOrder}
            primaryDimension={template.primaryDimension}
            secondaryDimension={template.secondaryDimension}
            selectedMeasure={template.selectedMeasure}
            xAxisLabel={template.xAxisLabel}
            yAxisLabel={template.yAxisLabel}
            showXAxisGridLines={template.showXAxisGridLines}
            showYAxisGridLines={template.showYAxisGridLines}
            showRegressionLine={template.showRegressionLine}
            maxDataPoints={template.maxDataPoints}
            legendPosition={template.legendPosition}
            kpiValue={template.kpiValue}
            kpiLabel={template.kpiLabel}
            kpiSecondaryValue={template.kpiSecondaryValue}
            kpiSecondaryLabel={template.kpiSecondaryLabel}
            kpiShowTrend={template.kpiShowTrend}
            kpiTrendPercentage={template.kpiTrendPercentage}
          />
        )}
      </div>
    </Paper>
  );
}

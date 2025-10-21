import { Paper, Title, ActionIcon, Group, Loader, Text, Center } from '@mantine/core';
import { IconTrash, IconEdit, IconDownload } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { GraphTemplate } from '../../types/graph';
import { ChartRenderer } from '../visualizations/ChartRenderer';
import { executeCubeGraphQL } from '../../services/cube';
import { useDownloadCSV } from '../../hooks/useDownloadCSV';

interface GraphCardProps {
  template: GraphTemplate;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export function GraphCard({ template, onDelete, onEdit }: GraphCardProps) {
  const [queryResult, setQueryResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create filename from template name, removing special characters
  const downloadFilename = template.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const downloadCSV = useDownloadCSV(queryResult, downloadFilename);

  useEffect(() => {
    // Fetch fresh data when component mounts
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await executeCubeGraphQL(template.query);
        setQueryResult(result);
      } catch (err) {
        console.error('Error fetching graph data:', err);
        setError('Failed to load graph data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [template.query]);

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
        <Title order={4}>{template.name || 'Untitled Graph'}</Title>
        <Group gap="xs">
          <ActionIcon
            color="green"
            variant="subtle"
            onClick={downloadCSV}
            aria-label="Download CSV"
            disabled={!queryResult || loading}
          >
            <IconDownload size={18} />
          </ActionIcon>
          <ActionIcon
            color="blue"
            variant="subtle"
            onClick={() => onEdit(template.id)}
            aria-label="Edit graph"
          >
            <IconEdit size={18} />
          </ActionIcon>
          <ActionIcon
            color="red"
            variant="subtle"
            onClick={() => onDelete(template.id)}
            aria-label="Delete graph"
          >
            <IconTrash size={18} />
          </ActionIcon>
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
            sortOrder={template.sortOrder}
            primaryDimension={template.primaryDimension}
            secondaryDimension={template.secondaryDimension}
            selectedMeasure={template.selectedMeasure}
          />
        )}
      </div>
    </Paper>
  );
}

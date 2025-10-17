import { Container, Button, Title, SimpleGrid, Stack, Text, Group } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getAllGraphTemplates, getDashboard, deleteGraphTemplate, removeGraphFromDashboard, getGraphTemplate } from '../../utils/graphTemplateStorage';
import { GraphTemplate } from '../../types/graphTemplate';
import { GraphCard } from './GraphCard';

export function Dashboard() {
  const navigate = useNavigate();
  const [graphs, setGraphs] = useState<GraphTemplate[]>([]);

  // Load graphs on mount
  useEffect(() => {
    loadGraphs();
  }, []);

  const loadGraphs = () => {
    const dashboard = getDashboard();
    const allGraphs = getAllGraphTemplates();

    // Filter and order graphs based on dashboard configuration
    const orderedGraphs = dashboard.graphIds
      .map(id => allGraphs.find(g => g.id === id))
      .filter((g): g is GraphTemplate => g !== undefined);

    setGraphs(orderedGraphs);
  };

  const handleDeleteGraph = (id: string) => {
    if (window.confirm('Are you sure you want to delete this graph? This action cannot be undone.')) {
      deleteGraphTemplate(id);
      removeGraphFromDashboard(id);
      loadGraphs();
    }
  };

  const handleEditGraph = (id: string) => {
    const template = getGraphTemplate(id);
    if (template) {
      navigate('/configure-graph', { state: { template } });
    }
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Group justify="space-between" align="center">
          <Title order={1}>Dashboard</Title>
          <Button onClick={() => navigate('/configure-graph')} color="red" size="lg">
            Add Graph
          </Button>
        </Group>

        {graphs.length === 0 ? (
          <Stack align="center" gap="md" py="xl">
            <Text size="lg" c="dimmed">
              No graphs yet. Create your first graph to get started!
            </Text>
            <Button onClick={() => navigate('/configure-graph')} size="lg">
              Create Graph
            </Button>
          </Stack>
        ) : (
          <SimpleGrid
            cols={{ base: 1, sm: 1, md: 2, lg: 2, xl: 3 }}
            spacing="lg"
          >
            {graphs.map(graph => (
              <GraphCard
                key={graph.id}
                template={graph}
                onDelete={handleDeleteGraph}
                onEdit={handleEditGraph}
              />
            ))}
          </SimpleGrid>
        )}
      </Stack>
    </Container>
  );
}

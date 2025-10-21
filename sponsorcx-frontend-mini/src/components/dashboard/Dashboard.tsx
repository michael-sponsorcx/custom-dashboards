import { Container, Button, Title, Stack, Text, Group } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  deleteGraphTemplate,
  getGraphTemplate,
  getAllDashboardItems,
  removeGraphFromDashboard,
  saveGridLayout,
  deleteGridLayout,
} from '../../utils/storage';
import { DashboardItem } from '../../types/dashboard';
import { DashboardGrid } from './DashboardGrid';

export function Dashboard() {
  const navigate = useNavigate();
  const [graphs, setGraphs] = useState<DashboardItem[]>([]);

  // Load graphs on mount
  useEffect(() => {
    loadGraphs();
  }, []);

  const loadGraphs = () => {
    const items = getAllDashboardItems();
    setGraphs(items);
  };

  const handleDeleteGraph = (id: string) => {
    if (window.confirm('Are you sure you want to delete this graph? This action cannot be undone.')) {
      deleteGraphTemplate(id);
      deleteGridLayout(id);
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

  const handleResizeGraph = (id: string, width: number, height: number) => {
    saveGridLayout(id, { gridWidth: width, gridHeight: height });
    loadGraphs();
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
          <DashboardGrid
            graphs={graphs}
            onDelete={handleDeleteGraph}
            onEdit={handleEditGraph}
            onResize={handleResizeGraph}
          />
        )}
      </Stack>
    </Container>
  );
}

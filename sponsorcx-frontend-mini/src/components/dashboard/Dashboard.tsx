import { Container, Button, Title, Stack, Text, Group } from '@mantine/core';
import { DashboardGrid } from './grid/DashboardGrid';
import { useDashboardState, useDashboardActions } from './hooks';

/**
 * Dashboard Component - Refactored
 *
 * Main dashboard view for managing and displaying graphs.
 * Uses modular custom hooks for clean separation of concerns.
 */
export function Dashboard() {
  // Use custom hooks to manage state and actions
  const { graphs, loading, refreshDashboard } = useDashboardState();
  const { handleDeleteGraph, handleEditGraph, handleResizeGraph, handleCreateGraph } =
    useDashboardActions({
      onRefresh: refreshDashboard,
    });

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Text>Loading...</Text>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <Group justify="space-between" align="center">
          <Title order={1}>Dashboard</Title>
          <Button onClick={handleCreateGraph} color="red" size="lg">
            Add Graph
          </Button>
        </Group>

        {/* Empty State or Grid */}
        {graphs.length === 0 ? (
          <Stack align="center" gap="md" py="xl">
            <Text size="lg" c="dimmed">
              No graphs yet. Create your first graph to get started!
            </Text>
            <Button onClick={handleCreateGraph} size="lg">
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

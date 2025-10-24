import { Container, Button, Title, Stack, Text, Group } from '@mantine/core';
import { useState } from 'react';
import { useDashboardState, useDashboardActions } from './hooks';
import { DashboardGrid } from './grid';
import { GraphFilterModal } from './GraphFilterModal';
import { DashboardFilters } from './DashboardFilters';
import { DashboardFilterModal } from './DashboardFilterModal';

/**
 * Dashboard Component - Refactored
 *
 * Main dashboard view for managing and displaying graphs.
 * Uses modular custom hooks for clean separation of concerns.
 */
export function Dashboard() {
  // Use custom hooks to manage state and actions
  const { graphs, loading, refreshDashboard, updateGraphPosition, updateGraphSize } = useDashboardState();
  const { handleDeleteGraph, handleEditGraph, handleResizeGraph, handleMoveGraph, handleBatchMoveGraph, handleCreateGraph } =
    useDashboardActions({
      onRefresh: refreshDashboard,
      onUpdatePosition: updateGraphPosition,
      onUpdateSize: updateGraphSize,
    });

  // Graph filter modal state
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [selectedGraphId, setSelectedGraphId] = useState<string | null>(null);

  // Dashboard filter modal state
  const [dashboardFilterModalOpen, setDashboardFilterModalOpen] = useState(false);

  // Find the selected graph for the modal
  const selectedGraph = graphs.find(g => g.id === selectedGraphId);

  const handleFilterGraph = (id: string) => {
    setSelectedGraphId(id);
    setFilterModalOpen(true);
  };

  const handleCloseFilterModal = () => {
    setFilterModalOpen(false);
    setSelectedGraphId(null);
  };

  const handleOpenDashboardFilters = () => {
    setDashboardFilterModalOpen(true);
  };

  const handleCloseDashboardFilters = () => {
    setDashboardFilterModalOpen(false);
  };

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
          <Group gap="md">
            <DashboardFilters onOpenFilters={handleOpenDashboardFilters} />
            <Button onClick={handleCreateGraph} color="red" size="lg">
              Add Graph
            </Button>
          </Group>
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
            onFilter={handleFilterGraph}
            onResize={handleResizeGraph}
            onMove={handleMoveGraph}
            onBatchMove={handleBatchMoveGraph}
          />
        )}
      </Stack>

      {/* Graph Filter Modal */}
      <GraphFilterModal
        opened={filterModalOpen}
        onClose={handleCloseFilterModal}
        graphId={selectedGraphId}
        graphName={selectedGraph?.name || 'Untitled Graph'}
      />

      {/* Dashboard Filter Modal */}
      <DashboardFilterModal
        opened={dashboardFilterModalOpen}
        onClose={handleCloseDashboardFilters}
      />
    </Container>
  );
}

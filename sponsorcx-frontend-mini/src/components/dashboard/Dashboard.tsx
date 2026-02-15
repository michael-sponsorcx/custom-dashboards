import { Container, Button, Title, Stack, Text, Group, Loader, Center } from '@mantine/core';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { useDashboardState, useDashboardActions, useMaintenanceMode } from './hooks';
import { MaintenanceMode } from './MaintenanceMode';
import { DashboardGrid } from './grid';
// import { GraphFilterModal } from './GraphFilterModal';
import { KPIAlertModal } from './KPIAlertModal';
import { ScheduleModal } from './schedule/ScheduleModal';
import { DashboardFilters } from './DashboardFilters';
import { DashboardFilterModal } from './DashboardFilterModal';
import { DashboardAvailableFilters } from './DashboardAvailableFilters';
import { DashboardAvailableFiltersModal } from './DashboardAvailableFiltersModal';
import { Present } from './present';
import { DownloadPDF } from './download_pdf';
import { DashboardActionsMenu } from './DashboardActionsMenu';
import { useOrganizationStore, useDashboardFilterStore } from '../../store';

/**
 * Dashboard Component - Refactored
 *
 * Main dashboard view for managing and displaying gridItems.
 * Uses modular custom hooks for clean separation of concerns.
 */
export function Dashboard() {
  const navigate = useNavigate();

  // Load dashboard filters when dashboardId changes
  const { dashboardId, organizationId, userId } = useOrganizationStore();
  const { loadFilters } = useDashboardFilterStore();

  useEffect(() => {
    if (dashboardId) {
      loadFilters(dashboardId);
    }
  }, [dashboardId, loadFilters]);

  // Check maintenance mode feature flag
  const { enabled: maintenanceEnabled, loading: maintenanceLoading } = useMaintenanceMode();

  // Use custom hooks to manage state and actions
  const { gridItems, loading, refreshDashboard, updateGraphPosition, updateGraphSize } =
    useDashboardState();
  const {
    handleDeleteGraph,
    handleEditGraph,
    handleResizeGraph,
    handleMoveGraph,
    handleBatchMoveGraph,
    handleCreateGraph,
  } = useDashboardActions({
    onRefresh: refreshDashboard,
    onUpdatePosition: updateGraphPosition,
    onUpdateSize: updateGraphSize,
  });

  // Graph filter modal state (for configuring permanent graph-level filters)
  // const [filterModalOpen, setFilterModalOpen] = useState(false);
  // const [selectedGraphId, setSelectedGraphId] = useState<string | null>(null);

  // KPI alert modal state
  const [kpiAlertModalOpen, setKpiAlertModalOpen] = useState(false);
  const [selectedKPIAlertGraphId, setSelectedKPIAlertGraphId] = useState<string | null>(null);

  // Schedule modal state
  const [createScheduleModalOpen, setCreateScheduleModalOpen] = useState(false);

  // Dashboard filter modal state
  const [dashboardFilterModalOpen, setDashboardFilterModalOpen] = useState(false);

  // Filter value modal state
  const [filterValueModalOpen, setFilterValueModalOpen] = useState(false);
  const [selectedFilterField, setSelectedFilterField] = useState<string | null>(null);

  // Presentation mode state
  const [presentationMode, setPresentationMode] = useState(false);

  // PDF generation state
  const [pdfGenerationMode, setPdfGenerationMode] = useState(false);

  // Refresh state - used to force all gridItems to re-fetch data
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handler to open graph-level filter modal for a specific graph
  const handleOpenGraphFilterModal = (id: string) => {
    // TODO: Implement graph filter modal
    console.log('Open graph filter modal for graph:', id);
    // setSelectedGraphId(id);
    // setFilterModalOpen(true);
  };

  // const handleCloseGraphFilterModal = () => {
  //   setFilterModalOpen(false);
  //   setSelectedGraphId(null);
  // };

  // Handler to open KPI alert modal for a specific graph
  const handleOpenKPIAlertModal = (id: string) => {
    setSelectedKPIAlertGraphId(id);
    setKpiAlertModalOpen(true);
  };

  const handleCloseKPIAlertModal = () => {
    setKpiAlertModalOpen(false);
    setSelectedKPIAlertGraphId(null);
  };

  const handleOpenDashboardFilters = () => {
    setDashboardFilterModalOpen(true);
  };

  const handleCloseDashboardFilters = () => {
    setDashboardFilterModalOpen(false);
  };

  const handleFilterFieldClick = (fieldName: string) => {
    setSelectedFilterField(fieldName);
    setFilterValueModalOpen(true);
  };

  const handleCloseFilterValue = () => {
    setFilterValueModalOpen(false);
    setSelectedFilterField(null);
  };

  const handleStartPresentation = () => {
    setPresentationMode(true);
  };

  const handleClosePresentation = () => {
    setPresentationMode(false);
  };

  const handleDownloadPDF = () => {
    setPdfGenerationMode(true);
  };

  const handleClosePDFGeneration = () => {
    setPdfGenerationMode(false);
  };

  const handleCreateSchedule = () => {
    setCreateScheduleModalOpen(true);
  };

  const handleCloseCreateSchedule = () => {
    setCreateScheduleModalOpen(false);
  };

  const handleManageSchedules = () => {
    navigate('/schedules');
  };

  const handleRefreshAll = () => {
    setIsRefreshing(true);
    // Increment refresh key to force all GraphCards to re-fetch
    setRefreshKey((prev) => prev + 1);

    notifications.show({
      title: 'Refreshing Dashboard',
      message: 'All graphs are being refreshed...',
      color: 'blue',
      autoClose: 2000,
    });

    // Reset refreshing state after a short delay
    setTimeout(() => {
      setIsRefreshing(false);
      notifications.show({
        title: 'Refresh Complete',
        message: 'All graphs have been updated',
        color: 'green',
        autoClose: 3000,
      });
    }, 1500);
  };

  // If in presentation mode, render the Present component
  if (presentationMode) {
    return <Present gridItems={gridItems} dashboardName="Dashboard" onClose={handleClosePresentation} />;
  }

  // Show loader while dashboard data or maintenance status is being fetched
  if (loading || maintenanceLoading) {
    return (
      <Container size="xl" py="xl">
        <Center h="50vh">
          <Loader size="xl" />
        </Center>
      </Container>
    );
  }

  // Show maintenance page when feature flag is enabled
  if (maintenanceEnabled) {
    return <MaintenanceMode />;
  }

  // Error state: only show after loading completes and required IDs are still missing
  if (!organizationId || !dashboardId || !userId) {
    console.error('Dashboard: Required IDs are not set in the store. This should be set after login.', {
      organizationId,
      dashboardId,
      userId,
    });
    return (
      <Container size="xl" py="xl">
        <Stack align="center" gap="md">
          <Title order={2} c="red">Something went wrong</Title>
          <Text c="dimmed">Unable to load dashboard. Please try refreshing the page or logging in again.</Text>
        </Stack>
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
            <DashboardActionsMenu
              onPresent={handleStartPresentation}
              onDownloadPDF={handleDownloadPDF}
              onCreateSchedule={handleCreateSchedule}
              onManageSchedules={handleManageSchedules}
              onRefresh={handleRefreshAll}
              disabled={gridItems.length === 0}
              refreshing={isRefreshing}
            />
            <Button onClick={handleCreateGraph} color="red" size="lg">
              Add Graph
            </Button>
          </Group>
        </Group>

        {/* Available Filter Fields */}
        <DashboardAvailableFilters onFilterClick={handleFilterFieldClick} />

        {/* Empty State or Grid */}
        {gridItems.length === 0 ? (
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
            gridItems={gridItems}
            onDelete={handleDeleteGraph}
            onEdit={handleEditGraph}
            onOpenGraphFilterModal={handleOpenGraphFilterModal}
            onOpenKPIAlertModal={handleOpenKPIAlertModal}
            onResize={handleResizeGraph}
            onMove={handleMoveGraph}
            onBatchMove={handleBatchMoveGraph}
            refreshKey={refreshKey}
          />
        )}
      </Stack>

      {/* Graph Filter Modal - Configures permanent graph-level filters (Graph.filters) */}
      {/* <GraphFilterModal
        opened={filterModalOpen}
        onClose={handleCloseGraphFilterModal}
        graphId={selectedGraphId}
        graphName={selectedGraph?.name || 'Untitled Graph'}
      /> */}

      {/* KPI Alert Modal */}
      <KPIAlertModal
        opened={kpiAlertModalOpen}
        onClose={handleCloseKPIAlertModal}
        graphId={selectedKPIAlertGraphId}
        organizationId={organizationId}
        dashboardId={dashboardId}
        userId={userId}
      />

      {/* Create Schedule Modal */}
      <ScheduleModal
        opened={createScheduleModalOpen}
        onClose={handleCloseCreateSchedule}
        organizationId={organizationId}
        dashboardId={dashboardId}
        userId={userId}
      />

      {/* Dashboard Filter Modal */}
      <DashboardFilterModal
        opened={dashboardFilterModalOpen}
        onClose={handleCloseDashboardFilters}
      />

      {/* Dashboard Available Filters Modal */}
      <DashboardAvailableFiltersModal
        opened={filterValueModalOpen}
        onClose={handleCloseFilterValue}
        fieldName={selectedFilterField}
      />

      {/* PDF Generation (non-blocking, renders off-screen) */}
      {pdfGenerationMode && (
        <DownloadPDF
          gridItems={gridItems}
          dashboardName="Dashboard"
          onComplete={handleClosePDFGeneration}
        />
      )}
    </Container>
  );
}

import { Container, Button, Stack, Text, Loader, Center } from '@mantine/core';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { IconPresentation, IconFileTypePdf, IconRefresh, IconCalendar } from '@tabler/icons-react';
import colors from '@/stadiumDS/foundations/colors';
import PageHeader from '@/stadiumDS/applicationComponents/PageHeader/PageHeader';
import type { ThreeDotMenuOption } from '@/stadiumDS/applicationComponents/PageHeader/components/ThreeDotMenu';
import type { SavedView } from '@/gql/savedViewsGql';
import {
  useDashboardState,
  useDashboardActions,
  useMaintenanceMode,
  usePageHeaderFilters,
} from './hooks';
import { MaintenanceMode } from './MaintenanceMode';
import { DashboardGrid } from './grid';
import { KPIAlertModal } from './KPIAlertModal';
import { ScheduleModal } from './schedule/ScheduleModal';
import { DashboardAvailableFiltersModal } from './DashboardAvailableFiltersModal';
import { Present } from './present';
import { DownloadPDF } from './download_pdf';
import { useOrganizationStore, useDashboardFilterStore } from '../../store';

const DEFAULT_VIEW: SavedView = { id: 'all', name: 'All', pinned_view: true, default_view_tag: 'all' };

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

/**
 * Dashboard Component
 *
 * Main dashboard view for managing and displaying gridItems.
 * Uses Stadium PageHeader for consistent header layout with filters and actions.
 */
export const Dashboard = () => {
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

  // PageHeader filter bridge
  const {
    defaultFilters,
    appliedFilterValues,
    updateFilters,
    handleResetFilters,
    filtersAreApplied,
  } = usePageHeaderFilters();

  // KPI alert modal state
  const [kpiAlertModalOpen, setKpiAlertModalOpen] = useState(false);
  const [selectedKPIAlertGraphId, setSelectedKPIAlertGraphId] = useState<string | null>(null);

  // Schedule modal state
  const [createScheduleModalOpen, setCreateScheduleModalOpen] = useState(false);

  // Filter value modal state (for measure/date fields not handled by PageHeader)
  const [filterValueModalOpen, setFilterValueModalOpen] = useState(false);
  const [selectedFilterField, setSelectedFilterField] = useState<string | null>(null);

  // Presentation mode state
  const [presentationMode, setPresentationMode] = useState(false);

  // PDF generation state
  const [pdfGenerationMode, setPdfGenerationMode] = useState(false);

  // Saved views state (frontend-only, no persistence)
  const [savedViews] = useState<SavedView[]>([DEFAULT_VIEW]);
  const [activeViewId, setActiveViewId] = useState(DEFAULT_VIEW.id);
  const activeView = useMemo(
    () => savedViews.find((v) => v.id === activeViewId),
    [savedViews, activeViewId]
  );
  const handleViewSelect = useCallback((view: SavedView) => {
    setActiveViewId(view.id);
  }, []);

  // Refresh state
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handler to open graph-level filter modal for a specific graph
  const handleOpenGraphFilterModal = (id: string) => {
    // TODO: Implement graph filter modal
    console.log('Open graph filter modal for graph:', id);
  };

  const handleOpenKPIAlertModal = (id: string) => {
    setSelectedKPIAlertGraphId(id);
    setKpiAlertModalOpen(true);
  };

  const handleCloseKPIAlertModal = () => {
    setKpiAlertModalOpen(false);
    setSelectedKPIAlertGraphId(null);
  };

  const handleCloseFilterValue = () => {
    setFilterValueModalOpen(false);
    setSelectedFilterField(null);
  };

  const handleClosePresentation = () => {
    setPresentationMode(false);
  };

  const handleClosePDFGeneration = () => {
    setPdfGenerationMode(false);
  };

  const handleCloseCreateSchedule = () => {
    setCreateScheduleModalOpen(false);
  };

  const handleRefreshAll = useCallback(() => {
    setIsRefreshing(true);
    setRefreshKey((prev) => prev + 1);

    notifications.show({
      title: 'Refreshing Dashboard',
      message: 'All graphs are being refreshed...',
      color: 'blue',
      autoClose: 2000,
    });

    setTimeout(() => {
      setIsRefreshing(false);
      notifications.show({
        title: 'Refresh Complete',
        message: 'All graphs have been updated',
        color: 'green',
        autoClose: 3000,
      });
    }, 1500);
  }, []);

  // ThreeDotMenu options — maps all DashboardActionsMenu items
  const threeDotMenuOptions: ThreeDotMenuOption[] = useMemo(() => {
    const noGraphs = gridItems.length === 0;
    return [
      {
        key: 'present',
        label: 'Present',
        icon: <IconPresentation size={16} />,
        onClick: () => setPresentationMode(true),
        disabled: noGraphs,
      },
      {
        key: 'download-pdf',
        label: 'Download PDF',
        icon: <IconFileTypePdf size={16} />,
        onClick: () => setPdfGenerationMode(true),
        disabled: noGraphs,
      },
      {
        key: 'schedule',
        label: 'Schedule',
        icon: <IconCalendar size={16} />,
        children: [
          {
            key: 'create-schedule',
            label: 'Create Schedule',
            onClick: () => setCreateScheduleModalOpen(true),
          },
          {
            key: 'manage-schedules',
            label: 'Manage Schedules',
            onClick: () => navigate('/schedules'),
          },
        ],
      },
      {
        key: 'refresh',
        label: isRefreshing ? 'Refreshing...' : 'Refresh All',
        icon: <IconRefresh size={16} />,
        onClick: handleRefreshAll,
        disabled: noGraphs || isRefreshing,
      },
    ];
  }, [gridItems.length, isRefreshing, navigate, handleRefreshAll]);

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

  // Error state
  if (!organizationId || !dashboardId || !userId) {
    console.error('Dashboard: Required IDs are not set in the store.', {
      organizationId,
      dashboardId,
      userId,
    });
    return (
      <Container size="xl" py="xl">
        <Stack align="center" gap="md">
          <Text size="xl" fw={700} c={colors.Error[500]}>Something went wrong</Text>
          <Text c={colors.Gray[500]}>Unable to load dashboard. Please try refreshing the page or logging in again.</Text>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Stadium PageHeader — built-in Filter button + slideout for filter values */}
        <PageHeader
          tableName="dashboard"
          primaryBtnText="Add Graph"
          handlePrimaryBtnClick={handleCreateGraph}
          searchable
          hideFilters={false}
          appliedFilterValues={appliedFilterValues}
          handleResetFilters={handleResetFilters}
          updateFilters={updateFilters}
          filtersAreApplied={filtersAreApplied}
          defaultFilters={defaultFilters}
          threeDotMenuOptions={threeDotMenuOptions}
          onViewSelect={handleViewSelect}
          activeView={activeView}
          savedViews={savedViews}
          refetchSavedViews={noop}
          savedViewsLoading={false}
          setActiveViewId={setActiveViewId}
        />

        {/* Empty State or Grid */}
        {gridItems.length === 0 ? (
          <Stack align="center" gap="md" py="xl">
            <Text size="lg" c={colors.Gray[500]}>
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

      {/* Filter Value Modal (for measure/date fields) */}
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
};

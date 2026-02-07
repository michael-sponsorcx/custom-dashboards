import { Paper, Group, Loader, Text, Center } from '@mantine/core';
import { ChartRenderer } from '../../../visualizations/ChartRenderer';
import { useDownloadCSV } from '../../../../hooks/useDownloadCSV';
import type { GridItem } from '../../../../types/dashboard';
import { useDashboardFilterStore } from '../../../../store';
import { useGraphData } from './hooks/useGraphData';
import { useGraphDrillDown } from './hooks/useGraphDrillDown';
import { useGraphQuery } from './hooks/useGraphQuery';
import { GraphCardHeader } from './components/GraphCardHeader';
import { GraphCardActions } from './components/GraphCardActions';

/**
 * Props for GraphCard component
 */
interface GraphCardProps {
  /** Graph configuration template */
  template: GridItem;
  /** Handler for delete action */
  onDelete: (id: string) => void;
  /** Handler for edit action */
  onEdit: (id: string) => void;
  /** Handler to open the graph-level filter modal (configures permanent filters for this specific graph) */
  onOpenGraphFilterModal: (id: string) => void;
  /** Handler to open the KPI alert modal */
  onOpenKPIAlertModal: (id: string) => void;
  /** Optional refresh trigger key */
  refreshKey?: number;
}

/**
 * Individual graph card component for dashboard grid
 *
 * **Purpose:** Display single graph with controls, drill-down, and filtering
 * **Pattern:** Paper container → Header + Actions + Chart content
 *
 * **Key Features:**
 * - Auto-fetches data on mount and when filters change
 * - Supports drill-down with dimension swapping
 * - Combines graph-level, dashboard-level, and drill-down filters
 * - CSV export functionality
 * - Individual refresh capability
 *
 * **Filter Architecture:**
 * - Graph-level filters (GraphTemplate.filters): Permanent filters configured via modal
 * - Dashboard-level filters (DashboardFilterContext): Temporary filters applied to ALL graphs
 * - Drill-down filters: Ephemeral filters from clicking chart elements
 *
 * @input template: GridItem, handlers, refreshKey
 * @output Rendered graph card with all controls
 *
 * @example
 * <GraphCard
 *   template={graphTemplate}
 *   onDelete={handleDelete}
 *   onEdit={handleEdit}
 *   onOpenGraphFilterModal={handleOpenFilterModal}
 *   refreshKey={refreshCounter}
 * />
 */
export function GraphCard({ template, onDelete, onEdit, onOpenGraphFilterModal, onOpenKPIAlertModal, refreshKey }: GraphCardProps) {
  const { activeFilters: dashboardFilters } = useDashboardFilterStore();

  // Drill-down state management
  const {
    drillDownState,
    effectivePrimaryDimension,
    isResetting,
    handleDrillDown,
    resetDrillDown,
  } = useGraphDrillDown(template);

  // Build query with combined filters
  const query = useGraphQuery(
    template,
    dashboardFilters,
    drillDownState?.drillDownFilters || [],
    effectivePrimaryDimension
  );

  // Data fetching with auto-refresh support
  const { queryResult, loading, error, isRefreshing, refresh } = useGraphData(
    query,
    refreshKey,
    template.name
  );

  // CSV download handler
  const downloadFilename = template.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const downloadCSV = useDownloadCSV(queryResult, downloadFilename);

  // Wrapper handlers for actions
  const handleRefresh = () => refresh(true); // Show notification on manual refresh
  const handleOpenFilterModal = () => onOpenGraphFilterModal(template.id);
  const handleOpenKPIAlertModalWrapper = () => onOpenKPIAlertModal(template.id);
  const handleEdit = () => onEdit(template.id);
  const handleDelete = () => onDelete(template.id);

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
        overflow: 'hidden',
      }}
    >
      {/* Header section - fixed height */}
      <Group justify="space-between" mb="md">
        <GraphCardHeader title={template.name} drillDownState={drillDownState} />

        <GraphCardActions
          drillDownState={drillDownState}
          isResetting={isResetting}
          isRefreshing={isRefreshing}
          loading={loading}
          hasData={!!queryResult}
          chartType={template.chartType}
          onReset={resetDrillDown}
          onRefresh={handleRefresh}
          onOpenFilterModal={handleOpenFilterModal}
          onOpenKPIAlertModal={handleOpenKPIAlertModalWrapper}
          onDownload={downloadCSV}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Group>

      {/* Chart container - flexible height, fills remaining space */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          width: '100%',
          position: 'relative',
        }}
      >
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
            primaryDimension={effectivePrimaryDimension}
            secondaryDimension={template.secondaryDimension}
            selectedMeasure={template.selectedMeasure}
            availableDimensions={template.dimensions}
            onDrillDown={handleDrillDown}
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

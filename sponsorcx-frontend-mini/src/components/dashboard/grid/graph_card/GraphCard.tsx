import { Paper, Group, Loader, Text, Center } from '@mantine/core';
import { ChartRenderer } from '../../../visualizations/ChartRenderer';
import { useDownloadCSV } from '../../../../hooks/useDownloadCSV';
import type { DashboardItem } from '../../../../types/dashboard';
import { useDashboardFilterContext } from '../../context';
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
  template: DashboardItem;
  /** Handler for delete action */
  onDelete: (id: string) => void;
  /** Handler for edit action */
  onEdit: (id: string) => void;
  /** Handler for filter action */
  onFilter: (id: string) => void;
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
 * - Combines graph, dashboard, and drill-down filters
 * - CSV export functionality
 * - Individual refresh capability
 *
 * @input template: DashboardItem, handlers, refreshKey
 * @output Rendered graph card with all controls
 *
 * @example
 * <GraphCard
 *   template={graphTemplate}
 *   onDelete={handleDelete}
 *   onEdit={handleEdit}
 *   onFilter={handleFilter}
 *   refreshKey={refreshCounter}
 * />
 */
export function GraphCard({ template, onDelete, onEdit, onFilter, refreshKey }: GraphCardProps) {
  // Get dashboard-level filters from context
  const { activeFilters: dashboardFilters } = useDashboardFilterContext();

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
  const handleFilter = () => onFilter(template.id);
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
          onReset={resetDrillDown}
          onRefresh={handleRefresh}
          onFilter={handleFilter}
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

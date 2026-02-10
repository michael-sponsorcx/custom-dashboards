import { Group, ActionIcon, Tooltip, Text } from '@mantine/core';
import {
  IconTrash,
  IconEdit,
  IconDownload,
  // IconFilter, // TODO: Uncomment when filter feature is implemented
  IconRefresh,
  IconZoomReset,
  IconBell,
} from '@tabler/icons-react';
import type { DrillDownState } from '../hooks/useGraphDrillDown';
import type { ChartType } from '../../../../../utils/chartDataAnalyzer';

/**
 * Props for GraphCardActions component
 */
interface GraphCardActionsProps {
  /** Drill-down state for showing reset button */
  drillDownState: DrillDownState | null;
  /** Whether reset animation is in progress */
  isResetting: boolean;
  /** Whether refresh is in progress */
  isRefreshing: boolean;
  /** Whether data is currently loading */
  loading: boolean;
  /** Whether query result exists for CSV download */
  hasData: boolean;
  /** Chart type - used to conditionally show KPI alert button */
  chartType: ChartType;
  /** Handler for reset drill-down */
  onReset: () => void;
  /** Handler for refresh */
  onRefresh: () => void;
  /** Handler to open graph-level filter modal (configures permanent filters for this specific graph) */
  onOpenFilterModal: () => void;
  /** Handler to open KPI alert modal */
  onOpenKPIAlertModal: () => void;
  /** Handler for CSV download */
  onDownload: () => void;
  /** Handler for edit */
  onEdit: () => void;
  /** Handler for delete */
  onDelete: () => void;
}

/**
 * Action button toolbar for GraphCard
 *
 * **Purpose:** All action buttons (reset, refresh, filter, download, edit, delete)
 * **Pattern:** Group of icon buttons with tooltips and conditional visibility
 *
 * **Filter Button:** Opens a modal to configure graph-level permanent filters (GraphTemplate.filters).
 * This is separate from dashboard-level filters which apply to ALL graphs.
 *
 * @input drillDownState, various handlers
 * @output Toolbar with 6 action buttons
 *
 * @example
 * <GraphCardActions
 *   drillDownState={drillDownState}
 *   isResetting={false}
 *   isRefreshing={false}
 *   loading={false}
 *   hasData={true}
 *   onReset={resetDrillDown}
 *   onRefresh={handleRefresh}
 *   onOpenFilterModal={handleOpenFilterModal}
 *   onDownload={downloadCSV}
 *   onEdit={() => onEdit(id)}
 *   onDelete={() => onDelete(id)}
 * />
 */
export function GraphCardActions({
  drillDownState,
  isResetting,
  isRefreshing,
  loading,
  hasData,
  chartType,
  onReset,
  onRefresh,
  onOpenFilterModal: _onOpenFilterModal, // TODO: Use when filter feature is implemented
  onOpenKPIAlertModal,
  onDownload,
  onEdit,
  onDelete,
}: GraphCardActionsProps) {
  return (
    <Group gap="xs">
      {/* Debug state indicator */}
      <Text size="xs" c="dimmed">
        {drillDownState
          ? `Drilled: ${drillDownState.newPrimaryDimension} (${drillDownState.drillDownFilters.length} filters)`
          : 'Normal'}
      </Text>

      {/* Reset drill-down button (only shown when drilled down) */}
      {drillDownState && (
        <Tooltip label="Reset drill down">
          <ActionIcon
            color="orange"
            variant="subtle"
            onClick={onReset}
            aria-label="Reset drill down"
            loading={isResetting}
          >
            <IconZoomReset size={18} />
          </ActionIcon>
        </Tooltip>
      )}

      {/* Refresh button */}
      <Tooltip label="Refresh graph data">
        <ActionIcon
          color="blue"
          variant="subtle"
          onClick={onRefresh}
          aria-label="Refresh graph data"
          loading={isRefreshing}
          disabled={loading}
        >
          <IconRefresh size={18} />
        </ActionIcon>
      </Tooltip>

      {/* TODO: Filter button - Uncomment when filter feature is implemented
      <Tooltip label="Configure graph filters">
        <ActionIcon
          color="violet"
          variant="subtle"
          onClick={onOpenFilterModal}
          aria-label="Configure graph filters"
        >
          <IconFilter size={18} />
        </ActionIcon>
      </Tooltip>
      */}

      {/* KPI Alert button - Only shown for KPI charts */}
      {chartType === 'kpi' && (
        <Tooltip label="Create KPI alert">
          <ActionIcon
            color="yellow"
            variant="subtle"
            onClick={onOpenKPIAlertModal}
            aria-label="Create KPI alert"
          >
            <IconBell size={18} />
          </ActionIcon>
        </Tooltip>
      )}

      {/* Download CSV button */}
      <Tooltip label="Download CSV">
        <ActionIcon
          color="green"
          variant="subtle"
          onClick={onDownload}
          aria-label="Download CSV"
          disabled={!hasData || loading}
        >
          <IconDownload size={18} />
        </ActionIcon>
      </Tooltip>

      {/* Edit button */}
      <Tooltip label="Edit graph">
        <ActionIcon color="blue" variant="subtle" onClick={onEdit} aria-label="Edit graph">
          <IconEdit size={18} />
        </ActionIcon>
      </Tooltip>

      {/* Delete button */}
      <Tooltip label="Delete graph">
        <ActionIcon color="red" variant="subtle" onClick={onDelete} aria-label="Delete graph">
          <IconTrash size={18} />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
}

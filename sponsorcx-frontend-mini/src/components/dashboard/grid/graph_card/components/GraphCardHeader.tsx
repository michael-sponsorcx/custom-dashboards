import { Group, Title, Text } from '@mantine/core';
import { DragHandle } from '../../DragHandle';
import type { DrillDownState } from '../hooks/useGraphDrillDown';

/**
 * Props for GraphCardHeader component
 */
interface GraphCardHeaderProps {
  /** Graph title from template */
  title: string;
  /** Drill-down state (if active) */
  drillDownState: DrillDownState | null;
}

/**
 * Header section of GraphCard showing title and drill-down indicator
 *
 * **Purpose:** Display graph title with drag handle and drill-down status
 * **Pattern:** Drag handle + title + optional drill-down indicator
 *
 * @input title: "Sales by Region", drillDownState: { newPrimaryDimension: "Product", drillDownFilters: [...] }
 * @output Header with "Sales by Region (Drilled down to Product - 1 filter)"
 *
 * @example
 * // Normal state (no drill-down)
 * <GraphCardHeader title="Revenue by Region" drillDownState={null} />
 *
 * @example
 * // Drilled down state
 * <GraphCardHeader
 *   title="Revenue by Region"
 *   drillDownState={{ newPrimaryDimension: "Product", drillDownFilters: [{field: "region", value: "North"}] }}
 * />
 */
export function GraphCardHeader({ title, drillDownState }: GraphCardHeaderProps) {
  return (
    <Group gap="xs">
      <DragHandle />
      <Title order={4}>{title || 'Untitled Graph'}</Title>
      {drillDownState && (
        <Text size="sm" c="dimmed" style={{ fontStyle: 'italic' }}>
          (Drilled down to {drillDownState.newPrimaryDimension} -{' '}
          {drillDownState.drillDownFilters.length} filter
          {drillDownState.drillDownFilters.length !== 1 ? 's' : ''})
        </Text>
      )}
    </Group>
  );
}

/**
 * DashboardFilterSlideOut — SlideOut panel for configuring dashboard-wide filters.
 * Replaces the DashboardFilterModal for the PageHeader filter button.
 *
 * TODO: Implement multi-step wizard inside a Stadium SlideOut:
 *   Step 0: Select data sources (views)
 *   Step 1: Select common fields across those views
 */

import { Paper, Text } from '@mantine/core';
import colors from '@/stadiumDS/foundations/colors';

interface DashboardFilterSlideOutProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DashboardFilterSlideOut = ({ isOpen, onClose }: DashboardFilterSlideOutProps) => {
  if (!isOpen) return null;

  return (
    <Paper
      p="md"
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: 480,
        height: '100vh',
        zIndex: 200,
        backgroundColor: 'white',
        borderLeft: `1px solid ${colors.Gray[200]}`,
      }}
    >
      <Text size="lg" fw={600} c={colors.Gray[900]}>
        Configure Filters
      </Text>
      <Text size="sm" c={colors.Gray[500]} mt="xs">
        Filter configuration coming soon.
      </Text>
      <button onClick={onClose} style={{ marginTop: 16 }}>
        Close
      </button>
    </Paper>
  );
};

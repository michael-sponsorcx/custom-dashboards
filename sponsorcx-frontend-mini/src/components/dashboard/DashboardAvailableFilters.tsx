import { Group, Badge, Text, Stack, Paper } from '@mantine/core';
import { useDashboardFilterState } from './hooks/useDashboardFilters';

interface DashboardAvailableFiltersProps {
  onFilterClick: (fieldName: string) => void;
}

/**
 * DashboardAvailableFilters Component
 *
 * Displays the currently available dashboard filter fields as clickable badges.
 * When clicked, opens a modal to configure filter values.
 */
export function DashboardAvailableFilters({ onFilterClick }: DashboardAvailableFiltersProps) {
  const { availableFields, activeFilters } = useDashboardFilterState();

  if (availableFields.length === 0) {
    return null;
  }

  return (
    <Paper p="md" withBorder>
      <Stack gap="sm">
        <Text size="sm" fw={500}>Active Filter Fields:</Text>
        <Group gap="xs">
          {availableFields.map(field => {
            // Determine badge color based on field type
            const color = field.fieldType === 'measure' ? 'blue' :
                         field.fieldType === 'dimension' ? 'green' :
                         'orange';

            // Check if this field has an active filter
            const hasActiveFilter = activeFilters.some(
              filter => filter.fieldName === field.fieldName
            );

            return (
              <Badge
                key={field.fieldName}
                color={color}
                variant={hasActiveFilter ? 'filled' : 'light'}
                style={{ cursor: 'pointer' }}
                onClick={() => onFilterClick(field.fieldName)}
                size="lg"
              >
                {field.fieldTitle}
              </Badge>
            );
          })}
        </Group>
        <Text size="xs" c="dimmed">
          Click on a field to add or modify its filter
        </Text>
      </Stack>
    </Paper>
  );
}

import { Paper, Stack, Title, Select } from '@mantine/core';
import { CubeMeasure, CubeDimension } from '../../../types/cube';

interface OrderByQueryControlProps {
  measures?: CubeMeasure[];
  dimensions?: CubeDimension[];
  dates?: CubeDimension[];
  orderByField?: string;
  orderByDirection?: 'asc' | 'desc';
  onOrderByFieldChange: (field: string | undefined) => void;
  onOrderByDirectionChange: (direction: 'asc' | 'desc') => void;
}

/**
 * OrderByQueryControl - Controls for ordering query results
 * Allows users to select a field and direction (asc/desc) for ordering
 */
export function OrderByQueryControl({
  measures,
  dimensions,
  dates,
  orderByField,
  orderByDirection = 'asc',
  onOrderByFieldChange,
  onOrderByDirectionChange,
}: OrderByQueryControlProps) {
  // Early return if any of the arrays are not yet loaded
  // This prevents errors during initial render before data is fetched
  if (!measures || !dimensions || !dates) {
    return null;
  }

  // Create grouped data structure for Select component
  const groupedData = [];

  // Create mapping for display label to actual field name
  const labelToFieldMap: Record<string, string> = {};

  // Reverse mapping for field name to display label
  const fieldToLabelMap: Record<string, string> = {};

  // Add Measures group if available
  if (measures.length > 0) {
    const measureItems = measures.map(m => m.title || m.name);
    groupedData.push({ group: 'Measures', items: measureItems });
    measures.forEach(m => {
      const label = m.title || m.name;
      labelToFieldMap[label] = m.name;
      fieldToLabelMap[m.name] = label;
    });
  }

  // Add Dimensions group if available
  if (dimensions.length > 0) {
    const dimensionItems = dimensions.map(d => d.title || d.name);
    groupedData.push({ group: 'Dimensions', items: dimensionItems });
    dimensions.forEach(d => {
      const label = d.title || d.name;
      labelToFieldMap[label] = d.name;
      fieldToLabelMap[d.name] = label;
    });
  }

  // Add Dates group if available
  if (dates.length > 0) {
    const dateItems = dates.map(d => d.title || d.name);
    groupedData.push({ group: 'Dates', items: dateItems });
    dates.forEach(d => {
      const label = d.title || d.name;
      labelToFieldMap[label] = d.name;
      fieldToLabelMap[d.name] = label;
    });
  }

  return (
    <Paper p="md" radius="md" withBorder>
      <Stack gap="sm">
        <Title order={5}>Order By</Title>

        <Select
          label="Field"
          placeholder="Select field to order by"
          data={groupedData}
          value={orderByField ? fieldToLabelMap[orderByField] : null}
          onChange={(value) => {
            const fieldName = value ? labelToFieldMap[value] : undefined;
            onOrderByFieldChange(fieldName);
          }}
          clearable
          searchable
        />

        <Select
          label="Direction"
          data={['Ascending (A → Z, 1 → 9)', 'Descending (Z → A, 9 → 1)']}
          value={orderByDirection === 'asc' ? 'Ascending (A → Z, 1 → 9)' : 'Descending (Z → A, 9 → 1)'}
          onChange={(value) => {
            if (value === 'Ascending (A → Z, 1 → 9)') {
              onOrderByDirectionChange('asc');
            } else if (value === 'Descending (Z → A, 9 → 1)') {
              onOrderByDirectionChange('desc');
            }
          }}
          disabled={!orderByField}
          clearable
        />
      </Stack>
    </Paper>
  );
}

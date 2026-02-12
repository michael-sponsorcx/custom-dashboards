import { Accordion, Stack, Group, Checkbox, Text, Title, ActionIcon } from '@mantine/core';
import { IconFilter } from '@tabler/icons-react';
import { CubeMeasureMeta, CubeDimensionMeta } from '../../../types/cube';
import { FieldType } from '../../../types/filters';

interface FieldSelectionAccordionProps {
  measures: CubeMeasureMeta[];
  dimensions: CubeDimensionMeta[];
  dates: CubeDimensionMeta[];
  selectedMeasures: Set<string>;
  selectedDimensions: Set<string>;
  selectedDates: Set<string>;
  onMeasureToggle: (measureName: string) => void;
  onDimensionToggle: (dimensionName: string) => void;
  onDateToggle: (dateName: string) => void;
  // Filter button handlers
  onFilterClick?: (fieldName: string, fieldTitle: string, fieldType: FieldType) => void;
  activeFilters?: Set<string>; // Set of field names that have active filters
}

export function FieldSelectionAccordion({
  measures,
  dimensions,
  dates,
  selectedMeasures,
  selectedDimensions,
  selectedDates,
  onMeasureToggle,
  onDimensionToggle,
  onDateToggle,
  onFilterClick,
  activeFilters = new Set(),
}: FieldSelectionAccordionProps) {
  return (
    <Accordion multiple>
      {/* Measures Section */}
      {measures.length > 0 && (
        <Accordion.Item
          value="measures"
          style={{
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '8px',
            marginBottom: '8px',
          }}
        >
          <Accordion.Control>
            <Title order={4}>Measures</Title>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="xs">
              {measures.map((measure: any) => (
                <Group key={measure.name} gap="sm" justify="space-between" wrap="nowrap">
                  <Group gap="sm" style={{ flex: 1 }}>
                    <Checkbox
                      checked={selectedMeasures.has(measure.name)}
                      onChange={() => onMeasureToggle(measure.name)}
                    />
                    <Text size="sm">{measure.title}</Text>
                  </Group>
                  {onFilterClick && (
                    <ActionIcon
                      size="sm"
                      variant={activeFilters.has(measure.name) ? 'filled' : 'subtle'}
                      color={activeFilters.has(measure.name) ? 'blue' : 'gray'}
                      onClick={() => onFilterClick(measure.name, measure.title, 'measure')}
                    >
                      <IconFilter size={14} />
                    </ActionIcon>
                  )}
                </Group>
              ))}
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      )}

      {/* Dimensions Section */}
      {dimensions.length > 0 && (
        <Accordion.Item
          value="dimensions"
          style={{
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            borderRadius: '8px',
            marginBottom: '8px',
          }}
        >
          <Accordion.Control>
            <Title order={4}>Dimensions</Title>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="xs">
              {dimensions.map((dimension: any) => (
                <Group key={dimension.name} gap="sm" justify="space-between" wrap="nowrap">
                  <Group gap="sm" style={{ flex: 1 }}>
                    <Checkbox
                      checked={selectedDimensions.has(dimension.name)}
                      onChange={() => onDimensionToggle(dimension.name)}
                    />
                    <Text size="sm">{dimension.title}</Text>
                  </Group>
                  {onFilterClick && (
                    <ActionIcon
                      size="sm"
                      variant={activeFilters.has(dimension.name) ? 'filled' : 'subtle'}
                      color={activeFilters.has(dimension.name) ? 'green' : 'gray'}
                      onClick={() => onFilterClick(dimension.name, dimension.title, 'dimension')}
                    >
                      <IconFilter size={14} />
                    </ActionIcon>
                  )}
                </Group>
              ))}
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      )}

      {/* Dates Section */}
      {dates.length > 0 && (
        <Accordion.Item
          value="dates"
          style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)', borderRadius: '8px' }}
        >
          <Accordion.Control>
            <Title order={4}>Dates</Title>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="xs">
              {dates.map((date: any) => (
                <Group key={date.name} gap="sm" justify="space-between" wrap="nowrap">
                  <Group gap="sm" style={{ flex: 1 }}>
                    <Checkbox
                      checked={selectedDates.has(date.name)}
                      onChange={() => onDateToggle(date.name)}
                    />
                    <Text size="sm">{date.title}</Text>
                  </Group>
                  {onFilterClick && (
                    <ActionIcon
                      size="sm"
                      variant={activeFilters.has(date.name) ? 'filled' : 'subtle'}
                      color={activeFilters.has(date.name) ? 'purple' : 'gray'}
                      onClick={() => onFilterClick(date.name, date.title, 'date')}
                    >
                      <IconFilter size={14} />
                    </ActionIcon>
                  )}
                </Group>
              ))}
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      )}
    </Accordion>
  );
}

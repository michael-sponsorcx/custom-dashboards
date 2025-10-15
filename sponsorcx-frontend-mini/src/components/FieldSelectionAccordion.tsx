import { Accordion, Stack, Group, Checkbox, Text, Title } from '@mantine/core';
import { CubeMeasure, CubeDimension } from '../types/cube';

interface FieldSelectionAccordionProps {
  measures: CubeMeasure[];
  dimensions: CubeDimension[];
  dates: CubeDimension[];
  selectedMeasures: Set<string>;
  selectedDimensions: Set<string>;
  selectedDates: Set<string>;
  onMeasureToggle: (measureName: string) => void;
  onDimensionToggle: (dimensionName: string) => void;
  onDateToggle: (dateName: string) => void;
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
}: FieldSelectionAccordionProps) {
  return (
    <Accordion multiple>
      {/* Measures Section */}
      {measures.length > 0 && (
        <Accordion.Item value="measures" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', marginBottom: '8px' }}>
          <Accordion.Control>
            <Title order={4}>Measures</Title>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="xs">
              {measures.map((measure: any) => (
                <Group key={measure.name} gap="sm">
                  <Checkbox
                    checked={selectedMeasures.has(measure.name)}
                    onChange={() => onMeasureToggle(measure.name)}
                  />
                  <Text size="sm">{measure.title}</Text>
                </Group>
              ))}
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      )}

      {/* Dimensions Section */}
      {dimensions.length > 0 && (
        <Accordion.Item value="dimensions" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px', marginBottom: '8px' }}>
          <Accordion.Control>
            <Title order={4}>Dimensions</Title>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="xs">
              {dimensions.map((dimension: any) => (
                <Group key={dimension.name} gap="sm">
                  <Checkbox
                    checked={selectedDimensions.has(dimension.name)}
                    onChange={() => onDimensionToggle(dimension.name)}
                  />
                  <Text size="sm">{dimension.title}</Text>
                </Group>
              ))}
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      )}

      {/* Dates Section */}
      {dates.length > 0 && (
        <Accordion.Item value="dates" style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)', borderRadius: '8px' }}>
          <Accordion.Control>
            <Title order={4}>Dates</Title>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="xs">
              {dates.map((date: any) => (
                <Group key={date.name} gap="sm">
                  <Checkbox
                    checked={selectedDates.has(date.name)}
                    onChange={() => onDateToggle(date.name)}
                  />
                  <Text size="sm">{date.title}</Text>
                </Group>
              ))}
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      )}
    </Accordion>
  );
}

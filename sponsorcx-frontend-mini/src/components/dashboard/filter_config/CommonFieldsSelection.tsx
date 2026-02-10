import {
  Stack,
  Text,
  Checkbox,
  Button,
  Alert,
  Accordion,
  ScrollArea,
  Group,
  Loader,
} from '@mantine/core';
import { useState, useEffect } from 'react';
import { fetchCubeMetadata } from '../../../api';

interface CommonFieldsSelectionProps {
  selectedViews: string[];
  onSave: (
    selectedFields: Array<{
      fieldName: string;
      fieldTitle: string;
      fieldType: 'measure' | 'dimension' | 'date';
    }>
  ) => void;
}

interface CommonField {
  name: string;
  title: string;
  type: 'measure' | 'dimension' | 'date';
}

/**
 * CommonFieldsSelection Component
 *
 * Step 2 of dashboard filter configuration.
 * Shows common fields (measures, dimensions, dates) across all selected views.
 * Users can select which fields to make available as dashboard filters.
 */
export function CommonFieldsSelection({ selectedViews, onSave }: CommonFieldsSelectionProps) {
  const [loading, setLoading] = useState(true);
  const [commonFields, setCommonFields] = useState<{
    measures: CommonField[];
    dimensions: CommonField[];
    dates: CommonField[];
  }>({
    measures: [],
    dimensions: [],
    dates: [],
  });
  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadCommonFields();
  }, [selectedViews]);

  const loadCommonFields = async () => {
    if (selectedViews.length === 0) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const metadata = await fetchCubeMetadata();

      // Get fields for each selected view
      const viewFieldsMap: Record<
        string,
        {
          measures: Set<string>;
          dimensions: Set<string>;
          dates: Set<string>;
        }
      > = {};

      for (const viewName of selectedViews) {
        const view = metadata.cubes.find((cube: any) => cube.name === viewName);
        if (!view) continue;

        const measures = new Set(view.measures?.map((m: any) => m.name) || []);
        const allDimensions = view.dimensions || [];
        const dates = new Set(
          allDimensions.filter((d: any) => d.type === 'time').map((d: any) => d.name)
        );
        const dimensions = new Set(
          allDimensions.filter((d: any) => d.type !== 'time').map((d: any) => d.name)
        );

        viewFieldsMap[viewName] = { measures, dimensions, dates };
      }

      // Find common fields across all views
      const findCommonFields = (fieldType: 'measures' | 'dimensions' | 'dates'): CommonField[] => {
        if (selectedViews.length === 0) return [];

        // Start with fields from the first view
        const firstViewName = selectedViews[0];
        const firstView = metadata.cubes.find((cube: any) => cube.name === firstViewName);
        if (!firstView) return [];

        let commonFieldNames = new Set(viewFieldsMap[firstViewName][fieldType]);

        // Intersect with fields from other views
        for (let i = 1; i < selectedViews.length; i++) {
          const viewName = selectedViews[i];
          const viewFields = viewFieldsMap[viewName][fieldType];
          commonFieldNames = new Set([...commonFieldNames].filter((name) => viewFields.has(name)));
        }

        // Build CommonField objects with titles
        const result: CommonField[] = [];
        for (const fieldName of commonFieldNames) {
          // Get field details from any view (they should be consistent)
          const view = metadata.cubes.find((cube: any) => cube.name === selectedViews[0]);
          if (!view) continue;

          let field: any;
          let type: 'measure' | 'dimension' | 'date';

          if (fieldType === 'measures') {
            field = view.measures?.find((m: any) => m.name === fieldName);
            type = 'measure';
          } else {
            field = view.dimensions?.find((d: any) => d.name === fieldName);
            type = field?.type === 'time' ? 'date' : 'dimension';
          }

          if (field) {
            result.push({
              name: field.name,
              title: field.shortTitle || field.title || field.name,
              type,
            });
          }
        }

        return result;
      };

      setCommonFields({
        measures: findCommonFields('measures'),
        dimensions: findCommonFields('dimensions'),
        dates: findCommonFields('dates'),
      });
    } catch (error) {
      console.error('Failed to load common fields:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleField = (fieldName: string) => {
    const newSelected = new Set(selectedFields);
    if (newSelected.has(fieldName)) {
      newSelected.delete(fieldName);
    } else {
      newSelected.add(fieldName);
    }
    setSelectedFields(newSelected);
  };

  const handleSelectAll = (fields: CommonField[]) => {
    const newSelected = new Set(selectedFields);
    fields.forEach((field) => newSelected.add(field.name));
    setSelectedFields(newSelected);
  };

  const handleDeselectAll = (fields: CommonField[]) => {
    const newSelected = new Set(selectedFields);
    fields.forEach((field) => newSelected.delete(field.name));
    setSelectedFields(newSelected);
  };

  const handleSave = () => {
    const allFields = [...commonFields.measures, ...commonFields.dimensions, ...commonFields.dates];

    const selected = allFields
      .filter((field) => selectedFields.has(field.name))
      .map((field) => ({
        fieldName: field.name,
        fieldTitle: field.title,
        fieldType: field.type,
      }));

    onSave(selected);
  };

  const totalCommonFields =
    commonFields.measures.length + commonFields.dimensions.length + commonFields.dates.length;

  if (loading) {
    return (
      <Stack align="center" gap="md" py="xl">
        <Loader />
        <Text size="sm" c="dimmed">
          Loading common fields...
        </Text>
      </Stack>
    );
  }

  if (totalCommonFields === 0) {
    return (
      <Stack gap="md" mt="md">
        <Alert color="yellow" title="No common fields found">
          The selected data sources do not have any fields in common. Please go back and select
          different data sources.
        </Alert>
      </Stack>
    );
  }

  return (
    <Stack gap="md" mt="md">
      <Text size="sm" c="dimmed">
        Select the fields you want to make available as dashboard filters. Only fields that exist in
        all selected data sources are shown.
      </Text>

      <ScrollArea h={400}>
        <Accordion variant="contained" multiple>
          {/* Measures */}
          {commonFields.measures.length > 0 && (
            <Accordion.Item value="measures">
              <Accordion.Control>
                <Group justify="space-between">
                  <Text fw={500}>Measures ({commonFields.measures.length})</Text>
                  <Text size="sm" c="dimmed">
                    {commonFields.measures.filter((m) => selectedFields.has(m.name)).length}{' '}
                    selected
                  </Text>
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                <Stack gap="xs">
                  <Group gap="xs">
                    <Button
                      size="xs"
                      variant="light"
                      onClick={() => handleSelectAll(commonFields.measures)}
                    >
                      Select All
                    </Button>
                    <Button
                      size="xs"
                      variant="light"
                      onClick={() => handleDeselectAll(commonFields.measures)}
                    >
                      Deselect All
                    </Button>
                  </Group>
                  {commonFields.measures.map((field) => (
                    <Checkbox
                      key={field.name}
                      label={field.title}
                      checked={selectedFields.has(field.name)}
                      onChange={() => handleToggleField(field.name)}
                    />
                  ))}
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          )}

          {/* Dimensions */}
          {commonFields.dimensions.length > 0 && (
            <Accordion.Item value="dimensions">
              <Accordion.Control>
                <Group justify="space-between">
                  <Text fw={500}>Dimensions ({commonFields.dimensions.length})</Text>
                  <Text size="sm" c="dimmed">
                    {commonFields.dimensions.filter((d) => selectedFields.has(d.name)).length}{' '}
                    selected
                  </Text>
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                <Stack gap="xs">
                  <Group gap="xs">
                    <Button
                      size="xs"
                      variant="light"
                      onClick={() => handleSelectAll(commonFields.dimensions)}
                    >
                      Select All
                    </Button>
                    <Button
                      size="xs"
                      variant="light"
                      onClick={() => handleDeselectAll(commonFields.dimensions)}
                    >
                      Deselect All
                    </Button>
                  </Group>
                  {commonFields.dimensions.map((field) => (
                    <Checkbox
                      key={field.name}
                      label={field.title}
                      checked={selectedFields.has(field.name)}
                      onChange={() => handleToggleField(field.name)}
                    />
                  ))}
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          )}

          {/* Dates */}
          {commonFields.dates.length > 0 && (
            <Accordion.Item value="dates">
              <Accordion.Control>
                <Group justify="space-between">
                  <Text fw={500}>Dates ({commonFields.dates.length})</Text>
                  <Text size="sm" c="dimmed">
                    {commonFields.dates.filter((d) => selectedFields.has(d.name)).length} selected
                  </Text>
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                <Stack gap="xs">
                  <Group gap="xs">
                    <Button
                      size="xs"
                      variant="light"
                      onClick={() => handleSelectAll(commonFields.dates)}
                    >
                      Select All
                    </Button>
                    <Button
                      size="xs"
                      variant="light"
                      onClick={() => handleDeselectAll(commonFields.dates)}
                    >
                      Deselect All
                    </Button>
                  </Group>
                  {commonFields.dates.map((field) => (
                    <Checkbox
                      key={field.name}
                      label={field.title}
                      checked={selectedFields.has(field.name)}
                      onChange={() => handleToggleField(field.name)}
                    />
                  ))}
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          )}
        </Accordion>
      </ScrollArea>

      <Group justify="flex-end" mt="md">
        <Text size="sm" c="dimmed">
          {selectedFields.size} field{selectedFields.size !== 1 ? 's' : ''} selected
        </Text>
        <Button onClick={handleSave} disabled={selectedFields.size === 0}>
          Save
        </Button>
      </Group>
    </Stack>
  );
}

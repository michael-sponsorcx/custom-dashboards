import { Stack, Text, Group, ScrollArea, Alert } from '@mantine/core';
import { useState } from 'react';
import { ModelSelector } from '../../shared/ModelSelector';
import { CubeMeasure, CubeDimension } from '../../../types/cube';

interface DataSourceSelectionProps {
  selectedViews: string[];
  onViewsChange: (views: string[]) => void;
}

interface ViewFields {
  measures: CubeMeasure[];
  dimensions: CubeDimension[];
  dates: CubeDimension[];
}

/**
 * DataSourceSelection Component
 *
 * Step 1 of dashboard filter configuration.
 * Allows users to search and select multiple data sources (views).
 * Reuses the ModelSelector component from CreateGraph.
 */
export function DataSourceSelection({ selectedViews, onViewsChange }: DataSourceSelectionProps) {
  const [currentView, setCurrentView] = useState<string | null>(null);
  const [viewFieldsMap, setViewFieldsMap] = useState<Record<string, ViewFields>>({});

  const handleViewSelect = (viewName: string | null) => {
    if (viewName && !selectedViews.includes(viewName)) {
      // Add the view to selected list
      onViewsChange([...selectedViews, viewName]);
      setCurrentView(null); // Reset search
    }
  };

  const handleViewFieldsChange = (fields: ViewFields) => {
    if (currentView) {
      setViewFieldsMap(prev => ({
        ...prev,
        [currentView]: fields,
      }));
    }
  };

  const handleRemoveView = (viewName: string) => {
    onViewsChange(selectedViews.filter(v => v !== viewName));
    // Remove from fields map
    setViewFieldsMap(prev => {
      const newMap = { ...prev };
      delete newMap[viewName];
      return newMap;
    });
  };

  return (
    <Stack gap="md" mt="md">
      <Text size="sm" c="dimmed">
        Select the data sources you want to add filters for. You can select multiple views.
      </Text>

      {/* Model Selector for searching and adding views */}
      <ModelSelector
        initialViewName={undefined}
        onViewSelect={handleViewSelect}
        onViewFieldsChange={handleViewFieldsChange}
        onClearSelections={() => setCurrentView(null)}
      />

      {/* List of selected views */}
      {selectedViews.length > 0 && (
        <Stack gap="xs" mt="md">
          <Text size="sm" fw={500}>
            Selected Data Sources ({selectedViews.length}):
          </Text>
          <ScrollArea h={200}>
            <Stack gap="xs">
              {selectedViews.map(viewName => (
                <Group key={viewName} justify="space-between" p="sm" style={{
                  border: '1px solid #dee2e6',
                  borderRadius: '4px',
                  backgroundColor: '#f8f9fa'
                }}>
                  <Text size="sm">{viewName}</Text>
                  <Text
                    size="sm"
                    c="red"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleRemoveView(viewName)}
                  >
                    Remove
                  </Text>
                </Group>
              ))}
            </Stack>
          </ScrollArea>
        </Stack>
      )}

      {selectedViews.length === 0 && (
        <Alert color="blue" title="No data sources selected">
          Search for and select at least one data source to continue.
        </Alert>
      )}
    </Stack>
  );
}

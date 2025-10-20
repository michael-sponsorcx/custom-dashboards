import { Container, Paper, Title, Button, Stack, Code, Grid, Group, TextInput, Modal } from '@mantine/core';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { executeCubeGraphQL } from '../../services/cube';
import { CubeMeasure, CubeDimension } from '../../types/cube';
import { buildSimpleCubeQuery } from '../../utils/graphqlQueryBuilder';
import { validateCubeGraphQLQuery } from '../../utils/cubeGraphQLValidator';
import { ModelSelector } from './search/ModelSelector';
import { QueryValidationResults } from './QueryValidationResults';
import { FieldSelectionAccordion } from './field_selection/FieldSelectionAccordion';
import { GraphBuilder } from './chart_preview/GraphBuilder';
import { ChartSettingsPanel } from './settings/ChartSettingsPanel';
import { analyzeChartCompatibility, ChartType } from '../../utils/chartDataAnalyzer';
import { SortOrder } from './settings/OrderByControl';
import { FilterModal } from './field_selection/filters/FilterModal';
import { FilterRule, FieldType } from '../../types/filters';
import { saveGraphTemplate, addGraphToDashboard, generateGraphId } from '../../utils/graphTemplateStorage';
import { GraphTemplate } from '../../types/graphTemplate';
import { notifications } from '@mantine/notifications';

export function CreateGraph() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get template from location state (for editing)
  const editingTemplate = location.state?.template as GraphTemplate | undefined;
  const isEditing = !!editingTemplate;

  const [selectedView, setSelectedView] = useState<string | null>(editingTemplate?.viewName || null);
  const [viewFields, setViewFields] = useState<{
    measures: CubeMeasure[];
    dimensions: CubeDimension[];
    dates: CubeDimension[];
  }>({ measures: [], dimensions: [], dates: [] });
  const [selectedMeasures, setSelectedMeasures] = useState<Set<string>>(new Set(editingTemplate?.measures || []));
  const [selectedDimensions, setSelectedDimensions] = useState<Set<string>>(new Set(editingTemplate?.dimensions || []));
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set(editingTemplate?.dates || []));

  // Chart visualization state
  const [queryResult, setQueryResult] = useState<any>(null);
  const [selectedChartType, setSelectedChartType] = useState<ChartType | null>(editingTemplate?.chartType || null);
  const [chartTitle, setChartTitle] = useState(editingTemplate?.chartTitle || '');
  const [numberFormat, setNumberFormat] = useState<'currency' | 'percentage' | 'number' | 'abbreviated'>(editingTemplate?.numberFormat || 'number');
  const [numberPrecision, setNumberPrecision] = useState(editingTemplate?.numberPrecision || 2);
  const [primaryColor, setPrimaryColor] = useState(editingTemplate?.primaryColor || '#3b82f6');
  const [sortOrder, setSortOrder] = useState<SortOrder>(editingTemplate?.sortOrder || 'desc');

  // Data field selection state (for charts with multiple dimensions/measures)
  const [primaryDimension, setPrimaryDimension] = useState<string | undefined>(editingTemplate?.primaryDimension);
  const [secondaryDimension, setSecondaryDimension] = useState<string | undefined>(editingTemplate?.secondaryDimension);
  const [selectedMeasureField, setSelectedMeasureField] = useState<string | undefined>(editingTemplate?.selectedMeasure);

  // Filter state
  const [filterModalOpened, setFilterModalOpened] = useState(false);
  const [filters, setFilters] = useState<FilterRule[]>(editingTemplate?.filters || []);
  const [currentFilterField, setCurrentFilterField] = useState<{
    fieldName: string;
    fieldTitle: string;
    fieldType: FieldType;
  } | null>(null);

  // Cache for dimension values to avoid refetching
  const [dimensionValuesCache, setDimensionValuesCache] = useState<Record<string, string[]>>({});

  // Handlers for ViewSearchBar
  const handleViewSelect = (viewName: string | null) => {
    setSelectedView(viewName);
  };

  const handleViewFieldsChange = (fields: {
    measures: CubeMeasure[];
    dimensions: CubeDimension[];
    dates: CubeDimension[];
  }) => {
    setViewFields(fields);
  };

  const handleClearSelections = () => {
    setSelectedMeasures(new Set());
    setSelectedDimensions(new Set());
    setSelectedDates(new Set());
  };

  const handleMeasureToggle = (measureName: string) => {
    setSelectedMeasures(prev => {
      const newSet = new Set(prev);
      if (newSet.has(measureName)) {
        newSet.delete(measureName);
      } else {
        newSet.add(measureName);
      }
      return newSet;
    });
  };

  const handleDimensionToggle = (dimensionName: string) => {
    setSelectedDimensions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dimensionName)) {
        newSet.delete(dimensionName);
      } else {
        newSet.add(dimensionName);
      }
      return newSet;
    });
  };

  const handleDateToggle = (dateName: string) => {
    setSelectedDates(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dateName)) {
        newSet.delete(dateName);
      } else {
        newSet.add(dateName);
      }
      return newSet;
    });
  };

  // Filter handlers
  const handleFilterClick = (fieldName: string, fieldTitle: string, fieldType: FieldType) => {
    setCurrentFilterField({ fieldName, fieldTitle, fieldType });
    setFilterModalOpened(true);
  };

  const handleApplyFilter = (filter: FilterRule | null) => {
    if (!currentFilterField) return;

    setFilters(prev => {
      // Remove existing filter for this field
      const filtered = prev.filter(f => f.fieldName !== currentFilterField.fieldName);

      // Add new filter if provided (null means remove filter)
      if (filter) {
        return [...filtered, filter];
      }

      return filtered;
    });
  };

  const handleUpdateDimensionCache = (key: string, values: string[]) => {
    setDimensionValuesCache(prev => ({
      ...prev,
      [key]: values,
    }));
  };

  // Get active filters as a Set of field names for UI highlighting
  const activeFilterFields = useMemo(() => {
    return new Set(filters.map(f => f.fieldName));
  }, [filters]);

  // Get existing filter for the current field being edited
  const currentExistingFilter = useMemo(() => {
    if (!currentFilterField) return null;
    return filters.find(f => f.fieldName === currentFilterField.fieldName) || null;
  }, [filters, currentFilterField]);

  // Generate GraphQL query based on selections
  const generatedQuery = useMemo(() => {
    if (!selectedView) return '';

    const selectedMeasuresList = viewFields.measures.filter((m: CubeMeasure) =>
      selectedMeasures.has(m.name)
    );
    const selectedDimensionsList = viewFields.dimensions.filter((d: CubeDimension) =>
      selectedDimensions.has(d.name)
    );
    const selectedDatesList = viewFields.dates.filter((d: CubeDimension) =>
      selectedDates.has(d.name)
    );

    // Only generate query if at least one field is selected
    if (selectedMeasuresList.length === 0 &&
        selectedDimensionsList.length === 0 &&
        selectedDatesList.length === 0) {
      return '';
    }

    return buildSimpleCubeQuery(
      selectedView,
      selectedMeasuresList,
      selectedDimensionsList,
      selectedDatesList,
      filters
    );
  }, [selectedView, selectedMeasures, selectedDimensions, selectedDates, viewFields, filters]);

  // Validate the generated query automatically
  const [validationResult, setValidationResult] = useState<any>(null);

  useEffect(() => {
    if (!generatedQuery) {
      setValidationResult(null);
      return;
    }

    // Validate asynchronously
    validateCubeGraphQLQuery(generatedQuery).then(result => {
      setValidationResult(result);
    });
  }, [generatedQuery]);

  // Auto-execute query when editing (once view fields and query are ready)
  useEffect(() => {
    if (isEditing && generatedQuery && viewFields.measures.length > 0 && !queryResult) {
      handleExecuteQuery();
    }
  }, [isEditing, generatedQuery, viewFields]);

  const handleExecuteQuery = async () => {
    if (!generatedQuery) {
      console.log('No query to execute');
      return;
    }

    console.log('Executing GraphQL Query:', generatedQuery);

    try {
      const result = await executeCubeGraphQL(generatedQuery);
      console.log('Query Result:', result);

      // Store query result
      setQueryResult(result);

      // Analyze chart compatibility
      const compatibility = analyzeChartCompatibility(result);
      console.log('Chart Compatibility:', compatibility);

      // Auto-select recommended chart type ONLY if not editing or no chart type is set
      if (compatibility.compatibleCharts.length > 0 && !selectedChartType) {
        setSelectedChartType(compatibility.recommendation);
      }
    } catch (err) {
      console.error('Error executing query:', err);
      setQueryResult(null);
      setSelectedChartType(null);
    }
  };

  const handleSaveGraph = () => {
    if (!selectedView || !queryResult || !selectedChartType || !generatedQuery) {
      notifications.show({
        title: 'Cannot Save',
        message: 'Please select a view, execute a query, and configure a chart before saving.',
        color: 'red',
      });
      return;
    }

    // Use existing ID when editing, generate new one when creating
    const graphId = isEditing ? editingTemplate.id : generateGraphId();

    const template: GraphTemplate = {
      id: graphId,
      name: chartTitle || 'Untitled Graph',
      createdAt: isEditing ? editingTemplate.createdAt : new Date().toISOString(),
      viewName: selectedView,
      measures: Array.from(selectedMeasures),
      dimensions: Array.from(selectedDimensions),
      dates: Array.from(selectedDates),
      filters: filters,
      query: generatedQuery,
      chartType: selectedChartType,
      chartTitle: chartTitle,
      numberFormat,
      numberPrecision,
      primaryColor,
      sortOrder,
      primaryDimension,
      secondaryDimension,
      selectedMeasure: selectedMeasureField,
    };

    saveGraphTemplate(template);

    // Only add to dashboard if creating new graph (not editing)
    if (!isEditing) {
      addGraphToDashboard(graphId);
    }

    notifications.show({
      title: isEditing ? 'Graph Updated!' : 'Graph Saved!',
      message: isEditing
        ? `"${template.name}" has been updated.`
        : `"${template.name}" has been added to your dashboard.`,
      color: 'green',
    });

    // Navigate to dashboard
    setTimeout(() => navigate('/'), 500);
  };

  // Analyze chart compatibility when query result changes
  const chartCompatibility = useMemo(() => {
    if (!queryResult) return { compatibleCharts: [], dataStructure: { measureCount: 0, dimensionCount: 0, rowCount: 0, measures: [], dimensions: [] }, recommendation: 'number' as ChartType };
    return analyzeChartCompatibility(queryResult);
  }, [queryResult]);

  // Auto-set default primary/secondary dimensions and measure when query result changes
  useEffect(() => {
    if (!queryResult || !chartCompatibility.dataStructure) return;

    const { dimensions, measures } = chartCompatibility.dataStructure;

    // Set primary dimension (first dimension by default)
    if (dimensions.length > 0 && !primaryDimension) {
      setPrimaryDimension(dimensions[0]);
    }

    // Set secondary dimension (second dimension if available)
    if (dimensions.length > 1 && !secondaryDimension) {
      setSecondaryDimension(dimensions[1]);
    }

    // Set selected measure (first measure by default)
    if (measures.length > 0 && !selectedMeasureField) {
      setSelectedMeasureField(measures[0]);
    }
  }, [queryResult, chartCompatibility, primaryDimension, secondaryDimension, selectedMeasureField]);

  return (
    <Container size="100%" p="md" style={{ maxWidth: '100%' }}>
      <Stack gap="md">
        <Title order={2}>Create Graph</Title>

        {/* Model Selector */}
        <ModelSelector
          initialViewName={editingTemplate?.viewName}
          onViewSelect={handleViewSelect}
          onViewFieldsChange={handleViewFieldsChange}
          onClearSelections={handleClearSelections}
        />

        {/* Three Column Layout: Left (Fields) | Center (Graph) | Right (Settings) */}
        <Grid gutter="md">
          {/* LEFT COLUMN: Field Selection */}
          <Grid.Col span={3}>
            <Stack gap="md">
              {selectedView && (
                <FieldSelectionAccordion
                  measures={viewFields.measures}
                  dimensions={viewFields.dimensions}
                  dates={viewFields.dates}
                  selectedMeasures={selectedMeasures}
                  selectedDimensions={selectedDimensions}
                  selectedDates={selectedDates}
                  onMeasureToggle={handleMeasureToggle}
                  onDimensionToggle={handleDimensionToggle}
                  onDateToggle={handleDateToggle}
                  onFilterClick={handleFilterClick}
                  activeFilters={activeFilterFields}
                />
              )}

              {/* Query Execution Section */}
              {generatedQuery && (
                <Paper p="md" radius="md" withBorder>
                  <Stack gap="sm">
                    <Title order={5}>GraphQL Query</Title>
                    <Code block style={{ whiteSpace: 'pre', overflow: 'auto', fontSize: '0.75rem', maxHeight: '200px' }}>
                      {generatedQuery}
                    </Code>
                    <QueryValidationResults validationResult={validationResult} />
                    <Button onClick={handleExecuteQuery} fullWidth disabled={validationResult?.valid === false}>
                      Execute Query
                    </Button>
                  </Stack>
                </Paper>
              )}
            </Stack>
          </Grid.Col>

          {/* CENTER COLUMN: Graph Builder */}
          <Grid.Col span={6}>
            <GraphBuilder
              queryResult={queryResult}
              selectedChartType={selectedChartType}
              chartTitle={chartTitle}
              numberFormat={numberFormat}
              numberPrecision={numberPrecision}
              primaryColor={primaryColor}
              sortOrder={sortOrder}
              primaryDimension={primaryDimension}
              secondaryDimension={secondaryDimension}
              selectedMeasure={selectedMeasureField}
            />
          </Grid.Col>

          {/* RIGHT COLUMN: Chart Settings */}
          <Grid.Col span={3}>
            <ChartSettingsPanel
              selectedChartType={selectedChartType}
              compatibleCharts={chartCompatibility.compatibleCharts}
              onChartTypeChange={setSelectedChartType}
              chartTitle={chartTitle}
              onChartTitleChange={setChartTitle}
              numberFormat={numberFormat}
              onNumberFormatChange={setNumberFormat}
              numberPrecision={numberPrecision}
              onNumberPrecisionChange={setNumberPrecision}
              primaryColor={primaryColor}
              onPrimaryColorChange={setPrimaryColor}
              onSortOrderChange={setSortOrder}
              dimensions={chartCompatibility.dataStructure.dimensions}
              measures={chartCompatibility.dataStructure.measures}
              primaryDimension={primaryDimension}
              secondaryDimension={secondaryDimension}
              selectedMeasure={selectedMeasureField}
              onPrimaryDimensionChange={setPrimaryDimension}
              onSecondaryDimensionChange={(dim) => setSecondaryDimension(dim || undefined)}
              onMeasureChange={setSelectedMeasureField}
            />
          </Grid.Col>
        </Grid>

        {/* Filter Modal */}
        <FilterModal
          opened={filterModalOpened}
          onClose={() => setFilterModalOpened(false)}
          fieldName={currentFilterField?.fieldName || null}
          fieldTitle={currentFilterField?.fieldTitle || null}
          fieldType={currentFilterField?.fieldType || null}
          viewName={selectedView}
          existingFilter={currentExistingFilter}
          onApplyFilter={handleApplyFilter}
          dimensionValuesCache={dimensionValuesCache}
          onUpdateCache={handleUpdateDimensionCache}
        />

        <Group justify="space-between">
          <Button onClick={() => navigate('/')} variant="outline">
            Cancel
          </Button>
          <Button
            onClick={handleSaveGraph}
            disabled={!queryResult || !selectedChartType}
            color="green"
            size="lg"
          >
            Save to Dashboard
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}

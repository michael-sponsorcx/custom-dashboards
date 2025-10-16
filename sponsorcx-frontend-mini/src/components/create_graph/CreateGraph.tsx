import { Container, Paper, Title, Button, Stack, Code, Grid } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { fetchCubeMetadata, executeCubeGraphQL } from '../../services/cubeApi';
import { CubeView, CubeMeasure, CubeDimension } from '../../types/cube';
import { buildSimpleCubeQuery } from '../../utils/graphqlQueryBuilder';
import { validateCubeGraphQLQuery } from '../../utils/cubeGraphQLValidator';
import { ModelSelectionSearchBar } from './ModelSelectionSearchBar';
import { QueryValidationResults } from './QueryValidationResults';
import { FieldSelectionAccordion } from './field_selection/FieldSelectionAccordion';
import { GraphBuilder } from './chart_preview/GraphBuilder';
import { ChartSettingsPanel } from './settings/ChartSettingsPanel';
import { analyzeChartCompatibility, ChartType } from '../../utils/chartDataAnalyzer';
import { SortOrder } from './settings/OrderByControl';
import { FilterModal } from './field_selection/filters/FilterModal';
import { FilterRule, FieldType } from '../../types/filters';

export function CreateGraph() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [metadata, setMetadata] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedMeasures, setSelectedMeasures] = useState<Set<string>>(new Set());
  const [selectedDimensions, setSelectedDimensions] = useState<Set<string>>(new Set());
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());

  // Chart visualization state
  const [queryResult, setQueryResult] = useState<any>(null);
  const [selectedChartType, setSelectedChartType] = useState<ChartType | null>(null);
  const [chartTitle, setChartTitle] = useState('');
  const [numberFormat, setNumberFormat] = useState<'currency' | 'percentage' | 'number' | 'abbreviated'>('number');
  const [numberPrecision, setNumberPrecision] = useState(2);
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Data field selection state (for charts with multiple dimensions/measures)
  const [primaryDimension, setPrimaryDimension] = useState<string | undefined>(undefined);
  const [secondaryDimension, setSecondaryDimension] = useState<string | undefined>(undefined);
  const [selectedMeasureField, setSelectedMeasureField] = useState<string | undefined>(undefined);

  // Filter state
  const [filterModalOpened, setFilterModalOpened] = useState(false);
  const [filters, setFilters] = useState<FilterRule[]>([]);
  const [currentFilterField, setCurrentFilterField] = useState<{
    fieldName: string;
    fieldTitle: string;
    fieldType: FieldType;
  } | null>(null);

  // Cache for dimension values to avoid refetching
  const [dimensionValuesCache, setDimensionValuesCache] = useState<Record<string, string[]>>({});

  useEffect(() => {
    // Fetch metadata on component mount
    const loadMetadata = async () => {
      setLoading(true);
      try {
        const data = await fetchCubeMetadata();
        setMetadata(data);
        console.log('Cube metadata:', data);
      } catch (err) {
        setError('Failed to load metadata');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadMetadata();
  }, []);

  // Extract views from metadata
  const views = useMemo(() => {
    if (!metadata?.cubes) return [];

    return metadata.cubes
      .filter((cube: any) => cube.type === 'view')
      .map((cube: any) => ({
        name: cube.name,
        title: cube.title || cube.name,
      }));
  }, [metadata]);

  // Filter views based on search query (case-insensitive substring match on name only)
  const filteredViews = useMemo(() => {
    if (!searchQuery.trim()) return views;

    const query = searchQuery.toLowerCase();
    return views.filter((view: CubeView) =>
      view.name.toLowerCase().includes(query)
    );
  }, [views, searchQuery]);

  // Limit to top 5 results
  const displayedViews = filteredViews.slice(0, 5);

  // Extract measures, dimensions, and dates from the selected view
  const viewFields = useMemo(() => {
    if (!selectedView || !metadata?.cubes) {
      return { measures: [], dimensions: [], dates: [] };
    }

    const view = metadata.cubes.find((cube: any) => cube.name === selectedView);
    if (!view) {
      return { measures: [], dimensions: [], dates: [] };
    }

    const measures = view.measures?.map((m: any) => ({
      name: m.name,
      title: m.shortTitle || m.title || m.name,
      type: m.type,
    })) || [];

    const allDimensions = view.dimensions?.map((d: any) => ({
      name: d.name,
      title: d.shortTitle || d.title || d.name,
      type: d.type,
    })) || [];

    // Separate date dimensions from regular dimensions
    const dates = allDimensions.filter((d: any) => d.type === 'time');
    const dimensions = allDimensions.filter((d: any) => d.type !== 'time');

    return { measures, dimensions, dates };
  }, [selectedView, metadata]);

  const handleViewSelect = (viewName: string) => {
    setSelectedView(viewName);
    setSearchQuery(viewName);
    setDropdownOpen(false);
    // Clear all selections when changing view
    setSelectedMeasures(new Set());
    setSelectedDimensions(new Set());
    setSelectedDates(new Set());
    console.log('Selected view:', viewName);
  };

  const handleClearSelection = () => {
    setSelectedView(null);
    setSearchQuery('');
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

      // Auto-select recommended chart type
      if (compatibility.compatibleCharts.length > 0) {
        setSelectedChartType(compatibility.recommendation);
      }
    } catch (err) {
      console.error('Error executing query:', err);
      setQueryResult(null);
      setSelectedChartType(null);
    }
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

        {/* Model Selection Search Bar */}
        <ModelSelectionSearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedView={selectedView}
          onViewSelect={handleViewSelect}
          onClearSelection={handleClearSelection}
          displayedViews={displayedViews}
          loading={loading}
          dropdownOpen={dropdownOpen}
          setDropdownOpen={setDropdownOpen}
        />

        {loading && <div>Loading metadata...</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}

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

        <Button onClick={() => navigate('/')} variant="outline">
          Back to Dashboard
        </Button>
      </Stack>
    </Container>
  );
}

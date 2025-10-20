import { Container, Paper, Title, Button, Stack, Code, Grid, Group } from '@mantine/core';
import { useNavigate, useLocation } from 'react-router-dom';
import { GraphTemplate } from '../../types/graphTemplate';
import { ModelSelector } from './search/ModelSelector';
import { QueryValidationResults } from './QueryValidationResults';
import { FieldSelectionAccordion } from './field_selection/FieldSelectionAccordion';
import { GraphBuilder } from './chart_preview/GraphBuilder';
import { ChartSettingsPanel } from './settings/ChartSettingsPanel';
import { FilterModal } from './field_selection/filters/FilterModal';
import { useGraphState, useFilterManagement, useQueryExecution, useGraphTemplate } from './hooks';

/**
 * CreateGraph Component - Refactored
 *
 * Main component for creating and editing graphs.
 * Now uses modular custom hooks for clean separation of concerns.
 */
export function CreateGraph() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get template from location state (for editing)
  const editingTemplate = location.state?.template as GraphTemplate | undefined;

  // Use custom hooks to manage state and logic
  const graphState = useGraphState({ initialTemplate: editingTemplate });
  const filterManagement = useFilterManagement({ initialTemplate: editingTemplate });
  const templateManager = useGraphTemplate({ editingTemplate });

  // Query execution hook depends on graph state
  const queryExecution = useQueryExecution({
    selectedView: graphState.selectedView,
    viewFields: graphState.viewFields,
    selectedMeasures: graphState.selectedMeasures,
    selectedDimensions: graphState.selectedDimensions,
    selectedDates: graphState.selectedDates,
    filters: filterManagement.filters,
    isEditing: templateManager.isEditing,
    selectedChartType: graphState.chartConfig.chartType,
    setSelectedChartType: graphState.setSelectedChartType,
    setPrimaryDimension: graphState.setPrimaryDimension,
    setSecondaryDimension: graphState.setSecondaryDimension,
    setSelectedMeasureField: graphState.setSelectedMeasureField,
    primaryDimension: graphState.primaryDimension,
    secondaryDimension: graphState.secondaryDimension,
    selectedMeasureField: graphState.selectedMeasureField,
  });

  // Save handler
  const handleSaveGraph = () => {
    templateManager.saveTemplate({
      selectedView: graphState.selectedView,
      selectedMeasures: graphState.selectedMeasures,
      selectedDimensions: graphState.selectedDimensions,
      selectedDates: graphState.selectedDates,
      filters: filterManagement.filters,
      generatedQuery: queryExecution.generatedQuery,
      queryResult: queryExecution.queryResult,
      chartConfig: graphState.chartConfig,
    });
  };

  return (
    <Container size="100%" p="md" style={{ maxWidth: '100%' }}>
      <Stack gap="md">
        <Title order={2}>Create Graph</Title>

        {/* Model Selector */}
        <ModelSelector
          initialViewName={editingTemplate?.viewName}
          onViewSelect={graphState.setSelectedView}
          onViewFieldsChange={graphState.setViewFields}
          onClearSelections={graphState.clearSelections}
        />

        {/* Three Column Layout: Left (Fields) | Center (Graph) | Right (Settings) */}
        <Grid gutter="md">
          {/* LEFT COLUMN: Field Selection */}
          <Grid.Col span={3}>
            <Stack gap="md">
              {graphState.selectedView && (
                <FieldSelectionAccordion
                  measures={graphState.viewFields.measures}
                  dimensions={graphState.viewFields.dimensions}
                  dates={graphState.viewFields.dates}
                  selectedMeasures={graphState.selectedMeasures}
                  selectedDimensions={graphState.selectedDimensions}
                  selectedDates={graphState.selectedDates}
                  onMeasureToggle={graphState.toggleMeasure}
                  onDimensionToggle={graphState.toggleDimension}
                  onDateToggle={graphState.toggleDate}
                  onFilterClick={filterManagement.openFilterModal}
                  activeFilters={filterManagement.activeFilterFields}
                />
              )}

              {/* Query Execution Section */}
              {queryExecution.generatedQuery && (
                <Paper p="md" radius="md" withBorder>
                  <Stack gap="sm">
                    <Title order={5}>GraphQL Query</Title>
                    <Code block style={{ whiteSpace: 'pre', overflow: 'auto', fontSize: '0.75rem', maxHeight: '200px' }}>
                      {queryExecution.generatedQuery}
                    </Code>
                    <QueryValidationResults validationResult={queryExecution.validationResult} />
                    <Button
                      onClick={queryExecution.executeQuery}
                      fullWidth
                      disabled={queryExecution.validationResult?.valid === false}
                    >
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
              queryResult={queryExecution.queryResult}
              selectedChartType={graphState.chartConfig.chartType}
              chartTitle={graphState.chartConfig.chartTitle}
              numberFormat={graphState.chartConfig.numberFormat}
              numberPrecision={graphState.chartConfig.numberPrecision}
              primaryColor={graphState.chartConfig.primaryColor}
              sortOrder={graphState.chartConfig.sortOrder}
              primaryDimension={graphState.primaryDimension}
              secondaryDimension={graphState.secondaryDimension}
              selectedMeasure={graphState.selectedMeasureField}
            />
          </Grid.Col>

          {/* RIGHT COLUMN: Chart Settings */}
          <Grid.Col span={3}>
            <ChartSettingsPanel
              selectedChartType={graphState.chartConfig.chartType}
              compatibleCharts={queryExecution.chartCompatibility.compatibleCharts}
              onChartTypeChange={graphState.setSelectedChartType}
              chartTitle={graphState.chartConfig.chartTitle}
              onChartTitleChange={graphState.setChartTitle}
              numberFormat={graphState.chartConfig.numberFormat}
              onNumberFormatChange={graphState.setNumberFormat}
              numberPrecision={graphState.chartConfig.numberPrecision}
              onNumberPrecisionChange={graphState.setNumberPrecision}
              primaryColor={graphState.chartConfig.primaryColor}
              onPrimaryColorChange={graphState.setPrimaryColor}
              onSortOrderChange={graphState.setSortOrder}
              dimensions={queryExecution.chartCompatibility.dataStructure.dimensions}
              measures={queryExecution.chartCompatibility.dataStructure.measures}
              primaryDimension={graphState.primaryDimension}
              secondaryDimension={graphState.secondaryDimension}
              selectedMeasure={graphState.selectedMeasureField}
              onPrimaryDimensionChange={graphState.setPrimaryDimension}
              onSecondaryDimensionChange={(dim) => graphState.setSecondaryDimension(dim || undefined)}
              onMeasureChange={graphState.setSelectedMeasureField}
            />
          </Grid.Col>
        </Grid>

        {/* Filter Modal */}
        <FilterModal
          opened={filterManagement.filterModalOpened}
          onClose={filterManagement.closeFilterModal}
          fieldName={filterManagement.currentFilterField?.fieldName || null}
          fieldTitle={filterManagement.currentFilterField?.fieldTitle || null}
          fieldType={filterManagement.currentFilterField?.fieldType || null}
          viewName={graphState.selectedView}
          existingFilter={filterManagement.currentExistingFilter}
          onApplyFilter={filterManagement.applyFilter}
          dimensionValuesCache={filterManagement.dimensionValuesCache}
          onUpdateCache={filterManagement.updateDimensionCache}
        />

        <Group justify="space-between">
          <Button onClick={() => navigate('/')} variant="outline">
            Cancel
          </Button>
          <Button
            onClick={handleSaveGraph}
            disabled={!queryExecution.queryResult || !graphState.chartConfig.chartType}
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

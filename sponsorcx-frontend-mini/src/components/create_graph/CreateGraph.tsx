import { Container, Paper, Title, Button, Stack, Code, Grid, Group, Tabs, Tooltip } from '@mantine/core';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GraphTemplate } from '../../types/graph';
import { ModelSelector } from './search/ModelSelector';
import { QueryValidationResults } from './field_selection/QueryValidationResults';
import { FieldSelectionAccordion } from './field_selection/FieldSelectionAccordion';
import { OrderByQueryControl } from './field_selection/OrderByQueryControl';
import { ChartPreview } from './preview/ChartPreview';
import { ChartSettingsPanel } from './settings/ChartSettingsPanel';
import { FilterModal } from './field_selection/filters/FilterModal';
import { QueryResultsTable } from '../visualizations/tables/QueryResultsTable';
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
  const [activeTab, setActiveTab] = useState<string | null>('data');

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
    orderByField: graphState.orderByField,
    orderByDirection: graphState.orderByDirection,
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
      orderByField: graphState.orderByField,
      orderByDirection: graphState.orderByDirection,
      queryResult: queryExecution.queryResult,
      chartConfig: graphState.chartConfig,
    });
  };

  return (
    <Container size="100%" p="md" style={{ maxWidth: '100%' }}>
      <Stack gap="md">
        <Title order={2}>Create Graph</Title>

        {/* Tab Switcher */}
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="data">Data</Tabs.Tab>
            <Tooltip label="Must execute query first" disabled={!!queryExecution.queryResult}>
              <Tabs.Tab value="visualization" disabled={!queryExecution.queryResult}>
                Visualization
              </Tabs.Tab>
            </Tooltip>
          </Tabs.List>

          <Tabs.Panel value="data" pt="md">
            {/* Two Column Layout: Left (Field Selection + Query) | Right (Data Table) */}
            <Grid gutter="md">
              {/* LEFT COLUMN: Field Selection and Query Execution */}
              <Grid.Col span={3}>
                <Stack gap="md">
                  {/* Model Selector */}
                  <ModelSelector
                    initialViewName={editingTemplate?.viewName}
                    onViewSelect={graphState.setSelectedView}
                    onViewFieldsChange={graphState.setViewFields}
                    onClearSelections={graphState.clearSelections}
                  />

                  {/* Field Selection Accordion */}
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

                  {/* Order By Control */}
                  {graphState.selectedView && (
                    <OrderByQueryControl
                      measures={graphState.viewFields.measures}
                      dimensions={graphState.viewFields.dimensions}
                      dates={graphState.viewFields.dates}
                      orderByField={graphState.orderByField}
                      orderByDirection={graphState.orderByDirection}
                      onOrderByFieldChange={graphState.setOrderByField}
                      onOrderByDirectionChange={graphState.setOrderByDirection}
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
                          loading={queryExecution.isExecuting}
                        >
                          Execute Query
                        </Button>
                      </Stack>
                    </Paper>
                  )}
                </Stack>
              </Grid.Col>

              {/* RIGHT COLUMN: Data Table */}
              <Grid.Col span={9}>
                <Paper p="md" radius="md" withBorder style={{ height: '100%' }}>
                  <Stack gap="sm">
                    <Title order={5}>Query Results</Title>
                    <QueryResultsTable
                      queryResult={queryExecution.queryResult}
                      isLoading={queryExecution.isExecuting}
                    />
                  </Stack>
                </Paper>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          <Tabs.Panel value="visualization" pt="md">
            {/* Two Column Layout: Chart Settings | Graph Builder */}
            <Grid gutter="md">
              {/* LEFT COLUMN: Chart Settings */}
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
                  colorPalette={graphState.chartConfig.colorPalette}
                  onColorPaletteChange={graphState.setColorPalette}
                  primaryColor={graphState.chartConfig.primaryColor}
                  onPrimaryColorChange={graphState.setPrimaryColor}
                  sortOrder={graphState.chartConfig.sortOrder}
                  onSortOrderChange={graphState.setSortOrder}
                  legendPosition={graphState.chartConfig.legendPosition}
                  onLegendPositionChange={graphState.setLegendPosition}
                  kpiValue={graphState.chartConfig.kpiValue}
                  onKpiValueChange={graphState.setKpiValue}
                  kpiLabel={graphState.chartConfig.kpiLabel}
                  onKpiLabelChange={graphState.setKpiLabel}
                  kpiSecondaryValue={graphState.chartConfig.kpiSecondaryValue}
                  onKpiSecondaryValueChange={graphState.setKpiSecondaryValue}
                  kpiSecondaryLabel={graphState.chartConfig.kpiSecondaryLabel}
                  onKpiSecondaryLabelChange={graphState.setKpiSecondaryLabel}
                  kpiShowTrend={graphState.chartConfig.kpiShowTrend}
                  onKpiShowTrendChange={graphState.setKpiShowTrend}
                  kpiTrendPercentage={graphState.chartConfig.kpiTrendPercentage}
                  onKpiTrendPercentageChange={graphState.setKpiTrendPercentage}
                  xAxisLabel={graphState.chartConfig.xAxisLabel}
                  yAxisLabel={graphState.chartConfig.yAxisLabel}
                  onXAxisLabelChange={graphState.setXAxisLabel}
                  onYAxisLabelChange={graphState.setYAxisLabel}
                  showXAxisGridLines={graphState.chartConfig.showXAxisGridLines}
                  showYAxisGridLines={graphState.chartConfig.showYAxisGridLines}
                  onShowXAxisGridLinesChange={graphState.setShowXAxisGridLines}
                  onShowYAxisGridLinesChange={graphState.setShowYAxisGridLines}
                  showRegressionLine={graphState.chartConfig.showRegressionLine}
                  onShowRegressionLineChange={graphState.setShowRegressionLine}
                  maxDataPoints={graphState.chartConfig.maxDataPoints}
                  onMaxDataPointsChange={graphState.setMaxDataPoints}
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

              {/* RIGHT COLUMN: Chart Preview */}
              <Grid.Col span={9}>
                <ChartPreview
                  queryResult={queryExecution.queryResult}
                  selectedChartType={graphState.chartConfig.chartType}
                  chartTitle={graphState.chartConfig.chartTitle}
                  numberFormat={graphState.chartConfig.numberFormat}
                  numberPrecision={graphState.chartConfig.numberPrecision}
                  primaryColor={graphState.chartConfig.primaryColor}
                  colorPalette={graphState.chartConfig.colorPalette}
                  sortOrder={graphState.chartConfig.sortOrder}
                  primaryDimension={graphState.primaryDimension}
                  secondaryDimension={graphState.secondaryDimension}
                  selectedMeasure={graphState.selectedMeasureField}
                  xAxisLabel={graphState.chartConfig.xAxisLabel}
                  yAxisLabel={graphState.chartConfig.yAxisLabel}
                  showXAxisGridLines={graphState.chartConfig.showXAxisGridLines}
                  showYAxisGridLines={graphState.chartConfig.showYAxisGridLines}
                  showRegressionLine={graphState.chartConfig.showRegressionLine}
                  maxDataPoints={graphState.chartConfig.maxDataPoints}
                  legendPosition={graphState.chartConfig.legendPosition}
                  kpiValue={graphState.chartConfig.kpiValue}
                  kpiLabel={graphState.chartConfig.kpiLabel}
                  kpiSecondaryValue={graphState.chartConfig.kpiSecondaryValue}
                  kpiSecondaryLabel={graphState.chartConfig.kpiSecondaryLabel}
                  kpiShowTrend={graphState.chartConfig.kpiShowTrend}
                  kpiTrendPercentage={graphState.chartConfig.kpiTrendPercentage}
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
          </Tabs.Panel>
        </Tabs>

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

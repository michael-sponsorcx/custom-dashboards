/**
 * useGraphTemplate Hook
 *
 * Manages graph template creation and saving:
 * - Determines if editing or creating
 * - Builds template from current state
 * - Saves template to storage
 * - Shows notifications
 * - Navigates after save
 */

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { GraphTemplate } from '../../../types/graph';
import { saveGraphTemplate, generateGraphId, addGraphToDashboard } from '../../../utils/storage';
import { ChartConfig } from '../types';
import { FilterRule } from '../../../types/filters';
import { ChartType } from '../../../utils/chartDataAnalyzer';

interface UseGraphTemplateOptions {
  editingTemplate?: GraphTemplate;
}

interface SaveGraphParams {
  selectedView: string | null;
  selectedMeasures: Set<string>;
  selectedDimensions: Set<string>;
  selectedDates: Set<string>;
  filters: FilterRule[];
  generatedQuery: string;
  queryResult: any;
  chartConfig: ChartConfig;
}

export function useGraphTemplate(options: UseGraphTemplateOptions = {}) {
  const { editingTemplate } = options;
  const navigate = useNavigate();
  const isEditing = !!editingTemplate;

  // Create template from current state
  const createTemplate = useCallback((params: SaveGraphParams): GraphTemplate => {
    const {
      selectedView,
      selectedMeasures,
      selectedDimensions,
      selectedDates,
      filters,
      generatedQuery,
      chartConfig,
    } = params;

    const graphId = isEditing ? editingTemplate.id : generateGraphId();

    return {
      id: graphId,
      name: chartConfig.chartTitle || 'Untitled Graph',
      createdAt: isEditing ? editingTemplate.createdAt : new Date().toISOString(),
      viewName: selectedView!,
      measures: Array.from(selectedMeasures),
      dimensions: Array.from(selectedDimensions),
      dates: Array.from(selectedDates),
      filters,
      query: generatedQuery,
      chartType: chartConfig.chartType as ChartType,
      chartTitle: chartConfig.chartTitle,
      numberFormat: chartConfig.numberFormat,
      numberPrecision: chartConfig.numberPrecision,
      colorPalette: chartConfig.colorPalette,
      primaryColor: chartConfig.primaryColor,
      sortOrder: chartConfig.sortOrder,
      legendPosition: chartConfig.legendPosition,
      // Axis & grid
      xAxisLabel: chartConfig.xAxisLabel,
      yAxisLabel: chartConfig.yAxisLabel,
      showXAxisGridLines: chartConfig.showXAxisGridLines,
      showYAxisGridLines: chartConfig.showYAxisGridLines,
      showRegressionLine: chartConfig.showRegressionLine,
      maxDataPoints: chartConfig.maxDataPoints,
      // KPI
      kpiValue: chartConfig.kpiValue,
      kpiLabel: chartConfig.kpiLabel,
      kpiSecondaryValue: chartConfig.kpiSecondaryValue,
      kpiSecondaryLabel: chartConfig.kpiSecondaryLabel,
      kpiShowTrend: chartConfig.kpiShowTrend,
      kpiTrendPercentage: chartConfig.kpiTrendPercentage,
      primaryDimension: chartConfig.primaryDimension,
      secondaryDimension: chartConfig.secondaryDimension,
      selectedMeasure: chartConfig.selectedMeasure,
    };
  }, [isEditing, editingTemplate]);

  // Save template
  const saveTemplate = useCallback((params: SaveGraphParams) => {
    const {
      selectedView,
      queryResult,
      chartConfig,
      generatedQuery,
    } = params;

    // Validate required fields
    if (!selectedView || !queryResult || !chartConfig.chartType || !generatedQuery) {
      notifications.show({
        title: 'Cannot Save',
        message: 'Please select a view, execute a query, and configure a chart before saving.',
        color: 'red',
      });
      return;
    }

    // Create template
    const template = createTemplate(params);

    // Save to storage
    saveGraphTemplate(template);

    // Only add to dashboard if creating new graph (not editing)
    if (!isEditing) {
      addGraphToDashboard(template.id);
    }

    // Show success notification
    notifications.show({
      title: isEditing ? 'Graph Updated!' : 'Graph Saved!',
      message: isEditing
        ? `"${template.name}" has been updated.`
        : `"${template.name}" has been added to your dashboard.`,
      color: 'green',
    });

    // Navigate to dashboard
    setTimeout(() => navigate('/'), 500);
  }, [isEditing, createTemplate, navigate]);

  return {
    isEditing,
    saveTemplate,
  };
}

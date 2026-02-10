/**
 * useGraphUI Hook
 *
 * Manages graph creation and saving:
 * - Determines if editing or creating
 * - Builds template from current state
 * - Saves template to backend
 * - Shows notifications
 * - Navigates after save
 */

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { GraphUI } from '../../../types/graph';
import {
  createGraph,
  updateGraph,
  addGraphToDashboard,
} from '../../../api';
import { useOrganizationStore } from '../../../store';
import { ChartConfig } from '../types';
import { FilterRule } from '../../../types/filters';
import { ChartType } from '../../../utils/chartDataAnalyzer';

interface UseGraphUIOptions {
  editingGraph?: GraphUI;
}

interface SaveGraphParams {
  selectedView: string | null;
  selectedMeasures: Set<string>;
  selectedDimensions: Set<string>;
  selectedDates: Set<string>;
  filters: FilterRule[];
  orderByField?: string;
  orderByDirection?: 'asc' | 'desc';
  queryResult: unknown;
  chartConfig: ChartConfig;
}

export function useGraphUI(options: UseGraphUIOptions = {}) {
  const { editingGraph } = options;
  const navigate = useNavigate();
  const { organizationId, dashboardId } = useOrganizationStore();
  const isEditing = !!editingGraph;

  // Create template from current state
  const createTemplateData = useCallback(
    (params: SaveGraphParams): Omit<GraphUI, 'id' | 'createdAt' | 'updatedAt'> => {
      const {
        selectedView,
        selectedMeasures,
        selectedDimensions,
        selectedDates,
        filters,
        orderByField,
        orderByDirection,
        chartConfig,
      } = params;

      return {
        name: chartConfig.chartTitle || 'Untitled Graph',
        viewName: selectedView!,
        measures: Array.from(selectedMeasures),
        dimensions: Array.from(selectedDimensions),
        dates: Array.from(selectedDates),
        filters,
        orderByField,
        orderByDirection,
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
    },
    []
  );

  // Save template
  const saveTemplate = useCallback(
    async (params: SaveGraphParams) => {
      const { selectedView, queryResult, chartConfig } = params;

      // Validate required fields
      if (!selectedView || !queryResult || !chartConfig.chartType) {
        notifications.show({
          title: 'Cannot Save',
          message: 'Please select a view, execute a query, and configure a chart before saving.',
          color: 'red',
        });
        return;
      }

      try {
        // Create template data
        const templateData = createTemplateData(params);

        let savedGraph: GraphUI;

        if (isEditing && editingGraph) {
          // Update existing graph
          savedGraph = await updateGraph(editingGraph.id, templateData);
        } else {
          // Create new graph
          savedGraph = await createGraph(templateData, organizationId);

          // Add to dashboard if we have a dashboard ID
          if (dashboardId) {
            await addGraphToDashboard(dashboardId, savedGraph.id);
          }
        }

        // Show success notification
        notifications.show({
          title: isEditing ? 'Graph Updated!' : 'Graph Saved!',
          message: isEditing
            ? `"${savedGraph.name}" has been updated.`
            : `"${savedGraph.name}" has been added to your dashboard.`,
          color: 'green',
        });

        // Navigate to dashboard
        setTimeout(() => navigate('/'), 500);
      } catch (error) {
        console.error('Failed to save graph:', error);
        notifications.show({
          title: 'Error Saving Graph',
          message: error instanceof Error ? error.message : 'Failed to save graph. Please try again.',
          color: 'red',
        });
      }
    },
    [isEditing, editingGraph, createTemplateData, navigate, organizationId, dashboardId]
  );

  return {
    isEditing,
    saveTemplate,
  };
}

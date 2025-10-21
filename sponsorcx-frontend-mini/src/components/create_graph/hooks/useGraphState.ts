/**
 * useGraphState Hook
 *
 * Manages all graph configuration state including:
 * - View and field selections
 * - Chart configuration
 * - Data field selections for multi-dimensional charts
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { GraphTemplate } from '../../../types/graph';
import { ViewFields, ChartConfig } from '../types';
import type { LegendPosition } from '../../../types/graph';
import { ChartType } from '../../../utils/chartDataAnalyzer';
import { SortOrder } from '../settings/OrderByControl';
import { createSetToggler } from '../utils/fieldToggle';

interface UseGraphStateOptions {
  initialTemplate?: GraphTemplate;
}

export function useGraphState(options: UseGraphStateOptions = {}) {
  const { initialTemplate } = options;

  // View selection
  const [selectedView, setSelectedView] = useState<string | null>(
    initialTemplate?.viewName || null
  );
  const [viewFields, setViewFields] = useState<ViewFields>({
    measures: [],
    dimensions: [],
    dates: [],
  });

  // Field selections
  const [selectedMeasures, setSelectedMeasures] = useState<Set<string>>(
    new Set(initialTemplate?.measures || [])
  );
  const [selectedDimensions, setSelectedDimensions] = useState<Set<string>>(
    new Set(initialTemplate?.dimensions || [])
  );
  const [selectedDates, setSelectedDates] = useState<Set<string>>(
    new Set(initialTemplate?.dates || [])
  );

  // Chart configuration
  const [selectedChartType, setSelectedChartType] = useState<ChartType | null>(
    initialTemplate?.chartType || null
  );
  const [chartTitle, setChartTitle] = useState(initialTemplate?.chartTitle || '');
  const [numberFormat, setNumberFormat] = useState<'currency' | 'percentage' | 'number' | 'abbreviated'>(
    initialTemplate?.numberFormat || 'number'
  );
  const [numberPrecision, setNumberPrecision] = useState(
    initialTemplate?.numberPrecision || 2
  );
  const [primaryColor, setPrimaryColor] = useState(
    initialTemplate?.primaryColor || '#3b82f6'
  );
  const [sortOrder, setSortOrder] = useState<SortOrder>(
    initialTemplate?.sortOrder || 'desc'
  );
  const [legendPosition, setLegendPosition] = useState<LegendPosition>(
    (initialTemplate?.legendPosition as LegendPosition) || 'bottom'
  );
  const [xAxisLabel, setXAxisLabel] = useState(initialTemplate?.xAxisLabel || '');
  const [yAxisLabel, setYAxisLabel] = useState(initialTemplate?.yAxisLabel || '');
  const [showGridLines, setShowGridLines] = useState(
    initialTemplate?.showGridLines ?? true
  );

  // Data field selections
  const [primaryDimension, setPrimaryDimension] = useState<string | undefined>(
    initialTemplate?.primaryDimension
  );
  const [secondaryDimension, setSecondaryDimension] = useState<string | undefined>(
    initialTemplate?.secondaryDimension
  );
  const [selectedMeasureField, setSelectedMeasureField] = useState<string | undefined>(
    initialTemplate?.selectedMeasure
  );

  // Create toggle functions using utility
  const toggleMeasure = useCallback(createSetToggler(setSelectedMeasures), []);
  const toggleDimension = useCallback(createSetToggler(setSelectedDimensions), []);
  const toggleDate = useCallback(createSetToggler(setSelectedDates), []);

  // Clear all selections
  const clearSelections = useCallback(() => {
    setSelectedMeasures(new Set());
    setSelectedDimensions(new Set());
    setSelectedDates(new Set());
  }, []);

  // Grouped chart config for easy access
  const chartConfig: ChartConfig = useMemo(() => ({
    chartType: selectedChartType,
    chartTitle,
    numberFormat,
    numberPrecision,
    primaryColor,
    sortOrder,
    legendPosition,
    primaryDimension,
    secondaryDimension,
    selectedMeasure: selectedMeasureField,
    xAxisLabel,
    yAxisLabel,
    showGridLines,
  }), [
    selectedChartType,
    chartTitle,
    numberFormat,
    numberPrecision,
    primaryColor,
    sortOrder,
    legendPosition,
    primaryDimension,
    secondaryDimension,
    selectedMeasureField,
    xAxisLabel,
    yAxisLabel,
    showGridLines,
  ]);

  return {
    // View state
    selectedView,
    setSelectedView,
    viewFields,
    setViewFields,

    // Field selections
    selectedMeasures,
    selectedDimensions,
    selectedDates,
    toggleMeasure,
    toggleDimension,
    toggleDate,
    clearSelections,

    // Chart config
    chartConfig,
    setSelectedChartType,
    setChartTitle,
    setNumberFormat,
    setNumberPrecision,
    setPrimaryColor,
    setSortOrder,
    setLegendPosition,
    setXAxisLabel,
    setYAxisLabel,
    setShowGridLines,

    // Data field selections
    primaryDimension,
    secondaryDimension,
    selectedMeasureField,
    setPrimaryDimension,
    setSecondaryDimension,
    setSelectedMeasureField,
  };
}

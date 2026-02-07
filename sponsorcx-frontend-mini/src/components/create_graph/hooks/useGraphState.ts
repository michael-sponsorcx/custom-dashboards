/**
 * useGraphState Hook
 *
 * Manages all graph configuration state including:
 * - View and field selections
 * - Chart configuration
 * - Data field selections for multi-dimensional charts
 */

import { useState, useCallback, useMemo } from 'react';
import { GraphUI } from '../../../types/graph';
import { ViewFields, ChartConfig } from '../types';
import type { LegendPosition } from '../../../types/graph';
import { ChartType } from '../../../utils/chartDataAnalyzer';
import { SortOrder } from '../settings/OrderByControl';
import { createSetToggler } from '../utils/fieldToggle';
import type { ColorPalette } from '../../../constants/colorPalettes';
import { getPalettePrimaryColor } from '../../../constants/colorPalettes';

interface UseGraphStateOptions {
  initialTemplate?: GraphUI;
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

  // Query options (orderBy)
  const [orderByField, setOrderByField] = useState<string | undefined>(
    initialTemplate?.orderByField
  );
  const [orderByDirection, setOrderByDirection] = useState<'asc' | 'desc'>(
    initialTemplate?.orderByDirection || 'asc'
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
  const [colorPalette, setColorPalette] = useState<ColorPalette>(
    initialTemplate?.colorPalette || 'hubspot-orange'
  );
  const [primaryColor, setPrimaryColor] = useState(
    initialTemplate?.primaryColor || getPalettePrimaryColor(initialTemplate?.colorPalette || 'hubspot-orange')
  );
  const [sortOrder, setSortOrder] = useState<SortOrder>(
    initialTemplate?.sortOrder || 'asc'
  );
  const [legendPosition, setLegendPosition] = useState<LegendPosition>(
    (initialTemplate?.legendPosition as LegendPosition) || 'bottom'
  );
  const [xAxisLabel, setXAxisLabel] = useState(initialTemplate?.xAxisLabel || '');
  const [yAxisLabel, setYAxisLabel] = useState(initialTemplate?.yAxisLabel || '');
  const [showXAxisGridLines, setShowXAxisGridLines] = useState(
    initialTemplate?.showXAxisGridLines ?? true
  );
  const [showYAxisGridLines, setShowYAxisGridLines] = useState(
    initialTemplate?.showYAxisGridLines ?? true
  );
  const [showRegressionLine, setShowRegressionLine] = useState(
    initialTemplate?.showRegressionLine ?? false
  );
  const [maxDataPoints, setMaxDataPoints] = useState<number | undefined>(
    initialTemplate?.maxDataPoints
  );

  // KPI fields
  const [kpiValue, setKpiValue] = useState<number | undefined>(initialTemplate?.kpiValue);
  const [kpiLabel, setKpiLabel] = useState<string | undefined>(initialTemplate?.kpiLabel);
  const [kpiSecondaryValue, setKpiSecondaryValue] = useState<number | undefined>(initialTemplate?.kpiSecondaryValue);
  const [kpiSecondaryLabel, setKpiSecondaryLabel] = useState<string | undefined>(initialTemplate?.kpiSecondaryLabel);
  const [kpiShowTrend, setKpiShowTrend] = useState<boolean | undefined>(initialTemplate?.kpiShowTrend ?? false);
  const [kpiTrendPercentage, setKpiTrendPercentage] = useState<number | undefined>(initialTemplate?.kpiTrendPercentage);

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

  // Wrapped setColorPalette to update primaryColor when selecting a preset palette
  const handleSetColorPalette = useCallback((palette: ColorPalette) => {
    setColorPalette(palette);
    // When switching to a preset palette, update primaryColor to first color from that palette
    // When switching to custom, keep existing primaryColor
    if (palette !== 'custom') {
      setPrimaryColor(getPalettePrimaryColor(palette));
    }
  }, []);

  // Grouped chart config for easy access
  const chartConfig: ChartConfig = useMemo(() => {
    const config = {
      chartType: selectedChartType,
      chartTitle,
      numberFormat,
      numberPrecision,
      colorPalette,
      primaryColor,
      sortOrder,
      legendPosition,
      kpiValue,
      kpiLabel,
      kpiSecondaryValue,
      kpiSecondaryLabel,
      kpiShowTrend,
      kpiTrendPercentage,
      primaryDimension,
      secondaryDimension,
      selectedMeasure: selectedMeasureField,
      xAxisLabel,
      yAxisLabel,
      showXAxisGridLines,
      showYAxisGridLines,
      showRegressionLine,
      maxDataPoints,
    };
    return config;
  }, [
    selectedChartType,
    chartTitle,
    numberFormat,
    numberPrecision,
    colorPalette,
    primaryColor,
    sortOrder,
    legendPosition,
    kpiValue,
    kpiLabel,
    kpiSecondaryValue,
    kpiSecondaryLabel,
    kpiShowTrend,
    kpiTrendPercentage,
    primaryDimension,
    secondaryDimension,
    selectedMeasureField,
    xAxisLabel,
    yAxisLabel,
    showXAxisGridLines,
    showYAxisGridLines,
    showRegressionLine,
    maxDataPoints,
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

    // Query options
    orderByField,
    orderByDirection,
    setOrderByField,
    setOrderByDirection,

    // Chart config
    chartConfig,
    setSelectedChartType,
    setChartTitle,
    setNumberFormat,
    setNumberPrecision,
    setColorPalette: handleSetColorPalette,
    setPrimaryColor,
    setSortOrder,
    setLegendPosition,
    setXAxisLabel,
    setYAxisLabel,
    setShowXAxisGridLines,
    setShowYAxisGridLines,
    setShowRegressionLine,
    setMaxDataPoints,

    // KPI setters
    setKpiValue,
    setKpiLabel,
    setKpiSecondaryValue,
    setKpiSecondaryLabel,
    setKpiShowTrend,
    setKpiTrendPercentage,

    // Data field selections
    primaryDimension,
    secondaryDimension,
    selectedMeasureField,
    setPrimaryDimension,
    setSecondaryDimension,
    setSelectedMeasureField,
  };
}

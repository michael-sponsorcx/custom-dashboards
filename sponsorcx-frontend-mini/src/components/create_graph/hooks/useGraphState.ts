/**
 * useGraphState Hook
 *
 * Manages all graph configuration state including:
 * - View and field selections
 * - Chart configuration
 * - Data field selections for multi-dimensional charts
 */

import { useState, useCallback, useMemo } from 'react';
import type { GraphUI } from '../../../types/graph';
import { ViewFields, ChartConfig } from '../types';
import { LegendPosition, NumberFormat } from '../../../types/backend-graphql';
import { ChartType } from '../../../types/backend-graphql';
import { SortOrder } from '../settings/OrderByControl';
import { createSetToggler } from '../utils/fieldToggle';
import { ColorPalette } from '../../../types/backend-graphql';
import { getPalettePrimaryColor } from '../../../constants/colorPalettes';

interface UseGraphStateOptions {
  initialTemplate?: GraphUI;
}

export const useGraphState = (options: UseGraphStateOptions = {}) => {
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
    initialTemplate?.orderByField ?? undefined
  );
  const [orderByDirection, setOrderByDirection] = useState<SortOrder>(
    initialTemplate?.orderByDirection ?? SortOrder.Asc
  );

  // Chart configuration
  const [selectedChartType, setSelectedChartType] = useState<ChartType | null>(
    initialTemplate?.chartType || null
  );
  const [chartTitle, setChartTitle] = useState(initialTemplate?.chartTitle || '');
  const [numberFormat, setNumberFormat] = useState<NumberFormat>(
    initialTemplate?.numberFormat || NumberFormat.Number
  );
  const [numberPrecision, setNumberPrecision] = useState(
    initialTemplate?.numberPrecision || 2
  );
  const [colorPalette, setColorPalette] = useState<ColorPalette>(
    initialTemplate?.colorPalette || ColorPalette.HubspotOrange
  );
  const [primaryColor, setPrimaryColor] = useState(
    initialTemplate?.primaryColor || getPalettePrimaryColor(initialTemplate?.colorPalette || ColorPalette.HubspotOrange)
  );
  const [sortOrder, setSortOrder] = useState<SortOrder>(
    initialTemplate?.sortOrder || SortOrder.Asc
  );
  const [legendPosition, setLegendPosition] = useState<LegendPosition>(
    initialTemplate?.legendPosition || LegendPosition.Bottom
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
    initialTemplate?.maxDataPoints ?? undefined
  );

  // KPI fields
  const [kpiValue, setKpiValue] = useState<number | undefined>(initialTemplate?.kpiValue ?? undefined);
  const [kpiLabel, setKpiLabel] = useState<string | undefined>(initialTemplate?.kpiLabel ?? undefined);
  const [kpiSecondaryValue, setKpiSecondaryValue] = useState<number | undefined>(initialTemplate?.kpiSecondaryValue ?? undefined);
  const [kpiSecondaryLabel, setKpiSecondaryLabel] = useState<string | undefined>(initialTemplate?.kpiSecondaryLabel ?? undefined);
  const [kpiShowTrend, setKpiShowTrend] = useState<boolean | undefined>(initialTemplate?.kpiShowTrend ?? false);
  const [kpiTrendPercentage, setKpiTrendPercentage] = useState<number | undefined>(initialTemplate?.kpiTrendPercentage ?? undefined);

  // Data field selections
  const [primaryDimension, setPrimaryDimension] = useState<string | undefined>(
    initialTemplate?.primaryDimension ?? undefined
  );
  const [secondaryDimension, setSecondaryDimension] = useState<string | undefined>(
    initialTemplate?.secondaryDimension ?? undefined
  );
  const [selectedMeasureField, setSelectedMeasureField] = useState<string | undefined>(
    initialTemplate?.selectedMeasure ?? undefined
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
    if (palette !== ColorPalette.Custom) {
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
};

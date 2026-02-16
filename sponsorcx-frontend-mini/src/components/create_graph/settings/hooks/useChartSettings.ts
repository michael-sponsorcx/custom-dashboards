import { useState, useCallback } from 'react';
import { SortOrder } from '../OrderByControl';
import { NumberFormat, ColorPalette, ChartType } from '../../../../types/backend-graphql';
import { getPalettePrimaryColor } from '../../../../constants/colorPalettes';

interface ChartSettings {
  chartType: ChartType | null;
  chartTitle: string;
  numberFormat: NumberFormat;
  numberPrecision: number;
  colorPalette: ColorPalette;
  primaryColor: string;
  sortOrder: SortOrder;
  primaryDimension?: string;
  secondaryDimension?: string;
  selectedMeasure?: string;
}

interface UseChartSettingsOptions {
  initialSettings?: Partial<ChartSettings>;
  onSettingsChange?: (settings: ChartSettings) => void;
}

/**
 * useChartSettings Hook
 *
 * Manages all chart settings state in a centralized way
 * Provides callbacks for updating individual settings
 */
export function useChartSettings(options: UseChartSettingsOptions = {}) {
  const { initialSettings = {}, onSettingsChange } = options;

  const [settings, setSettings] = useState<ChartSettings>({
    chartType: initialSettings.chartType ?? null,
    chartTitle: initialSettings.chartTitle ?? '',
    numberFormat: initialSettings.numberFormat ?? NumberFormat.Number,
    numberPrecision: initialSettings.numberPrecision ?? 2,
    colorPalette: initialSettings.colorPalette ?? ColorPalette.Sponsorcx,
    primaryColor: initialSettings.primaryColor ?? '#2E90FA', // SponsorCX Brand 500
    sortOrder: initialSettings.sortOrder ?? SortOrder.Desc,
    primaryDimension: initialSettings.primaryDimension,
    secondaryDimension: initialSettings.secondaryDimension,
    selectedMeasure: initialSettings.selectedMeasure,
  });

  const updateSettings = useCallback(
    (updates: Partial<ChartSettings>) => {
      setSettings((prev) => {
        const newSettings = { ...prev, ...updates };
        onSettingsChange?.(newSettings);
        return newSettings;
      });
    },
    [onSettingsChange]
  );

  const setChartType = useCallback(
    (chartType: ChartType) => {
      updateSettings({ chartType });
    },
    [updateSettings]
  );

  const setChartTitle = useCallback(
    (chartTitle: string) => {
      updateSettings({ chartTitle });
    },
    [updateSettings]
  );

  const setNumberFormat = useCallback(
    (numberFormat: NumberFormat) => {
      updateSettings({ numberFormat });
    },
    [updateSettings]
  );

  const setNumberPrecision = useCallback(
    (numberPrecision: number) => {
      updateSettings({ numberPrecision });
    },
    [updateSettings]
  );

  const setColorPalette = useCallback(
    (colorPalette: ColorPalette) => {
      // When switching to a preset palette, update primaryColor to first color from that palette
      // When switching to custom, keep existing primaryColor
      const updates: Partial<ChartSettings> = { colorPalette };

      if (colorPalette !== 'custom') {
        updates.primaryColor = getPalettePrimaryColor(colorPalette);
      }

      updateSettings(updates);
    },
    [updateSettings]
  );

  const setPrimaryColor = useCallback(
    (primaryColor: string) => {
      updateSettings({ primaryColor });
    },
    [updateSettings]
  );

  const setSortOrder = useCallback(
    (sortOrder: SortOrder) => {
      updateSettings({ sortOrder });
    },
    [updateSettings]
  );

  const setPrimaryDimension = useCallback(
    (primaryDimension: string) => {
      updateSettings({ primaryDimension });
    },
    [updateSettings]
  );

  const setSecondaryDimension = useCallback(
    (secondaryDimension: string | null) => {
      updateSettings({ secondaryDimension: secondaryDimension ?? undefined });
    },
    [updateSettings]
  );

  const setSelectedMeasure = useCallback(
    (selectedMeasure: string) => {
      updateSettings({ selectedMeasure });
    },
    [updateSettings]
  );

  return {
    settings,
    setChartType,
    setChartTitle,
    setNumberFormat,
    setNumberPrecision,
    setColorPalette,
    setPrimaryColor,
    setSortOrder,
    setPrimaryDimension,
    setSecondaryDimension,
    setSelectedMeasure,
  };
}

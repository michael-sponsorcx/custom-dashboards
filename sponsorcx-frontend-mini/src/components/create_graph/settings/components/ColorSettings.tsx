import { ColorInput, Stack } from '@mantine/core';
import { ColorPalette } from '../../../../constants/colorPalettes';
import { PaletteSelector } from './PaletteSelector';

interface ColorSettingsProps {
  colorPalette: ColorPalette;
  primaryColor: string;
  onColorPaletteChange: (palette: ColorPalette) => void;
  onPrimaryColorChange: (color: string) => void;
  /** Whether this chart type only displays a single color (e.g., KPI, bar, horizontalBar) */
  isSingleColorChart: boolean;
}

/**
 * ColorSettings Component - Enhanced with Palette Selection
 *
 * Features:
 * - HubSpot-style palette selector with visual previews
 * - Custom color picker for single-color charts (KPI, bar, horizontalBar)
 * - Multi-series charts use preset palettes only
 */
export function ColorSettings({
  colorPalette,
  primaryColor,
  onColorPaletteChange,
  onPrimaryColorChange,
  isSingleColorChart,
}: ColorSettingsProps) {
  // Allow custom color for single-color chart types
  const allowCustomColor = isSingleColorChart;

  return (
    <Stack gap="md">
      {/* Palette Selector */}
      <PaletteSelector
        selectedPalette={colorPalette}
        onPaletteChange={onColorPaletteChange}
        showCustomOption={allowCustomColor}
      />

      {/* Custom Color Picker - Only shown when 'custom' palette is selected and chart uses single color */}
      {colorPalette === 'custom' && allowCustomColor && (
        <ColorInput
          label="Custom Color"
          description="Choose a custom color for your chart"
          value={primaryColor}
          onChange={onPrimaryColorChange}
          format="hex"
        />
      )}
    </Stack>
  );
}
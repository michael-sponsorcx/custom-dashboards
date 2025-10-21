import { ColorInput } from '@mantine/core';

interface ColorSettingsProps {
  primaryColor: string;
  onPrimaryColorChange: (color: string) => void;
}

/**
 * ColorSettings Component
 *
 * Handles color customization for charts
 */
export function ColorSettings({
  primaryColor,
  onPrimaryColorChange,
}: ColorSettingsProps) {
  return (
    <ColorInput
      label="Primary Color"
      description="Customize chart color"
      value={primaryColor}
      onChange={onPrimaryColorChange}
      format="hex"
    />
  );
}

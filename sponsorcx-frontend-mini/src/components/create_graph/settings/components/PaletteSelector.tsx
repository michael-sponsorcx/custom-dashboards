import { Box, SimpleGrid, Text, Stack, Group } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { ColorPalette, getAllPalettes, getPalettePreview, getPaletteName } from '../../../../constants/colorPalettes';

interface PaletteSelectorProps {
  selectedPalette: ColorPalette;
  onPaletteChange: (palette: ColorPalette) => void;
  /** Whether to show the 'Custom' palette option (only for single-dimension charts) */
  showCustomOption?: boolean;
}

/**
 * PaletteSelector - HubSpot-style color palette picker
 *
 * Features:
 * - Grid of palette cards
 * - Visual preview with 5 color dots
 * - Clean, minimal design
 * - Responsive layout
 * - Conditional 'Custom' option for single-dimension charts
 */
export function PaletteSelector({ selectedPalette, onPaletteChange, showCustomOption = true }: PaletteSelectorProps) {
  const allPalettes = getAllPalettes();
  const palettes = showCustomOption ? allPalettes : allPalettes.filter(p => p !== 'custom');

  return (
    <Stack gap="xs">
      <Text size="sm" fw={600} c="dimmed">
        Select Color Palette
      </Text>
      <Box
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(115px, 1fr))',
          gap: '8px',
        }}
      >
        {palettes.map((palette) => (
          <PaletteCard
            key={palette}
            palette={palette}
            selected={selectedPalette === palette}
            onClick={() => onPaletteChange(palette)}
          />
        ))}
      </Box>
    </Stack>
  );
}

interface PaletteCardProps {
  palette: ColorPalette;
  selected: boolean;
  onClick: () => void;
}

function PaletteCard({ palette, selected, onClick }: PaletteCardProps) {
  const previewColors = getPalettePreview(palette);
  const paletteName = getPaletteName(palette);
  const isCustom = palette === 'custom';

  return (
    <Box
      onClick={onClick}
      style={(theme) => ({
        padding: '12px 16px',
        borderRadius: '8px',
        border: selected ? `2px solid ${theme.colors.blue[6]}` : '1px solid #e1e4e8',
        backgroundColor: selected ? '#f6f8fa' : '#ffffff',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative',
        ':hover': {
          borderColor: selected ? theme.colors.blue[6] : '#cbd2d9',
          boxShadow: selected ? '0 2px 8px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.04)',
        },
      })}
    >
      <Stack gap="xs">
        <Group justify="space-between" align="center">
          <Text size="sm" fw={500} style={{ flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {paletteName}
          </Text>
          {selected && <IconCheck size={16} color="#0969da" />}
        </Group>

        {!isCustom && previewColors.length > 0 && (
          <Group gap={6}>
            {previewColors.map((color, index) => (
              <Box
                key={index}
                style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  backgroundColor: color,
                  border: '1px solid rgba(0,0,0,0.1)',
                }}
              />
            ))}
          </Group>
        )}

        {isCustom && (
          <Text size="xs" c="dimmed">
            Choose your own color
          </Text>
        )}
      </Stack>
    </Box>
  );
}
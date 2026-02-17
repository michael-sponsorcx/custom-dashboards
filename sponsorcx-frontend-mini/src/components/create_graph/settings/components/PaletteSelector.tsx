import { Box, Text, Stack, Group } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import colors from '@/stadiumDS/foundations/colors';
import {
  ColorPalette,
  getAllPalettes,
  getPalettePreview,
  getPaletteName,
} from '../../../../constants/colorPalettes';

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
export function PaletteSelector({
  selectedPalette,
  onPaletteChange,
  showCustomOption = true,
}: PaletteSelectorProps) {
  const allPalettes = getAllPalettes();
  const palettes = showCustomOption ? allPalettes : allPalettes.filter((p) => p !== 'custom');

  return (
    <Stack gap="xs">
      <Text size="sm" fw={600} c="dimmed">
        Select Color Palette
      </Text>
      <Box
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(115px, 1fr))',
          gap: 'var(--mantine-spacing-xs)',
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
        borderRadius: 'var(--mantine-radius-md)',
        border: selected ? `2px solid ${theme.colors.Brand[5]}` : `1px solid ${colors.Gray[200]}`,
        backgroundColor: selected ? colors.Gray[50] : colors.Base.White,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative',
        ':hover': {
          borderColor: selected ? theme.colors.Brand[5] : colors.Gray[300],
          boxShadow: selected
            ? theme.shadows.sm
            : theme.shadows.xs,
        },
      })}
    >
      <Stack gap="xs">
        <Group justify="space-between" align="center">
          <Text
            size="sm"
            fw={500}
            style={{
              flex: 1,
              minWidth: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {paletteName}
          </Text>
          {selected && <IconCheck size={16} color={colors.Brand[600]} />}
        </Group>

        {!isCustom && previewColors.length > 0 && (
          <Group gap={6}>
            {previewColors.map((color, index) => (
              <Box
                key={index}
                style={{
                  width: 14,
                  height: 14,
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

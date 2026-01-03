import { Paper, Stack, Title, Text } from '@mantine/core';

interface KPIAlertTileProps {
  /** The type/title of the KPI alert */
  title: string;
  /** Example description of what this alert does */
  example: string;
  /** Whether this tile is currently selected */
  isSelected?: boolean;
  /** Optional click handler for when the tile is selected */
  onClick?: () => void;
}

/**
 * KPIAlertTile Component
 *
 * A clickable tile that displays a KPI alert type with an example.
 * Used in the KPI Alert Modal to show different alert options.
 *
 * @example
 * <KPIAlertTile
 *   title="KPI crosses a set limit"
 *   example="Receive an alert when monthly sales is less than 50,000"
 *   isSelected={false}
 *   onClick={() => handleSelectAlertType('threshold')}
 * />
 */
export function KPIAlertTile({ title, example, isSelected, onClick }: KPIAlertTileProps) {
  return (
    <Paper
      shadow="sm"
      p="md"
      radius="md"
      withBorder
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        borderColor: isSelected ? 'var(--mantine-color-blue-6)' : undefined,
        borderWidth: isSelected ? '2px' : undefined,
      }}
      styles={{
        root: {
          '&:hover': onClick
            ? {
                borderColor: 'var(--mantine-color-blue-5)',
                backgroundColor: 'var(--mantine-color-blue-0)',
                transform: 'translateY(-2px)',
                boxShadow: 'var(--mantine-shadow-md)',
              }
            : {},
        },
      }}
    >
      <Stack gap="sm">
        {/* Header - Alert Type */}
        <Title order={4}>{title}</Title>

        {/* Body - Example */}
        <Text size="sm" c="dimmed">
          {example}
        </Text>
      </Stack>
    </Paper>
  );
}

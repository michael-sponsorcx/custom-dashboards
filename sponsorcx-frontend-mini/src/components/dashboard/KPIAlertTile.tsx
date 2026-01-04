import { Paper, Stack, Title, Text } from '@mantine/core';
import type { KPIAlertTileProps } from '../../types/kpi-alerts';

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
export const KPIAlertTile = ({ title, example, isSelected, onClick, disabled }: KPIAlertTileProps) => {
  return (
    <Paper
      shadow="sm"
      p="md"
      radius="md"
      withBorder
      onClick={disabled ? undefined : onClick}
      style={{
        cursor: disabled ? 'not-allowed' : onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        borderColor: isSelected ? 'var(--mantine-color-blue-6)' : undefined,
        borderWidth: isSelected ? '2px' : undefined,
        opacity: disabled ? 0.5 : 1,
      }}
      styles={{
        root: {
          '&:hover': !disabled && onClick
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
        <Title order={4} c={disabled ? 'dimmed' : undefined}>
          {title}
        </Title>

        {/* Body - Example */}
        <Text size="sm" c="dimmed">
          {example}
        </Text>
      </Stack>
    </Paper>
  );
};

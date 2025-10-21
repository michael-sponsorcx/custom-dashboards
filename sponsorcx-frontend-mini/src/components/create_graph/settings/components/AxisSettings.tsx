import { Paper, Stack, Title, TextInput } from '@mantine/core';

/**
 * AxisSettings Component
 *
 * Handles axis labels and other axis-related settings
 * Currently a placeholder for future implementation
 */
export function AxisSettings() {
  return (
    <Paper p="sm" withBorder style={{ backgroundColor: '#f8f9fa' }}>
      <Stack gap="xs">
        <Title order={6}>Additional Settings</Title>
        <TextInput label="X-Axis Label" placeholder="Coming soon..." disabled />
        <TextInput label="Y-Axis Label" placeholder="Coming soon..." disabled />
      </Stack>
    </Paper>
  );
}

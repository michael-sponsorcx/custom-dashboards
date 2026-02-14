import { Container, Center, Stack, Title, Text, Paper, ThemeIcon } from '@mantine/core';
import { IconTool } from '@tabler/icons-react';

export const MaintenanceMode = () => {
  return (
    <Container size="sm" py="xl">
      <Center h="60vh">
        <Paper shadow="md" radius="lg" p={48} withBorder>
          <Stack align="center" gap="lg">
            <ThemeIcon size={80} radius="xl" variant="light" color="orange">
              <IconTool size={40} />
            </ThemeIcon>
            <Title order={2} ta="center">
              Under Maintenance
            </Title>
            <Text size="lg" c="dimmed" ta="center" maw={400}>
              We are performing scheduled maintenance on the dashboard. Please check back shortly.
            </Text>
            <Text size="sm" c="dimmed" ta="center">
              We appreciate your patience.
            </Text>
          </Stack>
        </Paper>
      </Center>
    </Container>
  );
};

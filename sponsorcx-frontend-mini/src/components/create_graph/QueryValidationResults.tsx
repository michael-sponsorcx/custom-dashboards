import { Stack, Alert, Text } from '@mantine/core';
import { IconAlertCircle, IconCircleCheck, IconInfoCircle } from '@tabler/icons-react';
import { ValidationResult } from '../../types/cube';

interface QueryValidationResultsProps {
  validationResult: ValidationResult | null;
}

export function QueryValidationResults({ validationResult }: QueryValidationResultsProps) {
  if (!validationResult) {
    return null;
  }

  return (
    <Stack gap="sm" mt="md">
      {/* Overall Status */}
      <Alert
        icon={validationResult.valid ? <IconCircleCheck size={16} /> : <IconAlertCircle size={16} />}
        color={validationResult.valid ? 'green' : 'red'}
        title={validationResult.valid ? 'Query is Valid' : 'Query has Errors'}
      >
        {validationResult.valid
          ? 'This query follows proper GraphQL syntax and Cube rules'
          : `Found ${validationResult.errors.length} error(s)`}
      </Alert>

      {/* Errors */}
      {validationResult.errors.length > 0 && (
        <Stack gap="xs">
          {validationResult.errors.map((error, idx) => (
            <Alert key={idx} icon={<IconAlertCircle size={16} />} color="red" variant="light">
              <Text size="xs" fw={600} tt="uppercase" mb={4}>{error.type}</Text>
              <Text size="sm">{error.message}</Text>
            </Alert>
          ))}
        </Stack>
      )}

      {/* Warnings */}
      {validationResult.warnings.length > 0 && (
        <Stack gap="xs">
          {validationResult.warnings.map((warning, idx) => (
            <Alert key={idx} icon={<IconInfoCircle size={16} />} color="yellow" variant="light">
              <Text size="xs" fw={600} tt="uppercase" mb={4}>{warning.type}</Text>
              <Text size="sm">{warning.message}</Text>
            </Alert>
          ))}
        </Stack>
      )}
    </Stack>
  );
}

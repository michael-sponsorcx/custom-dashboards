import { Modal, Button, Stack, Title } from '@mantine/core';
import { FieldType, ComparisonOperator } from '../../../types/filters';
import { DimensionFilterContent } from './DimensionFilterContent';
import { MeasureFilterContent } from './MeasureFilterContent';
import { DateFilterContent } from './DateFilterContent';

interface SharedFilterModalUIProps {
  /** Whether the modal is open */
  opened: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** Title to display in the modal */
  title: string;
  /** The type of field being filtered */
  fieldType: FieldType | null;

  // Measure filter props
  measureOperator: ComparisonOperator;
  measureValue: number | string;
  onMeasureOperatorChange: (operator: ComparisonOperator) => void;
  onMeasureValueChange: (value: number | string) => void;

  // Dimension filter props
  dimensionMode: 'include' | 'exclude';
  dimensionValues: string[];
  selectedValues: Set<string>;
  loadingValues: boolean;
  loadError: string | null;
  onDimensionModeChange: (mode: 'include' | 'exclude') => void;
  onToggleValue: (value: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;

  // Date filter props
  dateOperator: ComparisonOperator;
  dateValue: string;
  onDateOperatorChange: (operator: ComparisonOperator) => void;
  onDateValueChange: (value: string) => void;

  // Action callbacks
  onApply: () => void;
  onRemove?: () => void;

  // UI state
  isValidFilter: boolean;
  hasExistingFilter: boolean;
}

/**
 * SharedFilterModalUI Component
 *
 * Pure UI component for rendering filter modals.
 * Contains no business logic - all state and handlers are passed as props.
 * Used by both CreateGraph FilterModal and Dashboard FilterModal.
 */
export function SharedFilterModalUI({
  opened,
  onClose,
  title,
  fieldType,
  measureOperator,
  measureValue,
  onMeasureOperatorChange,
  onMeasureValueChange,
  dimensionMode,
  dimensionValues,
  selectedValues,
  loadingValues,
  loadError,
  onDimensionModeChange,
  onToggleValue,
  onSelectAll,
  onDeselectAll,
  dateOperator,
  dateValue,
  onDateOperatorChange,
  onDateValueChange,
  onApply,
  onRemove,
  isValidFilter,
  hasExistingFilter,
}: SharedFilterModalUIProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Title order={4}>{title}</Title>}
      size="lg"
      centered
    >
      <Stack gap="md">
        {/* Render filter UI based on field type */}
        {fieldType === 'measure' && (
          <MeasureFilterContent
            measureOperator={measureOperator}
            measureValue={measureValue}
            onOperatorChange={onMeasureOperatorChange}
            onValueChange={onMeasureValueChange}
          />
        )}
        {fieldType === 'dimension' && (
          <DimensionFilterContent
            dimensionValues={dimensionValues}
            loadingValues={loadingValues}
            loadError={loadError}
            dimensionMode={dimensionMode}
            selectedValues={selectedValues}
            onModeChange={onDimensionModeChange}
            onToggleValue={onToggleValue}
            onSelectAll={onSelectAll}
            onDeselectAll={onDeselectAll}
          />
        )}
        {fieldType === 'date' && (
          <DateFilterContent
            dateOperator={dateOperator}
            dateValue={dateValue}
            onOperatorChange={onDateOperatorChange}
            onValueChange={onDateValueChange}
          />
        )}

        {/* Action Buttons */}
        <Stack gap="sm">
          <Button onClick={onApply} fullWidth disabled={!isValidFilter}>
            Apply Filter
          </Button>
          {hasExistingFilter && onRemove && (
            <Button onClick={onRemove} variant="outline" color="red" fullWidth>
              Remove Filter
            </Button>
          )}
          <Button onClick={onClose} variant="outline" fullWidth>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}

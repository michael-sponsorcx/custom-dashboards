import { ConditionThresholdInput } from './ConditionThresholdInput';
import type { ComparisonOperator } from '../../../types/kpi-alerts';

/**
 * ThresholdAlertDetails Component
 *
 * Alert detail fields specific to the "threshold" alert type.
 * Used when the alert type is "KPI crosses a set limit".
 *
 * Fields:
 * - Condition: Comparison operator (greater than, less than, etc.)
 * - Threshold Value: The value to compare against
 */

interface ThresholdAlertDetailsProps {
  /** Current condition value */
  condition?: string;
  /** Current threshold value */
  thresholdValue?: string;
  /** Callback when condition changes */
  onConditionChange?: (condition: ComparisonOperator) => void;
  /** Callback when threshold value changes */
  onThresholdValueChange?: (value: string) => void;
}

export const ThresholdAlertDetails = ({
  condition,
  thresholdValue,
  onConditionChange,
  onThresholdValueChange
}: ThresholdAlertDetailsProps) => {
  return (
    <ConditionThresholdInput
      condition={condition}
      thresholdValue={thresholdValue}
      onConditionChange={onConditionChange}
      onThresholdValueChange={onThresholdValueChange}
    />
  );
}

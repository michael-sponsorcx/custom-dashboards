import { Group, Button } from '@mantine/core';
import type { DayOfWeek } from '../../../types/schedule-common';

interface DaySelectorProps {
  selectedDays: DayOfWeek[];
  onChange: (days: DayOfWeek[]) => void;
}

const DAYS: Array<{ value: DayOfWeek; label: string }> = [
  { value: 'M', label: 'M' },
  { value: 'T', label: 'T' },
  { value: 'W', label: 'W' },
  { value: 'Th', label: 'Th' },
  { value: 'F', label: 'F' },
  { value: 'S', label: 'S' },
  { value: 'Su', label: 'Su' },
];

/**
 * DaySelector Component
 *
 * Allows users to select multiple days of the week.
 * Displays buttons for M, T, W, Th, F, S, Su.
 */
export const DaySelector = ({ selectedDays, onChange }: DaySelectorProps) => {
  const handleDayToggle = (day: DayOfWeek) => {
    if (selectedDays.includes(day)) {
      onChange(selectedDays.filter((d) => d !== day));
    } else {
      onChange([...selectedDays, day]);
    }
  };

  return (
    <Group gap="xs">
      {DAYS.map((day) => (
        <Button
          key={day.value}
          variant={selectedDays.includes(day.value) ? 'filled' : 'outline'}
          size="sm"
          onClick={() => handleDayToggle(day.value)}
          style={{ width: 45 }}
        >
          {day.label}
        </Button>
      ))}
    </Group>
  );
};

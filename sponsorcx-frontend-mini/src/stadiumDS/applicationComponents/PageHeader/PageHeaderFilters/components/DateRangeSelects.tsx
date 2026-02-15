import Calendar from '@/stadiumDS/foundations/icons/Time/Calendar';
import { Box, Stack } from '@mantine/core';
import { DateInput, DateInputProps } from '@mantine/dates';
import { DateRangeFilterValueType } from '../PageHeaderFilters.type';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

interface DateRangeSelectsProps {
    value: DateRangeFilterValueType;
    onChange: (value: DateRangeFilterValueType) => void;
    minLabel?: string;
    maxLabel?: string;
}

export function DateRangeSelects({
    value,
    onChange,
    minLabel = 'Start Date',
    maxLabel = 'End Date',
}: DateRangeSelectsProps) {
    const date1Value = value?.[0] || '';
    const date2Value = value?.[1] || '';

    const date1AsDate = date1Value
        ? dayjs(date1Value, 'YYYY-MM-DD').toDate()
        : null;
    const date2AsDate = date2Value
        ? dayjs(date2Value, 'YYYY-MM-DD').toDate()
        : null;

    const handleStartDateChange = (date: string | null) => {
        onChange([date ? date : '', date2Value ? date2Value : '']);
    };

    const handleEndDateChange = (date: string | null) => {
        onChange([date1Value ? date1Value : '', date ? date : '']);
    };

    return (
        <Box>
            <Stack gap="xs">
                <Box style={{ display: 'flex', gap: '1rem' }}>
                    <Box style={{ flex: 1 }}>
                        <DateInput
                            label={minLabel}
                            placeholder="Select date"
                            value={date1AsDate}
                            onChange={handleStartDateChange}
                            clearable
                            style={{ width: '100%' }}
                            rightSection={
                                date1AsDate ? undefined : <Calendar />
                            }
                            rightSectionPointerEvents={
                                date1AsDate ? undefined : 'none'
                            }
                        />
                    </Box>
                    <Box style={{ flex: 1 }}>
                        <DateInput
                            label={maxLabel}
                            placeholder="Select date"
                            value={date2AsDate}
                            onChange={handleEndDateChange}
                            clearable
                            style={{ width: '100%' }}
                            minDate={date1AsDate || undefined}
                            rightSection={
                                date2AsDate ? undefined : <Calendar />
                            }
                            rightSectionPointerEvents={
                                date2AsDate ? undefined : 'none'
                            }
                        />
                    </Box>
                </Box>
            </Stack>
        </Box>
    );
}

import { RangeSlider, Stack, Text } from '@mantine/core';
import { FilterValueType, PageHeaderFilter } from '../PageHeaderFilters.type';
import colors from '@/stadiumDS/foundations/colors';
import { useEffect, useState } from 'react';

interface FilterRangeSliderProps {
    filter: PageHeaderFilter & { type: 'range' };
    updateFilters: (updatedParams: Record<string, FilterValueType>) => void;
}

export const FilterRangeSlider = ({
    filter,
    updateFilters,
}: FilterRangeSliderProps) => {
    const [value, setValue] = useState<[number, number]>([
        filter.defaultValue[0] ?? filter.minValue,
        filter.defaultValue[1] ?? filter.maxValue,
    ]);

    useEffect(() => {
        setValue([
            filter.defaultValue[0] ?? filter.minValue,
            filter.defaultValue[1] ?? filter.maxValue,
        ]);
    }, [filter.defaultValue, filter.minValue, filter.maxValue]);

    return (
        <Stack gap={0}>
            <Text size="md" fw={500} c={colors.Gray[700]} lh="20px">
                {filter.label}
            </Text>
            <RangeSlider
                key={filter.key}
                min={filter.minValue}
                max={filter.maxValue}
                value={value}
                onChange={(value) => {
                    setValue(value);
                }}
                onChangeEnd={(value) => {
                    const newValue: [number | null, number | null] = [
                        value[0],
                        value[1],
                    ];
                    if (newValue[0] === filter.minValue) {
                        newValue[0] = null;
                    }
                    if (newValue[1] === filter.maxValue) {
                        newValue[1] = null;
                    }
                    updateFilters({
                        [filter.key]: newValue,
                    });
                }}
                label={filter.numberLabel}
                minRange={filter.minRange || 10}
                scale={filter.numberScale}
            />
        </Stack>
    );
};

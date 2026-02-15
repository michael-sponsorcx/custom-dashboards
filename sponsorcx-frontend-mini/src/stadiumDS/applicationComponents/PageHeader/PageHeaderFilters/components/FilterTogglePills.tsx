import { Text, Button, Group, Stack, Space } from '@mantine/core';
import { deleteOrAdd } from '@/utils/helpers';
import { TogglePillOption } from '../PageHeaderFilters.type';
import colors from '@/stadiumDS/foundations/colors';

interface FilterTogglePillsProps {
    options: TogglePillOption[];
    value: string[];
    onChange: (newValue: string[]) => void;
    multiSelect?: boolean;
    label: string;
    subLabel?: string;
    includeAllOption?: boolean;
}

export const FilterTogglePills = ({
    options,
    value,
    onChange,
    multiSelect = false,
    label,
    subLabel,
    includeAllOption = true,
}: FilterTogglePillsProps) => {
    return (
        <Stack gap={0}>
            <Text size="md" fw={500} c={colors.Gray[700]} lh="20px">
                {label}
            </Text>
            {subLabel && (
                <Text size="md" fw={400} c={colors.Gray[500]} lh="20px">
                    {subLabel}
                </Text>
            )}
            <Space h={14} />
            <Group gap="xs" wrap="wrap" mb="xs">
                {includeAllOption && (
                    <Button
                        variant={value.length === 0 ? 'filled' : 'outline'}
                        onClick={() => onChange([])}
                        bg={value.length === 0 ? undefined : colors.Gray[200]}
                    >
                        All
                    </Button>
                )}
                {options.map((option) => {
                    const isSelected = value?.includes(option.value);
                    return (
                        <Button
                            key={option.value}
                            variant={isSelected ? 'filled' : 'outline'}
                            styles={{
                                root: {
                                    fontSize: '14px',
                                    lineHeight: '20px',
                                },
                            }}
                            bg={isSelected ? undefined : colors.Gray[200]}
                            onClick={() => {
                                if (multiSelect) {
                                    const newValues = deleteOrAdd(
                                        value,
                                        option.value
                                    );

                                    onChange(newValues);
                                } else {
                                    const newValues = [option.value];
                                    onChange(newValues);
                                }
                            }}
                        >
                            {option.label}
                        </Button>
                    );
                })}
            </Group>
        </Stack>
    );
};

import RequiredIndicator from '@/components/RequiredIndicator';
import { primaryColors } from '@/stadiumDS/foundations/colors/primary';
import HelpCircle from '@/stadiumDS/foundations/icons/General/HelpCircle';
import {
    Box,
    ComboboxItem,
    Group,
    Select,
    SelectProps,
    Tooltip,
} from '@mantine/core';
import { useHistory } from 'react-router-dom';

interface StadiumSelectProps extends SelectProps {
    linkOption?: {
        url: string;
        label: string;
    };
    tooltip?: string;
}

export const StadiumSelect = ({
    linkOption,
    data,
    onChange,
    tooltip,
    ...mantineSelectProps
}: StadiumSelectProps) => {
    const selectOptions = linkOption
        ? [...(data ?? []), { value: '#link', label: linkOption.label }]
        : data ?? [];

    const history = useHistory();

    const handleOptionChange = (value: string | null, _: ComboboxItem) => {
        if (value === '#link' && linkOption) {
            history.push(linkOption.url);
        } else {
            onChange?.(value, _);
        }
    };
    return (
        <Select
            {...mantineSelectProps}
            data={
                selectOptions.length > 0
                    ? selectOptions
                    : [
                          {
                              value: 'no-items',
                              label: 'No items found',
                              disabled: true,
                          },
                      ]
            }
            onChange={handleOptionChange}
            label={
                tooltip ? (
                    <Group gap="4px">
                        {mantineSelectProps.label}
                        {mantineSelectProps.required ? (
                            <RequiredIndicator
                                color={primaryColors.Brand[400]}
                            />
                        ) : null}
                        <Tooltip
                            label={tooltip}
                            withinPortal={false}
                            openDelay={300}
                        >
                            <Box display="inline-flex">
                                <HelpCircle color={primaryColors.Gray[500]} />
                            </Box>
                        </Tooltip>
                    </Group>
                ) : (
                    mantineSelectProps.label
                )
            }
            labelProps={{
                ...mantineSelectProps.labelProps,
                required: tooltip ? false : mantineSelectProps.required, //* this is a workaround to hide the required indicator when tooltip is present
            }}
        />
    );
};

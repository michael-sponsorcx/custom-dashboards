import { primaryColors } from '@/stadiumDS/foundations/colors/primary';
import { Radio } from '@mantine/core';

interface RadioButtonProps {
    value: string;
    label: string;
    checked: boolean;
    onChange: () => void;
}

export const RadioButton = ({
    value,
    label,
    checked,
    onChange,
}: RadioButtonProps) => {
    return (
        <Radio
            value={value}
            label={label}
            checked={checked}
            onChange={onChange}
            color={primaryColors.Brand[400]}
            styles={{
                label: {
                    color: primaryColors.Gray[700],
                    fontWeight: 500,
                    fontSize: 14,
                    fontFamily: 'Inter',
                    paddingLeft: 8,
                },
                radio: {
                    width: 16,
                    height: 16,
                    border: `1px solid ${
                        checked
                            ? primaryColors.Brand[400]
                            : primaryColors.Gray[300]
                    }`,
                },
                icon: {
                    width: 6,
                    height: 6,
                },
            }}
        />
    );
};

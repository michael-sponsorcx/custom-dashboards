import {
    Switch as MantineSwitch,
    SwitchProps as MantineSwitchProps,
} from '@mantine/core';
import { primaryColors } from '@/stadiumDS/foundations/colors/primary';

export type SwitchProps = MantineSwitchProps;

export const Switch = ({ styles, ...props }: SwitchProps) => (
    <MantineSwitch
        color={primaryColors.Brand[400]}
        styles={(theme, params, ctx) => ({
            label: {
                color: primaryColors.Gray[500],
                fontFamily: 'Inter',
                fontSize: '14px',
                fontStyle: 'normal',
                fontWeight: '600',
                lineHeight: '20px',
            },
            ...(typeof styles === 'function'
                ? styles(theme, params, ctx)
                : styles),
        })}
        {...props}
    />
);

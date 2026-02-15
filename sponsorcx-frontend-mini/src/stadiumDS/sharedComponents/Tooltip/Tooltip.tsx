import {
    Tooltip as MantineTooltip,
    TooltipProps as MantineTooltipProps,
} from '@mantine/core';
import { primaryColors } from '@/stadiumDS/foundations/colors/primary';
import styled from 'styled-components';

interface TooltipProps extends MantineTooltipProps {
    label: string | React.ReactNode;
    children: React.ReactNode;
}

export const Tooltip = ({ label, children, ...props }: TooltipProps) => (
    <MantineTooltip
        label={label}
        styles={{
            tooltip: {
                color: primaryColors.Gray[900],
                fontSize: '12px',
                fontWeight: '500',
                fontFamily: 'Inter',
                lineHeight: '18px',
                textAlign: 'center',
                borderRadius: '8px',
                border: `1px solid ${primaryColors.Gray[200]}`,
                backgroundColor: primaryColors.Base.White,
                boxShadow:
                    '0px 12px 16px -4px rgba(10, 13, 18, 0.08), 0px 4px 6px -2px rgba(10, 13, 18, 0.03), 0px 2px 2px -1px rgba(10, 13, 18, 0.04)',
            },
        }}
        {...props}
    >
        {children}
    </MantineTooltip>
);

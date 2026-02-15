import { Badge, MantineSize } from '@mantine/core';
import { ColorScheme } from '../foundations/colors/colors.types';
import { ReactNode } from 'react';
import colors from '../foundations/colors';

export interface StadiumTagProps {
    colorScheme?: ColorScheme;
    label: ReactNode;
    overrides?: {
        backgroundColor?: string;
        color?: string;
        borderColor?: string;
    };
    size?: MantineSize;
}

export const StadiumTag = ({
    colorScheme = colors.Gray,
    label,
    overrides,
    size,
}: StadiumTagProps) => {
    return (
        <Badge
            style={{
                backgroundColor:
                    overrides?.backgroundColor ?? colorScheme?.[50],
                color: overrides?.color ?? colorScheme?.[700],
                borderColor: overrides?.borderColor ?? colorScheme?.[200],
                textTransform: 'none',
                fontWeight: 500,
            }}
            size={size}
        >
            {label}
        </Badge>
    );
};

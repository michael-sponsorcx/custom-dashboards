import { Badge, BadgeProps } from '@mantine/core';
import colors from '../foundations/colors';
import { CSSProperties } from 'react';

const badgeStyles: Record<string, CSSProperties> = {
    root: {
        borderRadius: '6px',
        border: `1px solid ${colors.Gray[300]}`,
    },
    label: {
        fontWeight: 500,
        color: colors.Gray[700],
        textTransform: 'none',
    },
};

interface TagProps {
    children: React.ReactNode;
    size?: BadgeProps['size'];
}

export const Tag = ({ children, size = 'lg' }: TagProps) => {
    return (
        <Badge variant="outline" radius="md" size={size} styles={badgeStyles}>
            {children}
        </Badge>
    );
};

export default Tag;

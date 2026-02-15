import { Group, Text, Tooltip } from '@mantine/core';
import { CSSProperties, ReactNode } from 'react';
import HeaderClasses from '../SidePanelSectionHeader.module.css';

interface SidePanelFieldValueProps {
    value: string;
    icon?: ReactNode;
    tooltip?: string;
    textStyle?: CSSProperties;
    onClick?: () => void;
}

export const SidePanelFieldValue = ({
    value,
    icon,
    tooltip,
    textStyle,
    onClick,
}: SidePanelFieldValueProps) => {
    return (
        <Tooltip label={tooltip} disabled={!tooltip}>
            <Group
                wrap="nowrap"
                style={{ gap: '8px' }}
                onClick={onClick}
                className={onClick ? HeaderClasses.headerLink : undefined}
            >
                {icon}
                <Text truncate style={textStyle}>
                    {value}
                </Text>
            </Group>
        </Tooltip>
    );
};

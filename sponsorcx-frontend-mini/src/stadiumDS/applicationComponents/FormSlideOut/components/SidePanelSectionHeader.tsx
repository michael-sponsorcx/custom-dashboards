import colors from '@/stadiumDS/foundations/colors';
import HelpCircle from '@/stadiumDS/foundations/icons/General/HelpCircle';
import { Group, Text } from '@mantine/core';
import { ReactNode } from 'react';
import HeaderClasses from './SidePanelSectionHeader.module.css';
import { Tooltip } from '@/stadiumDS/sharedComponents/Tooltip';

export interface SidePanelSectionHeaderProps {
    title: string;
    info?: string;
    icon?: ReactNode;
    onClick?: () => void;
}

export const SidePanelSectionHeader = ({
    title,
    info,
    icon,
    onClick,
}: SidePanelSectionHeaderProps) => {
    return (
        <Group gap="8px">
            <Group
                gap="8px"
                onClick={onClick}
                className={
                    onClick ? HeaderClasses.headerLink : HeaderClasses.header
                }
            >
                {icon}
                <Text>{title}</Text>
            </Group>
            {info && (
                <Tooltip label={info} withinPortal={false}>
                    <span
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                        }}
                    >
                        <HelpCircle color={colors.Gray[300]} size="16" />
                    </span>
                </Tooltip>
            )}
        </Group>
    );
};

import { Divider, Group, Stack } from '@mantine/core';
import { PropsWithChildren } from 'react';
import {
    SidePanelSectionHeader,
    SidePanelSectionHeaderProps,
} from './SidePanelSectionHeader';

interface SidePanelSectionProps {
    header?: SidePanelSectionHeaderProps;
    secondaryHeader?: SidePanelSectionHeaderProps;
}

export const SidePanelSection = ({
    header,
    secondaryHeader,
    children,
}: PropsWithChildren<SidePanelSectionProps>) => {
    return (
        <Stack w="100%" style={{ gap: '24px', flexShrink: 0 }}>
            {header && secondaryHeader ? (
                <Group gap="8px" w="100%">
                    <Group w="50%">
                        <SidePanelSectionHeader {...header} />
                    </Group>
                    <Group w="calc(50% - 8px)">
                        <SidePanelSectionHeader {...secondaryHeader} />
                    </Group>
                </Group>
            ) : header || secondaryHeader ? (
                <SidePanelSectionHeader
                    {...((header ||
                        secondaryHeader) as SidePanelSectionHeaderProps)}
                />
            ) : null}
            {children}
            <Divider />
        </Stack>
    );
};

import { Group, Stack } from '@mantine/core';
import { ReactNode } from 'react';

interface SidePanelFieldContainerProps {
    groupedChildren: ReactNode;
    stackedChildren?: ReactNode;
}

export const SidePanelFieldContainer = ({
    groupedChildren,
    stackedChildren,
}: SidePanelFieldContainerProps) => {
    return (
        <Stack style={{ gap: '4px', maxWidth: '100%', overflow: 'hidden' }}>
            <Group
                justify="space-between"
                style={{ gap: '8px', maxWidth: '100%', overflow: 'hidden' }}
                wrap="nowrap"
            >
                {groupedChildren}
            </Group>
            {stackedChildren}
        </Stack>
    );
};

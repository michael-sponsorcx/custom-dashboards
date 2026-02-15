import { Group, Stack, Text } from '@mantine/core';
import { PropsWithChildren, ReactNode } from 'react';

interface MainPanelSectionProps {
    title?: string | ReactNode;
    extraHeaderContent?: ReactNode;
    minHeight?: string;
}

export const MainPanelSection = ({
    title,
    extraHeaderContent,
    children,
    minHeight,
}: PropsWithChildren<MainPanelSectionProps>) => {
    return (
        <Stack
            gap="16px"
            w="100%"
            style={{
                minHeight,
                flexShrink: 0,
            }}
        >
            {title || extraHeaderContent ? (
                <Group justify="space-between" w="100%">
                    {title ? (
                        <Text fw={700} style={{ fontSize: '16px' }}>
                            {title}
                        </Text>
                    ) : null}
                    {extraHeaderContent}
                </Group>
            ) : null}
            {children}
        </Stack>
    );
};

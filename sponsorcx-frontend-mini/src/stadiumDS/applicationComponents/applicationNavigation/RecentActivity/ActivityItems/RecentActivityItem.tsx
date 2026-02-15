import colors from '@/stadiumDS/foundations/colors';
import { Flex, Menu, Text, Tooltip } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

interface RecentActivityItemProps {
    label: string;
    icon: ({ color, size }: { color: string; size: string }) => React.ReactNode;
    path: string;
}

export const RecentActivityItem = ({
    label,
    icon,
    path,
}: RecentActivityItemProps) => {
    const history = useHistory();
    const textRef = useRef<HTMLDivElement>(null);
    const [shouldTruncate, setShouldTruncate] = useState(false);

    useEffect(() => {
        if (textRef.current) {
            setShouldTruncate(textRef.current.scrollWidth >= 130);
        }
    }, [textRef.current]);

    return (
        <Menu.Item
            onClick={() => {
                history.push(path);
            }}
        >
            <Flex gap="8px" align="center">
                {icon({ color: colors.Gray[400], size: '16' })}
                <Tooltip label={label} disabled={!shouldTruncate}>
                    <Text
                        ref={textRef}
                        c={colors.Gray[600]}
                        fw={600}
                        truncate
                        style={{
                            maxWidth: '130px',
                        }}
                    >
                        {label}
                    </Text>
                </Tooltip>
            </Flex>
        </Menu.Item>
    );
};

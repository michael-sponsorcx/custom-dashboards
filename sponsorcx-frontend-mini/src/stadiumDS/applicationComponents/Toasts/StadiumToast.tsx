import colors from '@/stadiumDS/foundations/colors';
import X from '@/stadiumDS/foundations/icons/General/X';
import { HoverIcon } from '@/stadiumDS/foundations/icons/IconHelpers/HoverIcon';
import { Flex, Text, UnstyledButton } from '@mantine/core';
import { ReactNode } from 'react';

export interface StadiumToastProps {
    message: ReactNode;
    icon: JSX.Element;
    colorMap: Record<number, string>;
    extraContent?: JSX.Element;
    closeToast: () => void;
}

export const StadiumToast = ({
    message,
    icon,
    colorMap,
    extraContent,
    closeToast,
}: StadiumToastProps) => {
    return (
        <Flex
            align="flex-start"
            gap="16px"
            style={{
                width: '100%',
                borderRadius: '12px',
                backgroundColor: colorMap[50],
                border: `1px solid ${colorMap[300]}`,
                padding: '16px',
                boxShadow: '0px 1px 2px 0px rgba(10, 13, 18, 0.05)',
            }}
        >
            <Flex
                align="center"
                justify="center"
                style={{
                    position: 'relative',
                }}
            >
                {icon}
                <Flex
                    align="center"
                    justify="center"
                    style={{
                        position: 'absolute',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        border: `2px solid ${colorMap[100]}`,
                        flexShrink: 0,
                    }}
                >
                    <Flex
                        align="center"
                        justify="center"
                        style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            border: `2px solid ${colorMap[200]}`,
                            flexShrink: 0,
                        }}
                    ></Flex>
                </Flex>
            </Flex>
            <Flex direction="column" gap="12px">
                <Text fw={600} c={colors.Gray[700]}>
                    {message}
                </Text>
                {extraContent}
            </Flex>
            <UnstyledButton
                onClick={closeToast}
                style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                }}
            >
                <HoverIcon
                    icon={<X size="20" color={colors.Gray[400]} />}
                    hoverColor={colors.Gray[600]}
                />
            </UnstyledButton>
        </Flex>
    );
};

import 'styled-components/macro';
import { SettingsCardBodyItemLabel } from './label';
import { Flex, Text } from '@mantine/core';
import colors from '@/stadiumDS/foundations/colors';

interface SettingsCardBodyItemProps {
    label: string;
    subLabel?: string;
    children: React.ReactNode;
    labelWidth?: string;
    icon?: React.ReactNode;
}

export const SettingsCardBodyItem = ({
    label,
    subLabel,
    children,
    labelWidth = '25%',
    icon,
}: SettingsCardBodyItemProps): JSX.Element => {
    return (
        <div
            css={`
                display: flex;
                flex-direction: row;
                gap: 32px;
                align-items: flex-start;
            `}
        >
            <Flex align="center" gap="16px" style={{ width: labelWidth }}>
                {icon && icon}
                <Flex direction="column">
                    <SettingsCardBodyItemLabel label={label} />
                    {subLabel && (
                        <Text fz={16} c={colors.Gray[600]}>
                            {subLabel}
                        </Text>
                    )}
                </Flex>
            </Flex>
            <div
                css={`
                    display: flex;
                    flex: 1 0 0;
                    max-width: 512px;
                `}
            >
                {children}
            </div>
        </div>
    );
};

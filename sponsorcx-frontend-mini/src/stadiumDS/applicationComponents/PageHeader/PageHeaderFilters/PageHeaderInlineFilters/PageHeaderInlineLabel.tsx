import colors from '@/stadiumDS/foundations/colors';
import Chevron from '@/stadiumDS/foundations/icons/Arrows/Chevron';
import { Flex, Text, UnstyledButton } from '@mantine/core';
import classNames from './PageHeaderInlineLabel.module.css';
import X from '@/stadiumDS/foundations/icons/General/X';
import { HoverIcon } from '@/stadiumDS/foundations/icons/IconHelpers/HoverIcon';
import { Tooltip } from '@/stadiumDS/sharedComponents/Tooltip';

interface PageHeaderInlineLabelProps {
    label: string;
    amountSelected?: number;
    selected?: boolean;
    onClear: () => void;
    tooltipLabel: string;
    clearable?: boolean;
}

export const PageHeaderInlineLabel = ({
    label,
    amountSelected,
    selected,
    onClear,
    tooltipLabel,
    clearable = true,
}: PageHeaderInlineLabelProps) => {
    const active = (amountSelected && amountSelected > 0) || selected;

    return (
        <Tooltip
            label={tooltipLabel}
            openDelay={300}
            multiline
            maw="300px"
            disabled={!active || !clearable}
        >
            <Flex
                gap="8px"
                align="center"
                classNames={classNames}
                data-active={active && clearable}
            >
                <Text
                    fw={500}
                    c={colors.Gray[700]}
                    style={{
                        fontSize: '12px',
                        lineHeight: '20px',
                    }}
                >
                    {amountSelected && amountSelected > 0
                        ? `(${amountSelected}) ${label}`
                        : clearable
                        ? label
                        : tooltipLabel}
                </Text>
                <Chevron variant="down" color={colors.Gray[400]} size="18px" />
                {active && clearable ? (
                    <UnstyledButton
                        style={{ height: '20px' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onClear();
                        }}
                    >
                        <HoverIcon
                            icon={<X color={colors.Gray[400]} size="18px" />}
                            hoverColor={colors.Gray[500]}
                        />
                    </UnstyledButton>
                ) : null}
            </Flex>
        </Tooltip>
    );
};

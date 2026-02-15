import { ActionIcon, Flex, Menu, Tooltip } from '@mantine/core';
import Dots from '@/stadiumDS/foundations/icons/General/Dots';

export interface ThreeDotMenuOption {
    key: string;
    label: string;
    disabled?: boolean;
    onClick?: () => void;
    icon?: React.ReactNode;
    children?: ThreeDotMenuOption[];
}

interface ThreeDotMenuProps {
    options: ThreeDotMenuOption[];
    withinPortal?: boolean;
    disableTooltip?: boolean;
}

const ThreeDotMenu = ({
    options,
    withinPortal,
    disableTooltip,
}: ThreeDotMenuProps): JSX.Element => {
    return (
        <Menu withinPortal={withinPortal}>
            <Tooltip
                label="Menu"
                disabled={disableTooltip}
                withinPortal={withinPortal}
            >
                <Menu.Target>
                    <ActionIcon
                        variant="subtle"
                        size="lg"
                        data-testid="page-header-three-dot-menu"
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    >
                        <Dots variant="vertical" />
                    </ActionIcon>
                </Menu.Target>
            </Tooltip>
            <Menu.Dropdown>
                {options.map((option) =>
                    option.children?.length ? (
                        <Menu.Sub key={option.key}>
                            <Menu.Sub.Target>
                                <Menu.Sub.Item
                                    key={option.key}
                                    onClick={(e: React.MouseEvent) => {
                                        e.stopPropagation();
                                        option.onClick?.();
                                    }}
                                    disabled={option.disabled}
                                >
                                    <Flex gap={8} align="center">
                                        {option.icon && option.icon}
                                        {option.label}
                                    </Flex>
                                </Menu.Sub.Item>
                            </Menu.Sub.Target>
                            <Menu.Sub.Dropdown>
                                {option.children.map((child) => (
                                    <Menu.Item
                                        key={child.key}
                                        onClick={(e: React.MouseEvent) => {
                                            e.stopPropagation();
                                            child.onClick?.();
                                        }}
                                    >
                                        <Flex gap={8} align="center">
                                            {child.icon && child.icon}
                                            {child.label}
                                        </Flex>
                                    </Menu.Item>
                                ))}
                            </Menu.Sub.Dropdown>
                        </Menu.Sub>
                    ) : (
                        <Menu.Item
                            key={option.key}
                            onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                option.onClick?.();
                            }}
                            disabled={option.disabled}
                        >
                            <Flex gap={8} align="center">
                                {option.icon && option.icon}
                                {option.label}
                            </Flex>
                        </Menu.Item>
                    )
                )}
            </Menu.Dropdown>
        </Menu>
    );
};

export default ThreeDotMenu;

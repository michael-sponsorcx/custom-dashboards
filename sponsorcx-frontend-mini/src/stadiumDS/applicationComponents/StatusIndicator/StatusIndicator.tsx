import { primaryColors } from '@/stadiumDS/foundations/colors/primary';
import { Menu, UnstyledButton } from '@mantine/core';
import { cloneElement, ReactElement } from 'react';

export interface StatusIcon {
    name: string;
    component: ReactElement;
}

export interface StatusIconMap<T extends string> {
    [key: string]: StatusIcon;
}

interface StatusIndicatorProps<T extends string> {
    status: T;
    statusIcons: StatusIconMap<T>;
    updateStatus: (status: T) => void;
    zIndex?: number;
    showLabel?: boolean;
    withinPortal?: boolean;
    isDisabled?: boolean;
    labelColor?: string;
    onMenuOpen?: () => void;
    onMenuClose?: () => void;
}

export const StatusIndicator = <T extends string>({
    status,
    statusIcons,
    updateStatus,
    zIndex,
    showLabel = false,
    withinPortal = true,
    isDisabled = false,
    labelColor,
    onMenuOpen,
    onMenuClose,
}: StatusIndicatorProps<T>) => {
    const statusComponent = statusIcons[status]?.component;

    if (!statusComponent) {
        console.error(`Component for status ${status} not found`); // eslint-disable-line no-console
        return null;
    }

    const handleStatusClick = (clickedStatus: T) => {
        if (clickedStatus !== status) {
            updateStatus(clickedStatus);
        }
    };

    return (
        <Menu
            shadow="md"
            width={200}
            position="bottom-start"
            withArrow
            zIndex={zIndex}
            withinPortal={withinPortal}
            disabled={isDisabled}
            onOpen={onMenuOpen}
            onClose={onMenuClose}
        >
            <Menu.Target>
                <UnstyledButton
                    styles={{
                        root: {
                            textWrap: 'nowrap',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            borderRadius: '6px',
                            transition: 'all 0.25s ease',
                            color: labelColor || primaryColors.Gray[950],
                            fontFamily: 'Inter',
                            fontSize: '14px',
                            fontStyle: 'normal',
                            fontWeight: '400',
                            lineHeight: '20px',
                            cursor: isDisabled ? 'not-allowed' : 'pointer',
                        },
                    }}
                >
                    {statusComponent}
                    {showLabel && statusIcons[status]?.name}
                </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label>Change Status</Menu.Label>
                {Object.entries(statusIcons).map(([statusKey, statusValue]) => (
                    <Menu.Item
                        key={statusKey}
                        onClick={() => handleStatusClick(statusKey as T)}
                        leftSection={cloneElement(
                            statusValue.component as ReactElement,
                            { size: '18' }
                        )}
                    >
                        {statusValue.name}
                    </Menu.Item>
                ))}
            </Menu.Dropdown>
        </Menu>
    );
};

import { Button, Tooltip } from '@mantine/core';
import viewToggleClasses from './ViewToggle.module.css';

export interface ViewToggleItem {
    key: string;
    tooltip: string;
    onClick: () => void;
    isActive: boolean;
    children: React.ReactNode;
}

interface ViewToggleProps {
    items: ViewToggleItem[];
}

export const ViewToggle = ({ items }: ViewToggleProps) => {
    return (
        <Button.Group>
            {items.map((item) => (
                <Tooltip key={item.key} label={item.tooltip}>
                    <Button
                        variant="default"
                        onClick={item.onClick}
                        data-active={item.isActive}
                        classNames={viewToggleClasses}
                    >
                        {item.children}
                    </Button>
                </Tooltip>
            ))}
        </Button.Group>
    );
};

export default ViewToggle;

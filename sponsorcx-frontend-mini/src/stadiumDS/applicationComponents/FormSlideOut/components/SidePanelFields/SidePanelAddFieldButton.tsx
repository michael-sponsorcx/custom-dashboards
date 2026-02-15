import Plus from '@/stadiumDS/foundations/icons/General/Plus';
import { ActionIcon } from '@mantine/core';
import { forwardRef } from 'react';
import { sidePanelFieldPlaceholderColor } from './SidePanelFields.types';

interface SidePanelAddFieldButtonProps {
    onClick?: () => void;
}

export const SidePanelAddFieldButton = forwardRef<
    HTMLButtonElement,
    SidePanelAddFieldButtonProps
>(({ onClick }, ref) => {
    return (
        <ActionIcon
            ref={ref}
            onClick={onClick}
            style={{
                border: `1px dashed ${sidePanelFieldPlaceholderColor}`,
                borderRadius: '16px',
                minWidth: '21px',
                minHeight: '21px',
                width: '21px',
                height: '21px',
            }}
        >
            <Plus size="14" color={sidePanelFieldPlaceholderColor} />
        </ActionIcon>
    );
});

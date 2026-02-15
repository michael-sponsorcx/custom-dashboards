import { useState } from 'react';
import { StadiumPopover } from '../StadiumPopover/StadiumPopover';
import { FloatingPosition } from '@mantine/core';

interface StadiumConfirmActionPopupProps {
    onConfirm: () => void;
    onCancel?: () => void;
    getTrigger: (
        setOpen: (open: boolean) => void,
        open: boolean
    ) => JSX.Element;
    title?: string;
    description?: React.ReactNode;
    confirmButtonText?: string;
    cancelButtonText?: string;
    stopPropagation?: boolean;
    danger?: boolean;
    withinPortal?: boolean;
    zIndex?: number | string;
    position?: FloatingPosition;
    preHeaderContent?: React.ReactNode;
}

export const StadiumConfirmActionPopup = ({
    onConfirm,
    onCancel,
    getTrigger,
    title,
    description,
    confirmButtonText = 'Confirm',
    cancelButtonText = 'Cancel',
    stopPropagation = false,
    danger = true,
    withinPortal = false,
    zIndex,
    position,
    preHeaderContent,
}: StadiumConfirmActionPopupProps) => {
    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
        onCancel?.();
    };

    const handleConfirm = (e: React.MouseEvent) => {
        if (stopPropagation) {
            e.stopPropagation();
        }

        onConfirm();
        setOpen(false);
    };

    return (
        <StadiumPopover
            header={{
                title,
                description,
                preHeaderContent,
            }}
            primaryButton={{
                onClick: handleConfirm,
                text: confirmButtonText,
                variant: danger ? 'danger' : 'primary',
            }}
            secondaryButton={{
                onClick: (e) => {
                    if (stopPropagation) {
                        e.stopPropagation();
                    }
                    handleClose();
                },
                text: cancelButtonText,
            }}
            open={open}
            trigger={getTrigger(setOpen, open)}
            onClose={handleClose}
            padding="24px"
            stopPropagation={stopPropagation}
            withinPortal={withinPortal}
            zIndex={zIndex}
            position={position}
        />
    );
};

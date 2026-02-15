import { StadiumModal } from '../StadiumModal/StadiumModal';

interface StadiumConfirmActionModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    onCancel?: () => void;
    title?: string;
    description?: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    stopPropagation?: boolean;
    dangerConfirmButton?: boolean;
    loadingMutation?: boolean;
}

export const StadiumConfirmActionModal = ({
    open,
    onClose,
    onConfirm,
    onCancel = onClose,
    title = 'Are you sure?',
    description,
    confirmButtonText = 'Confirm',
    cancelButtonText = 'Cancel',
    stopPropagation = false,
    dangerConfirmButton = false,
    loadingMutation = false,
}: StadiumConfirmActionModalProps) => {
    return (
        <StadiumModal
            header={{
                title,
                description,
            }}
            primaryButton={{
                onClick: onConfirm,
                text: confirmButtonText,
                variant: dangerConfirmButton ? 'danger' : 'primary',
            }}
            secondaryButton={{
                onClick: (e) => {
                    if (stopPropagation) {
                        e.stopPropagation();
                    }
                    onCancel();
                },
                text: cancelButtonText,
            }}
            open={open}
            onClose={onClose}
            padding="24px"
            loadingMutation={loadingMutation}
        />
    );
};

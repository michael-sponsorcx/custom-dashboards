import { Modal, ModalProps } from '@mantine/core';
import { ModalForm, ModalFormProps } from '../ModalForm/ModalForm';
import classes from './StadiumModal.module.css';

interface StadiumModalProps extends ModalFormProps {
    open: boolean;
    onClose: () => void;
    size?: string;
    zIndex?: number | string;
    mantineModalProps?: Omit<
        ModalProps,
        'opened' | 'onClose' | 'size' | 'classNames' | 'withinPortal' | 'zIndex'
    >;
    loadingMutation?: boolean;
}

export const StadiumModal = ({
    open,
    onClose,
    size = 'md',
    zIndex,
    mantineModalProps,
    loadingMutation = false,
    ...props
}: StadiumModalProps) => {
    return (
        <Modal
            opened={open}
            onClose={onClose}
            size={size}
            classNames={classes}
            withinPortal
            zIndex={zIndex}
            {...mantineModalProps}
            onClick={(e) => e.stopPropagation()}
        >
            <ModalForm
                {...props}
                onClose={onClose}
                loadingMutation={loadingMutation}
            />
        </Modal>
    );
};

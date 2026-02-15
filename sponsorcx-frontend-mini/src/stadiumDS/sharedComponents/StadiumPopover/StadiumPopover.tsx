import { Popover, FloatingPosition } from '@mantine/core';
import { ModalForm, ModalFormProps } from '../ModalForm/ModalForm';
import colors from '@/stadiumDS/foundations/colors';

interface StadiumPopoverProps extends ModalFormProps {
    open: boolean;
    onClose: () => void;
    trigger: JSX.Element;
    width?: string;
    withinPortal?: boolean;
    position?: FloatingPosition;
    zIndex?: number | string;
}

export const StadiumPopover = ({
    open,
    onClose,
    trigger,
    width = '400px',
    withinPortal = false,
    position,
    zIndex,
    ...props
}: StadiumPopoverProps) => {
    return (
        <Popover
            shadow="0px 20px 24px -4px rgba(10, 13, 18, 0.08), 0px 8px 8px -4px rgba(10, 13, 18, 0.03), 0px 3px 3px -1.5px rgba(10, 13, 18, 0.04)"
            opened={open}
            onChange={(open) => {
                if (!open) {
                    onClose();
                }
            }}
            withinPortal={withinPortal}
            position={position}
            zIndex={zIndex}
        >
            <Popover.Target>{trigger}</Popover.Target>
            <Popover.Dropdown
                className="stadium-popover-dropdown"
                styles={{
                    dropdown: {
                        padding: 0,
                        width,
                        borderRadius: '12px',
                        background: colors.Base.White,
                        border: `1px solid ${colors.Gray[200]}`,
                    },
                }}
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <ModalForm {...props} onClose={onClose} />
            </Popover.Dropdown>
        </Popover>
    );
};

import { formatDate } from '@/utils/helpers';
import { Popover } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { forwardRef } from 'react';
import * as S from './datePicker.styles';

interface StadiumDatePickerProps {
    value?: string | null;
    onChange: (value: string | null) => void;
    trigger?: React.ReactNode;
    onClose?: () => void;
    color?: string;
    weight?: string;
    withinPortal?: boolean;
    disabled?: boolean;
}

export const StadiumDatePicker = forwardRef<
    HTMLDivElement,
    StadiumDatePickerProps
>(
    (
        {
            value,
            onChange,
            trigger,
            onClose,
            color,
            weight,
            withinPortal,
            disabled,
        },
        ref
    ) => {
        return (
            <Popover
                onClose={onClose}
                withinPortal={withinPortal}
                disabled={disabled}
            >
                <Popover.Target>
                    {trigger || (
                        <S.DateText $color={color} $weight={weight}>
                            {value ? formatDate(value) : '--/--/--'}
                        </S.DateText>
                    )}
                </Popover.Target>
                <Popover.Dropdown ref={ref}>
                    <DatePicker
                        value={value ? new Date(value) : undefined}
                        onChange={(date) =>
                            onChange(date ? formatDate(date, 'MM/dd/yy') : null)
                        }
                        defaultDate={value ? new Date(value) : undefined}
                    />
                </Popover.Dropdown>
            </Popover>
        );
    }
);

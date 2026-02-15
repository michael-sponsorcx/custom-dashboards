import { primaryColors } from '@/stadiumDS/foundations/colors/primary';
import {
    DateInput,
    DateInputProps,
    DateInputStylesNames,
} from '@mantine/dates';
import { deepMerge, FloatingPosition, CSSProperties } from '@mantine/core';
import { formatUTCDate } from '@/utils/helpers';

export interface StadiumDateInputProps {
    label?: string;
    required?: boolean;
    placeholder?: string;
    height?: number;
    dropdownZIndex?: number;
    value?: string | null;
    onChange?: (value: string | null) => void;
    position?: FloatingPosition;
    disabled?: boolean;
    labelColor?: string;
    styles?: Partial<Record<DateInputStylesNames, CSSProperties>>;
    clearable?: boolean;
    classNames?: DateInputProps['classNames'];
    allowDeselect?: boolean;
    fontSize?: number;
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onPopoverClose?: () => void;
}

export const StadiumDateInput = ({
    label,
    required = false,
    placeholder,
    height = 40,
    dropdownZIndex,
    value,
    onChange,
    position,
    disabled = false,
    labelColor,
    styles = {},
    clearable = true,
    classNames,
    allowDeselect = true,
    fontSize = 16,
    onFocus,
    onBlur,
    onPopoverClose,
}: StadiumDateInputProps) => {
    const mergedStyles = deepMerge(
        {
            root: {
                width: '100%',
            },
            label: {
                marginBottom: 6,
                '--input-label-size': 14,
                color: labelColor || primaryColors.Gray[700],
            },
            required: {
                color: primaryColors.Brand[400],
            },
            input: {
                padding: '10px 14px',
                borderRadius: 8,
                border: `1px solid ${primaryColors.Gray[300]}`,
                boxShadow: '0px 1px 2px 0px rgba(10, 13, 18, 0.05)',
                color: primaryColors.Gray[700],
                fontSize,
                fontWeight: 400,
                fontFamily: 'Inter',
                height: height,
                placeholder: {
                    color: primaryColors.Gray[500],
                },
            },
            calendarHeader: {
                display: 'flex',
                flexDirection: 'row' as const,
                justifyContent: 'space-between',
            },
            calendarHeaderLevel: {
                fontSize: 14,
                fontWeight: 500,
                padding: 0,
                margin: 0,
            },
        },
        styles
    );

    // Handle the value conversion here - treat undefined as null for the date input
    const inputValue = value === undefined ? null : formatUTCDate(value);
    const dateValue = inputValue ? new Date(inputValue) : null;

    return (
        <DateInput
            label={label}
            required={required}
            placeholder={placeholder}
            value={dateValue}
            onChange={(date) => {
                const dateValue = date ? formatUTCDate(date) : null;
                // Mantine DateInput doesn't allow deselecting the date if clearable is false.
                // So we need to handle the deselection manually.
                if ((clearable || allowDeselect) && dateValue === inputValue) {
                    onChange?.(null);
                } else {
                    onChange?.(dateValue);
                }
            }}
            onFocus={onFocus}
            onBlur={onBlur}
            styles={mergedStyles}
            classNames={classNames}
            popoverProps={{
                offset: 0,
                styles: {
                    dropdown: {
                        backgroundColor: primaryColors.Base.White,
                        borderRadius: 8,
                        border: `1px solid ${primaryColors.Gray[200]}`,
                        boxShadow:
                            '0px 12px 16px -4px rgba(10, 13, 18, 0.08), 0px 4px 6px -2px rgba(10, 13, 18, 0.03), 0px 2px 2px -1px rgba(10, 13, 18, 0.04)',
                        padding: '20px 24px',
                        ...(dropdownZIndex ? { zIndex: dropdownZIndex } : {}),
                    },
                },
                position,
                onClose: onPopoverClose,
            }}
            disabled={disabled}
            clearable={clearable && !disabled}
            allowDeselect={clearable && allowDeselect && !disabled}
        />
    );
};

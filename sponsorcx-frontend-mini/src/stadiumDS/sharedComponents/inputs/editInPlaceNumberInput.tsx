import {
    __InputStylesNames,
    NumberInput,
    NumberInputProps,
} from '@mantine/core';
import { useEffect, useState, forwardRef } from 'react';
import editInPlaceInputClasses from './editInPlaceInput.module.css';
import { stadiumToast } from '@/stadiumDS/applicationComponents/Toasts/StadiumToast.helpers';

interface EditInPlaceNumberInputProps extends NumberInputProps {
    errorMessage?: string;
}

export const EditInPlaceNumberInput = forwardRef<
    HTMLInputElement,
    EditInPlaceNumberInputProps
>(
    (
        {
            value,
            onChange,
            required = false,
            errorMessage = 'This field is required',
            onBlur,
            ...props
        },
        ref
    ) => {
        const [newValue, setNewValue] = useState(value);

        useEffect(() => {
            setNewValue(value);
        }, [value]);

        return (
            <NumberInput
                ref={ref}
                value={newValue}
                onChange={(value) => setNewValue(Number(value))}
                classNames={{
                    root: editInPlaceInputClasses.root,
                    input: editInPlaceInputClasses.input,
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        e.currentTarget.blur();
                    }
                }}
                onBlur={(e) => {
                    if (required && !newValue) {
                        stadiumToast.error(errorMessage);
                        setNewValue(value);
                        return;
                    }
                    if (newValue !== value && newValue !== undefined) {
                        onChange?.(newValue);
                    }
                    onBlur?.(e);
                }}
                {...props}
            />
        );
    }
);

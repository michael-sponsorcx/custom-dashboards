import {
    NumberInput,
    TextInput,
    NumberInputProps,
    TextInputProps,
} from '@mantine/core';
import { useState, useEffect } from 'react';

// Base props that are common to both number and text inputs
// Shared custom props
type CustomBlurInputProps = {
    initialValue: number | string;
    onBlur: (value: string) => void;
};

// Number input variant (supports both 'number' and 'dollar')
export type NumberBlurInputProps = CustomBlurInputProps & {
    type: 'number' | 'dollar';
} & Omit<NumberInputProps, 'value' | 'onChange' | 'onBlur' | 'type'>;

// Text input variant
export type TextBlurInputProps = CustomBlurInputProps & {
    type: 'text';
} & Omit<TextInputProps, 'value' | 'onChange' | 'onBlur' | 'type'>;

// Discriminated union
export type BlurInputProps = NumberBlurInputProps | TextBlurInputProps;

export const BlurInput = (props: BlurInputProps): JSX.Element => {
    const { initialValue, onBlur, type, ...restProps } = props;

    // Convert initialValue to string for internal state
    const [internalValue, setInternalValue] = useState<string>(
        String(initialValue)
    );

    // Update internal state when initialValue changes, but only if it's actually different
    useEffect(() => {
        const newInitialValue = String(initialValue);
        setInternalValue((currentValue) => {
            // Only update if the new value is different from current
            if (currentValue !== newInitialValue) {
                return newInitialValue;
            }
            return currentValue;
        });
    }, [initialValue]);

    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInternalValue(event.target.value);
    };

    const handleNumberChange = (value: string | number) => {
        setInternalValue(String(value));
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        const rawValue = event.target.value ?? '';

        // Sanitize based on type
        let sanitizedValue: string;
        if (type === 'number' || type === 'dollar') {
            // For number/dollar inputs, empty/whitespace becomes "0"
            sanitizedValue = rawValue.trim() === '' ? '0' : rawValue;
        } else {
            // For text inputs, trim whitespace
            sanitizedValue = rawValue.trim();
        }

        // Update internal state with sanitized value
        setInternalValue(sanitizedValue);

        // Only call onBlur callback if the value has actually changed
        const initialValueAsString = String(initialValue);
        if (sanitizedValue !== initialValueAsString) {
            onBlur(sanitizedValue);
        }
    };

    if (type === 'number' || type === 'dollar') {
        return (
            <NumberInput
                decimalScale={type === 'dollar' ? 2 : undefined}
                fixedDecimalScale={type === 'dollar'}
                thousandSeparator
                {...(restProps as Omit<
                    NumberInputProps,
                    'value' | 'onChange' | 'onBlur'
                >)}
                value={internalValue}
                onChange={handleNumberChange}
                onBlur={handleBlur}
            />
        );
    }

    return (
        <TextInput
            {...(restProps as Omit<
                TextInputProps,
                'value' | 'onChange' | 'onBlur'
            >)}
            value={internalValue}
            onChange={handleTextChange}
            onBlur={handleBlur}
        />
    );
};

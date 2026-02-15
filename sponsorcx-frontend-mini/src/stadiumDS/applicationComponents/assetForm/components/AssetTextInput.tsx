import { TextInput, TextInputProps, Tooltip } from '@mantine/core';
import classes from './AssetInput.module.css';
import { inputStyles } from './AssetInput.styles';
import { useState, useRef, useEffect } from 'react';

export interface AssetTextInputProps extends Omit<TextInputProps, 'onChange'> {
    onChange?: (value: string) => void;
}

export const AssetTextInput = ({
    classNames,
    styles,
    onChange,
    value,
    defaultValue = '',
    ...props
}: AssetTextInputProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (newValue: string | undefined) => {
        if (onChange && typeof newValue === 'string' && newValue !== value) {
            onChange(newValue);
        }
    };

    // Check if text is overflowing
    useEffect(() => {
        const checkOverflow = () => {
            if (inputRef.current) {
                const { scrollWidth, clientWidth } = inputRef.current;
                setIsOverflowing(scrollWidth > clientWidth);
            }
        };

        checkOverflow();

        // Check on resize
        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, [value, defaultValue]);

    const displayValue = value ?? defaultValue;
    const shouldShowTooltip = !isFocused && isOverflowing && displayValue;

    // Conditional styles based on focus state
    const focusedStyles = {
        ...inputStyles,
        border: '1px solid var(--mantine-color-Gray-3) !important',
    };

    const unfocusedStyles = {
        ...inputStyles,
        border: 'none',
    };

    return (
        <Tooltip
            label={displayValue}
            position="top"
            disabled={!shouldShowTooltip}
            multiline
            w={
                typeof displayValue === 'string' && displayValue.length > 30
                    ? 300
                    : undefined
            }
        >
            <TextInput
                ref={inputRef}
                classNames={{
                    input: classes.input,
                    ...classNames,
                }}
                styles={{
                    input: isFocused ? focusedStyles : unfocusedStyles,
                    ...styles,
                }}
                defaultValue={displayValue}
                onFocus={() => setIsFocused(true)}
                onBlur={(e) => {
                    setIsFocused(false);
                    handleChange(e?.target?.value);
                }}
                onKeyDown={(e) => {
                    if (e?.key === 'Enter') {
                        handleChange(e?.currentTarget?.value);
                    }
                    props.onKeyDown?.(e);
                }}
                key={String(value) ?? 'empty'}
                {...props}
            />
        </Tooltip>
    );
};

import {
    StadiumDateInput,
    StadiumDateInputProps,
} from '@/stadiumDS/sharedComponents/inputs/dateInput';
import classes from './AssetInput.module.css';
import { inputStyles } from './AssetInput.styles';
import { deepMerge, Tooltip } from '@mantine/core';
import { useState, useRef, useEffect } from 'react';

export type AssetDateInputProps = StadiumDateInputProps;

export const AssetDateInput = ({
    classNames,
    styles,
    value,
    ...props
}: AssetDateInputProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

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
    }, [value]);

    const displayValue = value || '';
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

    const mergedStyles = deepMerge(
        {
            input: isFocused ? focusedStyles : unfocusedStyles,
            wrapper: {
                minHeight: '20px',
            },
            section: {
                padding: 0,
            },
        },
        styles
    );

    // Add focus/blur handlers to track focus state
    const enhancedClassNames = {
        input: classes.input,
        ...classNames,
    };

    return (
        <Tooltip
            label={displayValue}
            position="top"
            disabled={!shouldShowTooltip}
            multiline
            w={displayValue.length > 30 ? 300 : undefined}
        >
            <StadiumDateInput
                classNames={enhancedClassNames}
                styles={mergedStyles}
                height={20}
                placeholder={'--/--/--'}
                value={value}
                {...props}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                clearable={false}
            />
        </Tooltip>
    );
};

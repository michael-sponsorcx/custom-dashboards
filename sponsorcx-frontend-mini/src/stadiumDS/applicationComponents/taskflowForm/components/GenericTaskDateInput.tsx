import {
    StadiumDateInput,
    StadiumDateInputProps,
} from '@/stadiumDS/sharedComponents/inputs/dateInput';
import classes from './GenericTaskInput.module.css';
import { inputStyles } from './GenericInput.styles';
import { deepMerge } from '@mantine/core';
import { useState } from 'react';

export type GenericTaskDateInputProps = StadiumDateInputProps & {
    /**
     * Optional visual variant
     * - 'default': current styling
     * - 'mutedLeft': left-aligned value with muted grey color when unfocused
     */
    variant?: 'default' | 'mutedLeft';
};

export const GenericTaskDateInput = ({
    classNames,
    styles,
    value,
    variant = 'default',
    ...props
}: GenericTaskDateInputProps) => {
    const [isFocused, setIsFocused] = useState(false);

    const displayValue = value || '';
    const hasValue = Boolean(displayValue);

    // Conditional styles based on focus state and variant
    const variantBaseInputStyles =
        variant === 'mutedLeft'
            ? ({
                  textAlign: 'left',
                  display: 'block',
                  justifyContent: 'flex-start',
                  paddingLeft: '0px',
              } as const)
            : ({} as const);

    const focusedStyles = {
        ...inputStyles,
        ...variantBaseInputStyles,
        color:
            variant === 'mutedLeft' && hasValue
                ? 'var(--mantine-color-Gray-6)'
                : undefined,
        border: '1px solid var(--mantine-color-Gray-3) !important',
    };

    const unfocusedStyles = {
        ...inputStyles,
        ...variantBaseInputStyles,
        color:
            variant === 'mutedLeft' && hasValue
                ? 'var(--mantine-color-Gray-6)'
                : undefined,
        border: 'none',
    };

    const mergedStyles = deepMerge(
        {
            input: isFocused ? focusedStyles : unfocusedStyles,
            wrapper: {
                minHeight: '20px',
            },
            section:
                variant === 'mutedLeft'
                    ? {
                          display: 'none',
                          padding: 0,
                      }
                    : {
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
    );
};

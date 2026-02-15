import { primaryColors } from '@/stadiumDS/foundations/colors/primary';
import { deepMerge, Textarea, TextareaProps } from '@mantine/core';
import { CSSProperties, useState, useEffect } from 'react';
import classes from './AutoSizeTextInput.module.css';

export interface AutoSizeTextInputProps extends TextareaProps {
    onUpdate: (value: string) => void;
    allowNewLines?: boolean;
}

export const AutoSizeTextInput = ({
    defaultValue,
    onKeyDown,
    onBlur,
    styles = {},
    onUpdate,
    allowNewLines = false,
    ...props
}: AutoSizeTextInputProps) => {
    const [value, setValue] = useState(defaultValue ?? '');

    useEffect(() => {
        setValue(defaultValue ?? '');
    }, [defaultValue]);

    const mergedStyles = deepMerge(
        {
            wrapper: {
                width: '100%',
            },
            input: {
                margin: 0,
                padding: 0,
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box' as const,
                '&::placeholder': {
                    color: primaryColors.Gray[400],
                },
                textOverflow: 'ellipsis',
                whiteSpace: 'normal' as const,
                overflow: 'auto',
                scrollbarWidth: 'thin' as CSSProperties['scrollbarWidth'],
                scrollbarColor: '#D9D9D9 transparent',
                boxShadow: 'none',
            },
            root: {
                width: '100%',
            },
        },
        styles
    );

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        onKeyDown?.(e);
        if (e.key === 'Enter' && !allowNewLines) {
            e.preventDefault();
            (e.target as HTMLTextAreaElement).blur();
        }
    };

    return (
        <Textarea
            value={value}
            onKeyDown={handleKeyDown}
            onChange={(e) => {
                const newValue = e.target.value;
                setValue(newValue);
            }}
            onBlur={(e) => {
                onBlur?.(e);
                // Scroll to top when textarea loses focus
                if (!allowNewLines) {
                    (e.target as HTMLTextAreaElement).scrollTop = 0;
                }

                const target = e.target as HTMLTextAreaElement;
                setValue(target.value);
                if (defaultValue !== target.value) {
                    onUpdate(target.value);
                }
            }}
            autosize
            rows={1}
            minRows={1}
            maxRows={2}
            classNames={classes}
            styles={mergedStyles}
            {...props}
        />
    );
};

import {
    __InputStylesNames,
    ActionIcon,
    CSSProperties,
    Flex,
    Text,
    TextInput,
    Tooltip,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import editInPlaceInputClasses from './editInPlaceInput.module.css';
import { stadiumToast } from '@/stadiumDS/applicationComponents/Toasts/StadiumToast.helpers';
import colors from '@/stadiumDS/foundations/colors';
import Pencil from '@/stadiumDS/foundations/icons/Editor/Pencil';

interface EditInPlaceInputProps {
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    errorMessage?: string;
    styles?: Partial<Record<__InputStylesNames, CSSProperties>>;
    disabled?: boolean;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
    placeholder?: string;
    showEditIcon?: boolean;
    enableTooltip?: boolean;
    withinPortal?: boolean;
}

export const EditInPlaceInput = ({
    value,
    onChange,
    required = false,
    errorMessage = 'This field is required',
    styles,
    disabled = false,
    onBlur,
    onFocus,
    placeholder,
    showEditIcon,
    enableTooltip = false,
    withinPortal = false,
}: EditInPlaceInputProps) => {
    const [newValue, setNewValue] = useState(value);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setNewValue(value);
    }, [value]);

    if (!isEditing) {
        return (
            <Flex
                align="center"
                gap="4px"
                className={editInPlaceInputClasses.editContainer}
            >
                <Tooltip
                    label={newValue}
                    disabled={!enableTooltip || !newValue.length}
                    withinPortal={withinPortal}
                    openDelay={500}
                >
                    <Text
                        truncate
                        onClick={() => {
                            if (disabled) return;
                            setIsEditing(true);
                        }}
                        c={newValue ? 'inherit' : colors.Gray[400]}
                        style={{
                            width: '100%',
                            cursor: disabled ? 'not-allowed' : 'pointer',
                            lineHeight: '20px',
                        }}
                    >
                        {newValue || placeholder}
                    </Text>
                </Tooltip>
                {showEditIcon && (
                    <ActionIcon
                        onClick={() => {
                            if (disabled) return;
                            setIsEditing(true);
                        }}
                    >
                        <Pencil
                            variant="1"
                            size="20"
                            color={colors.Gray[600]}
                        />
                    </ActionIcon>
                )}
            </Flex>
        );
    }

    return (
        <TextInput
            autoFocus
            placeholder={placeholder}
            value={newValue}
            onChange={(event) => setNewValue(event.target.value)}
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
                    setIsEditing(false);
                    return;
                }
                if (newValue !== value) {
                    onChange(newValue);
                }
                onBlur?.(e);
                setIsEditing(false);
            }}
            onFocus={onFocus}
            styles={styles}
            disabled={disabled}
        />
    );
};

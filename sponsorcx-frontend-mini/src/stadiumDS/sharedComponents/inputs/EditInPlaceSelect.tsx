import {
    __InputStylesNames,
    ActionIcon,
    CSSProperties,
    Flex,
    Select,
    Text,
    Tooltip,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import editInPlaceInputClasses from './editInPlaceInput.module.css';
import colors from '@/stadiumDS/foundations/colors';
import Pencil from '@/stadiumDS/foundations/icons/Editor/Pencil';
import Building from '@/stadiumDS/foundations/icons/General/Building';
import { useS3Resource } from '@/hooks/useS3Resources';

export interface SelectOption {
    value: string;
    label: string;
    logo?: string;
}

interface PropertyOptionProps {
    logo?: string;
    label: string;
}

const PropertyOption = ({ logo, label }: PropertyOptionProps) => {
    const logoUrl = useS3Resource(logo);
    const size = 20;

    return (
        <Flex align="center" gap={12}>
            <Flex
                align="center"
                justify="center"
                style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    flexShrink: 0,
                }}
            >
                {logo ? (
                    <img
                        src={logoUrl}
                        alt={label}
                        style={{
                            width: `${size}px`,
                            height: `${size}px`,
                            objectFit: 'contain',
                            borderRadius: '4px',
                        }}
                    />
                ) : (
                    <Building
                        variant="6"
                        color={colors.Gray[400]}
                        size={`${size}`}
                    />
                )}
            </Flex>
            <Text truncate>{label}</Text>
        </Flex>
    );
};

interface EditInPlaceSelectProps {
    value: string | null | undefined;
    onChange: (value: string | null) => void;
    options: SelectOption[];
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
    searchable?: boolean;
    clearable?: boolean;
    loading?: boolean;
    nothingFoundMessage?: string;
}

export const EditInPlaceSelect = ({
    value,
    onChange,
    options,
    styles,
    disabled = false,
    onBlur,
    onFocus,
    placeholder = 'Select...',
    showEditIcon,
    enableTooltip = false,
    withinPortal = false,
    searchable = false,
    clearable = false,
    nothingFoundMessage = 'No options found',
}: EditInPlaceSelectProps) => {
    const [newValue, setNewValue] = useState<string | null>(value || null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setNewValue(value || null);
    }, [value]);

    const getSelectedOption = () => {
        if (!newValue) return null;
        return options.find((opt) => opt.value === newValue) || null;
    };

    const getDisplayLabel = () => {
        const option = getSelectedOption();
        return option?.label || placeholder;
    };

    if (!isEditing) {
        const selectedOption = getSelectedOption();

        return (
            <Flex
                align="center"
                gap="4px"
                className={editInPlaceInputClasses.editContainer}
            >
                <Tooltip
                    label={getDisplayLabel()}
                    disabled={!enableTooltip || !newValue}
                    withinPortal={withinPortal}
                    openDelay={500}
                >
                    <div
                        onClick={() => {
                            if (disabled) return;
                            setIsEditing(true);
                        }}
                        style={{
                            width: '100%',
                            cursor: disabled ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {selectedOption ? (
                            <PropertyOption
                                logo={selectedOption.logo}
                                label={selectedOption.label}
                            />
                        ) : (
                            <Text
                                truncate
                                c={colors.Gray[400]}
                                style={{
                                    lineHeight: '20px',
                                }}
                            >
                                {placeholder}
                            </Text>
                        )}
                    </div>
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
        <Select
            data={options}
            value={newValue}
            onChange={(value) => {
                setNewValue(value);
                onChange(value);
                setIsEditing(false);
            }}
            placeholder={placeholder}
            searchable={searchable}
            clearable={clearable}
            disabled={disabled}
            nothingFoundMessage={nothingFoundMessage}
            classNames={{
                root: editInPlaceInputClasses.root,
                input: editInPlaceInputClasses.input,
            }}
            onBlur={(e) => {
                onBlur?.(e);
                setIsEditing(false);
            }}
            onFocus={onFocus}
            styles={styles}
            dropdownOpened={isEditing}
            comboboxProps={{
                withinPortal,
                onClose: () => setIsEditing(false),
            }}
            renderOption={({ option }) => {
                const selectOption = options.find(
                    (opt) => opt.value === option.value
                );
                return (
                    <PropertyOption
                        logo={selectOption?.logo}
                        label={option.label}
                    />
                );
            }}
        />
    );
};

import { TextInput } from '@mantine/core';
import { SidePanelFieldLabel } from './SidePanelFieldLabel';
import {
    sidePanelInputFieldStyles,
    TextFieldProps,
} from './SidePanelFields.types';
import { SidePanelAddFieldButton } from './SidePanelAddFieldButton';
import { useEffect, useState } from 'react';
import { SidePanelFieldContainer } from './SidePanelFieldContainer';

export const SidePanelTextField = ({
    value,
    onChange,
    label,
    disabled,
    required,
    highlightRequiredFields,
    rightSection,
    paddingRight,
}: Omit<TextFieldProps, 'type'>) => {
    const stringifiedValue = value ? String(value) : '';

    const [editing, setEditing] = useState(false);
    const [tempValue, setTempValue] = useState(stringifiedValue);

    useEffect(() => {
        setTempValue(stringifiedValue);
        setEditing(false);
    }, [stringifiedValue]);

    return (
        <SidePanelFieldContainer
            groupedChildren={
                <>
                    <SidePanelFieldLabel
                        label={label}
                        required={required}
                        highlight={
                            required &&
                            !stringifiedValue &&
                            highlightRequiredFields
                        }
                    />
                    {!stringifiedValue && !editing && !disabled ? (
                        <SidePanelAddFieldButton
                            onClick={() => setEditing(true)}
                        />
                    ) : null}
                </>
            }
            stackedChildren={
                stringifiedValue || editing ? (
                    <TextInput
                        autoFocus={editing}
                        value={tempValue || ''}
                        onChange={(e) => setTempValue(e.target.value)}
                        onBlur={() => {
                            if (tempValue !== stringifiedValue) {
                                onChange(tempValue);
                            }
                            if (!tempValue) {
                                setEditing(false);
                            }
                        }}
                        styles={{
                            ...sidePanelInputFieldStyles,
                            input: {
                                ...sidePanelInputFieldStyles.input,
                                paddingRight,
                            },
                        }}
                        rightSection={rightSection}
                        disabled={disabled}
                    />
                ) : null
            }
        />
    );
};

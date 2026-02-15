import { NumberInput } from '@mantine/core';
import { SidePanelFieldLabel } from './SidePanelFieldLabel';
import {
    NumberFieldProps,
    sidePanelInputFieldStyles,
} from './SidePanelFields.types';
import { SidePanelAddFieldButton } from './SidePanelAddFieldButton';
import { useEffect, useState } from 'react';
import { isNumber } from 'lodash';
import { SidePanelFieldContainer } from './SidePanelFieldContainer';

export const SidePanelNumberField = ({
    value,
    onChange,
    label,
    disabled,
    required,
    prefix,
    suffix,
    highlightRequiredFields,
}: Omit<NumberFieldProps, 'type'>) => {
    const [editing, setEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);

    useEffect(() => {
        setTempValue(value);
        setEditing(false);
    }, [value]);

    return (
        <SidePanelFieldContainer
            groupedChildren={
                <>
                    <SidePanelFieldLabel
                        label={label}
                        required={required}
                        highlight={
                            required &&
                            !isNumber(value) &&
                            highlightRequiredFields
                        }
                    />
                    {!isNumber(value) && !editing && !disabled ? (
                        <SidePanelAddFieldButton
                            onClick={() => setEditing(true)}
                        />
                    ) : null}
                </>
            }
            stackedChildren={
                isNumber(value) || editing ? (
                    <NumberInput
                        autoFocus={editing}
                        value={isNumber(tempValue) ? tempValue : ''}
                        onChange={(value) =>
                            setTempValue(value === '' ? null : Number(value))
                        }
                        onBlur={() => {
                            if (tempValue !== value) {
                                onChange(
                                    isNumber(tempValue) ? tempValue : null
                                );
                            }
                            if (!isNumber(tempValue)) {
                                setEditing(false);
                            }
                        }}
                        styles={sidePanelInputFieldStyles}
                        suffix={suffix}
                        prefix={prefix}
                        disabled={disabled}
                        placeholder="Enter a number"
                    />
                ) : null
            }
        />
    );
};

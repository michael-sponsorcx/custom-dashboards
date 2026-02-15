import { UnstyledButton } from '@mantine/core';
import { BooleanFieldProps } from './SidePanelFields.types';
import { SidePanelFieldContainer } from './SidePanelFieldContainer';
import { SidePanelFieldLabel } from './SidePanelFieldLabel';
import { SelectMenu } from '@/stadiumDS/sharedComponents/menu/SelectMenu';
import { SidePanelAddFieldButton } from './SidePanelAddFieldButton';
import triggerButtonClasses from './SidePanelTriggerButton.module.css';
import { SidePanelFieldValue } from './SidePanelFieldValue';

enum BooleanFieldValues {
    TRUE = 'true',
    FALSE = 'false',
}

export const SidePanelBooleanField = ({
    value,
    onChange,
    label,
    disabled,
    required,
    allowDeselect,
    highlightRequiredFields,
}: Omit<BooleanFieldProps, 'type'>) => {
    const options = [
        { label: 'Yes', value: BooleanFieldValues.TRUE },
        { label: 'No', value: BooleanFieldValues.FALSE },
    ];
    const selectedOption = options.find(
        (option) => option.value === String(value)
    );

    if (disabled) {
        return (
            <SidePanelFieldContainer
                groupedChildren={
                    <>
                        <SidePanelFieldLabel label={label} />
                        {selectedOption ? (
                            <SidePanelFieldValue value={selectedOption.label} />
                        ) : null}
                    </>
                }
            />
        );
    }

    return (
        <SidePanelFieldContainer
            groupedChildren={
                <>
                    <SidePanelFieldLabel
                        label={label}
                        required={required}
                        highlight={
                            required &&
                            !selectedOption &&
                            highlightRequiredFields
                        }
                    />
                    <SelectMenu
                        trigger={
                            selectedOption ? (
                                <UnstyledButton
                                    className={
                                        triggerButtonClasses.triggerButton
                                    }
                                >
                                    <SidePanelFieldValue
                                        value={selectedOption.label}
                                    />
                                </UnstyledButton>
                            ) : (
                                <SidePanelAddFieldButton />
                            )
                        }
                        items={options.map((option) => ({
                            ...option,
                            onClick: () => {
                                if (
                                    selectedOption?.value === option.value &&
                                    allowDeselect
                                ) {
                                    onChange(null);
                                } else if (
                                    selectedOption?.value !== option.value
                                ) {
                                    onChange(
                                        option.value === BooleanFieldValues.TRUE
                                            ? true
                                            : false
                                    );
                                }
                            },
                        }))}
                        value={selectedOption?.value}
                        closeOnItemClick
                        position="bottom-end"
                    />
                </>
            }
        />
    );
};

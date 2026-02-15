import { SelectMenu } from '@/stadiumDS/sharedComponents/menu/SelectMenu';
import { SidePanelFieldLabel } from './SidePanelFieldLabel';
import { SelectFieldProps } from './SidePanelFields.types';
import { UnstyledButton } from '@mantine/core';
import { SidePanelFieldValue } from './SidePanelFieldValue';
import triggerButtonClasses from './SidePanelTriggerButton.module.css';

export const SidePanelSelectField = ({
    value,
    onChange,
    label,
    disabled,
    required,
    options,
    icon,
    allowDeselect,
    highlightRequiredFields,
}: Omit<SelectFieldProps, 'type'>) => {
    const selectedOption = options.find((option) => option.value === value);

    if (disabled) {
        return selectedOption ? (
            <SidePanelFieldValue
                value={selectedOption.label}
                icon={selectedOption.leftSection ?? icon}
                tooltip={label}
            />
        ) : (
            <SidePanelFieldLabel label={label} icon={icon} />
        );
    }

    return (
        <SelectMenu
            trigger={
                <UnstyledButton className={triggerButtonClasses.triggerButton}>
                    {selectedOption ? (
                        <SidePanelFieldValue
                            value={selectedOption.label}
                            icon={selectedOption.leftSection ?? icon}
                            tooltip={label}
                        />
                    ) : (
                        <SidePanelFieldLabel
                            label={label}
                            required={required}
                            icon={icon}
                            highlight={required && highlightRequiredFields}
                        />
                    )}
                </UnstyledButton>
            }
            items={options.map((option) => ({
                ...option,
                onClick: () =>
                    onChange(
                        value === option.value && allowDeselect
                            ? null
                            : option.value
                    ),
            }))}
            value={value}
            closeOnItemClick
            position="bottom-start"
            searchable
        />
    );
};

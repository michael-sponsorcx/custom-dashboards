import { StadiumDatePicker } from '@/stadiumDS/sharedComponents/inputs/datePicker';
import {
    DateFieldProps,
    sidePanelFieldPlaceholderColor,
    sidePanelLabelIconSize,
} from './SidePanelFields.types';
import { SidePanelFieldLabel } from './SidePanelFieldLabel';
import Calendar from '@/stadiumDS/foundations/icons/Time/Calendar';
import { UnstyledButton } from '@mantine/core';
import triggerButtonClasses from './SidePanelTriggerButton.module.css';
import { formatDate } from '@/utils/helpers';
import { SidePanelFieldValue } from './SidePanelFieldValue';
import colors from '@/stadiumDS/foundations/colors';

export const SidePanelDateField = ({
    value,
    onChange,
    label,
    disabled,
    required,
    highlightRequiredFields,
    overdue,
}: Omit<DateFieldProps, 'type'>) => {
    const formattedValue = value ? formatDate(value) : null;
    const adjustedLabel = `Set ${label}`;

    if (disabled) {
        return formattedValue ? (
            <SidePanelFieldValue
                value={formattedValue}
                icon={
                    <Calendar
                        size={String(sidePanelLabelIconSize)}
                        color={sidePanelFieldPlaceholderColor}
                    />
                }
                tooltip={label}
            />
        ) : (
            <SidePanelFieldLabel
                label={label}
                icon={
                    <Calendar
                        size={String(sidePanelLabelIconSize)}
                        color={sidePanelFieldPlaceholderColor}
                    />
                }
            />
        );
    }

    return (
        <StadiumDatePicker
            value={formattedValue}
            onChange={onChange}
            trigger={
                <UnstyledButton className={triggerButtonClasses.triggerButton}>
                    {formattedValue ? (
                        <SidePanelFieldValue
                            value={formattedValue}
                            icon={
                                <Calendar
                                    size={String(sidePanelLabelIconSize)}
                                    color={sidePanelFieldPlaceholderColor}
                                />
                            }
                            tooltip={adjustedLabel}
                            textStyle={
                                overdue
                                    ? {
                                          fontWeight: 600,
                                          color: colors.Error[500],
                                      }
                                    : undefined
                            }
                        />
                    ) : (
                        <SidePanelFieldLabel
                            label={adjustedLabel}
                            required={required}
                            icon={
                                <Calendar
                                    size={String(sidePanelLabelIconSize)}
                                    color={sidePanelFieldPlaceholderColor}
                                />
                            }
                            highlight={
                                required &&
                                !formattedValue &&
                                highlightRequiredFields
                            }
                        />
                    )}
                </UnstyledButton>
            }
        />
    );
};

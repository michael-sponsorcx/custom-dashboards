import LinkExternal02 from '@/stadiumDS/foundations/icons/General/LinkExternal02';
import { LinkFieldProps } from './SidePanelFields.types';
import { SidePanelTextField } from './SidePanelTextField';
import colors from '@/stadiumDS/foundations/colors';
import { ActionIcon } from '@mantine/core';

export const SidePanelLinkField = ({
    value,
    onChange,
    label,
    disabled,
    required,
    highlightRequiredFields,
}: Omit<LinkFieldProps, 'type'>) => {
    return (
        <SidePanelTextField
            value={value}
            onChange={onChange}
            label={label}
            disabled={disabled}
            required={required}
            highlightRequiredFields={highlightRequiredFields}
            rightSection={
                <ActionIcon
                    onClick={() => window.open(value ?? '', '_blank')}
                    disabled={!value}
                >
                    <LinkExternal02 color={colors.Gray[700]} size="16" />
                </ActionIcon>
            }
            paddingRight="30px"
        />
    );
};

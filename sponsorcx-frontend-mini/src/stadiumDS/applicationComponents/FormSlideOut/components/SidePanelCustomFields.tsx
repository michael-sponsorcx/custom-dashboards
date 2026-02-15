import { CustomField, ObjectType } from '@/gql/customFieldGql';
import useCustomFields from '@/hooks/useCustomFields';
import { SidePanelBooleanField } from './SidePanelFields/SidePanelBooleanField';
import { SidePanelDateField } from './SidePanelFields/SidePanelDateField';
import { SidePanelFileField } from './SidePanelFields/SidePanelFileField';
import { SidePanelLinkField } from './SidePanelFields/SidePanelLinkField';
import { SidePanelMultiSelectField } from './SidePanelFields/SidePanelMultiSelectField';
import { SidePanelNumberField } from './SidePanelFields/SidePanelNumberField';
import { SidePanelTextField } from './SidePanelFields/SidePanelTextField';
import { SidePanelSelectField } from './SidePanelFields/SidePanelSelectField';
import { Fragment } from 'react';

interface SidePanelCustomFieldsProps {
    objectType: ObjectType;
    value: Record<string, any>;
    onFieldChange: (field: string, value: any) => void;
    disabled?: boolean;
}

export const SidePanelCustomFields = ({
    objectType,
    value,
    onFieldChange,
    disabled,
}: SidePanelCustomFieldsProps) => {
    const { customFields } = useCustomFields({
        objectType,
    });

    return (
        <>
            {customFields.map((customField) => (
                <Fragment key={`custom-field-${customField.id}`}>
                    {getSidePanelFieldFromCustomField({
                        customField,
                        value: value[customField.key],
                        onChange: (value: any) =>
                            onFieldChange(customField.key, value),
                        disabled,
                    })}
                </Fragment>
            ))}
        </>
    );
};

const getSidePanelFieldFromCustomField = ({
    customField,
    value,
    onChange,
    disabled,
}: {
    customField: CustomField;
    value: any;
    onChange: (value: any) => void;
    disabled?: boolean;
}) => {
    switch (customField.value_type) {
        case 'boolean':
            return (
                <SidePanelBooleanField
                    label={customField.label}
                    value={value as boolean | null | undefined}
                    onChange={onChange}
                    disabled={disabled}
                    allowDeselect
                />
            );
        case 'date':
            return (
                <SidePanelDateField
                    label={customField.label}
                    value={value as string | null | undefined}
                    onChange={onChange}
                    disabled={disabled}
                />
            );
        case 'file':
            return (
                <SidePanelFileField
                    label={customField.label}
                    value={value as string | null | undefined}
                    onChange={onChange}
                    disabled={disabled}
                />
            );
        case 'hyperlink':
            return (
                <SidePanelLinkField
                    label={customField.label}
                    value={value as string | null | undefined}
                    onChange={onChange}
                    disabled={disabled}
                />
            );
        case 'multi-select':
            return (
                <SidePanelMultiSelectField
                    label={customField.label}
                    value={value as string[] | null | undefined}
                    onChange={onChange}
                    disabled={disabled}
                    options={
                        customField.options?.map((option) => ({
                            label: option,
                            value: option,
                        })) ?? []
                    }
                />
            );
        case 'number':
            return (
                <SidePanelNumberField
                    label={customField.label}
                    value={value as number | null | undefined}
                    onChange={onChange}
                    disabled={disabled}
                />
            );
        case 'percentage':
            return (
                <SidePanelNumberField
                    label={customField.label}
                    value={value as number | null | undefined}
                    onChange={onChange}
                    disabled={disabled}
                    suffix="%"
                />
            );
        case 'rich-text':
            return (
                <SidePanelTextField
                    label={customField.label}
                    value={value as string | null | undefined}
                    onChange={onChange}
                    disabled={disabled}
                />
            );
        case 'select':
            return (
                <SidePanelSelectField
                    label={customField.label}
                    value={value as string | null | undefined}
                    onChange={onChange}
                    disabled={disabled}
                    options={
                        customField.options?.map((option) => ({
                            label: option,
                            value: option,
                        })) ?? []
                    }
                    allowDeselect
                />
            );
        case 'string':
            return (
                <SidePanelTextField
                    label={customField.label}
                    value={value as string | null | undefined}
                    onChange={onChange}
                    disabled={disabled}
                />
            );
        default:
            return null;
    }
};

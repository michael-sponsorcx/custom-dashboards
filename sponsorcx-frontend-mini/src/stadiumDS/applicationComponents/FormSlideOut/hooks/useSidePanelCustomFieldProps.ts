import { CustomField, ObjectType } from '@/gql/customFieldGql';
import useCustomFields from '@/hooks/useCustomFields';
import {
    SidePanelFieldProps,
    SidePanelFieldTypes,
} from '../components/SidePanelFields/SidePanelFields.types';

const mapCustomFieldOptions = (customField: CustomField) =>
    customField.options?.map((option) => ({
        label: option,
        value: option,
    })) ?? [];

interface UseSidePanelCustomFieldPropsOptions {
    objectType: ObjectType;
    value: Record<string, any>;
    onFieldChange: (key: string, value: any) => void;
    disabled?: boolean;
}

export const useSidePanelCustomFieldProps = ({
    objectType,
    value,
    onFieldChange,
    disabled,
}: UseSidePanelCustomFieldPropsOptions): SidePanelFieldProps[] => {
    const { customFields } = useCustomFields({
        objectType,
    });

    return customFields
        .map((customField) =>
            getFieldPropsFromCustomField({
                customField,
                value: value[customField.key],
                onChange: (fieldValue: any) =>
                    onFieldChange(customField.key, fieldValue),
                disabled,
            })
        )
        .filter((props): props is SidePanelFieldProps => props !== null);
};

const getFieldPropsFromCustomField = ({
    customField,
    value,
    onChange,
    disabled,
}: {
    customField: CustomField;
    value: any;
    onChange: (value: any) => void;
    disabled?: boolean;
}): SidePanelFieldProps | null => {
    const baseProps = {
        label: customField.label,
        disabled,
    };

    switch (customField.value_type) {
        case 'boolean':
            return {
                ...baseProps,
                type: SidePanelFieldTypes.BOOLEAN,
                value: value as boolean | null | undefined,
                onChange,
                allowDeselect: true,
            };
        case 'date':
            return {
                ...baseProps,
                type: SidePanelFieldTypes.DATE,
                value: value as string | null | undefined,
                onChange,
            };
        case 'file':
            return {
                ...baseProps,
                type: SidePanelFieldTypes.FILE,
                value: value as string | null | undefined,
                onChange,
            };
        case 'hyperlink':
            return {
                ...baseProps,
                type: SidePanelFieldTypes.LINK,
                value: value as string | null | undefined,
                onChange,
            };
        case 'multi-select':
            return {
                ...baseProps,
                type: SidePanelFieldTypes.MULTI_SELECT,
                value: value as string[] | null | undefined,
                onChange,
                options: mapCustomFieldOptions(customField),
            };
        case 'number':
            return {
                ...baseProps,
                type: SidePanelFieldTypes.NUMBER,
                value: value as number | null | undefined,
                onChange,
            };
        case 'percentage':
            return {
                ...baseProps,
                type: SidePanelFieldTypes.NUMBER,
                value: value as number | null | undefined,
                onChange,
                suffix: '%',
            };
        case 'rich-text':
        case 'string':
            return {
                ...baseProps,
                type: SidePanelFieldTypes.TEXT,
                value: value as string | null | undefined,
                onChange,
            };
        case 'select':
            return {
                ...baseProps,
                type: SidePanelFieldTypes.SELECT,
                value: value as string | null | undefined,
                onChange,
                options: mapCustomFieldOptions(customField),
                allowDeselect: true,
            };
        default:
            return null;
    }
};

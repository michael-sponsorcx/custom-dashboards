import { CustomField } from '@/gql/customFieldGql';
import { useUserOptions } from '@/hooks/useUserOptions';
import {
    MultiSelect,
    NumberInput,
    Select,
    Stack,
    TextInput,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useEffect, useState } from 'react';

const StadiumCustomField = ({
    field,
    value,
    onChange,
}: {
    field: CustomField;
    value: string | boolean | number | string[] | null;
    onChange: (value: string | boolean | number | string[] | null) => void;
}) => {
    const [temporaryValue, setTemporaryValue] = useState(value);
    const userOptions = useUserOptions();

    useEffect(() => {
        setTemporaryValue(value);
    }, [value]);

    if (field.value_type === 'number' || field.value_type === 'percentage') {
        return (
            <NumberInput
                label={field.label}
                value={!value && value !== 0 ? '' : Number(value)}
                onChange={(value) => onChange(value)}
                suffix={field.value_type === 'percentage' ? '%' : undefined}
                placeholder={`Enter ${field.label}`}
            />
        );
    }
    if (field.value_type === 'date') {
        return (
            <DateInput
                label={field.label}
                value={!value ? null : String(value)}
                onChange={(value) => onChange(value)}
                allowDeselect
                clearable
                placeholder={`Select ${field.label}`}
            />
        );
    }
    if (field.value_type === 'select') {
        return (
            <Select
                label={field.label}
                value={!value ? null : String(value)}
                onChange={(value) => onChange(value)}
                placeholder={`Select ${field.label}`}
                data={field.options?.map((option) => ({
                    label: option,
                    value: option,
                }))}
                allowDeselect
                clearable
            />
        );
    }
    if (field.value_type === 'multi-select') {
        return (
            <MultiSelect
                label={field.label}
                value={(value as string[]) ?? []}
                onChange={(value) => onChange(value)}
                placeholder={`Select ${field.label}`}
                data={field.options?.map((option) => ({
                    label: option,
                    value: option,
                }))}
                clearable
            />
        );
    }
    if (field.value_type === 'boolean') {
        const selectedBooleanVal = value ?? null;

        return (
            <Select
                label={field.label}
                value={
                    selectedBooleanVal === null
                        ? null
                        : String(selectedBooleanVal)
                }
                onChange={(value) => {
                    onChange(
                        value === 'true'
                            ? true
                            : value === 'false'
                            ? false
                            : null
                    );
                }}
                data={[
                    { label: 'Yes', value: 'true' },
                    { label: 'No', value: 'false' },
                ]}
                placeholder={`Select ${field.label}`}
                allowDeselect
            />
        );
    }
    if (field.value_type === 'string') {
        return (
            <TextInput
                label={field.label}
                value={!temporaryValue ? '' : String(temporaryValue)}
                onChange={(e) => setTemporaryValue(e.target.value)}
                onBlur={() => onChange(temporaryValue)}
                placeholder={`Enter ${field.label}`}
            />
        );
    }
    if (field.value_type === 'user-list') {
        return (
            <Select
                label={field.label}
                value={!value ? null : String(value)}
                onChange={(value) => onChange(value)}
                data={userOptions.map((option) => ({
                    label: option.text,
                    value: option.value.toString(),
                }))}
                clearable
            />
        );
    }
    return null;
};

interface StadiumCustomFieldsFormProps {
    customFields: CustomField[];
    value: Record<string, string | boolean | number | string[] | null>;
    onChange: (
        value: Record<string, string | boolean | number | string[] | null>
    ) => void;
}

export const StadiumCustomFieldsForm = ({
    customFields,
    value,
    onChange,
}: StadiumCustomFieldsFormProps) => {
    return (
        <Stack gap={16}>
            {customFields.map((field) => (
                <StadiumCustomField
                    key={field.id}
                    field={field}
                    value={value[field.key]}
                    onChange={(keyValue) => {
                        onChange({
                            ...value,
                            [field.key]: keyValue,
                        });
                    }}
                />
            ))}
        </Stack>
    );
};

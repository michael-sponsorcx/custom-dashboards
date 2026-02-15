import { CustomField, ObjectType } from '@/gql/customFieldGql';
import {
    Group,
    MultiSelect,
    NumberInput,
    Stack,
    Text,
    TextInput,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { DateRangeSelects } from './DateRangeSelects';
import useCustomFields from '@/hooks/useCustomFields';
import { sortCustomFieldsByOrder } from '@/utils/customFields.helper';
import { FilterTogglePills } from './FilterTogglePills';

interface FilterSlideOutCustomFieldsProps {
    label: string;
    filterKey: string;
    objectType: ObjectType;
    defaultValue: Record<string, any>;
    updateFilters: (updatedParams: Record<string, any>) => void;
}

export const FilterSlideOutCustomFields = ({
    label,
    filterKey,
    objectType,
    defaultValue,
    updateFilters,
}: FilterSlideOutCustomFieldsProps) => {
    const { customFields } = useCustomFields({
        objectType,
    });

    const handleUpdateFilters = (fieldKey: string, value: any) => {
        const newValue = { ...defaultValue };
        if (!value && value !== false) {
            delete newValue[fieldKey];
        } else {
            newValue[fieldKey] = value;
        }
        updateFilters({ [filterKey]: JSON.stringify(newValue) });
    };

    // Filter out custom fields that have filterable set to false in metadata, then sort
    const filterableFields = sortCustomFieldsByOrder(
        customFields.filter((field) => field.metadata?.filterable !== false)
    );

    if (filterableFields.length === 0) {
        return null;
    }

    return (
        <Stack gap="md">
            <Text fw={600}>{label}</Text>
            {filterableFields.map((field) =>
                getCustomFieldFilter({
                    field,
                    handleUpdateFilters,
                    value: defaultValue[field.key],
                })
            )}
        </Stack>
    );
};

interface CustomFieldFilterProps {
    field: CustomField;
    handleUpdateFilters: (fieldKey: string, value: any) => void;
    value: any;
}

const getCustomFieldFilter = ({
    field,
    handleUpdateFilters,
    value,
}: CustomFieldFilterProps) => {
    switch (field.value_type) {
        case 'boolean':
            return (
                <BooleanFilter
                    field={field}
                    handleUpdateFilters={handleUpdateFilters}
                    value={value}
                />
            );
        case 'date':
            return (
                <DateFilter
                    field={field}
                    handleUpdateFilters={handleUpdateFilters}
                    value={value}
                />
            );
        case 'select':
        case 'multi-select':
            return (
                <MultiSelectFilter
                    field={field}
                    handleUpdateFilters={handleUpdateFilters}
                    value={value}
                />
            );
        case 'number':
            return (
                <NumberFilter
                    field={field}
                    handleUpdateFilters={handleUpdateFilters}
                    value={value}
                />
            );
        case 'percentage':
            return (
                <NumberFilter
                    field={field}
                    handleUpdateFilters={handleUpdateFilters}
                    value={value}
                    isPercentage={true}
                />
            );
        case 'string':
            return (
                <StringFilter
                    field={field}
                    handleUpdateFilters={handleUpdateFilters}
                    value={value}
                />
            );
        default:
            return null;
    }
};

const BooleanFilter = ({
    field,
    handleUpdateFilters,
    value,
}: CustomFieldFilterProps) => {
    return (
        <FilterTogglePills
            key={field.key}
            options={[
                {
                    label: 'Yes',
                    value: 'true',
                },
                {
                    label: 'No',
                    value: 'false',
                },
            ]}
            value={value === true ? ['true'] : value === false ? ['false'] : []}
            onChange={(newValue) => {
                const adjustedValue =
                    newValue.length === 1 ? newValue[0] === 'true' : null;
                handleUpdateFilters(field.key, adjustedValue);
            }}
            label={field.label}
        />
    );
};

const DateFilter = ({
    field,
    handleUpdateFilters,
    value,
}: CustomFieldFilterProps) => {
    return (
        <DateRangeSelects
            key={field.key}
            value={[value?.[0] ?? '', value?.[1] ?? '']}
            onChange={(value) => {
                if (value[0] === '' && value[1] === '') {
                    handleUpdateFilters(field.key, null);
                } else {
                    handleUpdateFilters(field.key, value);
                }
            }}
            minLabel={`${field.label} Min`}
            maxLabel={`${field.label} Max`}
        />
    );
};

const MultiSelectFilter = ({
    field,
    handleUpdateFilters,
    value,
}: CustomFieldFilterProps) => {
    return (
        <MultiSelect
            key={field.key}
            label={field.label}
            placeholder="Select items"
            data={
                field.options?.length
                    ? field.options
                    : [
                          {
                              value: 'no-items',
                              label: 'No items found',
                              disabled: true,
                          },
                      ]
            }
            value={value ?? []}
            onChange={(value) => {
                handleUpdateFilters(field.key, value.length ? value : null);
            }}
            searchable
        />
    );
};

const NumberFilter = ({
    field,
    handleUpdateFilters,
    value,
    isPercentage = false,
}: CustomFieldFilterProps & { isPercentage?: boolean }) => {
    const [minMax, setMinMax] = useState<[number | null, number | null]>(
        value ? value : [null, null]
    );

    useEffect(() => {
        const newMinMax = value ? value : [null, null];
        if (newMinMax[0] !== minMax[0] || newMinMax[1] !== minMax[1]) {
            setMinMax(newMinMax);
        }
    }, [JSON.stringify(value)]);

    const handleUpdateMinOrMax = (index: number, minOrMax: string | number) => {
        const newMinOrMax = minOrMax === '' ? null : Number(minOrMax);
        setMinMax([
            index === 0 ? newMinOrMax : minMax[0],
            index === 1 ? newMinOrMax : minMax[1],
        ]);
    };

    return (
        <Group gap="md" wrap="nowrap">
            <NumberInput
                label={`${field.label} Min`}
                placeholder="Enter Min"
                value={minMax[0] ?? ''}
                onChange={(min) => handleUpdateMinOrMax(0, min)}
                suffix={isPercentage ? '%' : ''}
                allowNegative={false}
                onBlur={() =>
                    handleUpdateFilters(
                        field.key,
                        minMax[0] === null && minMax[1] === null ? null : minMax
                    )
                }
            />
            <NumberInput
                label={`${field.label} Max`}
                placeholder="Enter Max"
                value={minMax[1] ?? ''}
                onChange={(max) => handleUpdateMinOrMax(1, max)}
                suffix={isPercentage ? '%' : ''}
                allowNegative={false}
                onBlur={() =>
                    handleUpdateFilters(
                        field.key,
                        minMax[0] === null && minMax[1] === null ? null : minMax
                    )
                }
            />
        </Group>
    );
};

const StringFilter = ({
    field,
    handleUpdateFilters,
    value,
}: CustomFieldFilterProps) => {
    const [inputValue, setInputValue] = useState(value ?? '');

    useEffect(() => {
        setInputValue(value ?? '');
    }, [value]);

    return (
        <TextInput
            key={field.key}
            label={field.label}
            placeholder="Enter a value"
            value={inputValue}
            onChange={(event) => {
                setInputValue(event.target.value);
            }}
            onBlur={() => {
                handleUpdateFilters(field.key, inputValue);
            }}
        />
    );
};

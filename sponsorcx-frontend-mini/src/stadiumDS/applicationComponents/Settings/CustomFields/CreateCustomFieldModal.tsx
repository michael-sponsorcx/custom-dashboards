import Plus from '@/stadiumDS/foundations/icons/General/Plus';
import {
    Button,
    Group,
    Select,
    Switch,
    TagsInput,
    TextInput,
} from '@mantine/core';
import { Fragment, useRef, useState } from 'react';
import colors from '@/stadiumDS/foundations/colors';
import {
    CustomField,
    customFieldCreate,
    customFieldUpdate,
    filterableFieldTypes,
    ObjectType,
    ValueType,
} from '@/gql/customFieldGql';
import {
    shouldShowFilterableForObjectType,
    useObjectTypeNameMap,
    valueTypeContentMap,
} from '@/utils/customFields.helper';
import Check from '@/stadiumDS/foundations/icons/General/Check';
import { Formik, FormikProps } from 'formik';
import { useMutation } from '@apollo/client';
import { convertLabelToKey } from '@/utils/helpers';
import useStore from '@/state';
import { StadiumModal } from '@/stadiumDS/sharedComponents/StadiumModal/StadiumModal';

interface CreateCustomFieldModalProps {
    objectType: ObjectType;
    getTrigger?: (setOpen: (open: boolean) => void) => JSX.Element;
    field?: CustomField;
    refetchCustomFields?: () => void;
    cannotEditLabel?: boolean;
    handleEditOptions?: (options: string[]) => Promise<void>;
    existingKeys?: string[];
    limitValueTypes?: ValueType[];
}

export const CreateCustomFieldModal = ({
    objectType,
    getTrigger,
    field,
    refetchCustomFields,
    cannotEditLabel = false,
    handleEditOptions,
    existingKeys,
    limitValueTypes = [],
}: CreateCustomFieldModalProps) => {
    const valueTypeOptions = Object.entries(valueTypeContentMap)
        .filter(
            ([key]) =>
                limitValueTypes.length === 0 ||
                limitValueTypes.includes(key as ValueType)
        )
        .map(([key, value]) => ({
            label: value.label,
            value: key,
        }));

    const organization = useStore((state) => state.organization);
    const [open, setOpen] = useState(false);

    const formRef = useRef<FormikProps<any>>(null);

    const initialValues: {
        label: string;
        type: string | null;
        options?: string[];
        filterable?: boolean;
    } = {
        label: field?.label ?? '',
        type: field?.value_type ?? null,
        options: field?.options ?? [],
        filterable:
            field?.value_type && filterableFieldTypes.includes(field.value_type)
                ? field.metadata?.filterable !== false
                : false,
    };

    const [createCustomField] = useMutation(customFieldCreate);

    const handleCreateCustomField = async (values: typeof initialValues) => {
        const generatedKey = convertLabelToKey(values.label);

        let finalKey = generatedKey;
        let counter = 1;

        while (existingKeys?.includes(finalKey)) {
            finalKey = `${generatedKey}_${counter}`;
            counter++;
        }

        const isFieldTypeFilterable =
            values.type && filterableFieldTypes.includes(values.type);
        const finalFilterable =
            isFieldTypeFilterable && values.filterable === false
                ? false
                : undefined;
        const metadata =
            finalFilterable !== undefined
                ? { filterable: finalFilterable }
                : undefined;

        await createCustomField({
            variables: {
                organization_id: organization.id,
                object_type: objectType,
                key: finalKey,
                value_type: values.type,
                label: values.label,
                options: values.options ? JSON.stringify(values.options) : null,
                metadata,
            },
        });
        refetchCustomFields?.();
    };

    const [updateCustomField] = useMutation(customFieldUpdate);

    const handleUpdateCustomField = async (values: {
        label?: string;
        options?: string[];
    }) => {
        if (handleEditOptions) {
            await handleEditOptions(values.options || []);
            return;
        }
        await updateCustomField({
            variables: {
                id: field?.id,
                label: values.label,
                options: values.options ? JSON.stringify(values.options) : null,
            },
        });
        refetchCustomFields?.();
    };

    const objectTypeNameMap = useObjectTypeNameMap({ objectType });

    return (
        <Formik
            ref={formRef}
            initialValues={initialValues}
            onSubmit={() => {}}
            enableReinitialize
        >
            {({ values, setFieldValue, resetForm }) => {
                const isFieldTypeFilterable =
                    values.type && filterableFieldTypes.includes(values.type);

                const handleClose = () => {
                    setOpen(false);
                    resetForm();
                };

                return (
                    <Fragment>
                        {getTrigger ? (
                            getTrigger(setOpen)
                        ) : (
                            <Button
                                leftSection={
                                    <Plus size="20" color={colors.Base.White} />
                                }
                                onClick={() => setOpen(true)}
                            >
                                Add Field
                            </Button>
                        )}
                        <StadiumModal
                            open={open}
                            onClose={handleClose}
                            header={{
                                title: field
                                    ? `Edit ${
                                          objectTypeNameMap?.singular ||
                                          objectType
                                      } Field`
                                    : `Add ${
                                          objectTypeNameMap?.singular ||
                                          objectType
                                      } Field`,
                            }}
                            primaryButton={{
                                text: field ? 'Save' : 'Add',
                                disabled:
                                    !values.label ||
                                    !values.type ||
                                    (field &&
                                        field.label === values.label &&
                                        JSON.stringify(field.options || []) ===
                                            JSON.stringify(
                                                values.options || []
                                            )),
                                onClick: async () => {
                                    if (field) {
                                        await handleUpdateCustomField(values);
                                    } else {
                                        await handleCreateCustomField(values);
                                    }
                                    handleClose();
                                },
                            }}
                            secondaryButton={{
                                onClick: handleClose,
                            }}
                        >
                            <TextInput
                                label="Label Title"
                                required
                                value={values.label}
                                onChange={(e) =>
                                    setFieldValue('label', e.target.value)
                                }
                                disabled={cannotEditLabel}
                            />
                            <Select
                                label="Type"
                                required
                                data={valueTypeOptions}
                                renderOption={({ option, checked }) => (
                                    <Group justify="space-between" flex={1}>
                                        <Group gap={12}>
                                            {valueTypeContentMap[
                                                option.value as ValueType
                                            ].icon({
                                                size: '20',
                                                color: colors.Base.Black,
                                            })}
                                            {option.label}
                                        </Group>
                                        {checked && (
                                            <Check
                                                size="20"
                                                color={colors.Brand[400]}
                                            />
                                        )}
                                    </Group>
                                )}
                                value={values.type}
                                onChange={(value) =>
                                    setFieldValue('type', value)
                                }
                                disabled={!!field}
                            />
                            {values.type === 'select' ||
                            values.type === 'multi-select' ? (
                                <TagsInput
                                    label="Options"
                                    value={values.options}
                                    onChange={(value) => {
                                        setFieldValue('options', value);
                                    }}
                                    styles={{
                                        input: {
                                            maxHeight: '200px',
                                            overflowY: 'auto',
                                        },
                                    }}
                                />
                            ) : null}
                            {shouldShowFilterableForObjectType(objectType) && (
                                <Switch
                                    label="Show in filters"
                                    description={
                                        isFieldTypeFilterable
                                            ? 'Allow this field to appear in filter dropdowns'
                                            : values.type
                                            ? 'This field type cannot be used in filters'
                                            : 'Select a field type to enable filtering'
                                    }
                                    checked={
                                        isFieldTypeFilterable
                                            ? values.filterable ?? true
                                            : false
                                    }
                                    disabled={!isFieldTypeFilterable}
                                    onChange={(e) => {
                                        if (!isFieldTypeFilterable) {
                                            return;
                                        }
                                        setFieldValue(
                                            'filterable',
                                            e.currentTarget.checked
                                        );
                                    }}
                                />
                            )}
                        </StadiumModal>
                    </Fragment>
                );
            }}
        </Formik>
    );
};

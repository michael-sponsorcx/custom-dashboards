import Plus from '@/stadiumDS/foundations/icons/General/Plus';
import {
    ActionIcon,
    Button,
    Group,
    Select,
    Stack,
    Switch,
    Text,
    TextInput,
} from '@mantine/core';
import { Fragment, useEffect, useRef, useState } from 'react';
import colors from '@/stadiumDS/foundations/colors';
import {
    CustomField,
    customFieldOptionDelete,
    customFieldOptionUpdate,
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
import useStore from '@/state';
import { StadiumModal } from '@/stadiumDS/sharedComponents/StadiumModal/StadiumModal';
import Trash from '@/stadiumDS/foundations/icons/General/Trash';
import Search from '@/stadiumDS/foundations/icons/General/Search';
import { StadiumConfirmActionPopup } from '@/stadiumDS/sharedComponents/ConfirmActionPopup/StadiumConfirmActionPopup';
import { stadiumToast } from '@/stadiumDS/applicationComponents/Toasts/StadiumToast.helpers';

type OptionData = {
    label: string;
    type: 'existing' | 'new';
};

export type CustomFieldHandlers = {
    handleRenameOption: (oldValue: string, newValue: string) => Promise<void>;
    handleDeleteOption: (value: string) => Promise<void>;
    handleAddOption: (value: string) => Promise<void>;
};

interface EditCustomFieldModalProps {
    objectType: ObjectType;
    getTrigger?: (setOpen: (open: boolean) => void) => JSX.Element;
    field: CustomField & {
        isDefault?: boolean;
    };
    refetchCustomFields?: () => void;
    cannotEditLabel?: boolean;
    customHandlers?: CustomFieldHandlers;
    limitValueTypes?: ValueType[];
}

export const EditCustomFieldModal = ({
    objectType,
    getTrigger,
    field,
    refetchCustomFields,
    cannotEditLabel = false,
    customHandlers,
    limitValueTypes = [],
}: EditCustomFieldModalProps) => {
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

    const isFieldTypeFilterable = filterableFieldTypes.includes(
        field.value_type
    );

    const organization = useStore((state) => state.organization);
    const [open, setOpen] = useState(false);
    const [optionsData, setOptionsData] = useState<OptionData[]>([]);
    const [search, setSearch] = useState('');

    const formRef = useRef<FormikProps<any>>(null);

    const initialValues: {
        label: string;
        type: string | null;
        options?: string[];
        filterable?: boolean;
    } = {
        label: field.label,
        type: field.value_type,
        options: field.options,
        filterable: isFieldTypeFilterable
            ? field.metadata?.filterable !== false
            : false,
    };

    useEffect(() => {
        setOptionsData(
            field.options?.map((option) => ({
                label: option,
                type: 'existing',
            })) || []
        );
    }, [field.options]);

    const [updateCustomField] = useMutation(customFieldUpdate, {
        onCompleted: () => {
            refetchCustomFields?.();
        },
    });

    const handleUpdateCustomField = async ({
        label,
        options,
        filterable,
    }: {
        label?: string;
        options?: string[];
        filterable?: boolean;
    }) => {
        if (label === field.label && filterable === undefined) {
            return;
        }
        const finalFilterable =
            filterable !== undefined && !isFieldTypeFilterable
                ? false
                : filterable;
        const metadata = {
            ...field.metadata,
            ...(finalFilterable !== undefined
                ? { filterable: finalFilterable }
                : {}),
        };
        await updateCustomField({
            variables: {
                id: field.id,
                label,
                options: options ? JSON.stringify(options) : undefined,
                metadata:
                    Object.keys(metadata).length > 0 ? metadata : undefined,
            },
        });
        if (label) {
            stadiumToast.success('Label updated');
        }
        if (options) {
            stadiumToast.success('Option added');
        }
        if (filterable !== undefined) {
            stadiumToast.success('Filterable setting updated');
        }
    };

    const [updateCustomFieldOption] = useMutation(customFieldOptionUpdate, {
        onCompleted: () => {
            refetchCustomFields?.();
            stadiumToast.success('Option updated');
        },
    });

    const handleUpdateCustomFieldOption = async (
        oldValue: string,
        newValue: string
    ) => {
        if (oldValue === newValue) {
            return;
        }
        if (customHandlers) {
            await customHandlers.handleRenameOption(oldValue, newValue);
        } else {
            await updateCustomFieldOption({
                variables: {
                    id: field.id,
                    organization_id: organization.id,
                    old_value: oldValue,
                    new_value: newValue,
                },
            });
        }
    };

    const [deleteCustomFieldOption] = useMutation(customFieldOptionDelete, {
        onCompleted: () => {
            refetchCustomFields?.();
            stadiumToast.success('Option deleted');
        },
    });

    const handleDeleteCustomFieldOption = async (value: string) => {
        if (customHandlers) {
            await customHandlers.handleDeleteOption(value);
        } else {
            await deleteCustomFieldOption({
                variables: {
                    id: field.id,
                    organization_id: organization.id,
                    option_value: value,
                },
            });
        }
    };

    const handleAddOptionButtonClick = () => {
        setOptionsData([...optionsData, { label: '', type: 'new' }]);
    };

    const handleCustomFieldOptionChange = async (
        label: string,
        option: OptionData
    ) => {
        // A new option that is unedited should be removed
        if (label === '' && option.type === 'new') {
            setOptionsData(optionsData.filter((o) => o.type !== 'new'));
        }
        // A new option that is edited should be added
        // Unless the label is the same as an existing option
        else if (option.type === 'new') {
            if (field.options?.includes(label)) {
                stadiumToast.error('Option already exists');
                setOptionsData(optionsData.filter((o) => o.type !== 'new'));
                return;
            }
            if (customHandlers) {
                await customHandlers.handleAddOption(label);
            } else {
                const newOptions = [...(field.options || []), label];
                await handleUpdateCustomField({
                    options: newOptions,
                });
            }
        }
        // An existing option that is edited should be updated
        else {
            await handleUpdateCustomFieldOption(option.label, label);
        }
    };

    const handleDeleteCustomFieldOptionButtonClick = (value: string) => {
        handleDeleteCustomFieldOption(value);
    };

    const checkForOpenPopovers = () => {
        const popovers = document.querySelectorAll('.stadium-popover-dropdown');
        return popovers.length > 0;
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
                const handleClose = () => {
                    if (checkForOpenPopovers()) {
                        return;
                    }
                    setOpen(false);
                    resetForm();
                    setOptionsData(
                        field.options?.map((option) => ({
                            label: option,
                            type: 'existing',
                        })) || []
                    );
                    setSearch('');
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
                                onClick={() => {
                                    setOpen(true);
                                }}
                            >
                                Add Field
                            </Button>
                        )}
                        <StadiumModal
                            open={open}
                            onClose={handleClose}
                            header={{
                                title: `Edit ${
                                    objectTypeNameMap?.singular || objectType
                                } Field`,
                            }}
                            includeButtons={false}
                            size="lg"
                        >
                            <Group wrap="nowrap">
                                <TextInput
                                    label="Label Title"
                                    required
                                    value={values.label}
                                    onChange={(e) =>
                                        setFieldValue('label', e.target.value)
                                    }
                                    disabled={cannotEditLabel}
                                    onBlur={() =>
                                        handleUpdateCustomField({
                                            label: values.label,
                                        })
                                    }
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
                                    disabled
                                />
                            </Group>
                            {shouldShowFilterableForObjectType(objectType) && (
                                <Switch
                                    label="Show in filters"
                                    description={
                                        isFieldTypeFilterable
                                            ? 'Allow this field to appear in filter dropdowns'
                                            : 'This field type cannot be used in filters'
                                    }
                                    checked={
                                        isFieldTypeFilterable
                                            ? values.filterable ?? true
                                            : false
                                    }
                                    disabled={
                                        !isFieldTypeFilterable ||
                                        field.isDefault
                                    }
                                    onChange={(e) => {
                                        if (!isFieldTypeFilterable) {
                                            return;
                                        }
                                        const newValue =
                                            e.currentTarget.checked;
                                        setFieldValue('filterable', newValue);
                                        handleUpdateCustomField({
                                            filterable: newValue,
                                        });
                                    }}
                                />
                            )}
                            {values.type === 'select' ||
                            values.type === 'multi-select' ? (
                                <Stack gap="sm">
                                    <Group justify="space-between">
                                        <Text fw={500}>Option Management</Text>
                                        <Button
                                            leftSection={
                                                <Plus
                                                    size="20"
                                                    color={colors.Base.White}
                                                />
                                            }
                                            onClick={handleAddOptionButtonClick}
                                        >
                                            Add Option
                                        </Button>
                                    </Group>
                                    <TextInput
                                        leftSection={
                                            <Search
                                                size="20"
                                                variant="lg"
                                                color={colors.Gray[600]}
                                            />
                                        }
                                        placeholder="Search options"
                                        styles={{
                                            root: {
                                                width: 'calc(50% - 7px)',
                                            },
                                            input: {
                                                paddingLeft: '32px',
                                            },
                                        }}
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                    />
                                    <Stack
                                        gap="sm"
                                        style={{
                                            height: '242px',
                                            overflowY: 'auto',
                                            scrollbarWidth: 'thin',
                                        }}
                                    >
                                        {optionsData
                                            .filter((option) => {
                                                if (search === '') {
                                                    return true;
                                                }
                                                if (option.type === 'new') {
                                                    return true;
                                                }
                                                return option.label
                                                    .toLowerCase()
                                                    .includes(
                                                        search.toLowerCase()
                                                    );
                                            })
                                            .map((option, index) => (
                                                <CustomFieldOption
                                                    key={`${option.label}-${index}`}
                                                    option={option}
                                                    onChange={(label: string) =>
                                                        handleCustomFieldOptionChange(
                                                            label,
                                                            option
                                                        )
                                                    }
                                                    handleDelete={() =>
                                                        handleDeleteCustomFieldOptionButtonClick(
                                                            option.label
                                                        )
                                                    }
                                                    existingOptions={
                                                        field.options || []
                                                    }
                                                />
                                            ))}
                                    </Stack>
                                </Stack>
                            ) : null}
                        </StadiumModal>
                    </Fragment>
                );
            }}
        </Formik>
    );
};

export const CustomFieldOption = ({
    option,
    onChange,
    handleDelete,
    existingOptions,
}: {
    option: OptionData;
    onChange: (label: string) => void;
    handleDelete: () => void;
    existingOptions: string[];
}) => {
    const [value, setValue] = useState(option.label);

    useEffect(() => {
        setValue(option.label);
    }, [option.label]);

    return (
        <Group wrap="nowrap">
            <StadiumConfirmActionPopup
                getTrigger={(setOpen: (open: boolean) => void) => (
                    <TextInput
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        autoFocus={option.type === 'new'}
                        onBlur={() => {
                            if (value === '' && option.type === 'existing') {
                                setValue(option.label);
                            } else if (
                                value !== option.label &&
                                option.type === 'existing'
                            ) {
                                if (existingOptions.includes(value)) {
                                    stadiumToast.error('Option already exists');
                                    setValue(option.label);
                                    return;
                                }
                                setOpen(true);
                                return;
                            } else {
                                onChange(value);
                            }
                        }}
                        placeholder="Option label"
                    />
                )}
                onConfirm={() => {
                    onChange(value);
                }}
                onCancel={() => {
                    setValue(option.label);
                }}
                withinPortal={false}
                title={`Update '${option.label}' to '${value}'?`}
                description="Changes you make here will update how this custom field’s options appear wherever it’s used."
                confirmButtonText="Change Option"
                danger={false}
            />
            <StadiumConfirmActionPopup
                getTrigger={(setOpen: (open: boolean) => void) => (
                    <ActionIcon onClick={() => setOpen(true)}>
                        <Trash size="20" variant="1" color={colors.Gray[400]} />
                    </ActionIcon>
                )}
                onConfirm={handleDelete}
                withinPortal={false}
                title="Are you sure you want to delete?"
                description="Changes you make here will update how this custom field’s options appear wherever it’s used."
                confirmButtonText="Delete"
            />
        </Group>
    );
};

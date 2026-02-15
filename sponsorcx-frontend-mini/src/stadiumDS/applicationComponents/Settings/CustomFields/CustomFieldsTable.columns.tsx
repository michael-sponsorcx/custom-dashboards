import {
    CustomField,
    filterableFieldTypes,
    ValueType,
} from '@/gql/customFieldGql';
import { SettingsTableColumn } from '@/stadiumDS/applicationComponents/SettingsTable/SettingsTable';
import colors from '@/stadiumDS/foundations/colors';
import { ActionIcon, Badge, Flex, Group, Text, Tooltip } from '@mantine/core';
import {
    shouldShowFilterableForObjectType,
    valueTypeContentMap,
} from '@/utils/customFields.helper';
import * as S from './CustomFieldsTable.styles';
import { StadiumConfirmActionPopup } from '@/stadiumDS/sharedComponents/ConfirmActionPopup/StadiumConfirmActionPopup';
import Trash from '@/stadiumDS/foundations/icons/General/Trash';
import Pencil from '@/stadiumDS/foundations/icons/Editor/Pencil';
import { StadiumRequiredIndicator } from '@/stadiumDS/sharedComponents/RequiredIndicator/StadiumRequiredIndicator';
import { CustomFieldOption } from './CustomFieldOption';
import {
    CustomFieldHandlers,
    EditCustomFieldModal,
} from './EditCustomFieldModal';

interface CustomFieldsTableColumnsProps {
    handleDeleteCustomField: (id: string) => void;
    refetchCustomFields: () => void;
    objectType: CustomField['object_type'];
    limitValueTypes?: ValueType[];
}

export const customFieldsTableColumns = ({
    handleDeleteCustomField,
    refetchCustomFields,
    objectType,
    limitValueTypes,
}: CustomFieldsTableColumnsProps): SettingsTableColumn<
    CustomField & {
        isDefault?: boolean;
        customHandlers?: CustomFieldHandlers;
    }
>[] => [
    {
        label: 'Label',
        key: 'label',
        render: (data) => (
            <>
                {data.label}
                {data.isDefault && <StadiumRequiredIndicator />}
            </>
        ),
    },
    {
        label: 'Type',
        key: 'value_type',
        render: (data) => {
            return (
                <Flex gap={12}>
                    {valueTypeContentMap[data.value_type].icon({
                        size: '20',
                        color: colors.Base.Black,
                    })}
                    {valueTypeContentMap[data.value_type].label}
                </Flex>
            );
        },
    },
    {
        label: 'Options',
        key: 'options',
        render: (data) => {
            const totalCFOptions = data.options?.length ?? 0;
            const visibleCFOptions = [...(data.options ?? [])].splice(0, 2);
            const remainingOptions = [...(data.options ?? [])].splice(2);

            return (
                <Group gap={4} wrap="nowrap">
                    {visibleCFOptions.map((option) => (
                        <CustomFieldOption
                            key={`select-option-${option}-${data.id}`}
                            option={option}
                        />
                    ))}
                    {totalCFOptions > 2 ? (
                        <Tooltip
                            label={
                                <Flex direction="column">
                                    {remainingOptions.map((option) => (
                                        <Text
                                            key={`select-option-${option}-${data.id}`}
                                        >
                                            {option}
                                        </Text>
                                    ))}
                                </Flex>
                            }
                            withinPortal
                        >
                            <S.RemainingOptionsContainer>
                                +{totalCFOptions - 2}
                            </S.RemainingOptionsContainer>
                        </Tooltip>
                    ) : null}
                </Group>
            );
        },
    },
    ...(shouldShowFilterableForObjectType(objectType)
        ? [
              {
                  label: 'Filterable',
                  key: 'filterable',
                  render: (
                      data: CustomField & {
                          isDefault?: boolean;
                          customHandlers?: CustomFieldHandlers;
                      }
                  ) => {
                      const fieldIncludedInFilters =
                          filterableFieldTypes.includes(data.value_type);
                      const isFilterable =
                          fieldIncludedInFilters &&
                          data.metadata?.filterable !== false;
                      return (
                          <Badge
                              color={isFilterable ? 'green' : 'gray'}
                              variant="light"
                          >
                              {isFilterable ? 'Yes' : 'No'}
                          </Badge>
                      );
                  },
              },
          ]
        : []),
    {
        label: '',
        key: 'actions',
        render: (data) => {
            return (
                <Flex>
                    <EditCustomFieldModal
                        objectType={objectType}
                        getTrigger={(setOpen) => (
                            <ActionIcon onClick={() => setOpen(true)}>
                                <Pencil
                                    variant="1"
                                    size="16"
                                    color={colors.Gray[400]}
                                />
                            </ActionIcon>
                        )}
                        field={data}
                        refetchCustomFields={refetchCustomFields}
                        cannotEditLabel={data.isDefault}
                        customHandlers={data.customHandlers}
                        limitValueTypes={limitValueTypes}
                    />
                    {data.isDefault ? null : (
                        <StadiumConfirmActionPopup
                            getTrigger={(setOpen) => (
                                <ActionIcon onClick={() => setOpen(true)}>
                                    <Trash
                                        variant="1"
                                        size="16"
                                        color={colors.Gray[400]}
                                    />
                                </ActionIcon>
                            )}
                            onConfirm={() => handleDeleteCustomField(data.id)}
                            title="Delete Custom Field"
                            description="Are you sure you want to delete this custom field? This action cannot be undone."
                            confirmButtonText="Delete"
                        />
                    )}
                </Flex>
            );
        },
        width: '97px',
    },
];

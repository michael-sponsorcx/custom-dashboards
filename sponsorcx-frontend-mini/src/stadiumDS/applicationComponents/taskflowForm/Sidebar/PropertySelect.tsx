import { GenericTask } from '@/gql/genericTask';
import * as S from './Relationships.styles';
import { primaryColors } from '@/stadiumDS/foundations/colors/primary';
import { FieldLabelText } from './FieldLabelText';
import Building from '@/stadiumDS/foundations/icons/General/Building';
import { SelectMenu } from '@/stadiumDS/sharedComponents/menu/SelectMenu';
import { UnstyledButton } from '@mantine/core';
import { useGenericTaskOperations } from '@/pages/propertyPages/Taskflow/hooks/useGenericTaskOperations';
import { useQuery } from '@apollo/client';
import useStore from '@/state';
import { accountQuery } from '@/gql/accountGql';
import { propertiesLookupQuery } from '@/gql/propertyGql';
import { StadiumRequiredIndicator } from '@/stadiumDS/sharedComponents/RequiredIndicator/StadiumRequiredIndicator';

interface PropertyOption {
    id: string;
    name: string;
}

interface AccountWithPropertiesResponse {
    account: {
        id: string;
        name: string;
        property_rels: Array<{
            property_id: string;
            property: { id: string; name: string };
        }>;
    } | null;
}

interface PropertiesLookupResponse {
    properties: Array<{ id: string; name: string }>;
}

export interface PropertySelectProps {
    task?: GenericTask;
    selectedAccountId?: string;
    selectedDealId?: string;
    dealAccountId?: string;
    required?: boolean;
    highlightRequiredFields?: boolean;
}

export const PropertySelect = ({
    task,
    selectedAccountId,
    selectedDealId,
    required = false,
    highlightRequiredFields = false,
}: PropertySelectProps) => {
    const { addRelationship, removeRelationship } = useGenericTaskOperations();
    const organization = useStore((state) => state.organization);

    const selectedPropertyRelationships = (task?.relationships ?? []).filter(
        (rel) => rel.related_entity_type === 'property'
    );
    // When a deal is selected, properties may be in related_entities (populated via JOINs)
    const propertiesFromDeal = task?.related_entities?.property ?? [];
    const selectedPropertyIds =
        selectedPropertyRelationships.length > 0
            ? selectedPropertyRelationships.map((rel) => rel.related_entity_id)
            : propertiesFromDeal.map((p) => p.id);

    const { data: accountData } = useQuery<AccountWithPropertiesResponse>(
        accountQuery,
        {
            variables: {
                id: selectedAccountId,
                organization_id: organization?.id,
            },
            skip: !organization?.id || !selectedAccountId,
            fetchPolicy: 'no-cache',
        }
    );

    const { data: allPropsData } = useQuery<PropertiesLookupResponse>(
        propertiesLookupQuery,
        {
            variables: {
                organization_id: organization?.id,
            },
            skip: !organization?.id,
            fetchPolicy: 'no-cache',
        }
    );

    const options: PropertyOption[] = (() => {
        // When only account is selected (no deal), show all properties to allow changing
        if (selectedAccountId && !selectedDealId) {
            return allPropsData?.properties ?? [];
        }
        // When account is selected with deal, show account's properties
        if (selectedAccountId) {
            const rels = accountData?.account?.property_rels ?? [];
            return rels.map((r) => ({
                id: r.property_id,
                name: r.property?.name || '',
            }));
        }
        return allPropsData?.properties ?? [];
    })();

    // Find selected property - check both options and related_entities
    const selectedProperty =
        options.find((prop) => prop.id === selectedPropertyIds[0]) ??
        (propertiesFromDeal.length > 0
            ? {
                  id: propertiesFromDeal[0].id,
                  name: propertiesFromDeal[0].name,
              }
            : undefined);

    const shouldHighlight =
        required && highlightRequiredFields && !selectedProperty;

    return (
        <>
            <SelectMenu
                trigger={
                    <UnstyledButton
                        style={{
                            position: 'relative',
                            cursor: 'pointer',
                            width: '100%',
                            display: 'block',
                            textAlign: 'left',
                        }}
                        aria-label={
                            selectedProperty
                                ? 'Change Property'
                                : 'Add Property'
                        }
                    >
                        <S.FieldLabel $highlight={shouldHighlight}>
                            {!selectedProperty && (
                                <Building
                                    variant="6"
                                    color={primaryColors.Gray[500]}
                                    size="20"
                                />
                            )}
                            {selectedProperty ? (
                                <FieldLabelText truncate>
                                    {propertiesFromDeal.length > 0 &&
                                    selectedDealId &&
                                    !selectedAccountId
                                        ? propertiesFromDeal
                                              .map((p) => p.name)
                                              .join(', ')
                                        : selectedProperty.name}
                                </FieldLabelText>
                            ) : (
                                <FieldLabelText>
                                    Add Property{' '}
                                    {required ? (
                                        <StadiumRequiredIndicator />
                                    ) : null}
                                </FieldLabelText>
                            )}
                        </S.FieldLabel>
                    </UnstyledButton>
                }
                items={options.map((prop) => ({
                    label: prop.name,
                    value: prop.id,
                    onClick: async () => {
                        if (!task?.id) return;

                        const existing = task?.relationships?.find(
                            (rel) => rel.related_entity_type === 'property'
                        );

                        // Toggle off if clicking the same property
                        if (existing?.related_entity_id === prop.id) {
                            if (existing.id) {
                                await removeRelationship(existing.id);
                            }
                            return;
                        }

                        // If deal exists, remove it first
                        const existingDealRel = task?.relationships?.find(
                            (rel) => rel.related_entity_type === 'agreement'
                        );
                        if (existingDealRel?.id) {
                            await removeRelationship(existingDealRel.id);
                        }

                        // If account exists (and we're changing property), remove it
                        // This happens when only account is selected (no deal)
                        const existingAccountRel = task?.relationships?.find(
                            (rel) => rel.related_entity_type === 'account'
                        );
                        if (
                            existingAccountRel?.id &&
                            selectedAccountId &&
                            !selectedDealId
                        ) {
                            await removeRelationship(existingAccountRel.id);
                        }

                        // Remove existing property before adding new one
                        if (
                            existing?.id &&
                            existing.related_entity_id !== prop.id
                        ) {
                            await removeRelationship(existing.id);
                        }

                        // Add the new property relationship
                        await addRelationship(task.id, 'property', prop.id);
                    },
                }))}
                withinPortal={false}
                multiple={false}
                value={selectedPropertyIds[0]}
                closeOnItemClick
                searchable
            />
        </>
    );
};

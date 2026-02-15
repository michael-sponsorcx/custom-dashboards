import { GenericTask } from '@/gql/genericTask';
import * as S from './Relationships.styles';
import { primaryColors } from '@/stadiumDS/foundations/colors/primary';
import { FieldLabelText } from './FieldLabelText';
import { CircleDollar } from '@/assets/icons/CircleDollar';
import { SelectMenu } from '@/stadiumDS/sharedComponents/menu/SelectMenu';
import { UnstyledButton } from '@mantine/core';
import { useGenericTaskOperations } from '@/pages/propertyPages/Taskflow/hooks/useGenericTaskOperations';
import { CXLink } from '@/components/CXLink';
import { useOrganizationDeals } from '@/hooks/useOrganizationDeals';
import { StadiumRequiredIndicator } from '@/stadiumDS/sharedComponents/RequiredIndicator/StadiumRequiredIndicator';

export const DealNumberSelect = ({
    task,
    selectedAccountId,
    selectedPropertyIds = [],
    required = false,
    highlightRequiredFields = false,
}: {
    task?: GenericTask;
    selectedAccountId?: string;
    selectedPropertyIds?: string[];
    required?: boolean;
    highlightRequiredFields?: boolean;
}) => {
    const { deals } = useOrganizationDeals({
        accountIds: selectedAccountId ? [selectedAccountId] : undefined,
        propertyIds: selectedPropertyIds.length
            ? selectedPropertyIds
            : undefined,
    });

    const { addRelationship, removeRelationship } = useGenericTaskOperations();

    const existingDealRel = task?.relationships?.find(
        (rel) => rel.related_entity_type === 'agreement'
    );
    const selectedDeal = existingDealRel
        ? deals.find((d) => d.id === existingDealRel.related_entity_id)
        : undefined;

    const shouldHighlight =
        required && highlightRequiredFields && !selectedDeal;

    return (
        <SelectMenu
            trigger={
                <UnstyledButton
                    style={{
                        position: 'relative',
                        cursor: 'pointer',
                    }}
                    aria-label={
                        selectedDeal ? 'Change Deal Number' : 'Add Deal Number'
                    }
                >
                    <S.FieldLabel $highlight={shouldHighlight}>
                        {!selectedDeal && (
                            <CircleDollar
                                color={primaryColors.Gray[500]}
                                size="20"
                            />
                        )}
                        {selectedDeal ? (
                            <CXLink
                                to={`/accounts/${selectedDeal.account_id}/agreements/${selectedDeal.id}?from=taskflow`}
                            >
                                {selectedDeal.agreement_number}
                            </CXLink>
                        ) : (
                            <FieldLabelText>
                                Add Deal Number{' '}
                                {required ? <StadiumRequiredIndicator /> : null}
                            </FieldLabelText>
                        )}
                    </S.FieldLabel>
                </UnstyledButton>
            }
            items={deals.map((deal) => ({
                label: deal.agreement_number,
                value: deal.id,
                onClick: async () => {
                    if (!task?.id) return;

                    // Toggle off if the selected deal is clicked again
                    if (existingDealRel?.related_entity_id === deal.id) {
                        if (existingDealRel.id) {
                            await removeRelationship(existingDealRel.id);
                        }
                        return;
                    }

                    // Remove existing deal before adding new one
                    if (
                        existingDealRel?.id &&
                        existingDealRel.related_entity_id !== deal.id
                    ) {
                        await removeRelationship(existingDealRel.id);
                    }

                    // Add the new deal relationship
                    // Backend automatically removes account and property relationships
                    await addRelationship(task.id, 'agreement', deal.id);
                },
            }))}
            withinPortal={false}
            multiple={false}
            value={selectedDeal?.id}
            closeOnItemClick
            searchable
        />
    );
};

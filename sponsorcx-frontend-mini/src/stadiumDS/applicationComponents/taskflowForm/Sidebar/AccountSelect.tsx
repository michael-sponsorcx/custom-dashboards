import { GenericTask } from '@/gql/genericTask';
import * as S from './Relationships.styles';
import { primaryColors } from '@/stadiumDS/foundations/colors/primary';
import { FieldLabelText } from './FieldLabelText';
import Building from '@/stadiumDS/foundations/icons/General/Building';
import { SelectMenu } from '@/stadiumDS/sharedComponents/menu/SelectMenu';
import { UnstyledButton } from '@mantine/core';
import { useGenericTaskOperations } from '@/pages/propertyPages/Taskflow/hooks/useGenericTaskOperations';
import { useAccountsByProperties } from '@/hooks/useAccountsByProperties';
import { useQuery } from '@apollo/client';
import useStore from '@/state';
import {
    accountBasicQuery,
    getAllAccountIdsNamesQuery,
} from '@/gql/accountGql';
import { CXLink } from '@/components/CXLink';
import { StadiumRequiredIndicator } from '@/stadiumDS/sharedComponents/RequiredIndicator/StadiumRequiredIndicator';

interface AccountNamesResponse {
    accounts: Array<{ id: string; name: string }>;
}

interface AccountBasicResponse {
    account: { id: string; name: string } | null;
}

export interface AccountSelectProps {
    task?: GenericTask;
    selectedPropertyIds?: string[];
    selectedDealId?: string;
    required?: boolean;
    highlightRequiredFields?: boolean;
}

export const AccountSelect = ({
    task,
    selectedPropertyIds = [],
    selectedDealId,
    required = false,
    highlightRequiredFields = false,
}: AccountSelectProps) => {
    const { addRelationship, removeRelationship } = useGenericTaskOperations();
    const organization = useStore((state) => state.organization);

    const existingAccountRel = task?.relationships?.find(
        (rel) => rel.related_entity_type === 'account'
    );
    // When a deal is selected, account may be in related_entities (populated via JOINs)
    const accountFromDeal = task?.related_entities?.account?.[0];
    const selectedAccountId =
        existingAccountRel?.related_entity_id ?? accountFromDeal?.id;

    // Query account data for display when account ID is available
    const { data: dealAccountData } = useQuery<AccountBasicResponse>(
        accountBasicQuery,
        {
            variables: {
                id: selectedAccountId,
                organization_id: organization?.id,
            },
            skip: !selectedAccountId,
            fetchPolicy: 'no-cache',
        }
    );

    // Accounts filtered by properties
    const { accounts: accountsByProps } = useAccountsByProperties({
        propertyIds: selectedPropertyIds,
    });

    // Fallback: all accounts for org (names only)
    const { data: allAccountsData } = useQuery<AccountNamesResponse>(
        getAllAccountIdsNamesQuery,
        {
            variables: { organization_id: organization?.id },
            skip: !organization?.id || selectedPropertyIds.length > 0,
            fetchPolicy: 'no-cache',
        }
    );

    const options =
        selectedPropertyIds.length > 0
            ? accountsByProps.map((a) => ({ id: a.id, name: a.name }))
            : allAccountsData?.accounts ?? [];

    const selectedAccountName = (() => {
        if (selectedAccountId) {
            // First check if account name is in related_entities (from deal)
            if (accountFromDeal?.name) return accountFromDeal.name;
            // Then check options
            const inOptions = options.find((a) => a.id === selectedAccountId);
            if (inOptions) return inOptions.name;
            // Finally check query data
            if (dealAccountData?.account?.name)
                return dealAccountData.account.name;
        }
        return undefined;
    })();

    const shouldHighlight =
        required && highlightRequiredFields && !selectedAccountId;

    return (
        <SelectMenu
            trigger={
                <UnstyledButton
                    style={{ position: 'relative', cursor: 'pointer' }}
                    aria-label={
                        selectedAccountId ? 'Change Account' : 'Add Account'
                    }
                >
                    <S.FieldLabel $highlight={shouldHighlight}>
                        {!selectedAccountId && (
                            <Building
                                variant="6"
                                color={primaryColors.Gray[500]}
                                size="20"
                            />
                        )}
                        {selectedAccountId && selectedAccountName ? (
                            <CXLink
                                to={`/accounts/${selectedAccountId}?from=taskflow`}
                            >
                                {selectedAccountName}
                            </CXLink>
                        ) : (
                            <FieldLabelText>
                                Add Account{' '}
                                {required ? <StadiumRequiredIndicator /> : null}
                            </FieldLabelText>
                        )}
                    </S.FieldLabel>
                </UnstyledButton>
            }
            items={options.map((acc) => ({
                label: acc.name,
                value: acc.id,
                onClick: async () => {
                    if (!task?.id) return;
                    const existing = task?.relationships?.find(
                        (rel) => rel.related_entity_type === 'account'
                    );

                    // Toggle off if the selected account is clicked again
                    if (existing?.related_entity_id === acc.id) {
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

                    // Remove existing account before adding new one
                    if (existing?.id && existing.related_entity_id !== acc.id) {
                        await removeRelationship(existing.id);
                    }

                    // Add the new account relationship
                    // Backend automatically removes property relationships
                    await addRelationship(task.id, 'account', acc.id);
                },
            }))}
            withinPortal={false}
            multiple={false}
            value={selectedAccountId}
            closeOnItemClick
            searchable
        />
    );
};

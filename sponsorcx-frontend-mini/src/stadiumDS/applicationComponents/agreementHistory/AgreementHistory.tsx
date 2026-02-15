import { useEffect, useState, useMemo } from 'react';
import * as ContentStyles from '../assetForm/Content';
import * as S from '../assetForm/Content/AssetHistory.styles';
import Chevron from '@/stadiumDS/foundations/icons/Arrows/Chevron';
import colors from '@/stadiumDS/foundations/colors';
import { Collapse, Tooltip } from '@mantine/core';
import { formatDistanceToNow, formatDuration } from 'date-fns';
import { getUserName } from '@/components/UserInfo';
import { AssetHistoryIcon } from '../assetForm/Content/AssetHistoryIcon';
import Ellipse from '@/stadiumDS/foundations/icons/General/Ellipse';
import { formatDate } from '@/utils/helpers';
import { useUserOptions } from '@/hooks/useUserOptions';
import { useTypeOptions } from '@/hooks/useTypeOptions';
import { usePropertyOptions } from '@/hooks/usePropertyOptions';
import { useAgreementHistory } from '@/hooks/useAgreementHistory';
import useCustomFields from '@/hooks/useCustomFields';
import { CustomField, ObjectType } from '@/gql/customFieldGql';
import { DropdownOptionType } from '@/hooks/useAccountOptions';
import { RecordHistory } from '@/gql/recordHistoryGql';
import { AgreementHistoryAction } from './AgreementHistoryAction';
import { useContactOptions } from '@/hooks/useContactOptions';
import { Agreement } from '@/gql/agreementGql';
import { usePercentCloseOptions } from '@/hooks/usePercentCloseOptions';
import { useFiscalYearsOptions } from '@/hooks/useFiscalYears';
import { useOrganizationAgreementValues } from '@/hooks/useOrganizationAgreementValues';
import { OrganizationAgreementValue } from '@/gql/organizationAgreementValuesGql';
import useOrganizationPackageOptions from '@/hooks/useOrganizationPackageOptions';
import { RecordHistoryGroup } from '../FormSlideOut/components/HistorySection/HistorySection.type';
import { useAgencySelection } from '@/pages/propertyPages/account/Agreement/AgreementHeader/components/useAgencySelection';
import { useBillingContactSelection } from '@/pages/propertyPages/account/Agreement/AgreementHeader/components/useBillingContactSelection';
import { useScxFlagIsOn } from '@/hooks/useScxFlagIsOn';
import { useQuery } from '@apollo/client';
import { organizationAgreementOptionTypesQuery } from '@/gql/organizationAgreementOptionTypeGql';
import useStore from '@/state';

export const AgreementHistoryGroup = ({
    recordHistoryGroup,
    lastItem,
    userOptions,
    propertyOptions,
    typeOptions,
    customFieldOptions,
    contactOptions,
    percentToCloseSteps,
    fiscalYearOptions,
    organizationAgreementValues,
    packageOptions,
    agencyOptions,
    showAgencyOnDealPage,
    billingContactOptions,
    optionTypeMap,
    optionTypesLoading,
    optionTypesError,
}: {
    recordHistoryGroup: RecordHistoryGroup;
    lastItem: boolean;
    userOptions: DropdownOptionType[];
    propertyOptions: DropdownOptionType[];
    typeOptions: {
        key: string;
        text: string;
        value: string;
    }[];
    customFieldOptions: CustomField[];
    contactOptions: DropdownOptionType[];
    percentToCloseSteps: DropdownOptionType[];
    fiscalYearOptions: DropdownOptionType[];
    organizationAgreementValues: OrganizationAgreementValue[];
    packageOptions: DropdownOptionType[];
    agencyOptions: DropdownOptionType[];
    showAgencyOnDealPage: boolean;
    billingContactOptions: DropdownOptionType[];
    optionTypeMap: Map<string, string>;
    optionTypesLoading: boolean;
    optionTypesError: Error | undefined;
}) => {
    const [open, setOpen] = useState(false);

    const { items, userName, durationSeconds } = recordHistoryGroup;

    // Format the duration string
    const durationText = formatDuration({
        minutes: Math.max(1, Math.ceil(durationSeconds / 60)),
    });

    return (
        <>
            <S.HistoryItem>
                <S.HistoryGroupCollapseButton onClick={() => setOpen(!open)}>
                    <S.RotatingChevron isOpen={open}>
                        <Chevron
                            variant="right"
                            size="16"
                            color={colors.Gray[600]}
                        />
                    </S.RotatingChevron>
                </S.HistoryGroupCollapseButton>
                <S.HistoryGroupHeaderText>
                    {items.length} fields updated by {userName} within{' '}
                    {durationText}
                </S.HistoryGroupHeaderText>
            </S.HistoryItem>
            <Collapse in={open}>
                <S.HistorySeparator />
                {items.map((item) => (
                    <AgreementHistoryItem
                        key={item.id}
                        lastItem={false}
                        item={item}
                        userOptions={userOptions}
                        contactOptions={contactOptions}
                        propertyOptions={propertyOptions}
                        typeOptions={typeOptions}
                        customFieldOptions={customFieldOptions}
                        percentToCloseSteps={percentToCloseSteps}
                        fiscalYearOptions={fiscalYearOptions}
                        organizationAgreementValues={
                            organizationAgreementValues
                        }
                        packageOptions={packageOptions}
                        agencyOptions={agencyOptions}
                        showAgencyOnDealPage={showAgencyOnDealPage}
                        billingContactOptions={billingContactOptions}
                        optionTypeMap={optionTypeMap}
                        optionTypesLoading={optionTypesLoading}
                        optionTypesError={optionTypesError}
                    />
                ))}
                <S.HistoryGroupFooter />
            </Collapse>
            {!lastItem && !open && <S.HistorySeparator />}
        </>
    );
};

export const AgreementHistoryItem = ({
    item,
    lastItem,
    userOptions,
    contactOptions,
    propertyOptions,
    typeOptions,
    customFieldOptions,
    percentToCloseSteps,
    fiscalYearOptions,
    organizationAgreementValues,
    packageOptions,
    agencyOptions,
    showAgencyOnDealPage,
    billingContactOptions,
    optionTypeMap,
    optionTypesLoading,
    optionTypesError,
}: {
    item: RecordHistory;
    lastItem: boolean;
    userOptions: DropdownOptionType[];
    contactOptions: DropdownOptionType[];
    propertyOptions: DropdownOptionType[];
    typeOptions: {
        key: string;
        text: string;
        value: string;
    }[];
    customFieldOptions: CustomField[];
    percentToCloseSteps: DropdownOptionType[];
    fiscalYearOptions: DropdownOptionType[];
    organizationAgreementValues: OrganizationAgreementValue[];
    packageOptions: DropdownOptionType[];
    agencyOptions: DropdownOptionType[];
    showAgencyOnDealPage: boolean;
    billingContactOptions: DropdownOptionType[];
    optionTypeMap: Map<string, string>;
    optionTypesLoading: boolean;
    optionTypesError: Error | undefined;
}) => {
    const [distanceToNow, setDistanceToNow] = useState(
        formatDistanceToNow(new Date(item.created_at))
    );

    useEffect(() => {
        const timer = setInterval(() => {
            setDistanceToNow(formatDistanceToNow(new Date(item.created_at)));
        }, 60000); // Update every minute

        return () => clearInterval(timer);
    }, []);

    const userFullName = getUserName({
        first_name: item.user?.first_name,
        last_name: item.user?.last_name,
    });

    return (
        <S.AnimatedHistoryItem delay={0.1}>
            <S.HistoryItem>
                <AssetHistoryIcon item={item} />
                <S.HistoryText>
                    <S.HistoryAction>{userFullName}</S.HistoryAction>{' '}
                    <AgreementHistoryAction
                        item={item}
                        userOptions={userOptions}
                        contactOptions={contactOptions}
                        percentToCloseSteps={percentToCloseSteps}
                        fiscalYearOptions={fiscalYearOptions}
                        organizationAgreementValues={
                            organizationAgreementValues
                        }
                        propertyOptions={propertyOptions}
                        packageOptions={packageOptions}
                        typeOptions={typeOptions}
                        customFieldOptions={customFieldOptions}
                        agencyOptions={agencyOptions}
                        showAgencyOnDealPage={showAgencyOnDealPage}
                        billingContactOptions={billingContactOptions}
                        optionTypeMap={optionTypeMap}
                        optionTypesLoading={optionTypesLoading}
                        optionTypesError={optionTypesError}
                    />
                </S.HistoryText>
                <S.HistoryGapIndicator>
                    <Ellipse />
                </S.HistoryGapIndicator>
                <Tooltip
                    label={formatDate(item.created_at, 'MMM d, yyyy')}
                    openDelay={250}
                >
                    <S.HistoryTime>{distanceToNow} ago</S.HistoryTime>
                </Tooltip>
            </S.HistoryItem>
            {!lastItem && <S.HistorySeparator />}
        </S.AnimatedHistoryItem>
    );
};

export interface AgreementHistoryProps {
    agreement?: Agreement;
}

export const AgreementHistory = ({ agreement }: AgreementHistoryProps) => {
    const propertyOptions = usePropertyOptions();
    const userOptions = useUserOptions();
    const typeOptions = useTypeOptions();
    const percentToCloseSteps = usePercentCloseOptions();
    const contactOptions = useContactOptions(agreement?.account_id ?? '');
    const fiscalYearOptions = useFiscalYearsOptions();
    const organizationAgreementValues = useOrganizationAgreementValues();
    const packageOptions = useOrganizationPackageOptions();
    const { customFields } = useCustomFields({
        objectType: ObjectType.AGREEMENT,
    });

    const billingContactOptionsResult = useBillingContactSelection({
        agreementId: agreement?.id,
        billingContactId: agreement?.billing_contact_id,
        agencyId: agreement?.agency_id,
        accountId: agreement?.account_id,
    });

    const billingContactOptions = billingContactOptionsResult.options.map(
        (option) => ({
            key: String(option.value),
            value: String(option.value),
            text: String(option.text),
        })
    );

    const agencyOptions = useAgencySelection({
        agreementId: agreement?.id,
    });

    const agencyOptionsDropdown = agencyOptions.options.map((option) => ({
        key: String(option.value),
        value: String(option.value),
        text: String(option.text),
    }));

    const showAgencyOnDealPage = useScxFlagIsOn('show_agency_on_deals_page');

    const { data } = useAgreementHistory(agreement?.id);

    const organization = useStore((state) => state.organization);

    // Fetch both archived and non-archived option types for historical records
    const {
        data: optionTypesData,
        loading: optionTypesLoading,
        error: optionTypesError,
    } = useQuery(organizationAgreementOptionTypesQuery, {
        variables: {
            organization_id: organization.id,
            archived: false,
        },
        fetchPolicy: 'no-cache',
        skip: !organization.id,
    });

    const { data: archivedOptionTypesData } = useQuery(
        organizationAgreementOptionTypesQuery,
        {
            variables: {
                organization_id: organization.id,
                archived: true,
            },
            fetchPolicy: 'no-cache',
            skip: !organization.id,
        }
    );

    // Create a unified map from organization_agreement_option_type_id to name
    const optionTypeMap = useMemo(() => {
        const map = new Map<string, string>();
        const nonArchived =
            optionTypesData?.organizationAgreementOptionTypes || [];
        const archived =
            archivedOptionTypesData?.organizationAgreementOptionTypes || [];
        [...nonArchived, ...archived].forEach(
            (type: { id: string; name: string }) => {
                map.set(type.id, type.name);
            }
        );
        return map;
    }, [
        optionTypesData?.organizationAgreementOptionTypes,
        archivedOptionTypesData?.organizationAgreementOptionTypes,
    ]);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '32px',
                padding: '24px 48px',
                width: '100%',
                overflowY: 'auto',
                scrollbarWidth: 'thin',
            }}
        >
            <ContentStyles.Container>
                <ContentStyles.Header>Deal History</ContentStyles.Header>
                <S.HistoryList>
                    {data.map((group, index) => (
                        <S.AnimatedHistoryItem key={index} delay={index * 0.1}>
                            {group.items.length > 1 ? (
                                <AgreementHistoryGroup
                                    lastItem={index === data.length - 1}
                                    recordHistoryGroup={group}
                                    userOptions={userOptions}
                                    propertyOptions={propertyOptions}
                                    typeOptions={typeOptions}
                                    customFieldOptions={customFields}
                                    contactOptions={contactOptions}
                                    percentToCloseSteps={percentToCloseSteps}
                                    fiscalYearOptions={fiscalYearOptions}
                                    organizationAgreementValues={
                                        organizationAgreementValues
                                    }
                                    packageOptions={packageOptions}
                                    agencyOptions={agencyOptionsDropdown}
                                    showAgencyOnDealPage={showAgencyOnDealPage}
                                    billingContactOptions={
                                        billingContactOptions
                                    }
                                    optionTypeMap={optionTypeMap}
                                    optionTypesLoading={optionTypesLoading}
                                    optionTypesError={optionTypesError}
                                />
                            ) : (
                                <AgreementHistoryItem
                                    lastItem={index === data.length - 1}
                                    item={group.items[0]}
                                    userOptions={userOptions}
                                    contactOptions={contactOptions}
                                    propertyOptions={propertyOptions}
                                    typeOptions={typeOptions}
                                    customFieldOptions={customFields}
                                    percentToCloseSteps={percentToCloseSteps}
                                    fiscalYearOptions={fiscalYearOptions}
                                    organizationAgreementValues={
                                        organizationAgreementValues
                                    }
                                    packageOptions={packageOptions}
                                    agencyOptions={agencyOptionsDropdown}
                                    showAgencyOnDealPage={showAgencyOnDealPage}
                                    billingContactOptions={
                                        billingContactOptions
                                    }
                                    optionTypeMap={optionTypeMap}
                                    optionTypesLoading={optionTypesLoading}
                                    optionTypesError={optionTypesError}
                                />
                            )}
                        </S.AnimatedHistoryItem>
                    ))}
                </S.HistoryList>
            </ContentStyles.Container>
        </div>
    );
};

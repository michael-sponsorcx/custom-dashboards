import { Box, Tooltip } from '@mantine/core';
import LinkExternal02 from '@/stadiumDS/foundations/icons/General/LinkExternal02';
import { ColumnDef } from '@tanstack/react-table';
import { useTableExport } from '@/hooks/useTableExport';
import { useMemo } from 'react';
import {
    Agreement,
    agreementHistoryQuery,
    agreementHistoryQueryName,
} from '@/gql/agreementGql';
import { RecordHistory } from '@/gql/recordHistoryGql';
import { stadiumToast } from '@/stadiumDS/applicationComponents/Toasts/StadiumToast.helpers';
import { useUserOptions } from '@/hooks/useUserOptions';
import { useContactOptions } from '@/hooks/useContactOptions';
import {
    createHistoryFormatContext,
    buildAgreementHistoryColumns,
} from './agreementHistoryExport';
import { useFiscalYearsOptions } from '@/hooks/useFiscalYears';
import { usePropertyOptions } from '@/hooks/usePropertyOptions';
import { useInventoryOptions } from '@/hooks/useInventoryOptions';
import useOrganizationPackageOptions from '@/hooks/useOrganizationPackageOptions';
import { useOrganizationAgreementValues } from '@/hooks/useOrganizationAgreementValues';
import { usePercentCloseOptions } from '@/hooks/usePercentCloseOptions';
import { useQuery } from '@apollo/client';
import { organizationAgreementOptionTypesQuery } from '@/gql/organizationAgreementOptionTypeGql';
import useStore from '@/state';

interface AgreementHistoryExportLinkProps {
    agreement: Agreement;
}

export const AgreementHistoryExportLink = ({
    agreement,
}: AgreementHistoryExportLinkProps) => {
    const userOptions = useUserOptions();
    const contactOptions = useContactOptions(agreement.account_id ?? '');
    const percentToCloseSteps = usePercentCloseOptions();
    const fiscalYearsOptions = useFiscalYearsOptions();
    const propertiesOptions = usePropertyOptions();
    const inventoriesOptions = useInventoryOptions();
    const organizationPackagesOptions = useOrganizationPackageOptions();
    const agreementValuesOptions = useOrganizationAgreementValues();
    const organization = useStore((state) => state.organization);

    // Fetch both archived and non-archived option types for historical records
    const { data: optionTypesData } = useQuery(
        organizationAgreementOptionTypesQuery,
        {
            variables: {
                organization_id: organization.id,
                archived: false,
            },
            fetchPolicy: 'no-cache',
            skip: !organization.id,
        }
    );

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

    const optionTypesOptions = useMemo(() => {
        const nonArchived =
            optionTypesData?.organizationAgreementOptionTypes || [];
        const archived =
            archivedOptionTypesData?.organizationAgreementOptionTypes || [];
        return [...nonArchived, ...archived].map((type) => ({
            value: type.id,
            text: type.name,
        }));
    }, [
        optionTypesData?.organizationAgreementOptionTypes,
        archivedOptionTypesData?.organizationAgreementOptionTypes,
    ]);

    const historyFormatContext = useMemo(() => {
        return createHistoryFormatContext(
            percentToCloseSteps.map((s) => ({
                id: String(s.value),
                label: String(s.text),
            })),
            userOptions.map((o) => ({
                value: String(o.value),
                text: String(o.text),
            })),
            contactOptions.map((o) => ({
                value: String(o.value),
                text: String(o.text),
            })),
            fiscalYearsOptions.map((o) => ({
                value: String(o.value),
                text: String(o.text),
            })),
            propertiesOptions.map((o) => ({
                value: String(o.value),
                text: String(o.text),
            })),
            inventoriesOptions.map((o) => ({
                value: String(o.value),
                text: String(o.text),
            })),
            organizationPackagesOptions.map((o) => ({
                value: String(o.value),
                text: String(o.text),
            })),
            agreementValuesOptions.map((o) => ({
                value: String(o.id),
                text: String(o.label),
            })),
            optionTypesOptions
        );
    }, [
        percentToCloseSteps,
        userOptions,
        contactOptions,
        fiscalYearsOptions,
        propertiesOptions,
        inventoriesOptions,
        organizationPackagesOptions,
        agreementValuesOptions,
        optionTypesOptions,
    ]);

    const columns: ColumnDef<RecordHistory, unknown>[] = useMemo(
        () => buildAgreementHistoryColumns(historyFormatContext),
        [historyFormatContext]
    );

    const { handleExport, loading } = useTableExport<RecordHistory>({
        exportFileName: 'agreement_history',
        query: agreementHistoryQuery,
        queryName: agreementHistoryQueryName,
        variables: {
            organization_id: agreement.organization_id,
            agreement_id: agreement.id,
            archived: false,
        },
        columns,
    });

    const onExportClick = () => {
        if (!agreement.id || !agreement.organization_id) {
            stadiumToast.error('Missing agreement details for export');
            return;
        }
        if (!loading) {
            handleExport();
        }
    };

    return (
        <Tooltip label="Export" zIndex={2000} withinPortal withArrow>
            <Box
                onClick={onExportClick}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingRight: '10px',
                    paddingTop: '6px',
                    paddingBottom: '6px',
                    height: '30px',
                }}
            >
                <LinkExternal02 color="gray" size="18" />
            </Box>
        </Tooltip>
    );
};

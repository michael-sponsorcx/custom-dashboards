import { RecordHistory, RecordHistoryActionType } from '@/gql/recordHistoryGql';
import {
    AgreementCreatedAction,
    AgreementAccountManagerUpdatedAction,
    AgreementPrimaryContactUpdatedAction,
    AgreementDescriptionAction,
    AgreementSubmittedForApprovalAction,
    AgreementApprovalRejectedAction,
    AgreementUploadedSignedDocAction,
    AgreementFulfillmentCreatedAction,
    AgreementProjectedDateUpdatedAction,
    AgreementClosedDateUpdatedAction,
    AgreementStageUpdatedAction,
    AgreementGrossUpdatedForFYAction,
    AgreementAgreementValuesUpdatedAction,
    AgreementFYDeletedAction,
    AgreementAssetAddedAction,
    AgreementAssetRemovedAction,
    AgreementPackageAddedAction,
    AgreementPackageRemovedAction,
    AgreementBillingFrequencySetAction,
    AgreementInvoiceAddedAction,
    AgreementInvoiceDeletedAction,
    AgreementInvoiceGeneratedAction,
    AgreementBusinessTypeChangedAction,
    AgreementFileUploadedAction,
    AgreementFileDeletedAction,
    AgreementApprovalApprovedAction,
    AgreementStartDateUpdatedAction,
    AgreementEndDateUpdatedAction,
    AgreementGrossUpdatedForPropertyAction,
    AgreementAgreementInventoryAddedAction,
    AgreementInvoiceFileAddedAction,
    AgreementInvoiceFileDeletedAction,
    AgreementInvoicePaymentAddedAction,
    AgreementInvoicePaymentDeletedAction,
    AgreementNumberUpdatedAction,
    AgreementStartedOverAction,
    AgreementAssetNotesAction,
    AgreementInventoryCustomFieldsAction,
    AgreementInventoryLockedRateAction,
    AgreementInventoryScheduledUnitsAction,
    AgreementInventoryRateAction,
    AgreementAccountManagerCreatedAction,
    AgreementPrimaryContactCreatedAction,
    AgreementInvoiceDownloadedAction,
    AgreementInvoiceUpdatedAction,
    AgreementLockedAction,
    AgreementUnlockedAction,
    AgreementBillingContactUpdatedAction,
    AgreementAgencyUpdatedAction,
    AgreementFYLockedAction,
    AgreementFYUnlockedAction,
    AgreementFiscalYearCustomFieldsAction,
    AgreementInvoiceAmountAction,
    AgreementInvoiceBillingDateAction,
    AgreementInvoiceDueDateAction,
    AgreementInvoiceInvoiceNumberAction,
    AgreementInvoiceCustomFieldsAction,
    AgreementHardCostAddedAction,
    AgreementHardCostRemovedAction,
    AgreementHardCostUpdatedAction,
    AgreementDealNotesAction,
    AgreementCustomFieldsAction,
    AgreementTaskCreatedAction,
    AgreementTaskArchivedAction,
    AgreementTaskStatusChangedAction,
    AgreementTradeCollectedAction,
    AgreementTradeCollectedRemovedAction,
    AgreementOptionAddedAction,
    AgreementOptionUpdatedAction,
    AgreementOptionExercisedAction,
    AgreementOptionDeletedAction,
} from './AgreementHistoryActions';
import { DropdownOptionType } from '@/hooks/useAccountOptions';
import { OrganizationAgreementValue } from '@/gql/organizationAgreementValuesGql';
import { CustomField } from '@/gql/customFieldGql';

const actionComponentMap = {
    // General Information
    [RecordHistoryActionType.AGREEMENT_CREATED]: AgreementCreatedAction,
    [RecordHistoryActionType.AGREEMENT_STARTED_OVER]:
        AgreementStartedOverAction,
    [RecordHistoryActionType.AGREEMENT_ACCOUNT_MANAGER_CREATED]:
        AgreementAccountManagerCreatedAction,
    [RecordHistoryActionType.AGREEMENT_ACCOUNT_MANAGER_UPDATED]:
        AgreementAccountManagerUpdatedAction,
    [RecordHistoryActionType.AGREEMENT_PRIMARY_CONTACT_CREATED]:
        AgreementPrimaryContactCreatedAction,
    [RecordHistoryActionType.AGREEMENT_PRIMARY_CONTACT_UPDATED]:
        AgreementPrimaryContactUpdatedAction,
    [RecordHistoryActionType.AGREEMENT_BILLING_CONTACT_UPDATED]:
        AgreementBillingContactUpdatedAction,
    [RecordHistoryActionType.AGREEMENT_AGENCY_UPDATED]:
        AgreementAgencyUpdatedAction,
    [RecordHistoryActionType.AGREEMENT_DESCRIPTION]: AgreementDescriptionAction,

    // Deal Status
    [RecordHistoryActionType.AGREEMENT_SUBMITTED_FOR_APPROVAL]:
        AgreementSubmittedForApprovalAction,
    [RecordHistoryActionType.AGREEMENT_APPROVAL_APPROVED]:
        AgreementApprovalApprovedAction,
    [RecordHistoryActionType.AGREEMENT_APPROVAL_REJECTED]:
        AgreementApprovalRejectedAction,
    [RecordHistoryActionType.AGREEMENT_UPLOADED_SIGNED_DOC]:
        AgreementUploadedSignedDocAction,
    [RecordHistoryActionType.AGREEMENT_FULFILLMENT_CREATED]:
        AgreementFulfillmentCreatedAction,
    [RecordHistoryActionType.AGREEMENT_LOCKED]: AgreementLockedAction,
    [RecordHistoryActionType.AGREEMENT_UNLOCKED]: AgreementUnlockedAction,

    // Deal Details
    [RecordHistoryActionType.AGREEMENT_NUMBER_UPDATED]:
        AgreementNumberUpdatedAction,
    [RecordHistoryActionType.AGREEMENT_START_DATE_UPDATED]:
        AgreementStartDateUpdatedAction,
    [RecordHistoryActionType.AGREEMENT_END_DATE_UPDATED]:
        AgreementEndDateUpdatedAction,
    [RecordHistoryActionType.AGREEMENT_PROJECTED_DATE_UPDATED]:
        AgreementProjectedDateUpdatedAction,
    [RecordHistoryActionType.AGREEMENT_CLOSED_DATE_UPDATED]:
        AgreementClosedDateUpdatedAction,
    [RecordHistoryActionType.AGREEMENT_STAGE_UPDATED]:
        AgreementStageUpdatedAction,
    [RecordHistoryActionType.AGREEMENT_GROSS_UPDATED_FOR_FY]:
        AgreementGrossUpdatedForFYAction,
    [RecordHistoryActionType.AGREEMENT_AGREEMENT_VALUES_UPDATED]:
        AgreementAgreementValuesUpdatedAction,
    [RecordHistoryActionType.AGREEMENT_INVENTORY_LOCKED_RATE]:
        AgreementInventoryLockedRateAction,
    [RecordHistoryActionType.AGREEMENT_INVENTORY_UNITS_SCHEDULED]:
        AgreementInventoryScheduledUnitsAction,
    [RecordHistoryActionType.AGREEMENT_INVENTORY_RATE]:
        AgreementInventoryRateAction,
    [RecordHistoryActionType.AGREEMENT_GROSS_UPDATED_FOR_PROPERTY]:
        AgreementGrossUpdatedForPropertyAction,
    [RecordHistoryActionType.AGREEMENT_FY_DELETED]: AgreementFYDeletedAction,
    [RecordHistoryActionType.AGREEMENT_ASSET_ADDED]: AgreementAssetAddedAction,
    [RecordHistoryActionType.AGREEMENT_ASSET_REMOVED]:
        AgreementAssetRemovedAction,
    [RecordHistoryActionType.AGREEMENT_PACKAGE_ADDED]:
        AgreementPackageAddedAction,
    [RecordHistoryActionType.AGREEMENT_PACKAGE_REMOVED]:
        AgreementPackageRemovedAction,
    [RecordHistoryActionType.AGREEMENT_AGREEMENT_INVENTORY_ADDED]:
        AgreementAgreementInventoryAddedAction,
    [RecordHistoryActionType.AGREEMENT_INVENTORY_NOTES]:
        AgreementAssetNotesAction,
    [RecordHistoryActionType.AGREEMENT_INVENTORY_CUSTOM_FIELDS]:
        AgreementInventoryCustomFieldsAction,
    [RecordHistoryActionType.AGREEMENT_FY_LOCK]: AgreementFYLockedAction,
    [RecordHistoryActionType.AGREEMENT_FY_UNLOCK]: AgreementFYUnlockedAction,
    [RecordHistoryActionType.AGREEMENT_FY_CUSTOM_FIELDS]:
        AgreementFiscalYearCustomFieldsAction,

    // Billing
    [RecordHistoryActionType.AGREEMENT_BILLING_FREQUENCY_SET]:
        AgreementBillingFrequencySetAction,
    [RecordHistoryActionType.AGREEMENT_INVOICE_ADDED]:
        AgreementInvoiceAddedAction,
    [RecordHistoryActionType.AGREEMENT_INVOICE_DELETED]:
        AgreementInvoiceDeletedAction,
    [RecordHistoryActionType.AGREEMENT_INVOICE_FILE_ADDED]:
        AgreementInvoiceFileAddedAction,
    [RecordHistoryActionType.AGREEMENT_INVOICE_FILE_DELETED]:
        AgreementInvoiceFileDeletedAction,
    [RecordHistoryActionType.AGREEMENT_INVOICE_PAYMENT_ADDED]:
        AgreementInvoicePaymentAddedAction,
    [RecordHistoryActionType.AGREEMENT_INVOICE_PAYMENT_DELETED]:
        AgreementInvoicePaymentDeletedAction,
    [RecordHistoryActionType.AGREEMENT_INVOICE_GENERATED]:
        AgreementInvoiceGeneratedAction,
    [RecordHistoryActionType.AGREEMENT_INVOICE_DOWNLOADED]:
        AgreementInvoiceDownloadedAction,
    [RecordHistoryActionType.AGREEMENT_INVOICE_UPDATED]:
        AgreementInvoiceUpdatedAction,
    [RecordHistoryActionType.AGREEMENT_INVOICE_INVOICE_NUMBER]:
        AgreementInvoiceInvoiceNumberAction,
    [RecordHistoryActionType.AGREEMENT_INVOICE_AMOUNT]:
        AgreementInvoiceAmountAction,
    [RecordHistoryActionType.AGREEMENT_INVOICE_BILLING_DATE]:
        AgreementInvoiceBillingDateAction,
    [RecordHistoryActionType.AGREEMENT_INVOICE_DUE_DATE]:
        AgreementInvoiceDueDateAction,
    [RecordHistoryActionType.AGREEMENT_INVOICE_CUSTOM_FIELDS]:
        AgreementInvoiceCustomFieldsAction,

    // Hard Costs
    [RecordHistoryActionType.AGREEMENT_HARD_COST_ADDED]:
        AgreementHardCostAddedAction,
    [RecordHistoryActionType.AGREEMENT_HARD_COST_REMOVED]:
        AgreementHardCostRemovedAction,
    [RecordHistoryActionType.AGREEMENT_HARD_COST_UPDATED]:
        AgreementHardCostUpdatedAction,

    // Trade
    [RecordHistoryActionType.AGREEMENT_TRADE_COLLECTED]:
        AgreementTradeCollectedAction,
    [RecordHistoryActionType.AGREEMENT_TRADE_COLLECTED_REMOVED]:
        AgreementTradeCollectedRemovedAction,

    // Fields
    [RecordHistoryActionType.AGREEMENT_BUSINESS_TYPE_CHANGED]:
        AgreementBusinessTypeChangedAction,
    [RecordHistoryActionType.AGREEMENT_DEAL_NOTES]: AgreementDealNotesAction,
    [RecordHistoryActionType.AGREEMENT_CUSTOM_FIELDS]:
        AgreementCustomFieldsAction,

    // Files
    [RecordHistoryActionType.AGREEMENT_FILE_UPLOADED]:
        AgreementFileUploadedAction,
    [RecordHistoryActionType.AGREEMENT_FILE_DELETED]:
        AgreementFileDeletedAction,

    // Taskflow
    [RecordHistoryActionType.AGREEMENT_TASK_CREATED]:
        AgreementTaskCreatedAction,
    [RecordHistoryActionType.AGREEMENT_TASK_ARCHIVED]:
        AgreementTaskArchivedAction,
    [RecordHistoryActionType.AGREEMENT_TASK_STATUS_CHANGED]:
        AgreementTaskStatusChangedAction,

    // Options
    [RecordHistoryActionType.AGREEMENT_OPTION_ADDED]:
        AgreementOptionAddedAction,
    [RecordHistoryActionType.AGREEMENT_OPTION_UPDATED]:
        AgreementOptionUpdatedAction,
    [RecordHistoryActionType.AGREEMENT_OPTION_EXERCISED]:
        AgreementOptionExercisedAction,
    [RecordHistoryActionType.AGREEMENT_OPTION_DELETED]:
        AgreementOptionDeletedAction,
};

export interface AgreementHistoryActionProps {
    item: RecordHistory;
    userOptions: DropdownOptionType[];
    contactOptions: DropdownOptionType[];
    percentToCloseSteps: DropdownOptionType[];
    fiscalYearOptions: DropdownOptionType[];
    organizationAgreementValues: OrganizationAgreementValue[];
    propertyOptions: DropdownOptionType[];
    packageOptions: DropdownOptionType[];
    typeOptions: {
        key: string;
        text: string;
        value: string;
    }[];
    customFieldOptions: CustomField[];
    agencyOptions: DropdownOptionType[];
    showAgencyOnDealPage: boolean;
    billingContactOptions: DropdownOptionType[];
    optionTypeMap: Map<string, string>;
    optionTypesLoading: boolean;
    optionTypesError: Error | undefined;
}

export const AgreementHistoryAction = ({
    item,
    userOptions,
    contactOptions,
    percentToCloseSteps,
    fiscalYearOptions,
    organizationAgreementValues,
    propertyOptions,
    packageOptions,
    typeOptions,
    customFieldOptions,
    agencyOptions,
    showAgencyOnDealPage,
    billingContactOptions,
    optionTypeMap,
    optionTypesLoading,
    optionTypesError,
}: AgreementHistoryActionProps) => {
    const ActionComponent =
        actionComponentMap[item.action as keyof typeof actionComponentMap];

    if (!ActionComponent)
        return (
            <>
                performed an <i>unknown</i> action
            </>
        );

    return (
        <ActionComponent
            item={item}
            userOptions={userOptions}
            contactOptions={contactOptions}
            percentToCloseSteps={percentToCloseSteps}
            fiscalYearOptions={fiscalYearOptions}
            organizationAgreementValues={organizationAgreementValues}
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
    );
};

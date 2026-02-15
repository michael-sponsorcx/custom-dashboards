import { formatDate, toTitleCase } from '@/utils/helpers';
import { AgreementHistoryActionProps } from './AgreementHistoryAction';
import {
    HistoryTextToken,
    HistoryTextUnknown,
} from '../assetForm/Content/AssetHistory.styles';
import { JSDollarFormatter } from '@/helpers';
import { getVariantNameFromMetadata } from '@/utils/variant';

// General
export const AgreementCreatedAction = () => 'created agreement';

export const AgreementStartedOverAction = () => 'started over this agreement';

export const AgreementAccountManagerCreatedAction = ({
    item,
    userOptions,
}: AgreementHistoryActionProps) => {
    const newUserOption = userOptions.find(
        (option) => option.value === item.action_value
    );

    return (
        <>
            added{' '}
            <HistoryTextToken>
                {newUserOption?.text ?? 'unknown'}
            </HistoryTextToken>{' '}
            as the account manager
        </>
    );
};

export const AgreementAccountManagerUpdatedAction = ({
    item,
    userOptions,
}: AgreementHistoryActionProps) => {
    if (item.action_value === item.user_id) {
        return 'set the account manager to themself';
    }

    const newUserOption = userOptions.find(
        (option) => option.value === item.action_value
    );

    const previousUserOption = userOptions.find(
        (option) => option.value === item.metadata?.previous_value
    );

    if (item.action_value === null) {
        return (
            <>
                removed{' '}
                {previousUserOption ? (
                    <HistoryTextToken>
                        {previousUserOption.text}
                    </HistoryTextToken>
                ) : (
                    <HistoryTextUnknown>unknown</HistoryTextUnknown>
                )}{' '}
                as the account manager
            </>
        );
    }

    if (!previousUserOption) {
        return (
            <>
                set the account manager to{' '}
                {newUserOption ? (
                    <HistoryTextToken>{newUserOption.text}</HistoryTextToken>
                ) : (
                    <HistoryTextUnknown>unknown</HistoryTextUnknown>
                )}
            </>
        );
    }

    return (
        <>
            updated the account manager from{' '}
            {previousUserOption ? (
                <HistoryTextToken>{previousUserOption.text}</HistoryTextToken>
            ) : (
                <HistoryTextUnknown>unknown</HistoryTextUnknown>
            )}{' '}
            to{' '}
            {newUserOption ? (
                <HistoryTextToken>{newUserOption.text}</HistoryTextToken>
            ) : (
                <HistoryTextUnknown>unknown</HistoryTextUnknown>
            )}
        </>
    );
};

export const AgreementPrimaryContactCreatedAction = ({
    item,
    contactOptions,
}: AgreementHistoryActionProps) => {
    const newContactOption = contactOptions.find(
        (option) => option.value === item.action_value
    );

    return (
        <>
            added{' '}
            <HistoryTextToken>
                {newContactOption?.text ?? 'unknown'}
            </HistoryTextToken>{' '}
            as the primary contact
        </>
    );
};

export const AgreementPrimaryContactUpdatedAction = ({
    item,
    contactOptions,
}: AgreementHistoryActionProps) => {
    if (item.action_value === item.user_id) {
        return 'set the primary contact to themself';
    }

    const previousContactOption = contactOptions.find(
        (option) => option.value === item.metadata?.previous_value
    );

    const contactOption = contactOptions.find(
        (option) => option.value === item.action_value
    );

    if (item.action_value === null) {
        return (
            <>
                removed{' '}
                {previousContactOption ? (
                    <HistoryTextToken>
                        {previousContactOption.text}
                    </HistoryTextToken>
                ) : (
                    <HistoryTextUnknown>unknown</HistoryTextUnknown>
                )}{' '}
                as the primary contact
            </>
        );
    }

    if (!previousContactOption) {
        return (
            <>
                set the primary contact to{' '}
                {contactOption ? (
                    <HistoryTextToken>{contactOption.text}</HistoryTextToken>
                ) : (
                    <HistoryTextUnknown>unknown</HistoryTextUnknown>
                )}
            </>
        );
    }

    return (
        <>
            updated the primary contact from{' '}
            {previousContactOption ? (
                <HistoryTextToken>
                    {previousContactOption.text}
                </HistoryTextToken>
            ) : (
                <HistoryTextUnknown>unknown</HistoryTextUnknown>
            )}{' '}
            to{' '}
            {contactOption ? (
                <HistoryTextToken>{contactOption.text}</HistoryTextToken>
            ) : (
                <HistoryTextUnknown>unknown</HistoryTextUnknown>
            )}
        </>
    );
};

export const AgreementBillingContactUpdatedAction = ({
    item,
    billingContactOptions,
    showAgencyOnDealPage,
}: AgreementHistoryActionProps) => {
    const fieldName = showAgencyOnDealPage
        ? 'agency billing contact'
        : 'billing contact';

    const previousContactOption = billingContactOptions.find(
        (option) => option.value === item.metadata?.previous_value
    );

    const newContactOption = billingContactOptions.find(
        (option) => option.value === item.action_value
    );

    if (item.action_value === null) {
        return (
            <>
                removed{' '}
                {previousContactOption ? (
                    <HistoryTextToken>
                        {previousContactOption.text}
                    </HistoryTextToken>
                ) : (
                    <HistoryTextUnknown>unknown</HistoryTextUnknown>
                )}{' '}
                as the {fieldName}
            </>
        );
    }

    if (item.metadata?.previous_value == null) {
        return (
            <>
                added{' '}
                {newContactOption ? (
                    <HistoryTextToken>{newContactOption.text}</HistoryTextToken>
                ) : (
                    <HistoryTextUnknown>unknown</HistoryTextUnknown>
                )}{' '}
                as the {fieldName}
            </>
        );
    }

    return (
        <>
            updated the {fieldName} from{' '}
            {previousContactOption ? (
                <HistoryTextToken>
                    {previousContactOption.text}
                </HistoryTextToken>
            ) : (
                <HistoryTextUnknown>unknown</HistoryTextUnknown>
            )}{' '}
            to{' '}
            {newContactOption ? (
                <HistoryTextToken>{newContactOption.text}</HistoryTextToken>
            ) : (
                <HistoryTextUnknown>unknown</HistoryTextUnknown>
            )}
        </>
    );
};

export const AgreementAgencyUpdatedAction = ({
    item,
    agencyOptions,
}: AgreementHistoryActionProps) => {
    const previousAgencyOption = agencyOptions.find(
        (option) => option.value === item.metadata?.previous_value
    );

    const newAgencyOption = agencyOptions.find(
        (option) => option.value === item.action_value
    );

    if (item.action_value === null) {
        return (
            <>
                removed{' '}
                {previousAgencyOption ? (
                    <HistoryTextToken>
                        {previousAgencyOption.text}
                    </HistoryTextToken>
                ) : (
                    <HistoryTextUnknown>unknown</HistoryTextUnknown>
                )}{' '}
                as the agency
            </>
        );
    }

    if (item.metadata?.previous_value == null) {
        return (
            <>
                updated the agency to{' '}
                {newAgencyOption ? (
                    <HistoryTextToken>{newAgencyOption.text}</HistoryTextToken>
                ) : (
                    <HistoryTextUnknown>unknown</HistoryTextUnknown>
                )}
            </>
        );
    }

    return (
        <>
            updated the agency from{' '}
            {previousAgencyOption ? (
                <HistoryTextToken>{previousAgencyOption.text}</HistoryTextToken>
            ) : (
                <HistoryTextUnknown>unknown</HistoryTextUnknown>
            )}{' '}
            to{' '}
            {newAgencyOption ? (
                <HistoryTextToken>{newAgencyOption.text}</HistoryTextToken>
            ) : (
                <HistoryTextUnknown>unknown</HistoryTextUnknown>
            )}
        </>
    );
};

export const AgreementFiscalYearCustomFieldsAction = ({
    item,
    fiscalYearOptions,
}: AgreementHistoryActionProps) => {
    const fiscalYearOption = fiscalYearOptions.find(
        (option) => option.value === item.metadata?.fiscal_year_id
    );

    const fiscalYearText = fiscalYearOption
        ? fiscalYearOption.text
        : 'unknown fiscal year';

    const customFieldLabel =
        item.metadata?.custom_field_key &&
        typeof item.metadata.custom_field_key === 'string' &&
        item.metadata.custom_field_key.trim() !== ''
            ? toTitleCase(item.metadata.custom_field_key)
            : 'unknown custom field';

    if (item.metadata?.new_value == '') {
        return (
            <>
                removed the custom field value for{' '}
                <HistoryTextToken>{customFieldLabel}</HistoryTextToken>{' '}
            </>
        );
    }

    return (
        <>
            updated the <HistoryTextToken>{customFieldLabel}</HistoryTextToken>{' '}
            custom field of the fiscal year{' '}
            <HistoryTextToken>{fiscalYearText}</HistoryTextToken> to{' '}
            <HistoryTextToken>
                {item.metadata?.new_value != null
                    ? String(item.metadata.new_value)
                    : 'n/a'}
            </HistoryTextToken>
        </>
    );
};

export const AgreementDescriptionAction = ({
    item,
}: AgreementHistoryActionProps) => {
    const previousDescription = item.metadata?.previous_value as string;
    const newDescription = item.action_value;

    if (previousDescription && newDescription) {
        return (
            <>
                updated the description from{' '}
                <HistoryTextToken>{previousDescription}</HistoryTextToken> to{' '}
                <HistoryTextToken>{newDescription}</HistoryTextToken>
            </>
        );
    }

    if (newDescription) {
        return (
            <>
                set the description to{' '}
                <HistoryTextToken>{newDescription}</HistoryTextToken>
            </>
        );
    }

    return <>removed description</>;
};

// Deal Status
export const AgreementSubmittedForApprovalAction = () =>
    'submitted for approval';

export const AgreementApprovalRejectedAction = () => 'rejected the agreement';

export const AgreementApprovalApprovedAction = () => 'approved the agreement';

export const AgreementUploadedSignedDocAction = () => 'uploaded signed doc';

export const AgreementFulfillmentCreatedAction = () => 'created fulfillment';

export const AgreementLockedAction = () => 'locked the agreement';

export const AgreementUnlockedAction = () => 'unlocked the agreement';

// Deal Details
export const AgreementNumberUpdatedAction = ({
    item,
}: AgreementHistoryActionProps) => {
    return (
        <>
            updated agreement number from{' '}
            <HistoryTextToken>
                {(item.metadata?.previous_value as string) || 'n/a'}
            </HistoryTextToken>{' '}
            to{' '}
            <HistoryTextToken>
                {(item.metadata?.new_value as string) || 'n/a'}
            </HistoryTextToken>
        </>
    );
};

export const AgreementStartDateUpdatedAction = ({
    item,
}: AgreementHistoryActionProps) => {
    return (
        <>
            updated start date from{' '}
            <HistoryTextToken>
                {formatDate(item.metadata?.previous_value as string)}
            </HistoryTextToken>{' '}
            to{' '}
            <HistoryTextToken>{formatDate(item.action_value)}</HistoryTextToken>
        </>
    );
};

export const AgreementEndDateUpdatedAction = ({
    item,
}: AgreementHistoryActionProps) => {
    return (
        <>
            updated end date from{' '}
            <HistoryTextToken>
                {formatDate(item.metadata?.previous_value as string)}
            </HistoryTextToken>{' '}
            to{' '}
            <HistoryTextToken>{formatDate(item.action_value)}</HistoryTextToken>
        </>
    );
};

export const AgreementProjectedDateUpdatedAction = ({
    item,
}: AgreementHistoryActionProps) => {
    const previousProjectedDate = item.metadata?.previous_value as string;
    const newProjectedDate = item.action_value;

    if (previousProjectedDate && newProjectedDate) {
        return (
            <>
                updated projected date from{' '}
                <HistoryTextToken>
                    {formatDate(previousProjectedDate)}
                </HistoryTextToken>{' '}
                to{' '}
                <HistoryTextToken>
                    {formatDate(newProjectedDate)}
                </HistoryTextToken>
            </>
        );
    }

    if (newProjectedDate) {
        return (
            <>
                updated projected date to{' '}
                <HistoryTextToken>
                    {formatDate(newProjectedDate)}
                </HistoryTextToken>
            </>
        );
    }

    return <>removed projected date</>;
};

export const AgreementClosedDateUpdatedAction = ({
    item,
}: AgreementHistoryActionProps) => {
    const previousClosedDate = item.metadata?.previous_value as string;
    const closedDate = item.action_value;

    if (previousClosedDate && closedDate) {
        return (
            <>
                updated closed date from{' '}
                <HistoryTextToken>
                    {formatDate(previousClosedDate)}
                </HistoryTextToken>{' '}
                to <HistoryTextToken>{formatDate(closedDate)}</HistoryTextToken>
            </>
        );
    }

    return (
        <>
            updated closed date to{' '}
            <HistoryTextToken>{formatDate(closedDate)}</HistoryTextToken>
        </>
    );
};

export const AgreementStageUpdatedAction = ({
    item,
    percentToCloseSteps,
}: AgreementHistoryActionProps) => {
    const previousStage = percentToCloseSteps.find(
        (step) => step.value === item.metadata?.previous_value
    );
    const newStage = percentToCloseSteps.find(
        (step) => step.value === item.action_value
    );

    if (previousStage && newStage) {
        return (
            <>
                updated stage from{' '}
                <HistoryTextToken>{previousStage.text}</HistoryTextToken> to{' '}
                <HistoryTextToken>{newStage.text}</HistoryTextToken>
            </>
        );
    }

    return (
        <>
            updated stage to{' '}
            <HistoryTextToken>{newStage?.text}</HistoryTextToken>
        </>
    );
};

export const AgreementGrossUpdatedForFYAction = ({
    item,
    fiscalYearOptions,
}: AgreementHistoryActionProps) => {
    const fiscalYearOption = fiscalYearOptions.find(
        (option) => option.value === item.metadata?.fiscal_year_id
    );

    const previousAmount = item.metadata?.previous_value as string;
    const newAmount = item.action_value;

    if (previousAmount && newAmount) {
        return (
            <>
                updated gross for{' '}
                <HistoryTextToken>
                    {fiscalYearOption?.text ?? 'unknown fiscal year'}
                </HistoryTextToken>{' '}
                from{' '}
                <HistoryTextToken>
                    {JSDollarFormatter(Number(previousAmount))}
                </HistoryTextToken>{' '}
                to{' '}
                <HistoryTextToken>
                    {JSDollarFormatter(Number(newAmount))}
                </HistoryTextToken>
            </>
        );
    }

    return (
        <>
            updated gross for{' '}
            <HistoryTextToken>
                {fiscalYearOption?.text ?? 'unknown fiscal year'}
            </HistoryTextToken>{' '}
            to{' '}
            <HistoryTextToken>
                {JSDollarFormatter(Number(newAmount))}
            </HistoryTextToken>
        </>
    );
};

export const AgreementAgreementValuesUpdatedAction = ({
    item,
    fiscalYearOptions,
    organizationAgreementValues,
    propertyOptions,
}: AgreementHistoryActionProps) => {
    const fiscalYearOption = fiscalYearOptions.find(
        (option) => option.value === item.metadata?.fiscal_year_id
    );

    const organizationAgreementValue = organizationAgreementValues.find(
        (oav) => oav.id === item.metadata?.organization_agreement_values_id
    );

    const propertyOption = propertyOptions.find(
        (option) => option.value === item.metadata?.property_id
    );

    const fiscalYearText = fiscalYearOption
        ? fiscalYearOption.text
        : 'unknown fiscal year';

    const previousAmount = item.metadata?.previous_value as number;
    const newAmount = item.action_value;

    const propertyText = propertyOption?.text ?? 'unknown property';
    const agreementValueText =
        organizationAgreementValue?.label ?? 'unknown agreement value';

    return (
        <>
            updated <HistoryTextToken>{agreementValueText}</HistoryTextToken>{' '}
            for <HistoryTextToken>{propertyText}</HistoryTextToken> of{' '}
            <HistoryTextToken>{fiscalYearText}</HistoryTextToken> from{' '}
            <HistoryTextToken>
                {JSDollarFormatter(Number(previousAmount))}
            </HistoryTextToken>{' '}
            to{' '}
            <HistoryTextToken>
                {JSDollarFormatter(Number(newAmount))}
            </HistoryTextToken>
        </>
    );
};

export const AgreementInventoryLockedRateAction = ({
    item,
}: AgreementHistoryActionProps) => {
    if (item.metadata?.new_value) {
        return (
            <>
                locked the rate card on{' '}
                <HistoryTextToken>
                    {' '}
                    {(item.metadata?.asset_title as string) ?? 'n/a'}
                </HistoryTextToken>
            </>
        );
    }
    return (
        <>
            unlocked the rate card on{' '}
            <HistoryTextToken>
                {' '}
                {(item.metadata?.asset_title as string) ?? 'n/a'}
            </HistoryTextToken>
        </>
    );
};

export const AgreementInventoryScheduledUnitsAction = ({
    item,
}: AgreementHistoryActionProps) => {
    return (
        <>
            updated units scheduled for{' '}
            <HistoryTextToken>
                {' '}
                {(item.metadata?.asset_title as string) ?? 'n/a'}
            </HistoryTextToken>{' '}
            to <HistoryTextToken>{item.action_value}</HistoryTextToken> for{' '}
            <HistoryTextToken>
                {(item.metadata?.fiscal_year as string) ?? 'n/a'}
            </HistoryTextToken>
        </>
    );
};

export const AgreementInventoryRateAction = ({
    item,
}: AgreementHistoryActionProps) => {
    return (
        <>
            updated selling rate for{' '}
            <HistoryTextToken>
                {' '}
                {(item.metadata?.asset_title as string) ?? 'n/a'}
            </HistoryTextToken>{' '}
            to{' '}
            <HistoryTextToken>
                {JSDollarFormatter(Number(item.action_value), {
                    currency_locale: item.metadata?.currency_locale as string,
                })}
            </HistoryTextToken>{' '}
            for{' '}
            <HistoryTextToken>
                {(item.metadata?.fiscal_year as string) ?? 'n/a'}
            </HistoryTextToken>
        </>
    );
};

export const AgreementGrossUpdatedForPropertyAction = ({
    item,
    propertyOptions,
    fiscalYearOptions,
}: AgreementHistoryActionProps) => {
    const propertyOption = propertyOptions.find(
        (option) => option.value === item.metadata?.property_id
    );

    const fiscalYearOption = fiscalYearOptions.find(
        (option) => option.value === item.metadata?.fiscal_year_id
    );

    const fiscalYearText = fiscalYearOption
        ? fiscalYearOption.text
        : 'unknown fiscal year';

    if (!item.metadata?.previous_value) {
        return (
            <>
                updated gross for{' '}
                <HistoryTextToken>{propertyOption?.text}</HistoryTextToken> for{' '}
                <HistoryTextToken>{fiscalYearText}</HistoryTextToken> to{' '}
                <HistoryTextToken>
                    {JSDollarFormatter(Number(item.action_value))}
                </HistoryTextToken>
            </>
        );
    }

    return (
        <>
            updated gross for{' '}
            <HistoryTextToken>{propertyOption?.text}</HistoryTextToken> for{' '}
            <HistoryTextToken>{fiscalYearText}</HistoryTextToken> from{' '}
            <HistoryTextToken>
                {JSDollarFormatter(Number(item.metadata?.previous_value))}
            </HistoryTextToken>{' '}
            to{' '}
            <HistoryTextToken>
                {JSDollarFormatter(Number(item.action_value))}
            </HistoryTextToken>
        </>
    );
};

export const AgreementFYDeletedAction = ({
    item,
    fiscalYearOptions,
}: AgreementHistoryActionProps) => {
    const fiscalYearOption = fiscalYearOptions.find(
        (option) => option.value === item.metadata?.previous_value
    );

    return (
        <>
            deleted fiscal year{' '}
            <HistoryTextToken>{fiscalYearOption?.text}</HistoryTextToken>
        </>
    );
};

export const AgreementAssetAddedAction = ({
    item,
}: AgreementHistoryActionProps) => {
    let assetName = '';

    const variantName = getVariantNameFromMetadata(item.metadata);
    if (variantName) {
        assetName = variantName;
    } else {
        assetName = item.metadata?.asset_name as string;
    }

    return (
        <>
            added asset <HistoryTextToken>{assetName}</HistoryTextToken> to{' '}
            <HistoryTextToken>
                {(item.metadata?.fiscal_year as string) ?? 'n/a'}
            </HistoryTextToken>{' '}
            with{' '}
            <HistoryTextToken>
                {item.metadata?.units as string}
            </HistoryTextToken>{' '}
            unit(s)
        </>
    );
};

export const AgreementAssetRemovedAction = ({
    item,
}: AgreementHistoryActionProps) => {
    let assetName = '';

    const variantName = getVariantNameFromMetadata(item.metadata);
    if (variantName) {
        assetName = variantName;
    } else {
        assetName = item.metadata?.asset_name as string;
    }

    return (
        <>
            removed asset <HistoryTextToken>{assetName}</HistoryTextToken>
        </>
    );
};

export const AgreementPackageAddedAction = ({
    item,
    packageOptions,
}: AgreementHistoryActionProps) => {
    const packageOption = packageOptions.find(
        (option) => option.value === item.action_value
    );
    return (
        <>
            added package{' '}
            <HistoryTextToken>{packageOption?.text}</HistoryTextToken>
        </>
    );
};

export const AgreementPackageRemovedAction = ({
    item,
    packageOptions,
}: AgreementHistoryActionProps) => {
    const packageOption = packageOptions.find(
        (option) => option.value === item.action_value
    );
    return (
        <>
            removed package{' '}
            <HistoryTextToken>{packageOption?.text}</HistoryTextToken>
        </>
    );
};

export const AgreementAgreementInventoryAddedAction = ({
    item,
    fiscalYearOptions,
}: AgreementHistoryActionProps) => {
    const fiscalYearOption = fiscalYearOptions.find(
        (option) => option.value === item.metadata?.fiscal_year_id
    );

    const inventoryName = item.metadata?.asset_name as string;

    return (
        <>
            added <HistoryTextToken>{inventoryName}</HistoryTextToken> to{' '}
            <HistoryTextToken>{fiscalYearOption?.text}</HistoryTextToken>
        </>
    );
};

export const AgreementAssetNotesAction = ({
    item,
}: AgreementHistoryActionProps) => {
    if (item.metadata?.removed) {
        return (
            <>
                removed the notes for{' '}
                <HistoryTextToken>
                    {(item.metadata?.asset_title as string) ?? 'n/a'}
                </HistoryTextToken>{' '}
            </>
        );
    }
    return (
        <>
            updated the notes of{' '}
            <HistoryTextToken>
                {(item.metadata?.asset_title as string) ?? 'n/a'}
            </HistoryTextToken>{' '}
            to <HistoryTextToken>{item.action_value}</HistoryTextToken>
        </>
    );
};

export const AgreementInventoryCustomFieldsAction = ({
    item,
}: AgreementHistoryActionProps) => {
    if (item.metadata?.removed) {
        return (
            <>
                removed the custom field value for{' '}
                <HistoryTextToken>
                    {(item.metadata?.custom_field_key as string) ?? 'n/a'}
                </HistoryTextToken>{' '}
            </>
        );
    }
    return (
        <>
            updated the{' '}
            <HistoryTextToken>
                {(item.metadata?.custom_field_key as string) ?? 'n/a'}
            </HistoryTextToken>{' '}
            custom field of the asset{' '}
            <HistoryTextToken>
                {(item.metadata?.asset_title as string) ?? 'n/a'}
            </HistoryTextToken>{' '}
            to{' '}
            <HistoryTextToken>
                {String(item.metadata?.new_value) ?? 'n/a'}
            </HistoryTextToken>
        </>
    );
};

export const AgreementFYLockedAction = ({
    item,
    fiscalYearOptions,
}: AgreementHistoryActionProps) => {
    const fiscalYearOption = fiscalYearOptions.find(
        (option) => option.value === item.metadata?.fiscal_year_id
    );

    const fiscalYearText = fiscalYearOption
        ? fiscalYearOption.text
        : 'unknown fiscal year';

    return (
        <>
            locked fiscal year{' '}
            <HistoryTextToken>{fiscalYearText}</HistoryTextToken>
        </>
    );
};

export const AgreementFYUnlockedAction = ({
    item,
    fiscalYearOptions,
}: AgreementHistoryActionProps) => {
    const fiscalYearOption = fiscalYearOptions.find(
        (option) => option.value === item.metadata?.fiscal_year_id
    );

    const fiscalYearText = fiscalYearOption
        ? fiscalYearOption.text
        : 'unknown fiscal year';

    return (
        <>
            unlocked fiscal year{' '}
            <HistoryTextToken>{fiscalYearText}</HistoryTextToken>
        </>
    );
};
// Billing

const billingFrequencyOptions = [
    { text: 'Monthly', value: 'monthly' },
    { text: 'Quarterly', value: 'quarterly' },
    { text: 'Semiannually', value: 'semiannually' },
    { text: 'Yearly', value: 'yearly' },
    { text: 'Custom', value: 'custom' },
];
export const AgreementBillingFrequencySetAction = ({
    item,
}: AgreementHistoryActionProps) => {
    const billingFrequencyOption = billingFrequencyOptions.find(
        (option) => option.value === item.action_value
    );

    return (
        <>
            set billing frequency to{' '}
            {billingFrequencyOption ? (
                <HistoryTextToken>
                    {billingFrequencyOption?.text}
                </HistoryTextToken>
            ) : (
                <HistoryTextUnknown>unknown</HistoryTextUnknown>
            )}
        </>
    );
};

export const AgreementInvoiceAddedAction = ({
    item,
    fiscalYearOptions,
}: AgreementHistoryActionProps) => {
    const fiscalYearOption = fiscalYearOptions.find(
        (option) => option.value === item.metadata?.fiscal_year_id
    );
    return (
        <>
            added invoice{' '}
            <HistoryTextToken>{item.action_value}</HistoryTextToken> for{' '}
            <HistoryTextToken>{fiscalYearOption?.text}</HistoryTextToken>
        </>
    );
};

export const AgreementInvoiceDeletedAction = ({
    item,
    fiscalYearOptions,
}: AgreementHistoryActionProps) => {
    const fiscalYearOption = fiscalYearOptions.find(
        (option) => option.value === item.metadata?.fiscal_year_id
    );
    return (
        <>
            deleted invoice{' '}
            <HistoryTextToken>{item.action_value}</HistoryTextToken> for{' '}
            <HistoryTextToken>{fiscalYearOption?.text}</HistoryTextToken>
        </>
    );
};

export const AgreementInvoiceFileAddedAction = ({
    item,
    fiscalYearOptions,
}: AgreementHistoryActionProps) => {
    const fiscalYearOption = fiscalYearOptions.find(
        (option) => option.value === item.metadata?.fiscal_year_id
    );

    const invoiceNumber = item.metadata?.invoice_number as string;

    return (
        <>
            added file to invoice{' '}
            <HistoryTextToken>{invoiceNumber}</HistoryTextToken> for{' '}
            <HistoryTextToken>{fiscalYearOption?.text}</HistoryTextToken>
        </>
    );
};

export const AgreementInvoiceFileDeletedAction = ({
    item,
    fiscalYearOptions,
}: AgreementHistoryActionProps) => {
    const fiscalYearOption = fiscalYearOptions.find(
        (option) => option.value === item.metadata?.fiscal_year_id
    );

    const invoiceNumber = item.metadata?.invoice_number as string;

    return (
        <>
            deleted file from invoice{' '}
            <HistoryTextToken>{invoiceNumber}</HistoryTextToken> for{' '}
            <HistoryTextToken>{fiscalYearOption?.text}</HistoryTextToken>
        </>
    );
};

export const AgreementInvoicePaymentAddedAction = ({
    item,
    fiscalYearOptions,
}: AgreementHistoryActionProps) => {
    const fiscalYearOption = fiscalYearOptions.find(
        (option) => option.value === item.metadata?.fiscal_year_id
    );

    const invoiceNumber = item.metadata?.invoice_number as string;

    return (
        <>
            added payment of{' '}
            <HistoryTextToken>
                {JSDollarFormatter(Number(item.action_value))}
            </HistoryTextToken>{' '}
            to invoice <HistoryTextToken>{invoiceNumber}</HistoryTextToken> for{' '}
            <HistoryTextToken>{fiscalYearOption?.text}</HistoryTextToken>
        </>
    );
};

export const AgreementInvoicePaymentDeletedAction = ({
    item,
    fiscalYearOptions,
}: AgreementHistoryActionProps) => {
    const fiscalYearOption = fiscalYearOptions.find(
        (option) => option.value === item.metadata?.fiscal_year_id
    );

    const invoiceNumber = item.metadata?.invoice_number as string;

    return (
        <>
            deleted payment of{' '}
            <HistoryTextToken>
                {JSDollarFormatter(Number(item.action_value))}
            </HistoryTextToken>{' '}
            to invoice <HistoryTextToken>{invoiceNumber}</HistoryTextToken> for{' '}
            <HistoryTextToken>{fiscalYearOption?.text}</HistoryTextToken>
        </>
    );
};

export const AgreementInvoiceGeneratedAction = ({
    item,
    fiscalYearOptions,
}: AgreementHistoryActionProps) => {
    const fiscalYearOption = fiscalYearOptions.find(
        (option) => option.value === item.metadata?.fiscal_year_id
    );

    const invoiceNumber = item.metadata?.invoice_number as string;

    return (
        <>
            generated invoice{' '}
            <HistoryTextToken>{invoiceNumber}</HistoryTextToken> of{' '}
            <HistoryTextToken>{fiscalYearOption?.text}</HistoryTextToken>
        </>
    );
};

export const AgreementInvoiceDownloadedAction = ({
    item,
    fiscalYearOptions,
}: AgreementHistoryActionProps) => {
    const fiscalYearOption = fiscalYearOptions.find(
        (option) => option.value === item.metadata?.fiscal_year_id
    );

    const invoiceNumber = item.metadata?.invoice_number as string;

    return (
        <>
            downloaded invoice{' '}
            <HistoryTextToken>{invoiceNumber}</HistoryTextToken> of{' '}
            <HistoryTextToken>
                {fiscalYearOption?.text ?? 'n/a'}
            </HistoryTextToken>
        </>
    );
};

export const AgreementInvoiceUpdatedAction = ({
    item,
    fiscalYearOptions,
}: AgreementHistoryActionProps) => {
    const fiscalYearOption = fiscalYearOptions.find(
        (option) => option.value === item.metadata?.fiscal_year_id
    );

    const invoiceNumber = item.metadata?.invoice_number as string;
    return (
        <>
            updated invoice <HistoryTextToken>{invoiceNumber}</HistoryTextToken>{' '}
            for <HistoryTextToken>{fiscalYearOption?.text}</HistoryTextToken>
        </>
    );
};

const businessTypeOptions = [
    { text: 'New Business', value: 'new_business' },
    { text: 'Renewal', value: 'renewal' },
    { text: 'Upsell', value: 'existing_client_non_renewal' },
];

export const AgreementInvoiceInvoiceNumberAction = ({
    item,
    fiscalYearOptions,
}: AgreementHistoryActionProps) => {
    const fiscalYearOption = fiscalYearOptions.find(
        (option) => option.value === item.metadata?.fiscal_year_id
    );

    const billingDate = item.metadata?.billing_date as string;
    const previousInvoiceNumber = item.metadata?.previous_value as string;

    return (
        <>
            updated invoice number from{' '}
            <HistoryTextToken>{previousInvoiceNumber}</HistoryTextToken> to{' '}
            <HistoryTextToken>{item.action_value}</HistoryTextToken> for{' '}
            <HistoryTextToken>{fiscalYearOption?.text}</HistoryTextToken> with
            billing date{' '}
            <HistoryTextToken>{formatDate(billingDate)}</HistoryTextToken>
        </>
    );
};

export const AgreementInvoiceAmountAction = ({
    item,
}: AgreementHistoryActionProps) => {
    const previousAmount = item.metadata?.previous_value as number;
    const invoiceNumber = item.metadata?.invoice_number as string;

    return (
        <>
            updated invoice amount from{' '}
            <HistoryTextToken>
                {JSDollarFormatter(Number(previousAmount))}
            </HistoryTextToken>{' '}
            to{' '}
            <HistoryTextToken>
                {JSDollarFormatter(Number(item.action_value))}
            </HistoryTextToken>{' '}
            for invoice number{' '}
            <HistoryTextToken>{invoiceNumber}</HistoryTextToken>
        </>
    );
};

export const AgreementInvoiceBillingDateAction = ({
    item,
}: AgreementHistoryActionProps) => {
    const invoiceNumber = item.metadata?.invoice_number as string;
    const previousBillingDate = item.metadata?.previous_value as string;

    return (
        <>
            updated invoice billing date from{' '}
            <HistoryTextToken>
                {formatDate(previousBillingDate)}
            </HistoryTextToken>{' '}
            to{' '}
            <HistoryTextToken>{formatDate(item.action_value)}</HistoryTextToken>{' '}
            for invoice number{' '}
            <HistoryTextToken>{invoiceNumber}</HistoryTextToken>
        </>
    );
};

export const AgreementInvoiceDueDateAction = ({
    item,
}: AgreementHistoryActionProps) => {
    const previousDueDate = item.metadata?.previous_value as string;
    const invoiceNumber = item.metadata?.invoice_number as string;

    return (
        <>
            updated invoice due date from{' '}
            <HistoryTextToken>{formatDate(previousDueDate)}</HistoryTextToken>{' '}
            to{' '}
            <HistoryTextToken>{formatDate(item.action_value)}</HistoryTextToken>{' '}
            for invoice number{' '}
            <HistoryTextToken>{invoiceNumber}</HistoryTextToken>
        </>
    );
};

export const AgreementInvoiceCustomFieldsAction = ({
    item,
    propertyOptions,
    contactOptions,
}: AgreementHistoryActionProps) => {
    const invoiceNumber = item.metadata?.invoice_number as string;
    const previousValueRaw = item.metadata?.previous_value;
    const newValueRaw = item.metadata?.new_value;
    const customFieldLabel =
        toTitleCase(item.metadata?.custom_field_key as string) ??
        'unknown custom field';

    let newValue = '';
    let previousValue = '';

    if (customFieldLabel === 'Invoice Description') {
        newValue = newValueRaw as string;
        previousValue = previousValueRaw as string;
    }

    if (customFieldLabel === 'Property Override') {
        newValue =
            propertyOptions.find((option) => option.value === newValueRaw)
                ?.text ?? 'unknown property';

        previousValue =
            propertyOptions.find((option) => option.value === previousValueRaw)
                ?.text ?? 'unknown property';
    }

    if (customFieldLabel === 'Billing Contact Override') {
        const previousValue = Array.isArray(previousValueRaw)
            ? previousValueRaw
            : previousValueRaw != null
            ? [previousValueRaw]
            : [];

        const newValue = Array.isArray(newValueRaw)
            ? newValueRaw
            : newValueRaw != null
            ? [newValueRaw]
            : [];

        const removedValues = previousValue.filter(
            (value) => !newValue.includes(value)
        );

        const addedValues = newValue.filter(
            (value) => !previousValue.includes(value)
        );

        // translate removed and added values to labels
        const removedValueLabels = removedValues.map(
            (value) =>
                contactOptions.find((option) => option.value === value)?.text ??
                'unknown billing contact'
        );
        const addedValueLabels = addedValues.map(
            (value) =>
                contactOptions.find((option) => option.value === value)?.text ??
                'unknown billing contact'
        );

        if (removedValues.length > 0) {
            return (
                <>
                    removed{' '}
                    <HistoryTextToken>
                        {removedValueLabels.join(', ')}
                    </HistoryTextToken>{' '}
                    from the billing contact override custom field for the
                    invoice <HistoryTextToken>{invoiceNumber}</HistoryTextToken>
                </>
            );
        }

        if (addedValues.length > 0) {
            return (
                <>
                    added{' '}
                    <HistoryTextToken>
                        {addedValueLabels.join(', ')}
                    </HistoryTextToken>{' '}
                    to the billing contact override custom field for the invoice{' '}
                    <HistoryTextToken>{invoiceNumber}</HistoryTextToken>
                </>
            );
        }
    }

    return (
        <>
            updated the <HistoryTextToken>{customFieldLabel}</HistoryTextToken>{' '}
            custom field of the invoice{' '}
            <HistoryTextToken>{invoiceNumber}</HistoryTextToken> from{' '}
            <HistoryTextToken>{previousValue}</HistoryTextToken> to{' '}
            <HistoryTextToken>{newValue}</HistoryTextToken>
        </>
    );
};

// Hard Costs
export const AgreementHardCostAddedAction = ({
    item,
    fiscalYearOptions,
}: AgreementHistoryActionProps) => {
    const assetName = item.metadata?.inventory_asset_name as string;
    const amount = item.metadata?.amount as number;
    const fiscalYearOption = fiscalYearOptions.find(
        (option) => option.value === item.metadata?.fiscal_year_id
    );

    return (
        <>
            added hard cost to <HistoryTextToken>{assetName}</HistoryTextToken>{' '}
            with amount{' '}
            <HistoryTextToken>{JSDollarFormatter(amount)}</HistoryTextToken> for{' '}
            <HistoryTextToken>{fiscalYearOption?.text}</HistoryTextToken>
        </>
    );
};

export const AgreementHardCostRemovedAction = ({
    item,
    fiscalYearOptions,
}: AgreementHistoryActionProps) => {
    const assetName = item.metadata?.inventory_asset_name as string;
    const amount = item.metadata?.amount as number;
    const fiscalYearOption = fiscalYearOptions.find(
        (option) => option.value === item.metadata?.fiscal_year_id
    );

    return (
        <>
            removed hard cost <HistoryTextToken>{assetName}</HistoryTextToken>{' '}
            with amount{' '}
            <HistoryTextToken>{JSDollarFormatter(amount)}</HistoryTextToken> for{' '}
            <HistoryTextToken>{fiscalYearOption?.text}</HistoryTextToken>
        </>
    );
};

export const AgreementHardCostUpdatedAction = ({
    item,
    fiscalYearOptions,
}: AgreementHistoryActionProps) => {
    const changedFields =
        (item.metadata?.changed_fields as
            | {
                  field: string;
                  new_value: string;
                  old_value: string;
              }[]
            | undefined) || [];

    const changedField = changedFields[0] || {
        field: '',
        new_value: '',
        old_value: '',
    };

    const field = changedField.field;
    let new_value = changedField.new_value;
    let old_value = changedField.old_value;

    const assetName = item.metadata?.inventory_asset_name as string;
    const fiscalYearOption = fiscalYearOptions.find(
        (option) => option.value === item.metadata?.fiscal_year_id
    );

    if (field === 'date' && new_value && old_value) {
        new_value = formatDate(new_value);
        old_value = formatDate(old_value);
    }

    if (field === 'amount' && new_value && old_value) {
        new_value = JSDollarFormatter(Number(new_value));
        old_value = JSDollarFormatter(Number(old_value));
    }

    if (!field) {
        return (
            <>
                updated hard cost for{' '}
                <HistoryTextToken>{assetName ?? 'n/a'}</HistoryTextToken> for{' '}
                <HistoryTextToken>
                    {fiscalYearOption?.text ?? 'n/a'}
                </HistoryTextToken>
            </>
        );
    }

    return (
        <>
            updated {field} from{' '}
            <HistoryTextToken>{old_value || 'n/a'}</HistoryTextToken> to{' '}
            <HistoryTextToken>{new_value || 'n/a'}</HistoryTextToken> for{' '}
            <HistoryTextToken>{assetName ?? 'n/a'}</HistoryTextToken> for{' '}
            <HistoryTextToken>
                {fiscalYearOption?.text ?? 'n/a'}
            </HistoryTextToken>
        </>
    );
};

export const AgreementTradeCollectedAction = ({
    item,
    fiscalYearOptions,
    organizationAgreementValues,
}: AgreementHistoryActionProps) => {
    const fiscal_year_id = item.metadata?.fiscal_year_id as string;
    const amount_collected = item.metadata?.amount_collected as number;
    const organization_agreement_value_id = item.metadata
        ?.organization_agreement_value_id as string;

    const fiscalYearOption = fiscalYearOptions.find(
        (option) => option.value === fiscal_year_id
    );

    const organizationAgreementValue = organizationAgreementValues.find(
        (oav) => oav.id === organization_agreement_value_id
    );

    const amount = JSDollarFormatter(amount_collected);

    return (
        <>
            collected trade with amount{' '}
            <HistoryTextToken>{amount}</HistoryTextToken> for{' '}
            <HistoryTextToken>
                {organizationAgreementValue?.label}
            </HistoryTextToken>{' '}
            for <HistoryTextToken>{fiscalYearOption?.text}</HistoryTextToken>
        </>
    );
};

export const AgreementTradeCollectedRemovedAction = ({
    item,
    fiscalYearOptions,
    organizationAgreementValues,
}: AgreementHistoryActionProps) => {
    const fiscal_year_id = item.metadata?.fiscal_year_id as string;
    const amount_collected = item.metadata?.amount_collected as number;
    const organization_agreement_value_id = item.metadata
        ?.organization_agreement_value_id as string;

    const fiscalYearOption = fiscalYearOptions.find(
        (option) => option.value === fiscal_year_id
    );

    const organizationAgreementValue = organizationAgreementValues.find(
        (oav) => oav.id === organization_agreement_value_id
    );

    const amount = JSDollarFormatter(amount_collected);

    return (
        <>
            removed trade with amount{' '}
            <HistoryTextToken>{amount}</HistoryTextToken> for{' '}
            <HistoryTextToken>
                {organizationAgreementValue?.label}
            </HistoryTextToken>{' '}
            for <HistoryTextToken>{fiscalYearOption?.text}</HistoryTextToken>
        </>
    );
};

export const AgreementDealNotesAction = ({
    item,
}: AgreementHistoryActionProps) => {
    const previousNotes = item.metadata?.previous_value as string;
    const newNotes = item.action_value as string;

    if (previousNotes == undefined || previousNotes == '') {
        return (
            <>
                added deal notes <HistoryTextToken>{newNotes}</HistoryTextToken>
            </>
        );
    }

    if (newNotes == undefined || newNotes == '') {
        return (
            <>
                removed deal notes{' '}
                <HistoryTextToken>{previousNotes}</HistoryTextToken>
            </>
        );
    }

    return (
        <>
            updated deal notes from{' '}
            <HistoryTextToken>{previousNotes}</HistoryTextToken> to{' '}
            <HistoryTextToken>{newNotes}</HistoryTextToken>
        </>
    );
};

export const AgreementCustomFieldsAction = ({
    item,
}: AgreementHistoryActionProps) => {
    const removed = item.metadata?.removed as boolean;
    const customFieldKey = item.metadata?.custom_field_key
        ? toTitleCase(item.metadata?.custom_field_key as string)
        : 'unknown custom field';
    const previousValue = item.metadata?.previous_value as string;

    if (removed) {
        return (
            <>
                removed custom field{' '}
                <HistoryTextToken>{customFieldKey}</HistoryTextToken> with value{' '}
                <HistoryTextToken>{previousValue}</HistoryTextToken>
            </>
        );
    }

    return (
        <>
            updated custom field{' '}
            <HistoryTextToken>{customFieldKey}</HistoryTextToken> with value{' '}
            <HistoryTextToken>{previousValue}</HistoryTextToken> to{' '}
            <HistoryTextToken>{item.action_value}</HistoryTextToken>
        </>
    );
};

export const AgreementTaskCreatedAction = ({
    item,
}: AgreementHistoryActionProps) => {
    const taskTitle = item.action_value as string;

    return (
        <>
            created task <HistoryTextToken>{taskTitle}</HistoryTextToken>
        </>
    );
};

export const AgreementTaskArchivedAction = ({
    item,
}: AgreementHistoryActionProps) => {
    const taskTitle = item.action_value as string;

    return (
        <>
            archived task <HistoryTextToken>{taskTitle}</HistoryTextToken>
        </>
    );
};

export const AgreementTaskStatusChangedAction = ({
    item,
}: AgreementHistoryActionProps) => {
    const taskTitle = item.metadata?.task_title as string;
    const previousStatus = item.metadata?.previous_value as string;
    const newStatus = item.metadata?.new_value as string;

    return (
        <>
            changed task status from{' '}
            <HistoryTextToken>{previousStatus}</HistoryTextToken> to{' '}
            <HistoryTextToken>{newStatus}</HistoryTextToken> for task{' '}
            <HistoryTextToken>{taskTitle}</HistoryTextToken>
        </>
    );
};

// Fields
export const AgreementBusinessTypeChangedAction = ({
    item,
}: AgreementHistoryActionProps) => {
    const previousBusinessType = item.metadata?.previous_value as string;

    const previousBusinessTypeOption = businessTypeOptions.find(
        (option) => option.value === previousBusinessType
    );

    const newBusinessTypeOption = businessTypeOptions.find(
        (option) => option.value === item.action_value
    );

    if (!previousBusinessTypeOption) {
        return (
            <>
                changed agreement business type to{' '}
                {newBusinessTypeOption ? (
                    <HistoryTextToken>
                        {newBusinessTypeOption?.text}
                    </HistoryTextToken>
                ) : (
                    <HistoryTextUnknown>unknown</HistoryTextUnknown>
                )}
            </>
        );
    }

    return (
        <>
            changed agreement business type from{' '}
            {previousBusinessTypeOption ? (
                <HistoryTextToken>
                    {previousBusinessTypeOption?.text}
                </HistoryTextToken>
            ) : (
                <HistoryTextUnknown>unknown</HistoryTextUnknown>
            )}{' '}
            to{' '}
            {newBusinessTypeOption ? (
                <HistoryTextToken>
                    {newBusinessTypeOption?.text}
                </HistoryTextToken>
            ) : (
                <HistoryTextUnknown>unknown</HistoryTextUnknown>
            )}
        </>
    );
};

// Files
export const AgreementFileUploadedAction = ({
    item,
}: AgreementHistoryActionProps) => {
    const fileName = item.metadata?.file_name as string;

    return (
        <>
            uploaded file <HistoryTextToken>{fileName}</HistoryTextToken>
        </>
    );
};

export const AgreementFileDeletedAction = ({
    item,
}: AgreementHistoryActionProps) => {
    const fileName = item.metadata?.file_name as string;

    return (
        <>
            deleted file <HistoryTextToken>{fileName}</HistoryTextToken>
        </>
    );
};

export const AgreementOptionAddedAction = ({
    item,
    optionTypeMap,
}: AgreementHistoryActionProps) => {
    // Look up option type name from organization_agreement_option_type_id in metadata
    const optionTypeId = item.metadata
        ?.organization_agreement_option_type_id as string | undefined;

    // Use provided optionTypeMap, fallback to action_value or 'unknown'
    // If loading or error, still show best available value
    const optionName =
        (optionTypeId && optionTypeMap.get(optionTypeId)) ||
        (item.action_value as string) ||
        'unknown';

    return (
        <>
            added option <HistoryTextToken>{optionName}</HistoryTextToken>
        </>
    );
};

export const AgreementOptionUpdatedAction = ({
    item,
    optionTypeMap,
}: AgreementHistoryActionProps) => {
    // Look up option type name from organization_agreement_option_type_id in metadata
    const optionTypeId = item.metadata
        ?.organization_agreement_option_type_id as string | undefined;

    // Use provided optionTypeMap, fallback to action_value or 'unknown'
    // If loading or error, still show best available value
    const optionName =
        (optionTypeId && optionTypeMap.get(optionTypeId)) ||
        (item.action_value as string) ||
        'unknown';

    const changedField = item.metadata?.changed_field as string | undefined;
    const previousValue = item.metadata?.previous_value as string | undefined;
    const newValue = item.metadata?.new_value as string | undefined;

    // Map field names to human-readable labels
    const fieldLabelMap: Record<string, string> = {
        organization_agreement_option_type_id: 'option type',
        exercise_date: 'exercise date',
        notes: 'notes',
    };

    if (!changedField) {
        return (
            <>
                updated option <HistoryTextToken>{optionName}</HistoryTextToken>
            </>
        );
    }

    const fieldLabel = fieldLabelMap[changedField] || changedField;

    // Format values for display
    const formatValue = (value: string | undefined): string => {
        if (value === undefined || value === null || value === '') {
            return 'empty';
        }
        if (changedField === 'organization_agreement_option_type_id') {
            return optionTypeMap.get(value) || value;
        }
        if (changedField === 'exercise_date') {
            return formatDate(value);
        }
        return value;
    };

    return (
        <>
            updated {fieldLabel} for option{' '}
            <HistoryTextToken>{optionName}</HistoryTextToken> from{' '}
            <HistoryTextToken>{formatValue(previousValue)}</HistoryTextToken> to{' '}
            <HistoryTextToken>{formatValue(newValue)}</HistoryTextToken>
        </>
    );
};

export const AgreementOptionExercisedAction = ({
    item,
    optionTypeMap,
}: AgreementHistoryActionProps) => {
    // Look up option type name from organization_agreement_option_type_id in metadata
    const optionTypeId = item.metadata
        ?.organization_agreement_option_type_id as string | undefined;

    // Use provided optionTypeMap, fallback to action_value or 'unknown'
    // If loading or error, still show best available value
    const optionName =
        (optionTypeId && optionTypeMap.get(optionTypeId)) ||
        (item.action_value as string) ||
        'unknown';

    const exerciseReason = item.metadata?.exercise_reason as string | undefined;
    const fiscalYearLabel = item.metadata?.first_impacted_fiscal_year_label as
        | string
        | undefined;

    return (
        <>
            exercised option <HistoryTextToken>{optionName}</HistoryTextToken>
            {exerciseReason && (
                <>
                    {' '}
                    - Reason:{' '}
                    <HistoryTextToken>{exerciseReason}</HistoryTextToken>
                </>
            )}
            {fiscalYearLabel && (
                <>
                    {' '}
                    - First Impacted Fiscal Year:{' '}
                    <HistoryTextToken>{fiscalYearLabel}</HistoryTextToken>
                </>
            )}
        </>
    );
};

export const AgreementOptionDeletedAction = ({
    item,
}: AgreementHistoryActionProps) => {
    return (
        <>
            deleted option{' '}
            <HistoryTextToken>{item.action_value}</HistoryTextToken>
        </>
    );
};

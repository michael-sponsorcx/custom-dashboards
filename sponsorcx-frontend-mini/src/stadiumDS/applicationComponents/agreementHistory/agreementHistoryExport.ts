import { ColumnDef } from '@tanstack/react-table';
import { RecordHistory, RecordHistoryActionType } from '@/gql/recordHistoryGql';
import { formatDate } from '@/utils/helpers';
import { getVariantNameFromMetadata } from '@/utils/variant';

const CATEGORY = {
    GENERAL_INFORMATION: 'General Information',
    DEAL_STATUS: 'Deal Status',
    DEAL_DETAILS: 'Deal Details',
    BILLING: 'Billing',
    FIELDS: 'Fields',
    HARD_COSTS: 'Hard Costs',
    TRADE: 'Trade',
    FILES: 'Files',
    OPTIONS: 'Options',
    TASKFLOW: 'Taskflow',
};

const actionCategoryMap: Partial<Record<RecordHistoryActionType, string>> = {
    // General Information
    [RecordHistoryActionType.AGREEMENT_CREATED]: CATEGORY.GENERAL_INFORMATION,
    [RecordHistoryActionType.AGREEMENT_ACCOUNT_MANAGER_CREATED]:
        CATEGORY.GENERAL_INFORMATION,
    [RecordHistoryActionType.AGREEMENT_ACCOUNT_MANAGER_UPDATED]:
        CATEGORY.GENERAL_INFORMATION,
    [RecordHistoryActionType.AGREEMENT_PRIMARY_CONTACT_CREATED]:
        CATEGORY.GENERAL_INFORMATION,
    [RecordHistoryActionType.AGREEMENT_PRIMARY_CONTACT_UPDATED]:
        CATEGORY.GENERAL_INFORMATION,
    [RecordHistoryActionType.AGREEMENT_DESCRIPTION]:
        CATEGORY.GENERAL_INFORMATION,
    [RecordHistoryActionType.AGREEMENT_BILLING_CONTACT_UPDATED]:
        CATEGORY.GENERAL_INFORMATION,
    [RecordHistoryActionType.AGREEMENT_AGENCY_UPDATED]:
        CATEGORY.GENERAL_INFORMATION,
    [RecordHistoryActionType.AGREEMENT_NUMBER_UPDATED]:
        CATEGORY.GENERAL_INFORMATION,
    [RecordHistoryActionType.AGREEMENT_STARTED_OVER]:
        CATEGORY.GENERAL_INFORMATION,

    // Deal Status
    [RecordHistoryActionType.AGREEMENT_SUBMITTED_FOR_APPROVAL]:
        CATEGORY.DEAL_STATUS,
    [RecordHistoryActionType.AGREEMENT_APPROVAL_APPROVED]: CATEGORY.DEAL_STATUS,
    [RecordHistoryActionType.AGREEMENT_APPROVAL_REJECTED]: CATEGORY.DEAL_STATUS,
    [RecordHistoryActionType.AGREEMENT_UPLOADED_SIGNED_DOC]:
        CATEGORY.DEAL_STATUS,
    [RecordHistoryActionType.AGREEMENT_FULFILLMENT_CREATED]:
        CATEGORY.DEAL_STATUS,

    // Deal Details
    [RecordHistoryActionType.AGREEMENT_START_DATE_UPDATED]:
        CATEGORY.DEAL_DETAILS,
    [RecordHistoryActionType.AGREEMENT_END_DATE_UPDATED]: CATEGORY.DEAL_DETAILS,
    [RecordHistoryActionType.AGREEMENT_PROJECTED_DATE_UPDATED]:
        CATEGORY.DEAL_DETAILS,
    [RecordHistoryActionType.AGREEMENT_CLOSED_DATE_UPDATED]:
        CATEGORY.DEAL_DETAILS,
    [RecordHistoryActionType.AGREEMENT_STAGE_UPDATED]: CATEGORY.DEAL_DETAILS,
    [RecordHistoryActionType.AGREEMENT_GROSS_UPDATED_FOR_FY]:
        CATEGORY.DEAL_DETAILS,
    [RecordHistoryActionType.AGREEMENT_FY_DELETED]: CATEGORY.DEAL_DETAILS,
    [RecordHistoryActionType.AGREEMENT_AGREEMENT_VALUES_UPDATED]:
        CATEGORY.DEAL_DETAILS,
    [RecordHistoryActionType.AGREEMENT_GROSS_UPDATED_FOR_PROPERTY]:
        CATEGORY.DEAL_DETAILS,
    [RecordHistoryActionType.AGREEMENT_AGREEMENT_INVENTORY_ADDED]:
        CATEGORY.DEAL_DETAILS,
    [RecordHistoryActionType.AGREEMENT_ASSET_ADDED]: CATEGORY.DEAL_DETAILS,
    [RecordHistoryActionType.AGREEMENT_ASSET_REMOVED]: CATEGORY.DEAL_DETAILS,
    [RecordHistoryActionType.AGREEMENT_PACKAGE_ADDED]: CATEGORY.DEAL_DETAILS,
    [RecordHistoryActionType.AGREEMENT_PACKAGE_REMOVED]: CATEGORY.DEAL_DETAILS,
    [RecordHistoryActionType.AGREEMENT_INVENTORY_NOTES]: CATEGORY.DEAL_DETAILS,
    [RecordHistoryActionType.AGREEMENT_INVENTORY_RATE]: CATEGORY.DEAL_DETAILS,
    [RecordHistoryActionType.AGREEMENT_INVENTORY_LOCKED_RATE]:
        CATEGORY.DEAL_DETAILS,
    [RecordHistoryActionType.AGREEMENT_INVENTORY_UNITS_SCHEDULED]:
        CATEGORY.DEAL_DETAILS,
    [RecordHistoryActionType.AGREEMENT_INVENTORY_CUSTOM_FIELDS]:
        CATEGORY.DEAL_DETAILS,
    [RecordHistoryActionType.AGREEMENT_FY_LOCK]: CATEGORY.DEAL_DETAILS,
    [RecordHistoryActionType.AGREEMENT_FY_UNLOCK]: CATEGORY.DEAL_DETAILS,
    [RecordHistoryActionType.AGREEMENT_FY_CUSTOM_FIELDS]: CATEGORY.DEAL_DETAILS,

    // Billing
    [RecordHistoryActionType.AGREEMENT_BILLING_FREQUENCY_SET]: CATEGORY.BILLING,
    [RecordHistoryActionType.AGREEMENT_INVOICE_ADDED]: CATEGORY.BILLING,
    [RecordHistoryActionType.AGREEMENT_INVOICE_DELETED]: CATEGORY.BILLING,
    [RecordHistoryActionType.AGREEMENT_INVOICE_GENERATED]: CATEGORY.BILLING,
    [RecordHistoryActionType.AGREEMENT_INVOICE_DOWNLOADED]: CATEGORY.BILLING,
    [RecordHistoryActionType.AGREEMENT_INVOICE_PAYMENT_ADDED]: CATEGORY.BILLING,
    [RecordHistoryActionType.AGREEMENT_INVOICE_PAYMENT_DELETED]:
        CATEGORY.BILLING,
    [RecordHistoryActionType.AGREEMENT_INVOICE_UPDATED]: CATEGORY.BILLING,
    [RecordHistoryActionType.AGREEMENT_INVOICE_INVOICE_NUMBER]:
        CATEGORY.BILLING,
    [RecordHistoryActionType.AGREEMENT_INVOICE_AMOUNT]: CATEGORY.BILLING,
    [RecordHistoryActionType.AGREEMENT_INVOICE_BILLING_DATE]: CATEGORY.BILLING,
    [RecordHistoryActionType.AGREEMENT_INVOICE_DUE_DATE]: CATEGORY.BILLING,
    [RecordHistoryActionType.AGREEMENT_INVOICE_CUSTOM_FIELDS]: CATEGORY.BILLING,

    // Hard Costs
    [RecordHistoryActionType.AGREEMENT_HARD_COST_ADDED]: CATEGORY.HARD_COSTS,
    [RecordHistoryActionType.AGREEMENT_HARD_COST_REMOVED]: CATEGORY.HARD_COSTS,
    [RecordHistoryActionType.AGREEMENT_HARD_COST_UPDATED]: CATEGORY.HARD_COSTS,

    // Trade
    [RecordHistoryActionType.AGREEMENT_TRADE_COLLECTED]: CATEGORY.TRADE,
    [RecordHistoryActionType.AGREEMENT_TRADE_COLLECTED_REMOVED]: CATEGORY.TRADE,

    // Fields
    [RecordHistoryActionType.AGREEMENT_BUSINESS_TYPE_CHANGED]: CATEGORY.FIELDS,
    [RecordHistoryActionType.AGREEMENT_DEAL_NOTES]: CATEGORY.FIELDS,
    [RecordHistoryActionType.AGREEMENT_CUSTOM_FIELDS]: CATEGORY.FIELDS,

    // Files
    [RecordHistoryActionType.AGREEMENT_FILE_UPLOADED]: CATEGORY.FILES,
    [RecordHistoryActionType.AGREEMENT_FILE_DELETED]: CATEGORY.FILES,
    [RecordHistoryActionType.AGREEMENT_INVOICE_FILE_ADDED]: CATEGORY.FILES,
    [RecordHistoryActionType.AGREEMENT_INVOICE_FILE_DELETED]: CATEGORY.FILES,

    // Taskflow
    [RecordHistoryActionType.AGREEMENT_TASK_CREATED]: CATEGORY.TASKFLOW,
    [RecordHistoryActionType.AGREEMENT_TASK_ARCHIVED]: CATEGORY.TASKFLOW,
    [RecordHistoryActionType.AGREEMENT_TASK_STATUS_CHANGED]: CATEGORY.TASKFLOW,

    // Options
    [RecordHistoryActionType.AGREEMENT_OPTION_ADDED]: CATEGORY.OPTIONS,
    [RecordHistoryActionType.AGREEMENT_OPTION_UPDATED]: CATEGORY.OPTIONS,
    [RecordHistoryActionType.AGREEMENT_OPTION_EXERCISED]: CATEGORY.OPTIONS,
    [RecordHistoryActionType.AGREEMENT_OPTION_DELETED]: CATEGORY.OPTIONS,
};

const getActionCategory = (action: RecordHistoryActionType): string => {
    return actionCategoryMap[action] ?? 'Unknown';
};

export interface HistoryFormatContext {
    percentToCloseStepById: Map<string, { id: string; label: string }>;
    userTextById: Map<string, string>;
    contactTextById: Map<string, string>;
    formatDate: (iso: string) => string;
    fiscalYearsTextById: Map<string, string>;
    propertiesTextById: Map<string, string>;
    inventoriesTextById: Map<string, string>;
    organizationPackagesTextById: Map<string, string>;
    agreementValuesTextById: Map<string, string>;
    optionTypesTextById: Map<string, string>;
}

export type ActionValueFormatter = (
    value: string | null | undefined,
    ctx: HistoryFormatContext
) => string;

const dateFormatter: ActionValueFormatter = (v, ctx) =>
    v ? ctx.formatDate(v) : '';
const percentToCloseStepFormatter: ActionValueFormatter = (v, ctx) =>
    v ? ctx.percentToCloseStepById.get(v)?.label ?? '' : '';
const userFormatter: ActionValueFormatter = (v, ctx) =>
    v ? ctx.userTextById.get(v) ?? '' : '';
const contactFormatter: ActionValueFormatter = (v, ctx) =>
    v ? ctx.contactTextById.get(v) ?? '' : '';
const fiscalYearsFormatter: ActionValueFormatter = (v, ctx) =>
    v ? ctx.fiscalYearsTextById.get(v) ?? '' : '';
const inventoriesFormatter: ActionValueFormatter = (v, ctx) =>
    v ? ctx.inventoriesTextById.get(v) ?? '' : '';
const organizationPackagesFormatter: ActionValueFormatter = (v, ctx) =>
    v ? ctx.organizationPackagesTextById.get(v) ?? '' : '';
const defaultFormatter: ActionValueFormatter = (v) => String(v ?? '');

const formatters: Partial<
    Record<RecordHistoryActionType, ActionValueFormatter>
> = {
    [RecordHistoryActionType.AGREEMENT_END_DATE_UPDATED]: dateFormatter,
    [RecordHistoryActionType.AGREEMENT_START_DATE_UPDATED]: dateFormatter,
    [RecordHistoryActionType.AGREEMENT_STAGE_UPDATED]:
        percentToCloseStepFormatter,
    [RecordHistoryActionType.AGREEMENT_ACCOUNT_MANAGER_CREATED]: userFormatter,
    [RecordHistoryActionType.AGREEMENT_ACCOUNT_MANAGER_UPDATED]: userFormatter,
    [RecordHistoryActionType.AGREEMENT_PRIMARY_CONTACT_CREATED]:
        contactFormatter,
    [RecordHistoryActionType.AGREEMENT_PRIMARY_CONTACT_UPDATED]:
        contactFormatter,
    [RecordHistoryActionType.AGREEMENT_PROJECTED_DATE_UPDATED]: dateFormatter,
    [RecordHistoryActionType.AGREEMENT_FY_DELETED]: fiscalYearsFormatter,
    [RecordHistoryActionType.AGREEMENT_ASSET_ADDED]: inventoriesFormatter,
    [RecordHistoryActionType.AGREEMENT_PACKAGE_ADDED]:
        organizationPackagesFormatter,
    [RecordHistoryActionType.AGREEMENT_ASSET_REMOVED]: inventoriesFormatter,
    [RecordHistoryActionType.AGREEMENT_PACKAGE_REMOVED]:
        organizationPackagesFormatter,
};

export function createHistoryFormatContext(
    percentToCloseSteps: Array<{ id: string; label: string }>,
    userOptions: Array<{ value: string; text: string }>,
    contactOptions: Array<{ value: string; text: string }>,
    fiscalYearsOptions: Array<{ value: string; text: string }>,
    propertiesOptions: Array<{ value: string; text: string }>,
    inventoriesOptions: Array<{ value: string; text: string }>,
    organizationPackagesOptions: Array<{ value: string; text: string }>,
    agreementValuesOptions: Array<{ value: string; text: string }>,
    optionTypesOptions: Array<{ value: string; text: string }>
): HistoryFormatContext {
    const percentToCloseStepById = new Map(
        percentToCloseSteps.map((s) => [s.id, { id: s.id, label: s.label }])
    );
    const userTextById = new Map(userOptions.map((o) => [o.value, o.text]));
    const contactTextById = new Map(
        contactOptions.map((o) => [o.value, o.text])
    );
    const fiscalYearsTextById = new Map(
        fiscalYearsOptions.map((o) => [o.value, o.text])
    );

    const propertiesTextById = new Map(
        propertiesOptions.map((o) => [o.value, o.text])
    );
    const inventoriesTextById = new Map(
        inventoriesOptions.map((o) => [o.value, o.text])
    );
    const organizationPackagesTextById = new Map(
        organizationPackagesOptions.map((o) => [o.value, o.text])
    );
    const agreementValuesTextById = new Map(
        agreementValuesOptions.map((o) => [o.value, o.text])
    );
    const optionTypesTextById = new Map(
        optionTypesOptions.map((o) => [o.value, o.text])
    );
    return {
        percentToCloseStepById,
        userTextById,
        contactTextById,
        formatDate,
        fiscalYearsTextById,
        propertiesTextById,
        inventoriesTextById,
        organizationPackagesTextById,
        agreementValuesTextById,
        optionTypesTextById,
    };
}

export function formatValueForAction(
    action: RecordHistoryActionType,
    rawValue: string | null | undefined,
    ctx: HistoryFormatContext
): string {
    const formatter = formatters[action] ?? defaultFormatter;
    return formatter(rawValue, ctx);
}

export function buildAgreementHistoryColumns(
    ctx: HistoryFormatContext
): ColumnDef<RecordHistory, unknown>[] {
    function getActionContext(row: RecordHistory): string {
        switch (row.action) {
            case RecordHistoryActionType.AGREEMENT_GROSS_UPDATED_FOR_FY: {
                const metadata = row.metadata ?? {};
                const fiscalYearId = String(metadata.fiscal_year_id);
                if (!fiscalYearId) return '';
                const fyLabel = ctx.fiscalYearsTextById.get(fiscalYearId);
                return fyLabel ? ` (${fyLabel})` : '';
            }
            case RecordHistoryActionType.AGREEMENT_GROSS_UPDATED_FOR_PROPERTY: {
                const metadata = row.metadata ?? {};
                const propertyId = String(metadata.property_id);
                if (!propertyId) return '';
                const propertyLabel = ctx.propertiesTextById.get(propertyId);

                const fiscalYearId = String(metadata.fiscal_year_id);
                if (!fiscalYearId) return '';
                const fiscalYearLabel =
                    ctx.fiscalYearsTextById.get(fiscalYearId);

                return propertyLabel
                    ? ` (${propertyLabel} for ${fiscalYearLabel})`
                    : '';
            }
            case RecordHistoryActionType.AGREEMENT_AGREEMENT_VALUES_UPDATED: {
                const metadata = row.metadata ?? {};
                const agreementValueId = String(
                    metadata.organization_agreement_values_id
                );
                if (!agreementValueId) return '';
                const agreementValueLabel =
                    ctx.agreementValuesTextById.get(agreementValueId);

                const fiscalYearId = String(metadata.fiscal_year_id);
                if (!fiscalYearId) return '';
                const fiscalYearLabel =
                    ctx.fiscalYearsTextById.get(fiscalYearId);

                return agreementValueLabel
                    ? ` (${agreementValueLabel} - ${fiscalYearLabel})`
                    : '';
            }
            case RecordHistoryActionType.AGREEMENT_AGREEMENT_INVENTORY_ADDED: {
                const metadata = row.metadata ?? {};
                const inventoryId = String(metadata.inventory_id);
                if (!inventoryId) return '';
                const inventoryLabel = ctx.inventoriesTextById.get(inventoryId);

                const fiscalYearId = String(metadata.fiscal_year_id);
                const fiscalYearLabel =
                    ctx.fiscalYearsTextById.get(fiscalYearId);

                return inventoryLabel
                    ? ` (${inventoryLabel} for ${fiscalYearLabel})`
                    : '';
            }
            case RecordHistoryActionType.AGREEMENT_INVOICE_FILE_ADDED:
            case RecordHistoryActionType.AGREEMENT_INVOICE_FILE_DELETED:
            case RecordHistoryActionType.AGREEMENT_INVOICE_PAYMENT_ADDED:
            case RecordHistoryActionType.AGREEMENT_INVOICE_PAYMENT_DELETED: {
                const metadata = row.metadata ?? {};
                const invoiceNumber = String(metadata.invoice_number);
                if (!invoiceNumber) return '';
                return invoiceNumber ? ` (${invoiceNumber})` : '';
            }
            case RecordHistoryActionType.AGREEMENT_OPTION_ADDED:
            case RecordHistoryActionType.AGREEMENT_OPTION_EXERCISED:
            case RecordHistoryActionType.AGREEMENT_OPTION_DELETED: {
                const metadata = row.metadata ?? {};
                const optionTypeId = String(
                    metadata.organization_agreement_option_type_id || ''
                );
                const optionTypeName = optionTypeId
                    ? ctx.optionTypesTextById.get(optionTypeId) ||
                      'Unknown Option Type'
                    : row.action_value || 'n/a';
                return optionTypeName ? ` (${optionTypeName})` : '';
            }
            case RecordHistoryActionType.AGREEMENT_OPTION_UPDATED: {
                const metadata = row.metadata ?? {};
                const changedField = metadata.changed_field as
                    | string
                    | undefined;

                if (!changedField) {
                    return '';
                }

                const fieldLabelMap: Record<string, string> = {
                    organization_agreement_option_type_id: 'option type',
                    exercise_date: 'exercise date',
                    notes: 'notes',
                };
                const fieldLabel = fieldLabelMap[changedField] || changedField;
                const optionTypeId = String(
                    metadata.organization_agreement_option_type_id || ''
                );
                const optionTypeName = optionTypeId
                    ? ctx.optionTypesTextById.get(optionTypeId) ||
                      'Unknown Option Type'
                    : row.action_value || '';
                return optionTypeName
                    ? ` (${fieldLabel} for ${optionTypeName})`
                    : ` (${fieldLabel})`;
            }
            default:
                return '';
        }
    }

    return [
        {
            id: 'name',
            header: 'Name',
            accessorKey: 'user',
            meta: {
                exportRender: (row: RecordHistory) =>
                    row.user.first_name + ' ' + row.user.last_name,
            },
        },
        {
            id: 'action_category',
            header: 'Action Category',
            accessorKey: 'action_category',
            meta: {
                exportRender: (row: RecordHistory) =>
                    getActionCategory(row.action),
            },
        },
        {
            id: 'action',
            header: 'Action',
            accessorKey: 'action',
            meta: {
                exportRender: (row: RecordHistory) =>
                    `${row.action}${getActionContext(row)}`,
            },
        },
        {
            id: 'previous_value',
            header: 'Previous Value',
            accessorKey: 'previous_value',
            meta: {
                exportRender: (row: RecordHistory) => {
                    switch (row.action) {
                        case RecordHistoryActionType.AGREEMENT_INVENTORY_NOTES: {
                            return (
                                (row.metadata?.previous_value as string) ??
                                'n/a'
                            );
                        }
                        case RecordHistoryActionType.AGREEMENT_INVENTORY_LOCKED_RATE: {
                            return row.metadata?.previous_value
                                ? 'true'
                                : 'false';
                        }
                        case RecordHistoryActionType.AGREEMENT_INVENTORY_UNITS_SCHEDULED: {
                            return (
                                (row.metadata?.previous_value as string) ??
                                'n/a'
                            );
                        }
                        case RecordHistoryActionType.AGREEMENT_INVENTORY_CUSTOM_FIELDS: {
                            return `${
                                row.metadata?.custom_field_key ?? 'n/a'
                            }: ${row.metadata?.previous_value ?? 'n/a'}`;
                        }
                        case RecordHistoryActionType.AGREEMENT_OPTION_UPDATED: {
                            const metadata = row.metadata ?? {};
                            const previousValue = metadata.previous_value as
                                | string
                                | undefined;

                            return previousValue !== undefined &&
                                previousValue !== null &&
                                previousValue !== ''
                                ? previousValue
                                : 'empty';
                        }
                        default:
                            return formatValueForAction(
                                row.action,
                                row.metadata?.previous_value as
                                    | string
                                    | undefined,
                                ctx
                            );
                    }
                },
            },
        },
        {
            id: 'new_value',
            header: 'New Value',
            accessorKey: 'action_value',
            meta: {
                exportRender: (row: RecordHistory) => {
                    switch (row.action) {
                        case RecordHistoryActionType.AGREEMENT_ASSET_ADDED:
                        case RecordHistoryActionType.AGREEMENT_ASSET_REMOVED: {
                            const variantName = getVariantNameFromMetadata(
                                row.metadata
                            );
                            if (variantName) return variantName;

                            return (
                                (row.metadata?.asset_name as string) ?? 'n/a'
                            );
                        }
                        case RecordHistoryActionType.AGREEMENT_INVENTORY_NOTES: {
                            return row.action_value ?? 'n/a';
                        }
                        case RecordHistoryActionType.AGREEMENT_INVENTORY_CUSTOM_FIELDS: {
                            return `${
                                row.metadata?.custom_field_key ?? 'n/a'
                            }: ${row.metadata?.new_value ?? 'n/a'}`;
                        }
                        case RecordHistoryActionType.AGREEMENT_OPTION_UPDATED: {
                            const metadata = row.metadata ?? {};
                            const newValue = metadata.new_value as
                                | string
                                | undefined;

                            return newValue !== undefined &&
                                newValue !== null &&
                                newValue !== ''
                                ? newValue
                                : 'empty';
                        }
                        default:
                            return formatValueForAction(
                                row.action,
                                row.action_value as string | undefined,
                                ctx
                            );
                    }
                },
            },
        },
        {
            id: 'created_at',
            header: 'Timestamp',
            accessorKey: 'created_at',
            meta: {
                exportRender: (row: RecordHistory) =>
                    new Date(row.created_at).toISOString(),
            },
        },
    ];
}

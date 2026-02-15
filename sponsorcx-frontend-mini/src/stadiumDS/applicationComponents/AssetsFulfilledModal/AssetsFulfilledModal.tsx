import { StadiumModal } from '@/stadiumDS/sharedComponents/StadiumModal/StadiumModal';
import { Flex, NumberInput, Textarea, Tooltip } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { Formik } from 'formik';
import { useMutation } from '@apollo/client';
import { AssetFulfilledHistory } from '../AssetFulfilledHistory/AssetFulfilledHistory';
import {
    BrandAssetUsageUpdate,
    brandAssetUsageUpdateArchive,
    brandAssetUsageUpdateCreate,
    getBrandAssetUsageQueryName,
} from '@/gql/brandAssetUsageUpdateGql';
import { refetchBrandAssetHistoryQueries } from '@/hooks/useBrandAssetHistory';
import { ObjectType } from '@/gql/customFieldGql';
import useCustomFields from '@/hooks/useCustomFields';
import { BrandAsset } from '@/gql/brandAssetsGql';
import { StadiumCustomFieldsForm } from '../CustomFields/StadiumCustomFieldsForm';
import useFlagIsOn from '@/pages/internalPages/FeatureFlags/hooks/useFlagIsOn';

interface AssetsFulfilledModalProps {
    open: boolean;
    onClose: () => void;
    history: BrandAssetUsageUpdate[];
    totalAssets: number;
    brandAsset: BrandAsset | null | undefined;
}

export const AssetsFulfilledModal = ({
    open,
    onClose,
    history,
    totalAssets,
    brandAsset,
}: AssetsFulfilledModalProps) => {
    const assetsFulfilledCustomFields = useFlagIsOn(
        'assets_fulfilled_custom_fields'
    );
    const { customFields } = useCustomFields({
        objectType: ObjectType.B_ASSET_USAGE_UPDATE,
    });

    const [createAssetScheduled] = useMutation(brandAssetUsageUpdateCreate, {
        refetchQueries: [
            ...refetchBrandAssetHistoryQueries,
            getBrandAssetUsageQueryName,
        ],
    });

    const [archiveAssetUsageUpdate] = useMutation(
        brandAssetUsageUpdateArchive,
        {
            refetchQueries: [
                ...refetchBrandAssetHistoryQueries,
                getBrandAssetUsageQueryName,
            ],
        }
    );

    const handleDelete = (id: string) => {
        archiveAssetUsageUpdate({
            variables: { id },
        });
    };

    const remainingAssets =
        totalAssets -
        history.reduce((acc, curr) => acc + curr.quantity_fulfilled, 0);

    const initialValues = {
        b_asset_id: brandAsset?.id,
        quantity_fulfilled: 1,
        date: null,
        note: '',
        custom_fields: customFields?.reduce((acc, curr) => {
            acc[curr.key] = null;
            return acc;
        }, {} as Record<string, string | boolean | number | string[] | null>),
    };

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={async (values, { resetForm }) => {
                await createAssetScheduled({
                    variables: values,
                });
                resetForm();
                onClose();
            }}
            enableReinitialize
        >
            {({ values, handleSubmit, resetForm, setFieldValue }) => (
                <StadiumModal
                    open={open}
                    onClose={() => {
                        resetForm();
                        onClose();
                    }}
                    header={{
                        title: 'Assets Fulfilled',
                        description: 'Track assets that have been fulfilled',
                    }}
                    primaryButton={{
                        disabled: !values.quantity_fulfilled || !values.date,
                        onClick: () => handleSubmit(),
                    }}
                    secondaryButton={{
                        onClick: onClose,
                    }}
                    size="lg"
                >
                    <Flex direction="row" gap="16px" style={{ width: '100%' }}>
                        <Tooltip
                            label="All assets have been fulfilled"
                            disabled={remainingAssets > 0}
                        >
                            <NumberInput
                                label="Quantity Fulfilled"
                                value={values.quantity_fulfilled}
                                required
                                onChange={(value) =>
                                    setFieldValue('quantity_fulfilled', value)
                                }
                                onBlur={(e) => {
                                    if (e.target.value === '') {
                                        setFieldValue('quantity_fulfilled', 1);
                                    }
                                }}
                                max={remainingAssets}
                                min={1}
                                disabled={remainingAssets <= 0}
                            />
                        </Tooltip>
                        <DateInput
                            label="Date Fulfilled"
                            value={values.date}
                            required
                            onChange={(value) => setFieldValue('date', value)}
                        />
                    </Flex>
                    {customFields.length > 0 && assetsFulfilledCustomFields && (
                        <StadiumCustomFieldsForm
                            customFields={customFields}
                            value={
                                (values?.custom_fields ?? {}) as Record<
                                    string,
                                    string | boolean | number | string[] | null
                                >
                            }
                            onChange={(value) => {
                                setFieldValue('custom_fields', {
                                    ...(values.custom_fields || {}),
                                    ...value,
                                });
                            }}
                        />
                    )}
                    <Textarea
                        label="Notes"
                        value={values.note}
                        onChange={(e) => setFieldValue('note', e.target.value)}
                    />
                    {history.length > 0 && (
                        <AssetFulfilledHistory
                            history={history}
                            handleDelete={handleDelete}
                        />
                    )}
                </StadiumModal>
            )}
        </Formik>
    );
};

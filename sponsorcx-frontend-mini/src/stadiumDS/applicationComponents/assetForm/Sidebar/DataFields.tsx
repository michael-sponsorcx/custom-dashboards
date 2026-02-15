import { useTypeOptions } from '@/hooks/useTypeOptions';
import { AssetFormBaseProps } from '../types';
import { ObjectType } from '@/gql/customFieldGql';
import { useBrandPropertySpendTypes } from '@/hooks/useBrandPropertySpendTypes';
import { useMutation } from '@apollo/client';
import {
    createBrandSpendByAsset,
    updateBrandSpendByAsset,
} from '@/gql/brandSpendByAssetGql';
import { SidePanelFieldsSection } from '../../FormSlideOut/components/SidePanelFieldsSection';
import {
    SidePanelFieldProps,
    SidePanelFieldTypes,
} from '../../FormSlideOut/components/SidePanelFields/SidePanelFields.types';
import { useSidePanelCustomFieldProps } from '../../FormSlideOut/hooks/useSidePanelCustomFieldProps';

export interface DataFieldsProps extends AssetFormBaseProps {
    highlightRequiredFields?: boolean;
}

export const DataFields = ({
    asset,
    onUpdate,
    highlightRequiredFields = false,
    disabled,
}: DataFieldsProps) => {
    const typeOptions = useTypeOptions();

    const { brandSpendTypes, refetchBrandSpendTypes } =
        useBrandPropertySpendTypes({
            assetId: asset?.id,
            onlyAssetSpends: true,
            skip: !asset?.id,
        });

    const [createSpendByAsset] = useMutation(createBrandSpendByAsset, {
        onCompleted: () => {
            refetchBrandSpendTypes();
        },
    });

    const [updateSpendByAsset] = useMutation(updateBrandSpendByAsset, {
        onCompleted: () => {
            refetchBrandSpendTypes();
        },
    });

    const handleSpendByAssetUpdate = (spendTypeId: string, amount: number) => {
        const existingSpendByAsset = brandSpendTypes?.find(
            (spendType) => spendType.id === spendTypeId
        )?.b_spend_by_assets?.[0];

        if (existingSpendByAsset) {
            updateSpendByAsset({
                variables: {
                    id: existingSpendByAsset.id,
                    amount,
                },
            });
        } else {
            createSpendByAsset({
                variables: {
                    organization_id: asset?.organization_id ?? '',
                    b_asset_id: asset?.id ?? '',
                    b_spend_type_id: spendTypeId,
                    amount,
                },
            });
        }
    };

    const customFieldValues = asset?.custom_fields ?? {};

    const handleCustomFieldChange = (
        key: string,
        value: string | number | boolean | string[] | null
    ) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [key]: _, ...custom_fields } = customFieldValues;

        onUpdate(asset?.id, {
            custom_fields: {
                ...custom_fields,
                [key]: value,
            },
        });
    };

    const customFieldProps = useSidePanelCustomFieldProps({
        objectType: ObjectType.B_ASSET,
        value: customFieldValues,
        onFieldChange: handleCustomFieldChange,
        disabled,
    });

    const typeField: SidePanelFieldProps = {
        type: SidePanelFieldTypes.SELECT,
        label: 'Type',
        value: asset?.type_id,
        onChange: (value) => {
            onUpdate(asset?.id, {
                type_id: value ? String(value) : undefined,
            });
        },
        options: typeOptions.map((option) => ({
            value: option.value,
            label: option.text,
        })),
        required: true,
        disabled,
        highlightRequiredFields,
    };

    const spendTypeFields: SidePanelFieldProps[] =
        brandSpendTypes?.map((spendType) => ({
            type: SidePanelFieldTypes.NUMBER as const,
            label: spendType.label,
            value: spendType.b_spend_by_assets?.[0]?.amount,
            onChange: (value: number | null) => {
                handleSpendByAssetUpdate(spendType.id, value ?? 0);
            },
            disabled,
            prefix: '$',
        })) ?? [];

    const fields: SidePanelFieldProps[] = [
        typeField,
        ...spendTypeFields,
        ...customFieldProps,
    ];

    return (
        <SidePanelFieldsSection
            header={{ title: 'Data Fields' }}
            fields={fields}
        />
    );
};

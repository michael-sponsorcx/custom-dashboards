import { BrandAsset, BrandAssetUpdateFields } from '@/gql/brandAssetsGql';
import { BrandAssetUserInput } from '@/gql/brandAssetUserGql';
import { CustomField } from '@/gql/customFieldGql';

export interface AssetFormBaseProps {
    asset?: BrandAsset | null;
    customFields?: CustomField[];
    onUpdate: (
        id: string | undefined,
        fieldsToUpdate: Partial<BrandAssetUpdateFields>
    ) => Promise<void>;
    disabled?: boolean;
}

export type onUpdateAssignedUsers = (
    id: string | undefined,
    users: BrandAssetUserInput[]
) => void;

export type onUpdateFollowerUsers = (
    id: string | undefined,
    users: BrandAssetUserInput[]
) => void;

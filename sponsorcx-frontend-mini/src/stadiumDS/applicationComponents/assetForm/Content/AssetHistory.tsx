import { AssetFormBaseProps } from '../types';
import { useUserOptions } from '@/hooks/useUserOptions';
import { useBrandPropertyOptions } from '@/hooks/useBrandPropertyOptions';
import { useTypeOptions } from '@/hooks/useTypeOptions';
import { useBrandAssetHistory } from '@/hooks/useBrandAssetHistory';
import { ObjectType } from '@/gql/customFieldGql';
import useCustomFields from '@/hooks/useCustomFields';
import { HistoryType } from '../../FormSlideOut/components/HistorySection/HistorySection.type';
import { HistorySection } from '../../FormSlideOut/components/HistorySection/HistorySection';

export const AssetHistory = ({
    asset,
}: {
    asset: AssetFormBaseProps['asset'];
}) => {
    const propertyOptions = useBrandPropertyOptions();
    const userOptions = useUserOptions();
    const typeOptions = useTypeOptions();
    const { customFields: customFieldOptions } = useCustomFields({
        objectType: ObjectType.B_ASSET,
    });

    const { data: history } = useBrandAssetHistory(asset?.id);

    return (
        <HistorySection
            title="Asset History"
            history={history}
            actionType={{
                type: HistoryType.BRAND_ASSET,
                options: {
                    userOptions,
                    propertyOptions,
                    typeOptions,
                    customFieldOptions,
                },
            }}
        />
    );
};

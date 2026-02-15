import { AssetFormBaseProps } from '../types';
import { UploadNode } from '@/hooks/useUniversalUploadList';
import { NoteAndFilesSection } from '../../FormSlideOut/components/NoteAndFilesSection';
import { getBrandUploadOrigins } from '@/pages/brandPages/Uploads/helpers/BrandUploads.helpers';
import { useLexicon } from '@/hooks/useLexicon';
import { refetchBrandAssetHistoryQueries } from '@/hooks/useBrandAssetHistory';

export type SpecsProps = AssetFormBaseProps & {
    brandAssetUploads: UploadNode[];
    refetchBrandAssetUploads: () => void;
    hoveringUploadIds: string[];
};

export const Specs = ({
    asset,
    onUpdate,
    disabled,
    brandAssetUploads,
    refetchBrandAssetUploads,
    hoveringUploadIds,
}: SpecsProps) => {
    const lexicon = useLexicon();

    return (
        <NoteAndFilesSection
            title="Specs"
            value={asset?.specs ?? ''}
            placeholder="Add specs..."
            onUpdate={(value) => onUpdate(asset?.id, { specs: value })}
            disabled={disabled}
            files={{
                recordType: 'BAsset',
                recordId: asset?.id ?? '',
                refetch: refetchBrandAssetUploads,
                refetchQueries: [...refetchBrandAssetHistoryQueries, 'uploads'],
                uploads: brandAssetUploads,
                hoveringUploadIds,
                originHelperFn: getBrandUploadOrigins(lexicon),
            }}
        />
    );
};

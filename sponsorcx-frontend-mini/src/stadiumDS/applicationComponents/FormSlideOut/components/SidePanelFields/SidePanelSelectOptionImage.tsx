import { useS3Resource } from '@/hooks/useS3Resources';
import { ReactNode } from 'react';
import { sidePanelLabelIconSize } from './SidePanelFields.types';

export const SidePanelSelectOptionImage = ({
    image = '',
    size = sidePanelLabelIconSize,
    fallback,
}: {
    image?: string;
    size?: number;
    fallback?: ReactNode;
}) => {
    const s3Resource = useS3Resource(image);

    return s3Resource ? (
        <img src={s3Resource} alt={image} width={size} height={size} />
    ) : (
        fallback
    );
};

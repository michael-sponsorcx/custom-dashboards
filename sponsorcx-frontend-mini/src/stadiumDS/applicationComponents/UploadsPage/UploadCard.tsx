import { UploadNode } from '@/hooks/useUniversalUploadList';
import * as S from './UploadCard.styles';
import { UploadContent } from '../UploadContent/UploadContent';
import { Text } from '@mantine/core';

interface UploadCardProps {
    upload: UploadNode;
    handleCardClick: () => void;
    selected: boolean;
}

export const UploadCard = ({
    upload,
    handleCardClick,
    selected,
}: UploadCardProps) => {
    return (
        <S.CardContainer
            onClick={handleCardClick}
            data-testid={`upload-card-${upload.id}`}
        >
            <S.Card $selected={selected}>
                <UploadContent upload={upload} playIconSize="36" />
            </S.Card>
            <Text truncate>
                {upload.display_name || upload.original_filename}
            </Text>
        </S.CardContainer>
    );
};

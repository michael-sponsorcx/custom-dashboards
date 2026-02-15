import { Dropzone } from '@/components/Dropzone';
import colors from '@/stadiumDS/foundations/colors';
import { StadiumDropzone } from '@/stadiumDS/sharedComponents/dropzone/StadiumDropzone';
import * as S from './StadiumImageUpload.styles';
import { useS3Resource } from '@/hooks/useS3Resources';
import 'styled-components/macro';

const StadiumImage = ({
    image,
    altText,
    containerStyle,
}: {
    image: string;
    altText?: string;
    containerStyle?: string;
}) => {
    const imageUrl = useS3Resource(image);

    return (
        <S.ImageContainer src={imageUrl} alt={altText} css={containerStyle} />
    );
};

interface StadiumImageUploadProps {
    image?: string;
    altText?: string;
    prefixKey: string;
    onUpload: (key: string) => void;
    onDelete: () => void;
    imageContainerStyle?: string;
}

export const StadiumImageUpload = ({
    image,
    altText = 'Uploaded Image',
    prefixKey,
    onUpload,
    onDelete,
    imageContainerStyle,
}: StadiumImageUploadProps) => {
    if (image) {
        return (
            <S.Container>
                <StadiumImage
                    image={image}
                    altText={altText}
                    containerStyle={imageContainerStyle}
                />
                <S.ButtonContainer>
                    <S.TextButton $color={colors.Gray[600]} onClick={onDelete}>
                        Delete
                    </S.TextButton>
                    <Dropzone
                        aspect={1}
                        onUpload={onUpload}
                        logo={image}
                        prefixKey={prefixKey}
                        skipConfirm
                        pick="image/*"
                        trigger={
                            <S.TextButton $color={colors.Brand[400]}>
                                Update
                            </S.TextButton>
                        }
                        skipCrop
                    />
                </S.ButtonContainer>
            </S.Container>
        );
    }
    return (
        <StadiumDropzone
            onUpload={onUpload}
            prefixKey={prefixKey}
            skipConfirm
            pick="image/*"
        />
    );
};

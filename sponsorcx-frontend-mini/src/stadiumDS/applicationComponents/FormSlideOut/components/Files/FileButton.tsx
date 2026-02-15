import { UploadNode } from '@/hooks/useUniversalUploadList';
import * as S from './Files.styles';
import Trash from '@/stadiumDS/foundations/icons/General/Trash';
import colors from '@/stadiumDS/foundations/colors';
import { useState } from 'react';
import { Loader } from '@mantine/core';
import { UploadContent } from '@/stadiumDS/applicationComponents/UploadContent/UploadContent';

export const FileButton = ({
    image,
    handleDelete,
    disabled = false,
    highlight = false,
    onImageClick,
}: {
    image: UploadNode;
    handleDelete: () => Promise<void>;
    disabled?: boolean;
    highlight?: boolean;
    onImageClick: () => void;
}) => {
    const [isHovering, setIsHovering] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    return (
        <div
            style={{ position: 'relative' }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <S.FileButton
                aria-label={`Select ${image.original_filename}`}
                $highlight={highlight}
                onClick={onImageClick}
                $isHovering={isHovering}
            >
                <UploadContent upload={image} borderRadius="0px" />
            </S.FileButton>
            {!disabled && (
                <S.TrashContainer
                    $isVisible={isHovering}
                    onClick={
                        disabled
                            ? undefined
                            : async (e) => {
                                  e.stopPropagation();
                                  setIsDeleting(true);
                                  await handleDelete();
                                  setIsDeleting(false);
                              }
                    }
                >
                    {isDeleting ? (
                        <Loader
                            color={colors.Base.Black}
                            size={'16'}
                            variant="1"
                        />
                    ) : (
                        <Trash
                            color={colors.Base.Black}
                            size={'16'}
                            variant="1"
                        />
                    )}
                </S.TrashContainer>
            )}
        </div>
    );
};

import { Text } from '@mantine/core';
import colors from '@/stadiumDS/foundations/colors';
import Upload from '@/stadiumDS/foundations/icons/General/Upload';
import * as S from './StadiumDropzoneTrigger.styles';
import { useState } from 'react';

interface StadiumDropzoneTriggerProps {
    description?: string;
}

export const StadiumDropzoneTrigger = ({
    description = 'SVG, PNG, JPG',
}: StadiumDropzoneTriggerProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const handleDragEnter = () => {
        setIsDragging(true);
    };
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        // if element is not a child of the container, set isDragging to false
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsDragging(false);
        }
    };
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        setIsDragging(false);
    };
    return (
        <S.Container
            isDragging={isDragging}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <S.IconContainer>
                <Upload
                    color={colors.Gray[600]}
                    size={'20'}
                    variant="cloud-2"
                />
            </S.IconContainer>
            <S.TextContainer>
                <S.UploadTextContainer>
                    <Text fw="600" c={colors.Brand[400]}>
                        Click to upload
                    </Text>
                    <Text c={colors.Gray[600]}>or drag and drop</Text>
                </S.UploadTextContainer>
                <Text fz={'var(--mantine-font-size-sm)'} c={colors.Gray[600]}>
                    {description}
                </Text>
            </S.TextContainer>
        </S.Container>
    );
};

import { useMemo, useState } from 'react';
import * as S from './CustomFieldsTable.styles';
import { Text, Tooltip } from '@mantine/core';

const MAX_WIDTH = 96;

interface CustomFieldOptionProps {
    option: string;
}

export const CustomFieldOption = ({ option }: CustomFieldOptionProps) => {
    const [optionContainerRef, setOptionContainerRef] =
        useState<HTMLDivElement | null>(null);

    const isTruncated = useMemo(() => {
        if (!optionContainerRef) return false;
        return optionContainerRef.clientWidth >= MAX_WIDTH - 2;
    }, [optionContainerRef?.clientWidth]);

    return (
        <Tooltip label={option} disabled={!isTruncated}>
            <S.OptionContainer
                $maxWidth={MAX_WIDTH}
                ref={setOptionContainerRef}
            >
                <Text truncate>{option}</Text>
            </S.OptionContainer>
        </Tooltip>
    );
};

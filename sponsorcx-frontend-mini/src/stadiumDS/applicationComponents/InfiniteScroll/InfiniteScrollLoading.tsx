import { Loader } from '@mantine/core';
import * as S from './InfiniteScroll.styles';

export const InfiniteScrollLoading = () => {
    return (
        <S.Container>
            <Loader />
        </S.Container>
    );
};

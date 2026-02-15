import * as S from './InfiniteScroll.styles';

interface InfiniteScrollLoadMoreProps {
    addPage: () => void;
}

export const InfiniteScrollLoadMore = ({
    addPage,
}: InfiniteScrollLoadMoreProps) => {
    return (
        <S.Container>
            <S.LoadMoreButton
                onClick={() => {
                    addPage();
                }}
            >
                Load more
            </S.LoadMoreButton>
        </S.Container>
    );
};

import { InfiniteScrollLoading } from './InfiniteScrollLoading';
import { InfiniteScrollLoadMore } from './InfiniteScrollLoadMore';

interface InfiniteScrollFooterProps {
    loading: boolean;
    hasMore: boolean;
    addPage: () => void;
}

export const InfiniteScrollFooter = ({
    loading,
    hasMore,
    addPage,
}: InfiniteScrollFooterProps) => {
    if (loading) {
        return <InfiniteScrollLoading />;
    }
    if (hasMore) {
        return <InfiniteScrollLoadMore addPage={addPage} />;
    }
    return null;
};

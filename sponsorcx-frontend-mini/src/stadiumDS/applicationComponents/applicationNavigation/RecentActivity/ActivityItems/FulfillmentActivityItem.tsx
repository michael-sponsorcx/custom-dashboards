import { Audit } from '@/gql/auditGql';
import { RecentActivityItem } from './RecentActivityItem';
import FileCheck from '@/stadiumDS/foundations/icons/Files/FileCheck';

interface FulfillmentActivityItemProps {
    item: Audit;
}

export const FulfillmentActivityItem = ({
    item,
}: FulfillmentActivityItemProps) => {
    const secondaryRoute: string | undefined = item.path
        .split('/')[2]
        ?.split('?')[0];
    const isTasks = secondaryRoute === 'tasks';

    return (
        <RecentActivityItem
            label={isTasks ? 'Tasks' : 'Live Memo'}
            icon={({ color, size }) => (
                <FileCheck color={color} size={size} variant="2" />
            )}
            path={item.path}
        />
    );
};

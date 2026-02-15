import { Audit } from '@/gql/auditGql';
import { RecentActivityItem } from './RecentActivityItem';
import Activity from '@/stadiumDS/foundations/icons/General/Activity';

interface ActivitiesActivityItemProps {
    item: Audit;
}

export const ActivitiesActivityItem = ({
    item,
}: ActivitiesActivityItemProps) => {
    return (
        <RecentActivityItem
            label="Activities"
            icon={({ color, size }) => <Activity color={color} size={size} />}
            path={item.path}
        />
    );
};

import { Audit } from '@/gql/auditGql';
import { RecentActivityItem } from './RecentActivityItem';
import BarChart from '@/stadiumDS/foundations/icons/Charts/BarChart';

interface DashboardActivityItemProps {
    item: Audit;
}

export const DashboardActivityItem = ({ item }: DashboardActivityItemProps) => {
    return (
        <RecentActivityItem
            label="Dashboard"
            icon={({ color, size }) => (
                <BarChart color={color} size={size} variant="8" />
            )}
            path={item.path}
        />
    );
};

import { Audit } from '@/gql/auditGql';
import { RecentActivityItem } from './RecentActivityItem';
import Building from '@/stadiumDS/foundations/icons/General/Building';

interface OrganizationsActivityItemProps {
    item: Audit;
}

export const OrganizationsActivityItem = ({
    item,
}: OrganizationsActivityItemProps) => {
    return (
        <RecentActivityItem
            label="Organizations"
            icon={({ color, size }) => (
                <Building color={color} size={size} variant="7" />
            )}
            path={item.path}
        />
    );
};

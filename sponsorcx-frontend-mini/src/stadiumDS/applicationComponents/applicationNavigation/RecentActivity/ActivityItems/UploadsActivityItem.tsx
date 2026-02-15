import { Audit } from '@/gql/auditGql';
import { RecentActivityItem } from './RecentActivityItem';
import Upload from '@/stadiumDS/foundations/icons/General/Upload';

interface UploadsActivityItemProps {
    item: Audit;
}

export const UploadsActivityItem = ({ item }: UploadsActivityItemProps) => {
    return (
        <RecentActivityItem
            label="Uploads"
            icon={({ color, size }) => (
                <Upload color={color} size={size} variant="1" />
            )}
            path={item.path}
        />
    );
};

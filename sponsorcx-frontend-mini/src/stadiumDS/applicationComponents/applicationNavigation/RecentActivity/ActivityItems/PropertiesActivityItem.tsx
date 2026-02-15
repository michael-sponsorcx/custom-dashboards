import { Audit } from '@/gql/auditGql';
import { RecentActivityItem } from './RecentActivityItem';
import Building from '@/stadiumDS/foundations/icons/General/Building';
import colors from '@/stadiumDS/foundations/colors';
import { useBrandPropertyOptions } from '@/hooks/useBrandPropertyOptions';

interface PropertiesActivityItemProps {
    item: Audit;
}

export const PropertiesActivityItem = ({
    item,
}: PropertiesActivityItemProps) => {
    const propertyOptions = useBrandPropertyOptions();
    const secondaryRoute: string | undefined = item.path
        .split('/')[2]
        ?.split('?')[0];

    const property = propertyOptions?.find(
        (property) => property.value === secondaryRoute
    );

    return (
        <RecentActivityItem
            label={property?.label || 'Properties'}
            icon={({ color, size }) => (
                <Building color={color} size={size} variant="6" />
            )}
            path={item.path}
        />
    );
};

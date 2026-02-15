import { Audit } from '@/gql/auditGql';
import { RecentActivityItem } from './RecentActivityItem';
import Settings from '@/stadiumDS/foundations/icons/General/Settings';

const labelMap: { [key: string]: string } = {
    profile: 'Profile',
    organization: 'General Info',
    info: 'General Info',
    integrations: 'Integrations',
    users: 'Users',
    values: 'Brands',
    brands: 'Brands',
    brand: 'Data Fields: Brand',
    b_property: 'Data Fields: Property',
    b_contacts: 'Data Fields: Contact',
    entity_contact_rel: 'Data Fields: Contact Type',
    b_asset: 'Data Fields: Asset',
    activity: 'Data Fields: Activity',
    activities: 'Activity Types',
    relationships: 'Relationship Types',
    'required-fields': 'Required Fields',
    'spend-fields': 'Spend Fields',
    'person-property-associations': 'Person Property Associations',
    templates: 'Task Templates',
    'task-templates': 'Task Templates',
};

interface SettingsActivityItemProps {
    item: Audit;
}

export const SettingsActivityItem = ({ item }: SettingsActivityItemProps) => {
    const lastRoute: string = item.path.split('/').pop()!.split('?')[0];

    return (
        <RecentActivityItem
            label={labelMap[lastRoute] || 'Profile'}
            icon={({ color, size }) => (
                <Settings color={color} size={size} variant="1" />
            )}
            path={item.path}
        />
    );
};

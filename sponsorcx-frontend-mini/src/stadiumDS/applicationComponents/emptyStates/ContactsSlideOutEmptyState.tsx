import GenericSlideOutEmptyState from './GenericSlideOutEmptyState';
import UserCircle from '@/stadiumDS/foundations/icons/Users/UserCircle';
import colors from '@/stadiumDS/foundations/colors';
import { PermissionsOld, userHasPermission } from '@/gql/userOrgRelGql';
import { Permissions } from '@/entities/permissions/permissions.type';
import { useUserStore } from '@/stores/userStore';
import useFlagIsOn from '@/pages/internalPages/FeatureFlags/hooks/useFlagIsOn';

interface ContactsSlideOutEmptyStateProps {
    onNewContactClick: () => void;
}

const ContactsSlideOutEmptyState = ({
    onNewContactClick,
}: ContactsSlideOutEmptyStateProps) => {
    const { user, userOrgRel } = useUserStore();
    const showNewPermissionsSolution = useFlagIsOn(
        'show_new_permissions_solution'
    );

    const editAccountPermission = showNewPermissionsSolution
        ? Permissions.EDIT_ACCOUNTS
        : PermissionsOld.EDIT_ACCOUNTS;

    const canEditContacts = userHasPermission(
        editAccountPermission,
        user,
        userOrgRel
    );

    return (
        <GenericSlideOutEmptyState
            icon={<UserCircle color={colors.Gray[700]} size="16" />}
            title="Add contacts"
            description="Start by adding a contact"
            buttonText="New Contact"
            onButtonClick={onNewContactClick}
            hideAddButton={!canEditContacts}
        />
    );
};

export default ContactsSlideOutEmptyState;

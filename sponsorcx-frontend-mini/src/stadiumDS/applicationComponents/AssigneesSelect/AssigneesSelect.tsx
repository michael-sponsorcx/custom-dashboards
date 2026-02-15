import { SelectMenu } from '@/stadiumDS/sharedComponents/menu/SelectMenu';
import { UnstyledButton } from '@mantine/core';
import { getAssigneesSelectTrigger } from './AssigneesSelectTrigger';
import { User } from '@/gql/types';
import useStore from '@/state';
import { Avatar } from '@/components/UserInfo';

interface AssigneesSelectProps {
    assigneeUserIds: string[];
    handleUpdateAssignees?: (assigneeUserIds: string[]) => void;
    withinPortal?: boolean;
    disabled?: boolean;
    userOptions?: User[];
    appendKey?: string;
    onClose?: () => void;
}

export const AssigneesSelect = ({
    assigneeUserIds,
    handleUpdateAssignees,
    withinPortal = true,
    disabled,
    userOptions,
    appendKey,
    onClose,
}: AssigneesSelectProps) => {
    const organization = useStore((state) => state.organization);
    const allUsers = organization.user_org_rels.map((uor) => uor.user) ?? [];
    // Sort users alphabetically by full name (first_name + last_name)
    const sortUsers = (users: User[]) => {
        return [...users].sort((a, b) => {
            const aName = `${a.first_name || ''} ${a.last_name || ''}`.trim();
            const bName = `${b.first_name || ''} ${b.last_name || ''}`.trim();
            return aName.localeCompare(bName);
        });
    };
    const sortedAllUsers = sortUsers(allUsers);
    const options = userOptions ? sortUsers(userOptions) : sortedAllUsers;
    const assigneeUsers: User[] = assigneeUserIds
        .map((auId) => {
            const user = options.find((u) => u.id === auId);
            return user;
        })
        .filter((u) => !!u);

    if (!handleUpdateAssignees) {
        if (assigneeUsers.length === 0) {
            return '--';
        }
        return getAssigneesSelectTrigger(assigneeUsers);
    }

    return (
        <SelectMenu
            trigger={
                <UnstyledButton
                    style={{
                        position: 'relative',
                        cursor: disabled ? 'not-allowed' : 'pointer',
                    }}
                >
                    {getAssigneesSelectTrigger(assigneeUsers)}
                </UnstyledButton>
            }
            items={options.map((user) => ({
                label: `${user.first_name} ${user.last_name}`,
                value: user.id,
                onClick: () => {
                    const newUserIds = [...assigneeUsers.map((au) => au.id)];
                    if (newUserIds.includes(user.id)) {
                        newUserIds.splice(newUserIds.indexOf(user.id), 1);
                    } else {
                        newUserIds.push(user.id);
                    }
                    handleUpdateAssignees(newUserIds);
                },
                leftSection: <Avatar user={user} size={16} removeMargin />,
                key: appendKey,
            }))}
            withinPortal={withinPortal}
            multiple={true}
            value={assigneeUserIds}
            disabled={disabled}
            onClose={onClose}
            searchable={true}
        />
    );
};

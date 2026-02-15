import useStore from '@/state';
import {
    sidePanelFieldPlaceholderColor,
    sidePanelLabelIconSize,
    UserMultiSelectFieldProps,
} from './SidePanelFields.types';
import { Avatar, getNameFromObj } from '@/components/UserInfo';
import { getAssigneesSelectTrigger } from '@/stadiumDS/applicationComponents/AssigneesSelect/AssigneesSelectTrigger';
import { SidePanelFieldLabel } from './SidePanelFieldLabel';
import UserCircle from '@/stadiumDS/foundations/icons/Users/UserCircle';
import { SelectMenu } from '@/stadiumDS/sharedComponents/menu/SelectMenu';
import { Tooltip, UnstyledButton } from '@mantine/core';
import triggerButtonClasses from './SidePanelTriggerButton.module.css';

export const SidePanelUserMultiSelect = ({
    value,
    onChange,
    label,
    disabled,
    required,
    options,
}: Omit<UserMultiSelectFieldProps, 'type'>) => {
    const organization = useStore((state) => state.organization);
    const allUsers = organization.user_org_rels?.map((uor) => uor.user) ?? [];
    const allUserOptions = allUsers.map((user) => ({
        value: user.id,
        label: getNameFromObj(user),
        leftSection: (
            <Avatar user={user} size={sidePanelLabelIconSize} removeMargin />
        ),
    }));

    const userItems = (options ?? allUserOptions).map((option) => ({
        ...option,
        onClick: () =>
            value?.includes(option.value)
                ? onChange(value?.filter((v) => v !== option.value))
                : onChange([...(value || []), option.value]),
    }));

    const selectedItems = userItems.filter((item) =>
        value?.includes(item.value)
    );
    const selectedUsers = selectedItems
        .map((item) => allUsers.find((user) => user.id === item.value))
        .filter((user) => !!user);

    if (disabled) {
        return selectedUsers.length > 0 ? (
            <Tooltip label={label}>
                {getAssigneesSelectTrigger(selectedUsers, true)}
            </Tooltip>
        ) : (
            <SidePanelFieldLabel
                label={label}
                icon={
                    <UserCircle
                        color={sidePanelFieldPlaceholderColor}
                        size={String(sidePanelLabelIconSize)}
                    />
                }
            />
        );
    }

    return (
        <SelectMenu
            trigger={
                <UnstyledButton className={triggerButtonClasses.triggerButton}>
                    {selectedUsers.length > 0 ? (
                        <Tooltip label={label}>
                            {getAssigneesSelectTrigger(selectedUsers, true)}
                        </Tooltip>
                    ) : (
                        <SidePanelFieldLabel
                            label={label}
                            required={required}
                            icon={
                                <UserCircle
                                    color={sidePanelFieldPlaceholderColor}
                                    size={String(sidePanelLabelIconSize)}
                                />
                            }
                        />
                    )}
                </UnstyledButton>
            }
            items={userItems}
            value={value}
            multiple
            searchable
        />
    );
};

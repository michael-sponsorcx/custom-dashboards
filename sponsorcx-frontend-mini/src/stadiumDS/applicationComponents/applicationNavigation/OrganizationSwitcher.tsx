import { Organization, organizationsForUser } from '@/gql/organizationGql';
import colors from '@/stadiumDS/foundations/colors';
import Building from '@/stadiumDS/foundations/icons/General/Building';
import useStore from '@/state';
import { useUserStore } from '@/stores/userStore';
import { useQuery } from '@apollo/client';
import {
    Combobox,
    Group,
    Text,
    UnstyledButton,
    useCombobox,
    CheckIcon,
} from '@mantine/core';
import { useEffect } from 'react';
import cssClasses from './OrganizationSwitcher.module.css';

export const ACTIVE_ORG_ID_LOCAL_STORAGE_KEY = 'activeOrgId';

const OrganizationSwitcher = ({ parentIsOpen }: { parentIsOpen: boolean }) => {
    const organization = useStore((state) => state.organization);
    const setOrganization = useStore((state) => state.setOrganization);
    const setIsSponsorUser = useUserStore((state) => state.setIsSponsorUser);
    const setIsBrandPartnerUser = useUserStore(
        (state) => state.setIsBrandPartnerUser
    );
    const { user } = useUserStore();

    const { data } = useQuery<{
        organizationsForUser: Organization[];
    }>(organizationsForUser);

    const availableOrgIds =
        data?.organizationsForUser.map((org) => org.id) ?? [];

    const moreThanOneOrgAvailable = availableOrgIds?.length > 1;

    const orgSelectOptions =
        data?.organizationsForUser.map((org) => ({
            label: org.name,
            value: org.id,
        })) || [];

    const handleSelect = (newOrgId: string | null) => {
        if (!newOrgId) return;

        localStorage.setItem(ACTIVE_ORG_ID_LOCAL_STORAGE_KEY, newOrgId);

        const brandPartnerOrgSelected =
            !!user?.brand_user_contact_relationships?.find(
                (bucr) => bucr.organization_id === newOrgId
            );
        const propertyPartnerOrgSelected =
            !!user?.user_contact_relationships?.find(
                (ucr) => ucr.organization_id === newOrgId
            );

        setIsBrandPartnerUser(brandPartnerOrgSelected);
        setIsSponsorUser(propertyPartnerOrgSelected || brandPartnerOrgSelected);

        const newOrg = data?.organizationsForUser?.find(
            (org) => org.id === newOrgId
        );

        if (newOrg && newOrg.id !== organization.id) {
            setOrganization(newOrg);
        }
    };

    useEffect(() => {
        if (!data?.organizationsForUser || !moreThanOneOrgAvailable) return;

        const storedOrgId = localStorage.getItem(
            ACTIVE_ORG_ID_LOCAL_STORAGE_KEY
        );

        if (
            storedOrgId &&
            availableOrgIds.includes(storedOrgId) &&
            storedOrgId !== organization.id
        ) {
            handleSelect(storedOrgId);
        }
    }, [data, JSON.stringify(availableOrgIds), organization.id]);

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
        onDropdownOpen: (eventSource) => {
            if (eventSource === 'keyboard') {
                combobox.selectActiveOption();
            } else {
                combobox.updateSelectedOptionIndex('active');
            }
        },
    });

    useEffect(() => {
        if (!parentIsOpen) {
            combobox.closeDropdown();
        }
    }, [parentIsOpen]);

    const activeOrgId = organization.id;

    if (!moreThanOneOrgAvailable) return null;

    return (
        <Combobox
            store={combobox}
            onOptionSubmit={(val) => {
                handleSelect(val);
                combobox.closeDropdown();
            }}
            position="top"
            classNames={cssClasses}
        >
            <Combobox.Target>
                <UnstyledButton
                    onClick={() => combobox.toggleDropdown()}
                    styles={{
                        root: {
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'center',
                            padding: '8px',
                        },
                    }}
                >
                    <Building size="20" variant="7" color={colors.Gray[500]} />
                    <Text c={colors.Gray[700]} fw={600}>
                        Org selector
                    </Text>
                </UnstyledButton>
            </Combobox.Target>
            <Combobox.Dropdown>
                <Combobox.Options>
                    {orgSelectOptions.map((option) => (
                        <Combobox.Option
                            value={option.value}
                            key={option.value}
                            active={option.value === activeOrgId}
                        >
                            <Group
                                gap="xs"
                                justify="space-between"
                                wrap="nowrap"
                            >
                                <span style={{ maxWidth: '84%' }}>
                                    {option.label}
                                </span>
                                {option.value === activeOrgId && (
                                    <CheckIcon
                                        size={12.8}
                                        color={colors.Brand[400]}
                                        opacity={0.4}
                                    />
                                )}
                            </Group>
                        </Combobox.Option>
                    ))}
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
};

export default OrganizationSwitcher;

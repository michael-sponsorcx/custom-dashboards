import { Audit } from '@/gql/auditGql';
import { auditForUserOrg } from '@/gql/auditGql';
import colors from '@/stadiumDS/foundations/colors';
import Clock from '@/stadiumDS/foundations/icons/Time/Clock';
import useStore from '@/state';
import { useUserStore } from '@/stores/userStore';
import { useQuery } from '@apollo/client';
import { ActionIcon, Flex, Menu, Text, Tooltip } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { DashboardActivityItem } from './ActivityItems/DashboardActivityItem';
import { RecentActivityItem } from './ActivityItems/RecentActivityItem';
import { PropertiesActivityItem } from './ActivityItems/PropertiesActivityItem';
import { ActivitiesActivityItem } from './ActivityItems/ActivitiesActivityItem';
import { FulfillmentActivityItem } from './ActivityItems/FulfillmentActivityItem';
import { UploadsActivityItem } from './ActivityItems/UploadsActivityItem';
import { OrganizationsActivityItem } from './ActivityItems/OrganizationsActivityItem';
import { SettingsActivityItem } from './ActivityItems/SettingsActivityItem';
import Link from '@/stadiumDS/foundations/icons/General/Link';

const activityItemMap: {
    [key: string]: (key: string, item: Audit) => React.ReactNode;
} = {
    dashboard: (key, item) => <DashboardActivityItem key={key} item={item} />,
    properties: (key, item) => <PropertiesActivityItem key={key} item={item} />,
    activities: (key, item) => <ActivitiesActivityItem key={key} item={item} />,
    fulfillment: (key, item) => (
        <FulfillmentActivityItem key={key} item={item} />
    ),
    uploads: (key, item) => <UploadsActivityItem key={key} item={item} />,
    organizations: (key, item) => (
        <OrganizationsActivityItem key={key} item={item} />
    ),
    settings: (key, item) => <SettingsActivityItem key={key} item={item} />,
};

export const RecentActivityMenu = () => {
    const { user } = useUserStore();
    const organization = useStore((state) => state.organization);
    const history = useHistory();

    const { data, refetch } = useQuery(auditForUserOrg, {
        variables: {
            user_id: user?.id,
            organization_id: organization?.id,
            actions: ['navigate'],
            pagination: { page: 0, pageSize: 20 },
        },
        skip: !user?.id || !organization?.id,
    });

    useEffect(() => {
        if (user?.id && organization?.id) {
            refetch();
        }
    }, [history.location.pathname, history.location.search]);

    const [opened, setOpened] = useState(false);

    const activityItems: Audit[] = (data?.auditForUserOrg.results || []).reduce(
        (acc: Audit[], audit: Audit) => {
            const path = audit.path;
            if (
                acc.find((a) => a.path.split('?')[0] === path.split('?')[0]) ||
                history.location.pathname === path.split('?')[0]
            ) {
                return acc;
            }
            return [...acc, audit];
        },
        [] as Audit[]
    );

    if (activityItems.length === 0) {
        return null;
    }

    return (
        <Menu opened={opened} onChange={setOpened}>
            <Menu.Target>
                <Tooltip label="Recent Activity" disabled={opened}>
                    <ActionIcon onClick={() => setOpened(!opened)}>
                        <Clock
                            color={colors.Gray[600]}
                            size="20"
                            variant="rewind"
                        />
                    </ActionIcon>
                </Tooltip>
            </Menu.Target>
            <Menu.Dropdown
                style={{
                    borderRadius: '12px',
                    padding: '0px',
                    width: '200px',
                }}
            >
                <Flex
                    gap="8px"
                    direction="column"
                    style={{
                        padding: '16px 6px',
                    }}
                >
                    <Text
                        fw={600}
                        c={colors.Gray[900]}
                        style={{
                            padding: '0px 12px',
                        }}
                    >
                        Recent Activity
                    </Text>
                    <Flex
                        direction="column"
                        style={{
                            maxHeight: '196px',
                            overflowY: 'auto',
                            scrollbarWidth: 'thin',
                        }}
                    >
                        {activityItems.map((item) => {
                            const primaryRoute: string = item.path
                                .split('/')[1]!
                                .split('?')[0]!;
                            return Object.keys(activityItemMap).includes(
                                primaryRoute
                            ) ? (
                                activityItemMap[primaryRoute](item.id, item)
                            ) : (
                                <RecentActivityItem
                                    key={item.id}
                                    label={primaryRoute}
                                    icon={({ color, size }) => (
                                        <Link
                                            color={color}
                                            size={size}
                                            variant="1"
                                        />
                                    )}
                                    path={item.path}
                                />
                            );
                        })}
                    </Flex>
                </Flex>
            </Menu.Dropdown>
        </Menu>
    );
};

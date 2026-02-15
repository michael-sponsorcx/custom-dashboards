import { getNameFromObj } from '@/components/UserInfo';
import { RecordHistory } from '@/gql/recordHistoryGql';
import { Divider, Group, Text, Tooltip } from '@mantine/core';
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';
import { HistoryIcon } from './HistoryIcon';
import colors from '@/stadiumDS/foundations/colors';
import { HistoryAction } from './HistoryAction';
import { HistoryActionType, HistoryType } from './HistorySection.type';
import Ellipse from '@/stadiumDS/foundations/icons/General/Ellipse';
import { formatDate } from '@/utils/helpers';

type HistoryItemProps = {
    item: RecordHistory;
    lastItem: boolean;
    actionType: HistoryActionType;
};

export const HistoryItem = ({
    item,
    lastItem,
    actionType,
}: HistoryItemProps) => {
    const [distanceToNow, setDistanceToNow] = useState(
        formatDistanceToNow(new Date(item.created_at))
    );

    useEffect(() => {
        const timer = setInterval(() => {
            setDistanceToNow(formatDistanceToNow(new Date(item.created_at)));
        }, 60000); // Update every minute

        return () => clearInterval(timer);
    }, []);

    const userFullName = getNameFromObj(item.user);

    return (
        <>
            <Group gap="12px" wrap="nowrap">
                <HistoryIcon item={item} />
                <Group
                    style={{
                        wordWrap: 'break-word',
                        fontSize: '12px',
                        color: colors.Gray[600],
                        gap: '4px',
                    }}
                >
                    <Text fw={600} style={{ fontSize: '12px' }}>
                        {userFullName}
                    </Text>
                    <HistoryAction
                        item={item}
                        actionType={
                            item.action.startsWith('custom_field')
                                ? ({
                                      type: HistoryType.CUSTOM_FIELD,
                                  } as HistoryActionType)
                                : actionType
                        }
                    />
                </Group>
                <Ellipse />
                <Tooltip
                    label={formatDate(item.created_at, 'MMM d, yyyy')}
                    openDelay={250}
                    multiline={false}
                >
                    <Text
                        c={colors.Gray[500]}
                        style={{ fontSize: '12px', whiteSpace: 'nowrap' }}
                    >
                        {distanceToNow} ago
                    </Text>
                </Tooltip>
            </Group>
            {!lastItem && (
                <Divider
                    orientation="vertical"
                    h="13px"
                    style={{ marginLeft: '7px' }}
                />
            )}
        </>
    );
};

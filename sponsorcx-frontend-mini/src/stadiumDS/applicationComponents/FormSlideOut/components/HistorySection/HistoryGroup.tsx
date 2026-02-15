import { useState } from 'react';
import { HistoryActionType, RecordHistoryGroup } from './HistorySection.type';
import { formatDuration } from 'date-fns';
import { ActionIcon, Collapse, Divider, Group, Text } from '@mantine/core';
import { HistoryItem } from './HistoryItem';
import Chevron from '@/stadiumDS/foundations/icons/Arrows/Chevron';
import colors from '@/stadiumDS/foundations/colors';

interface HistoryGroupProps {
    lastItem: boolean;
    recordHistoryGroup: RecordHistoryGroup;
    actionType: HistoryActionType;
}

export const HistoryGroup = ({
    lastItem,
    recordHistoryGroup,
    actionType,
}: HistoryGroupProps) => {
    const [open, setOpen] = useState(false);

    const { items, userName, durationSeconds } = recordHistoryGroup;

    // Format the duration string
    const durationText = formatDuration({
        minutes: Math.max(1, Math.ceil(durationSeconds / 60)),
    });

    return (
        <>
            <Group gap="12px">
                <ActionIcon
                    onClick={() => setOpen(!open)}
                    style={{ marginLeft: '-5px' }}
                >
                    <div
                        style={{
                            transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s ease-in-out',
                        }}
                    >
                        <Chevron
                            variant="right"
                            size="16"
                            color={colors.Gray[600]}
                        />
                    </div>
                </ActionIcon>
                <Text c={colors.Gray[600]} style={{ fontSize: '12px' }}>
                    {items.length} fields updated by {userName} within{' '}
                    {durationText}
                </Text>
            </Group>
            <Collapse in={open}>
                <Divider
                    orientation="vertical"
                    h="13px"
                    style={{ marginLeft: '7px' }}
                />
                {items.map((item) => (
                    <HistoryItem
                        key={item.id}
                        lastItem={false}
                        item={item}
                        actionType={actionType}
                    />
                ))}
                <Divider style={{ margin: '12px 0' }} />
            </Collapse>
            {!lastItem && !open && (
                <Divider
                    orientation="vertical"
                    h="13px"
                    style={{ marginLeft: '7px' }}
                />
            )}
        </>
    );
};

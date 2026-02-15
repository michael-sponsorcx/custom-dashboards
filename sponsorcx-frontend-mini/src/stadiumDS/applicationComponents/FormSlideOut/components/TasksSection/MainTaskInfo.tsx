import { Item, SelectMenu } from '@/stadiumDS/sharedComponents/menu/SelectMenu';
import { TasksSectionRowProps } from './TasksSection.type';
import { liveMemoStatusIcons } from '@/pages/brandPages/LiveMemo/components/LiveMemoStatusIndicator/LiveMemoStatusIndicator';
import { priorityIcons } from '@/stadiumDS/applicationComponents/assetForm/Content/TaskPriorityIconMenu';
import { useUserOptions } from '@/hooks/useUserOptions';
import { Avatar } from '@/components/UserInfo';
import { Group, UnstyledButton } from '@mantine/core';
import { EditInPlaceInput } from '@/stadiumDS/sharedComponents/inputs/editInPlaceInput';
import { StadiumDatePicker } from '@/stadiumDS/sharedComponents/inputs/datePicker';
import Calendar from '@/stadiumDS/foundations/icons/Time/Calendar';
import colors from '@/stadiumDS/foundations/colors';
import { TaskUpload } from './TaskUpload';
import Flag from '@/stadiumDS/foundations/icons/Maps/Flag';
import UserPlus from '@/stadiumDS/foundations/icons/Users/UserPlus';
import Plus from '@/stadiumDS/foundations/icons/General/Plus';
import Dots from '@/stadiumDS/foundations/icons/General/Dots';
import Trash from '@/stadiumDS/foundations/icons/General/Trash';
import { formatUTCDate } from '@/utils/helpers';

export const MainTaskInfo = ({
    task,
    onUpdateTask,
    statusOptions,
    priorityOptions,
    userOptions,
    uploadProps,
    onDeleteTask,
    highlighted,
    isTileView = false,
    canEdit = false,
}: TasksSectionRowProps) => {
    // default status options
    const defaultStatusOptions: Omit<Item, 'onClick'>[] = Object.entries(
        liveMemoStatusIcons
    ).map(([key, value]) => ({
        label: value.name,
        value: key,
        leftSection: value.component,
    }));

    const updatedStatusOptions: Item[] = (
        statusOptions ?? defaultStatusOptions
    ).map((status) => ({
        ...status,
        onClick: () => {
            onUpdateTask({
                id: task.id,
                status: status.value,
            });
        },
    }));

    const currentStatus = updatedStatusOptions?.find(
        (status) => status.value === task.status
    );

    // default priority options
    const defaultPriorityOptions: Omit<Item, 'onClick'>[] = [
        ...Object.entries(priorityIcons).map(([key, value]) => ({
            label: value.name,
            value: key,
            leftSection: value.component,
        })),
        {
            label: 'None',
            value: null,
            leftSection: (
                <Flag color={colors.Gray[400]} size={'16'} variant={'2'} />
            ),
        },
    ];

    const updatedPriorityOptions: Item[] = (
        priorityOptions ?? defaultPriorityOptions
    ).map((priority) => ({
        ...priority,
        onClick: () => {
            onUpdateTask({
                id: task.id,
                priority: priority.value,
            });
        },
    }));

    const currentPriority = updatedPriorityOptions?.find(
        (priority) => priority.value === task.priority
    );

    // default user options
    const defaultUserOptions: Omit<Item, 'onClick'>[] = useUserOptions().map(
        (user) => ({
            label: user.text,
            value: user.value,
            leftSection: (
                <Avatar user={user.meta.user} size={18} removeMargin />
            ),
        })
    );

    const updatedUserOptions: Item[] = (userOptions ?? defaultUserOptions).map(
        (user) => ({
            ...user,
            onClick: () => {
                onUpdateTask({
                    id: task.id,
                    assignee_ids: task.assignee_ids?.includes(
                        String(user.value)
                    )
                        ? task.assignee_ids?.filter(
                              (id) => id !== String(user.value)
                          )
                        : [...(task.assignee_ids ?? []), String(user.value)],
                });
            },
        })
    );

    const currentUsers = updatedUserOptions?.filter((user) =>
        task.assignee_ids?.includes(String(user.value))
    );

    return (
        <Group
            wrap="nowrap"
            style={{
                width: '100%',
                gap: '8px',
                position: 'relative',
                padding: '4px',
                backgroundColor: highlighted ? colors.Brand[50] : undefined,
            }}
        >
            {task.overdue && !isTileView ? (
                <div
                    style={{
                        position: 'absolute',
                        left: '-4px',
                        top: '-7px',
                        bottom: '-7px',
                        width: '4px',
                        backgroundColor: colors.Error[500],
                    }}
                />
            ) : null}
            <SelectMenu
                trigger={
                    <UnstyledButton style={{ lineHeight: 0 }}>
                        {currentStatus?.leftSection ??
                            updatedStatusOptions[0]?.leftSection}
                    </UnstyledButton>
                }
                items={updatedStatusOptions}
                value={currentStatus?.value}
                closeOnItemClick
                disabled={!canEdit}
                position="bottom-start"
            />
            <EditInPlaceInput
                value={task.title ?? ''}
                placeholder="Task title"
                onChange={(value) =>
                    onUpdateTask({ id: task.id, title: value })
                }
                disabled={!canEdit}
            />
            <StadiumDatePicker
                value={formatUTCDate(task.due_at)}
                onChange={(value) =>
                    onUpdateTask({
                        id: task.id,
                        due_at: value,
                    })
                }
                trigger={
                    !task.due_at ? (
                        <UnstyledButton style={{ lineHeight: 0 }}>
                            <Calendar color={colors.Gray[400]} size={'16'} />
                        </UnstyledButton>
                    ) : undefined
                }
                color={task.overdue ? colors.Error[500] : undefined}
                weight={task.overdue ? '600' : undefined}
                disabled={!canEdit}
            />
            <SelectMenu
                trigger={
                    <UnstyledButton style={{ lineHeight: 0 }}>
                        {currentPriority?.leftSection ??
                            updatedPriorityOptions[0]?.leftSection}
                    </UnstyledButton>
                }
                items={updatedPriorityOptions}
                value={currentPriority?.value}
                closeOnItemClick
                disabled={!canEdit}
            />
            {!isTileView && (
                <TaskUpload
                    taskId={task.id}
                    {...uploadProps}
                    uploads={task.uploads}
                    canEdit={canEdit}
                />
            )}
            <SelectMenu
                trigger={
                    <UnstyledButton
                        style={{ lineHeight: 0, position: 'relative' }}
                    >
                        {currentUsers[0]?.leftSection ?? (
                            <UserPlus
                                color={colors.Gray[400]}
                                size={'16'}
                                variant={'2'}
                            />
                        )}
                        {currentUsers.length > 1 && (
                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: '-4px',
                                    right: '-4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: colors.Gray[400],
                                    borderRadius: '50%',
                                    width: '12px',
                                    height: '12px',
                                    boxShadow:
                                        '0px 2px 4px 0px rgba(10, 13, 18, 0.05)',
                                }}
                            >
                                <Plus color={colors.Base.White} size="10" />
                            </div>
                        )}
                    </UnstyledButton>
                }
                items={updatedUserOptions}
                multiple
                value={currentUsers.map((user) => user.value)}
                disabled={!canEdit}
            />
            {canEdit && (
                <SelectMenu
                    trigger={
                        <UnstyledButton style={{ height: '16px' }}>
                            <Dots
                                color={colors.Gray[400]}
                                size="16"
                                variant="vertical"
                            />
                        </UnstyledButton>
                    }
                    items={[
                        {
                            label: 'Delete',
                            value: 'delete',
                            onClick: () => onDeleteTask(task.id),
                            leftSection: (
                                <Trash
                                    color={colors.Gray[400]}
                                    size="16"
                                    variant="3"
                                />
                            ),
                        },
                    ]}
                />
            )}
        </Group>
    );
};

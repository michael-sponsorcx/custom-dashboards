import {
    GenericTask,
    genericTaskQuery,
    GenericTaskStatus,
} from '@/gql/genericTask';
import { useSubtaskOperations } from '@/pages/propertyPages/Taskflow/hooks/useSubtaskOperations';
import { formatDate } from '@/utils/helpers';
import { TasksSection } from '../../FormSlideOut/components/TasksSection/TasksSection';
import { TasksSectionTask } from '../../FormSlideOut/components/TasksSection/TasksSection.type';
import { refetchGenericTaskHistoryQueries } from '@/hooks/useGenericTaskHistory';
import { isPast } from 'date-fns';
import { GenericTaskStatusIcons } from '@/pages/propertyPages/Taskflow/TaskflowStatusIndicator';
import { useGenericTaskStatuses } from '@/hooks/useGenericTaskStatuses';
import { useQuery } from '@apollo/client';
import useStore from '@/state';
import { useEffect } from 'react';
import { Loader } from '@mantine/core';
import { primaryColors } from '@/stadiumDS/foundations/colors/primary';

interface SubtasksProps {
    task?: GenericTask;
}

const getIsOverdue = (subtask: GenericTask) => {
    return !!(
        subtask.due_date &&
        (subtask.status?.status_type.toLowerCase() ===
            GenericTaskStatus.TO_DO.toLowerCase() ||
            subtask.status?.status_type.toLowerCase() ===
                GenericTaskStatus.IN_PROGRESS.toLowerCase()) &&
        isPast(new Date(subtask.due_date))
    );
};

export const Subtasks = ({ task }: SubtasksProps) => {
    const organization = useStore((state) => state.organization);
    const { getStatusByType } = useGenericTaskStatuses();
    const {
        updateSubtaskStatus,
        deleteSubtask,
        updateSubtask,
        createSubtask,
        updateSubtaskAssignments,
    } = useSubtaskOperations({});

    const {
        loading: loadingGenericTask,
        data: activeGenericTaskData,
        refetch: refetchGenericTask,
    } = useQuery(genericTaskQuery, {
        variables: {
            organization_id: organization?.id,
            id: task?.id,
        },
        skip: !task?.id || !organization?.id,
        fetchPolicy: 'no-cache',
    });

    const subtasks = activeGenericTaskData?.genericTask?.subtasks || [];

    const handleStatusChange = async (subtaskId: string, statusId: string) => {
        await updateSubtaskStatus(subtaskId, statusId);
    };

    const handleUpdateTask = async (subtask: TasksSectionTask) => {
        if (subtask.status !== undefined) {
            await handleStatusChange(subtask.id, subtask.status);
        }
        if (
            subtask.due_at !== undefined ||
            subtask.priority !== undefined ||
            subtask.title !== undefined
        ) {
            await updateSubtask(subtask.id, {
                due_date: subtask.due_at,
                priority: subtask.priority,
                task_title: subtask.title,
            });
        }
        if (subtask.assignee_ids !== undefined) {
            await updateSubtaskAssignments(subtask.id, subtask.assignee_ids);
        }
    };

    useEffect(() => {
        refetchGenericTask();
    }, [
        task?.id,
        task?.updated_at,
        task?.subtasks?.length,
        refetchGenericTask,
    ]);

    if (loadingGenericTask || !activeGenericTaskData) {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Loader color={primaryColors.Brand[400]} />
            </div>
        );
    }

    return (
        <TasksSection
            title="Subtasks"
            tasks={subtasks.map((subtask: GenericTask) => ({
                id: subtask.id,
                title: subtask.task_title,
                status: subtask.status?.id,
                due_at: subtask.due_date
                    ? formatDate(subtask.due_date)
                    : undefined,
                overdue: getIsOverdue(subtask),
                priority: subtask.priority,
                assignee_ids: subtask.assignments?.map(
                    (assignment) => assignment.user.id
                ),
            }))}
            onUpdateTask={handleUpdateTask}
            onAddTask={() => createSubtask(task?.id ?? '', {})}
            uploadProps={{
                recordType: 'GenericSubtask',
                originHelperFn: () => 'Subtask',
                refetchQueries: refetchGenericTaskHistoryQueries,
            }}
            onDeleteTask={deleteSubtask}
            statusOptions={Object.entries(GenericTaskStatusIcons)
                .map(([key, value]) => ({
                    value: getStatusByType(key)?.id,
                    label: value.name,
                    leftSection: value.component,
                }))
                .filter((option) => option.value !== undefined)}
            canEdit // TODO: add permissions check
        />
    );
};

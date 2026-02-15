import {
    BAssetTask,
    BAssetTaskPriorities,
    bAssetTaskSnippet,
    bAssetTasksQueryName,
    BAssetTaskTypes,
    createBAssetTaskMutation,
    createBAssetTasksFromTemplateMutation,
    updateBAssetTaskMutation,
} from '@/gql/bAssetTasksGql';
import { AssetFormBaseProps } from '../types';
import { BAssetStatus, updateBrandAsset } from '@/gql/brandAssetsGql';
import { useState } from 'react';
import { TasksSection } from '../../FormSlideOut/components/TasksSection/TasksSection';
import { useMutation, useQuery } from '@apollo/client';
import useStore from '@/state';
import { TasksSectionTask } from '../../FormSlideOut/components/TasksSection/TasksSection.type';
import { StadiumConfirmActionModal } from '@/stadiumDS/sharedComponents/ConfirmActionModal/StadiumConfirmActionModal';
import { getBrandUploadOrigins } from '@/pages/brandPages/Uploads/helpers/BrandUploads.helpers';
import { useLexicon } from '@/hooks/useLexicon';
import {
    allTaskCollectionTemplatesQuery,
    TaskCollectionTemplate,
} from '@/gql/taskCollectionTemplatesGql';
import { stadiumToast } from '../../Toasts/StadiumToast.helpers';
import { refetchBrandAssetHistoryQueries } from '@/hooks/useBrandAssetHistory';

const getPriorityValue = (priority?: BAssetTaskPriorities | null) => {
    switch (priority) {
        case BAssetTaskPriorities.HIGH:
            return 1;
        case BAssetTaskPriorities.MEDIUM:
            return 2;
        case BAssetTaskPriorities.LOW:
            return 3;
        default:
            return 4;
    }
};

export const taskSortFn = (a: BAssetTask, b: BAssetTask) => {
    const aPriority = getPriorityValue(a.priority);
    const bPriority = getPriorityValue(b.priority);
    if (aPriority === bPriority) {
        return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
    }
    return aPriority - bPriority;
};

export interface TasksProps extends AssetFormBaseProps {
    highlightedTaskId?: BAssetTask['id'];
    refetchBrandAssetUploads: () => void;
    refetchBrandAssetTasks: () => void;
    refetchBrandAsset: () => void;
    setHoveringUploadIds: (ids: string[]) => void;
    tasks: BAssetTask[];
}

export const Tasks = ({
    asset,
    highlightedTaskId,
    refetchBrandAssetUploads,
    refetchBrandAssetTasks,
    refetchBrandAsset,
    setHoveringUploadIds,
    tasks,
}: TasksProps) => {
    const organizationId = useStore((state) => state.organization.id);
    const lexicon = useLexicon();

    const [createTask] = useMutation<
        { createBAssetTask: BAssetTask },
        {
            organization_id: string;
            b_asset_id: string;
            status: BAssetStatus;
            title: string;
            type: BAssetTaskTypes;
            due_at: string | null;
            assignee_ids: string[];
        }
    >(createBAssetTaskMutation, {
        onCompleted: () => {
            refetchBrandAssetTasks();
        },
        refetchQueries: refetchBrandAssetHistoryQueries,
    });

    const handleAddTask = async () => {
        if (!asset?.id) {
            stadiumToast.error('Cannot add task: Asset not found');
            return;
        }
        await createTask({
            variables: {
                organization_id: organizationId,
                b_asset_id: asset.id,
                status: BAssetStatus.TO_DO,
                title: '',
                type: BAssetTaskTypes.TASK,
                due_at: null,
                assignee_ids: [],
            },
        });
    };

    const [inProgressPopup, setInProgressPopup] = useState(false);
    const [completePopup, setCompletePopup] = useState(false);

    const [updateTask] = useMutation(updateBAssetTaskMutation, {
        onCompleted: () => {
            refetchBrandAssetTasks();
        },
        refetchQueries: refetchBrandAssetHistoryQueries,
    });

    const [updateAsset] = useMutation(updateBrandAsset, {
        onCompleted: () => {
            refetchBrandAsset();
        },
        refetchQueries: refetchBrandAssetHistoryQueries,
    });

    const handleUpdateAssetStatus = (status: BAssetStatus) => {
        if (!asset?.id) {
            stadiumToast.error('Cannot update task: Asset not found');
            return;
        }
        updateAsset({
            variables: {
                id: asset.id,
                status,
            },
        });
    };

    const handleUpdateTask = (task: TasksSectionTask) => {
        const allOtherTasksComplete = tasks
            .filter((t) => t.id !== task.id)
            .every((t) => t.status === BAssetStatus.COMPLETE);

        updateTask({
            variables: {
                organization_id: organizationId,
                ...task,
            },
        }).then(() => {
            if (
                task.status &&
                task.status === BAssetStatus.IN_PROGRESS &&
                asset?.status !== BAssetStatus.IN_PROGRESS
            ) {
                setInProgressPopup(true);
            } else if (
                task.status &&
                task.status === BAssetStatus.COMPLETE &&
                asset?.status !== BAssetStatus.COMPLETE &&
                allOtherTasksComplete
            ) {
                setCompletePopup(true);
            }
        });
    };

    const handleArchiveTask = (id: string) => {
        updateTask({
            variables: {
                id,
                organization_id: organizationId,
                archived: true,
            },
        });
    };

    const allTaskCollectionTemplatesGql = useQuery<{
        taskCollectionTemplatesAll: TaskCollectionTemplate[];
    }>(allTaskCollectionTemplatesQuery, {
        fetchPolicy: 'no-cache',
        variables: { organization_id: organizationId },
    });

    const taskCollectionTemplates =
        allTaskCollectionTemplatesGql.data?.taskCollectionTemplatesAll?.filter(
            (template) => template.task_templates.length > 0
        ) ?? [];

    const [createTasksFromTemplate] = useMutation(
        createBAssetTasksFromTemplateMutation,
        {
            onCompleted: () => {
                refetchBrandAssetTasks();
            },
            refetchQueries: refetchBrandAssetHistoryQueries,
        }
    );

    const handleAddTemplate = async (templateId: string) => {
        if (!asset?.id) {
            stadiumToast.error('Cannot add template tasks: Asset not found');
            return;
        }
        await createTasksFromTemplate({
            variables: {
                organization_id: organizationId,
                b_asset_id: asset.id,
                template_id: templateId,
            },
        });
    };

    return (
        <>
            <TasksSection
                tasks={tasks.map((task) => ({
                    ...task,
                    assignee_ids: task.b_asset_task_assignees.map(
                        (assignee) => assignee.user_id
                    ),
                    overdue: task.tags?.overdue,
                }))}
                highlightedTaskId={highlightedTaskId}
                onUpdateTask={handleUpdateTask}
                onAddTask={handleAddTask}
                uploadProps={{
                    recordType: 'BAssetTask',
                    originHelperFn: () =>
                        getBrandUploadOrigins(lexicon)('BAssetTask'),
                    refetchQueries: refetchBrandAssetHistoryQueries,
                    setHoveringUploadIds,
                    refetch: refetchBrandAssetUploads,
                }}
                onDeleteTask={handleArchiveTask}
                templateProps={{
                    templates: taskCollectionTemplates,
                    onAddTemplateTasks: handleAddTemplate,
                    linkToManageTemplates: '/settings/templates/task-templates',
                }}
                canEdit // TODO: add permissions check
            />
            <StadiumConfirmActionModal
                open={inProgressPopup}
                onClose={() => setInProgressPopup(false)}
                onConfirm={() => {
                    handleUpdateAssetStatus(BAssetStatus.IN_PROGRESS);
                    setInProgressPopup(false);
                }}
                title="Tasks in progress"
                description="Do you want to update the asset's status to In Progress?"
                confirmButtonText="Update"
                cancelButtonText="Cancel"
            />
            <StadiumConfirmActionModal
                open={completePopup}
                onClose={() => setCompletePopup(false)}
                onConfirm={() => {
                    handleUpdateAssetStatus(BAssetStatus.COMPLETE);
                    setCompletePopup(false);
                }}
                title="Tasks complete"
                description="Do you want to update the asset's status to Complete?"
                confirmButtonText="Update"
                cancelButtonText="Cancel"
            />
        </>
    );
};

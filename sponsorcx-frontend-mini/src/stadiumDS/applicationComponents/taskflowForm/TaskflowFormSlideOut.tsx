import useStore from '@/state';
import { useMutation, useQuery } from '@apollo/client';
import {
    GenericTask,
    genericTaskQuery,
    GenericTaskUpdateInput,
    GenericTaskUpload,
    genericTaskUploadsGql,
    getTaskTemplateRequiredFieldsMet,
    updateGenericTaskAssignmentsMutation,
} from '@/gql/genericTask';
import { getGenericTaskRequiredFieldsMet } from '@/gql/genericTask';
import { useGenericTaskOperations } from '@/pages/propertyPages/Taskflow/hooks/useGenericTaskOperations';
import { StadiumConfirmActionModal } from '@/stadiumDS/sharedComponents/ConfirmActionModal/StadiumConfirmActionModal';
import { useEffect, useRef, useState } from 'react';
import { GenericTaskUserInput } from './types';
import { refetchGenericTaskHistoryQueries } from '@/hooks/useGenericTaskHistory';
import { FormSlideOut } from '../FormSlideOut/FormSlideOut';
import Trash from '@/stadiumDS/foundations/icons/General/Trash';
import * as Content from './Content';
import * as Sidebar from './Sidebar';
import { Subtasks } from './Content/Subtasks';
import { NoteAndFilesSection } from '../FormSlideOut/components/NoteAndFilesSection';
import { useGenericTaskTemplates } from '@/hooks/useGenericTaskTemplates';
import { useSubtaskOperations } from '@/pages/propertyPages/Taskflow/hooks/useSubtaskOperations';
import { stadiumToast } from '@/stadiumDS/applicationComponents/Toasts/StadiumToast.helpers';
import {
    deleteUploadsMutation,
    attachExistingFileMutation,
} from '@/gql/uploadGql';
import { useGenericTaskStatuses } from '@/hooks/useGenericTaskStatuses';
import { applyTemplate } from './TaskflowFormSlideOut.utils';
import { Property, propertyQuery } from '@/gql/propertyGql';
import { client } from '@/apollo';
import { useUserOptions } from '@/hooks/useUserOptions';

const getGenericTaskUploadOrigins = (recordType: string) => {
    switch (recordType) {
        case 'generic_task':
            return 'Generic Task';
        default:
            return recordType;
    }
};

interface TaskflowFormSlideOutProps {
    genericTaskId?: GenericTask['id'];
    setGenericTaskId: (id: GenericTask['id'] | undefined) => void;
    refetchGenericTasks: () => Promise<void>;
    handleUpdateGenericTask: (
        id: string | undefined,
        fieldsToUpdate: Partial<GenericTaskUpdateInput>
    ) => Promise<void>;
}

export const TaskflowFormSlideOut = ({
    genericTaskId,
    setGenericTaskId,
    refetchGenericTasks,
    handleUpdateGenericTask,
}: TaskflowFormSlideOutProps) => {
    const organization = useStore((state) => state.organization);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const { archiveTask, archiving, removeRelationship, updateTask } =
        useGenericTaskOperations();
    const { getTemplateById, getTemplateConfig } = useGenericTaskTemplates();
    const { createSubtask, deleteSubtask } = useSubtaskOperations({
        onSuccess: () => {
            refetchGenericTasks();
        },
    });

    const [updateGenericTaskAssignments] = useMutation(
        updateGenericTaskAssignmentsMutation,
        {
            refetchQueries: refetchGenericTaskHistoryQueries,
        }
    );
    const [deleteUploads] = useMutation(deleteUploadsMutation, {
        refetchQueries: refetchGenericTaskHistoryQueries,
    });
    const [attachExistingFile] = useMutation(attachExistingFileMutation, {
        refetchQueries: [...refetchGenericTaskHistoryQueries, 'uploads'],
        awaitRefetchQueries: true,
    });
    const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
    const [highlightRequiredFields, setHighlightRequiredFields] =
        useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const isDeletingRef = useRef(false);
    const pendingUpdateRef = useRef<Promise<void> | null>(null);
    const latestFormValuesRef = useRef<Partial<GenericTaskUpdateInput>>({});
    const userOptions = useUserOptions();

    const { getStatusByType, defaultStatus } = useGenericTaskStatuses();

    useEffect(() => {
        setHasUnsavedChanges(false);
        latestFormValuesRef.current = {};
    }, [genericTaskId]);

    const onUpdateAssignedUsers = async (
        id: string | undefined,
        users: GenericTaskUserInput[]
    ) => {
        try {
            if (!id) return;
            await updateGenericTaskAssignments({
                variables: {
                    task_id: id,
                    user_ids: users.map((user) => user.user_id),
                },
                refetchQueries: refetchGenericTaskHistoryQueries,
                onCompleted: async () => {
                    await refetchGenericTask();
                    await refetchGenericTasks();
                },
            });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error updating task assigned users:', error, {
                id,
                users,
            });
        }
    };

    const handleArchiveGenericTask = async (id: string) => {
        try {
            await archiveTask(id, true);
            refetchGenericTasks();
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error archiving task:', error, { id });
        }
    };

    // Bypass required-field checks when closing due to a delete action
    const onDelete = async (id: string) => {
        setIsDeleting(true);
        isDeletingRef.current = true;
        await handleArchiveGenericTask(id);
    };

    const isTempId = genericTaskId === 'temp-new-task';

    const { data: activeGenericTaskData, refetch: refetchGenericTask } =
        useQuery(genericTaskQuery, {
            variables: {
                organization_id: organization?.id,
                id: genericTaskId,
            },
            skip: !genericTaskId || !organization?.id || isTempId,
            fetchPolicy: 'no-cache',
        });

    const activeGenericTask = isTempId
        ? undefined
        : (activeGenericTaskData?.genericTask as GenericTask | undefined);

    const templateConfig = activeGenericTask?.template_id
        ? getTemplateConfig(activeGenericTask?.template_id)
        : null;

    const genericTaskUploadsQuery = useQuery(genericTaskUploadsGql, {
        variables: {
            organization_id: organization?.id,
            task_id: activeGenericTask?.id,
        },
        skip: !activeGenericTask?.id || !organization?.id,
    });

    const genericTaskUploads =
        genericTaskUploadsQuery.data?.genericTaskUploads ?? [];

    const handleUpdateGenericTaskWithTracking = async (
        id: string | undefined,
        fieldsToUpdate: Partial<GenericTaskUpdateInput>
    ) => {
        setHasUnsavedChanges(true);
        // Store latest form values for validation
        latestFormValuesRef.current = {
            ...latestFormValuesRef.current,
            ...fieldsToUpdate,
        };
        // Track the pending update
        const updatePromise = (async () => {
            await handleUpdateGenericTask(id, fieldsToUpdate);
            await refetchGenericTask();
            await refetchGenericTasks();
        })();
        pendingUpdateRef.current = updatePromise;
        await updatePromise;
        pendingUpdateRef.current = null;
    };

    const handleClose = async () => {
        // If deleting or the task is already gone, just dismiss without checks
        if (isDeletingRef.current || isDeleting || !activeGenericTask) {
            setGenericTaskId(undefined);
            setHighlightRequiredFields(false);
            setConfirmationModalOpen(false);
            setIsDeleting(false);
            isDeletingRef.current = false;
            setHasUnsavedChanges(false);
            return;
        }

        // Wait for any pending updates to complete before validating
        if (pendingUpdateRef.current) {
            await pendingUpdateRef.current;
        }

        // Create a merged task object with latest form values for validation
        const taskForValidation: GenericTask = {
            ...activeGenericTask,
            ...latestFormValuesRef.current,
        } as GenericTask;

        // Check basic required fields using merged values
        const basicFieldsMet = getGenericTaskRequiredFieldsMet({
            task: taskForValidation,
        });

        // Check template-specific required fields using merged values
        const templateFieldsMet = getTaskTemplateRequiredFieldsMet({
            task: taskForValidation,
            templateConfig,
            hasUploads: genericTaskUploads.length > 0,
        });

        if (!basicFieldsMet || !templateFieldsMet) {
            setConfirmationModalOpen(true);
            setHighlightRequiredFields(true);
            return;
        }
        // Slowdown closing the slideout so onUpdate can be called
        setTimeout(() => {
            setGenericTaskId(undefined);
            setHighlightRequiredFields(false);
            setHasUnsavedChanges(false);
        }, 1);
    };

    const handleDelete = async () => {
        if (activeGenericTask?.id) {
            await Promise.resolve(onDelete(activeGenericTask.id));
            setConfirmDeleteModalOpen(false);
            handleClose();
        }
    };

    const handleApplyTemplate = async (templateId: string) => {
        if (!activeGenericTask) {
            stadiumToast.error('No active task to apply template to');
            return;
        }

        let property: Property | undefined;
        const relatedProperty =
            activeGenericTask.related_entities?.property?.[0];

        if (relatedProperty) {
            const { data: propertyData } = await client.query({
                query: propertyQuery,
                variables: {
                    id: relatedProperty.id,
                },
            });

            property = propertyData.property;
        }

        await applyTemplate({
            templateId,
            activeGenericTask,
            organizationId: organization?.id,
            genericTaskUploads,
            getTemplateById,
            getTemplateConfig,
            updateGenericTaskAssignments,
            removeRelationship,
            deleteUploads,
            refetchGenericTaskUploads: genericTaskUploadsQuery.refetch,
            updateTask,
            refetchGenericTask,
            deleteSubtask,
            getStatusByType,
            defaultStatus,
            createSubtask,
            attachExistingFile,
            property,
            userOptions,
        });

        await refetchGenericTask();
        await refetchGenericTasks();
    };

    return (
        <>
            <FormSlideOut
                isOpen={!!activeGenericTask}
                onClose={handleClose}
                threeDotMenuOptions={[
                    {
                        key: 'delete',
                        label: 'Delete',
                        onClick: () => setConfirmDeleteModalOpen(true),
                        icon: <Trash variant={'3'} />,
                    },
                ]}
                header={{
                    title: {
                        value: activeGenericTask?.task_title ?? '',
                        placeholder: 'Task Name',
                        onUpdate: (value) =>
                            handleUpdateGenericTaskWithTracking(
                                activeGenericTask?.id ?? '',
                                {
                                    task_title: value,
                                }
                            ),
                        highlightWhenEmpty: highlightRequiredFields,
                    },
                }}
                tabs={[
                    {
                        key: 'overview',
                        label: 'Overview',
                        content: (
                            <>
                                <NoteAndFilesSection
                                    title="Details"
                                    value={activeGenericTask?.description ?? ''}
                                    placeholder="Add specs..."
                                    onUpdate={(value) =>
                                        handleUpdateGenericTaskWithTracking(
                                            activeGenericTask?.id ?? '',
                                            {
                                                description: value,
                                            }
                                        )
                                    }
                                    files={{
                                        recordType: 'generic_task',
                                        recordId: activeGenericTask?.id ?? '',
                                        refetch:
                                            genericTaskUploadsQuery.refetch,
                                        refetchQueries:
                                            refetchGenericTaskHistoryQueries,
                                        uploads: genericTaskUploads,
                                        originHelperFn:
                                            getGenericTaskUploadOrigins,
                                    }}
                                    descriptionRequired={
                                        templateConfig?.required_fields
                                            ?.description ?? false
                                    }
                                    uploadRequired={
                                        templateConfig?.required_fields
                                            ?.upload ?? false
                                    }
                                    highlightRequiredFields={
                                        highlightRequiredFields
                                    }
                                />
                                <Subtasks task={activeGenericTask} />
                                <Content.TaskHistory task={activeGenericTask} />
                            </>
                        ),
                    },
                ]}
                sidePanelContent={
                    <>
                        <Sidebar.Fields
                            task={activeGenericTask}
                            onUpdate={handleUpdateGenericTaskWithTracking}
                            refetchTask={() => refetchGenericTask()}
                            onUpdateAssignedUsers={onUpdateAssignedUsers}
                            onApplyTemplate={handleApplyTemplate}
                            highlightRequiredFields={highlightRequiredFields}
                            genericTaskUploadIds={genericTaskUploads.map(
                                (upload: GenericTaskUpload) => ({
                                    id: upload.id,
                                })
                            )}
                            hasUnsavedChanges={hasUnsavedChanges}
                        />
                        <Sidebar.Relationships
                            task={activeGenericTask}
                            highlightRequiredFields={highlightRequiredFields}
                        />
                    </>
                }
            />
            <StadiumConfirmActionModal
                open={confirmDeleteModalOpen}
                onClose={() => setConfirmDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Task?"
                description="Are you sure you want to delete this task?"
                confirmButtonText="Delete"
                dangerConfirmButton
                loadingMutation={archiving}
            />
            <StadiumConfirmActionModal
                open={confirmationModalOpen}
                onClose={() => setConfirmationModalOpen(false)}
                onConfirm={async () => {
                    if (genericTaskId) {
                        await handleArchiveGenericTask(genericTaskId);
                    }
                    setConfirmationModalOpen(false);
                    setGenericTaskId(undefined);
                    setHighlightRequiredFields(false);
                }}
                title="Missing required fields!"
                description="Please fill out required fields before exiting"
                confirmButtonText="Discard Task"
                dangerConfirmButton
                cancelButtonText="Continue"
            />
        </>
    );
};

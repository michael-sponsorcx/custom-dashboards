import { client } from '@/apollo';
import { agreementQuery } from '@/gql/agreementGql';
import {
    GenericTask,
    GenericTaskTemplate,
    GenericTaskStatusType,
    AssigneeCondition,
} from '@/gql/genericTask';
import { Property } from '@/gql/propertyGql';
import { DropdownOptionType } from '@/hooks/useAccountOptions';
import { stadiumToast } from '@/stadiumDS/applicationComponents/Toasts/StadiumToast.helpers';

export const currentTaskHasValues = (
    task?: GenericTask,
    genericTaskUploadIds?: Array<{ id: string }>
): boolean => {
    if (!task) return false;

    return Boolean(
        task.task_title?.trim() ||
            task.description?.trim() ||
            task.due_date ||
            (task.assignments && task.assignments.length > 0) ||
            (task.relationships && task.relationships.length > 0) ||
            (genericTaskUploadIds && genericTaskUploadIds.length > 0) ||
            (task.subtasks && task.subtasks.length > 0)
    );
};

export interface ApplyTemplateParams {
    userOptions: DropdownOptionType[];
    templateId: string;
    activeGenericTask: GenericTask;
    organizationId: string | undefined;
    genericTaskUploads: Array<{ id: string }>;
    getTemplateById: (templateId: string) => GenericTaskTemplate | undefined;
    getTemplateConfig: (templateId: string) => {
        required_fields?: {
            description?: boolean;
            upload?: boolean;
            due_date?: boolean;
        };
        default_subtasks?: Array<{
            task_title: string;
            order?: number;
            status?: string;
            priority?: string;
            due_date?: string;
            assignments?: string[];
            files?: Array<{
                s3_key: string;
                original_filename: string;
                content_type: string;
                file_size_bytes: number;
            }>;
        }>;
        relativeDueDate?: {
            enabled: boolean;
            value: number;
            unit: 'hours' | 'days' | 'weeks';
        };
        assignee_config?: {
            assignee_conditions?: AssigneeCondition[];
            type: 'single' | 'property_relationship' | null;
            single_assignee_user_id?: string | null;
            property_relationship_custom_field_key?: string | null;
        };
    } | null;
    updateGenericTaskAssignments: (options: {
        variables: {
            task_id: string;
            user_ids: string[];
        };
    }) => Promise<any>;
    removeRelationship: (relationshipId: string) => Promise<any>;
    deleteUploads: (options: {
        variables: {
            ids: string[];
            organization_id: string | undefined;
        };
    }) => Promise<any>;
    refetchGenericTaskUploads: () => Promise<any>;
    updateTask: (
        taskId: string,
        updates: {
            template_id?: string;
            task_title?: string;
            description?: string;
            due_date?: string | null;
        }
    ) => Promise<any>;
    refetchGenericTask: () => Promise<{
        data?: {
            genericTask?: GenericTask;
        };
    }>;
    deleteSubtask: (
        subtaskId: string,
        options?: { suppressToast?: boolean }
    ) => Promise<any>;
    getStatusByType: (statusType: string) => GenericTaskStatusType | undefined;
    defaultStatus: GenericTaskStatusType | undefined;
    createSubtask: (
        parentTaskId: string,
        subtaskData: {
            status_id: string | undefined;
            description: string;
            priority?: string;
            due_date?: string;
            assignments?: Array<{ user_id: string }>;
        },
        options?: { suppressToast?: boolean }
    ) => Promise<{
        data?: {
            createGenericTask?: {
                id: string;
            };
        };
    }>;
    attachExistingFile: (options: {
        variables: {
            input: {
                s3Key: string;
                originalFilename: string;
                contentType: string;
                recordType: string;
                recordId: string;
                organization_id: string | undefined;
                metadata: string;
                fileSizeBytes: number;
            };
        };
    }) => Promise<any>;
    property: Property | undefined;
}

/**
 * This logic should have been implemented on the backend when it was originally implemented.
 * For the next developer working with this logic, this needs to be moved to the backend to prevent
 * further bloating.
 */
export const applyTemplate = async ({
    templateId,
    activeGenericTask,
    organizationId,
    genericTaskUploads,
    getTemplateById,
    getTemplateConfig,
    updateGenericTaskAssignments,
    removeRelationship,
    deleteUploads,
    refetchGenericTaskUploads,
    updateTask,
    refetchGenericTask,
    deleteSubtask,
    getStatusByType,
    defaultStatus,
    createSubtask,
    attachExistingFile,
    property,
    userOptions,
}: ApplyTemplateParams): Promise<void> => {
    if (!activeGenericTask?.id) {
        stadiumToast.error('No active task to apply template to');
        return;
    }

    try {
        const template = getTemplateById(templateId);

        // Get the template configuration
        const templateConfig = getTemplateConfig(templateId);
        if (!templateConfig) {
            stadiumToast.error('Template configuration not found');
            return;
        }

        // Update the assignee configuration
        if (templateConfig.assignee_config) {
            const userNames: string[] = [];
            const userIds: string[] = [];

            if (templateConfig.assignee_config.type === 'single') {
                // this will be stored as a string id "123"
                const userId =
                    templateConfig.assignee_config.single_assignee_user_id;
                if (userId) {
                    userIds.push(userId);
                }
            } else if (
                templateConfig.assignee_config.type === 'property_relationship'
            ) {
                // Learfield has these users stored in their custom fields as string names "John Doe"
                const key =
                    templateConfig.assignee_config
                        .property_relationship_custom_field_key;

                if (key) {
                    const userListCustomField = property?.custom_fields?.[key];

                    if (userListCustomField) {
                        userNames.push(userListCustomField);
                    }
                }
            } else if (
                templateConfig.assignee_config.type === null &&
                templateConfig.assignee_config.assignee_conditions &&
                templateConfig.assignee_config.assignee_conditions.length > 0
            ) {
                const assigneeConditions =
                    templateConfig.assignee_config.assignee_conditions;

                if (assigneeConditions) {
                    // Check if first condition is true, if so return the assignees for that condition.
                    // If not, check the next condition.
                    // If no conditions are true, return an empty array.
                    for (const condition of assigneeConditions) {
                        if (condition.assignee_type === 'single') {
                            const dealTypeConditions =
                                condition.deal_type_conditions;
                            if (dealTypeConditions) {
                                const agreementId =
                                    activeGenericTask.related_entities
                                        ?.agreement?.[0]?.id;

                                if (agreementId) {
                                    const { data: agreementData } =
                                        await client.query({
                                            query: agreementQuery,
                                            variables: {
                                                id: agreementId,
                                            },
                                        });

                                    if (!agreementData?.agreement) {
                                        continue;
                                    }

                                    const dealTypeName =
                                        agreementData.agreement.custom_fields
                                            ?.deal_type_name;

                                    // check if the current deal type matches any of the deal type conditions
                                    if (
                                        dealTypeConditions.includes(
                                            dealTypeName
                                        ) &&
                                        condition.single_assignee_user_id
                                    ) {
                                        userIds.push(
                                            condition.single_assignee_user_id
                                        );
                                        break;
                                    }
                                } else {
                                    // no agreement related to task, do nothing and move on to the next condition
                                }
                            }
                        } else if (
                            condition.assignee_type === 'property_relationship'
                        ) {
                            const key =
                                condition.property_relationship_custom_field_key;

                            if (property && key) {
                                const userName = property?.custom_fields?.[key];

                                if (userName) {
                                    userNames.push(userName);
                                    break;
                                }
                            }
                        }
                    }
                }
            }

            let finalUserIds: (string | number)[] = userIds;

            if (userNames.length > 0) {
                // convert the user names to user ids
                const userIdsConverted = userNames
                    .map((userName) => {
                        const user = userOptions.find(
                            (user) => user.text?.trim() === userName.trim()
                        );

                        if (!user) {
                            stadiumToast.error(
                                `User ${userName} not found for user name custom field`
                            );
                        }

                        return user?.value;
                    })
                    .filter((userId): userId is string => Boolean(userId));

                finalUserIds = userIdsConverted;
            }

            await updateGenericTaskAssignments({
                variables: {
                    task_id: activeGenericTask.id,
                    user_ids: finalUserIds.filter((userId): userId is string =>
                        Boolean(userId)
                    ),
                },
            });
        }

        // Delete all existing files
        if (genericTaskUploads.length > 0) {
            const uploadIds = genericTaskUploads.map(
                (upload: { id: string }) => upload.id
            );
            await deleteUploads({
                variables: {
                    ids: uploadIds,
                    organization_id: organizationId,
                },
            });
            await refetchGenericTaskUploads();
        }

        await updateTask(activeGenericTask.id, {
            template_id: templateId,
            task_title: template?.label ?? '',
            description: template?.description ?? '',
        });
        const { data: refetchedData } = await refetchGenericTask();

        // Delete all existing subtasks
        const existingSubtasks = refetchedData?.genericTask?.subtasks || [];

        if (existingSubtasks.length > 0) {
            await Promise.all(
                existingSubtasks.map((subtask: GenericTask) =>
                    deleteSubtask(subtask.id, { suppressToast: true })
                )
            );
            stadiumToast.success(
                existingSubtasks.length === 1
                    ? 'Subtask deleted successfully'
                    : `${existingSubtasks.length} subtasks deleted successfully`
            );
        }

        // Create new subtasks from template config
        const defaultSubtasks = templateConfig.default_subtasks || [];
        if (defaultSubtasks.length > 0) {
            // Sort subtasks by order key to ensure correct display order
            const sortedSubtasks = [...defaultSubtasks].sort(
                (a, b) => (a.order ?? 0) - (b.order ?? 0)
            );

            // Create subtasks sequentially to preserve order
            for (const defaultSubtask of sortedSubtasks) {
                // Convert status string to status ID
                let statusId = defaultStatus?.id ?? undefined;
                if (defaultSubtask?.status) {
                    const statusObj = getStatusByType(defaultSubtask.status);
                    if (statusObj?.id) {
                        statusId = statusObj.id;
                    }
                }

                // Create the subtask
                const result = await createSubtask(
                    activeGenericTask.id,
                    {
                        status_id: statusId,
                        description: defaultSubtask.task_title,
                        priority: defaultSubtask.priority,
                        due_date: defaultSubtask.due_date,
                        assignments: defaultSubtask.assignments?.map(
                            (userId: string) => ({
                                user_id: userId,
                            })
                        ),
                    },
                    { suppressToast: true }
                );

                // Get the created subtask ID from the result
                const newSubtaskId = result?.data?.createGenericTask?.id;

                // If the subtask has files, attach them
                if (
                    newSubtaskId &&
                    defaultSubtask.files &&
                    defaultSubtask.files.length > 0
                ) {
                    await Promise.all(
                        defaultSubtask.files.map(async (file) => {
                            // Associate the file with the subtask
                            return attachExistingFile({
                                variables: {
                                    input: {
                                        s3Key: file.s3_key,
                                        originalFilename:
                                            file.original_filename,
                                        contentType: file.content_type,
                                        recordType: 'GenericSubtask',
                                        recordId: newSubtaskId,
                                        organization_id: organizationId,
                                        metadata: JSON.stringify({}),
                                        fileSizeBytes: file.file_size_bytes,
                                    },
                                },
                            });
                        })
                    );
                }
            }

            stadiumToast.success('Subtasks applied successfully');
        } else {
            stadiumToast.success('Template applied successfully');
        }

        // Refetch the task to show updated subtasks and cleared fields
        await refetchGenericTask();
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error applying template:', error);
        stadiumToast.error('Failed to apply template');
    }
};

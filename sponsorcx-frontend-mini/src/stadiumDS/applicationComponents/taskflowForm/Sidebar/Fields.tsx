import { cloneElement, useEffect, useState } from 'react';
import {
    GenericTask,
    GenericTaskStatus,
    GenericTaskUpdateInput,
} from '@/gql/genericTask';
import { GenericTaskStatusIcons } from '@/pages/propertyPages/Taskflow/TaskflowStatusIndicator';
import { primaryColors } from '@/stadiumDS/foundations/colors/primary';
import { onUpdateAssignedUsers } from '../types';
import { SidePanelFieldsSection } from '../../FormSlideOut/components/SidePanelFieldsSection';
import {
    sidePanelLabelIconSize,
    SidePanelFieldTypes,
    SidePanelFieldProps,
} from '../../FormSlideOut/components/SidePanelFields/SidePanelFields.types';
import { StadiumConfirmActionModal } from '@/stadiumDS/sharedComponents/ConfirmActionModal/StadiumConfirmActionModal';
import { useGenericTaskTemplates } from '@/hooks/useGenericTaskTemplates';
import { useGenericTaskStatuses } from '@/hooks/useGenericTaskStatuses';
import { ApolloQueryResult } from '@apollo/client';
import File from '@/stadiumDS/foundations/icons/Folders/File';
import { StadiumModal } from '@/stadiumDS/sharedComponents/StadiumModal/StadiumModal';
import { StadiumInput } from '@/stadiumDS/sharedComponents/inputs/input';
import Circle from '@/stadiumDS/foundations/icons/Shapes/Circle';
import { currentTaskHasValues } from '../TaskflowFormSlideOut.utils';

export interface FieldsProps {
    task?: GenericTask;
    onUpdate: (
        id: string | undefined,
        fieldsToUpdate: Partial<GenericTaskUpdateInput>
    ) => Promise<void>;
    onUpdateAssignedUsers: onUpdateAssignedUsers;
    onApplyTemplate?: (templateId: string) => void;
    highlightRequiredFields?: boolean;
    refetchTask: () => Promise<ApolloQueryResult<any>>;
    genericTaskUploadIds?: Array<{ id: string }>;
    hasUnsavedChanges?: boolean;
}

export const Fields = ({
    task,
    onUpdate,
    onUpdateAssignedUsers,
    onApplyTemplate,
    highlightRequiredFields,
    refetchTask,
    genericTaskUploadIds,
    hasUnsavedChanges,
}: FieldsProps) => {
    const [confirmTemplateModalOpen, setConfirmTemplateModalOpen] =
        useState(false);
    const [pendingTemplateId, setPendingTemplateId] = useState<string | null>(
        null
    );
    const [isApplyingTemplate, setIsApplyingTemplate] = useState(false);

    // Rejection modal state
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [pendingRejectedStatusId, setPendingRejectedStatusId] = useState<
        string | null
    >(null);
    const [rejectionComment, setRejectionComment] = useState('');

    const { getTemplateConfig, templateOptions } = useGenericTaskTemplates();
    const { statuses, getStatusById } = useGenericTaskStatuses();

    const assigneeUserIds = task?.assignments?.map((a) => a.user.id) ?? [];

    // Reset modal state when switching to a different task
    useEffect(() => {
        setConfirmTemplateModalOpen(false);
        setPendingTemplateId(null);
        setRejectModalOpen(false);
        setPendingRejectedStatusId(null);
        setRejectionComment('');
    }, [task?.id]);

    const handleTemplateSelect = (templateId: string | null) => {
        if (!templateId) return;

        // If no onApplyTemplate handler provided, fall back to simple update
        if (!onApplyTemplate) {
            return onUpdate(task?.id, {
                template_id: templateId,
            }).then(() => refetchTask());
        }

        // Check if task has current values that would be overridden
        const taskHasValues =
            currentTaskHasValues(task, genericTaskUploadIds) ||
            hasUnsavedChanges;

        if (taskHasValues) {
            // Show confirmation modal if there are existing values
            setPendingTemplateId(templateId);
            setConfirmTemplateModalOpen(true);
        } else {
            // Apply template directly without confirmation
            onApplyTemplate(templateId);
        }
    };

    // Update handleConfirmTemplate to be async and manage loading state
    const handleConfirmTemplate = async () => {
        if (pendingTemplateId && onApplyTemplate) {
            setIsApplyingTemplate(true);
            try {
                await onApplyTemplate(pendingTemplateId);
            } catch (error) {
                // Error handling is already done in parent, but we catch to ensure finally runs
            } finally {
                setIsApplyingTemplate(false);
                setConfirmTemplateModalOpen(false);
                setPendingTemplateId(null);
            }
        }
    };

    const handleCancelTemplate = () => {
        setConfirmTemplateModalOpen(false);
        setPendingTemplateId(null);
    };

    // Status change handlers
    const handleStatusSelect = (statusId: string | null) => {
        if (!statusId) return;

        const statusObj = getStatusById(statusId);
        const isRejected =
            statusObj?.status_type === GenericTaskStatus.REJECTED.toUpperCase();

        if (isRejected) {
            setPendingRejectedStatusId(statusId);
            setRejectModalOpen(true);
            return;
        }

        onUpdate(task?.id, { status_id: statusId });
    };

    const handleConfirmReject = () => {
        if (!pendingRejectedStatusId) return;
        const trimmed = rejectionComment.trim();
        onUpdate(task?.id, {
            status_id: pendingRejectedStatusId,
            rejection_comment: trimmed || undefined,
        });
        resetRejectState();
    };

    const resetRejectState = () => {
        setRejectModalOpen(false);
        setPendingRejectedStatusId(null);
        setRejectionComment('');
    };

    const templateConfig = task?.template_id
        ? getTemplateConfig(task?.template_id)
        : null;

    // Build status options with icons
    const statusOptions = statuses
        .filter((status) => Boolean(status?.id && status?.label))
        .map((status) => {
            const statusType =
                status.status_type?.toLowerCase() as GenericTaskStatus;
            const iconConfig = statusType
                ? GenericTaskStatusIcons[statusType]
                : null;
            return {
                value: status.id as string,
                label: (iconConfig?.name ?? status.label) as string,
                leftSection: iconConfig?.component
                    ? cloneElement(iconConfig.component, {
                          size: String(sidePanelLabelIconSize),
                      })
                    : undefined,
            };
        });

    const fields: SidePanelFieldProps[] = [
        {
            type: SidePanelFieldTypes.SELECT,
            label: 'Status',
            onChange: handleStatusSelect,
            options: statusOptions,
            value: task?.status?.id,
            icon: (
                <Circle
                    color={primaryColors.Gray[500]}
                    size={String(sidePanelLabelIconSize)}
                />
            ),
        },
        {
            type: SidePanelFieldTypes.DATE,
            label: 'Due Date',
            onChange: async (date) => {
                await onUpdate(task?.id, {
                    due_date: date ?? undefined,
                });
                await refetchTask();
            },
            value: task?.due_date,
            required: templateConfig?.required_fields?.due_date,
            highlightRequiredFields,
        },
        {
            type: SidePanelFieldTypes.USER_MULTI_SELECT,
            label: 'Assignees',
            onChange: (userIds) => {
                onUpdateAssignedUsers(
                    task?.id,
                    userIds.map((au) => ({
                        user_id: au,
                    }))
                );
            },
            value: assigneeUserIds,
        },
        {
            type: SidePanelFieldTypes.SELECT,
            label: 'Task Template',
            icon: (
                <File
                    color={primaryColors.Gray[500]}
                    size={String(sidePanelLabelIconSize)}
                    variant="5"
                />
            ),
            onChange: handleTemplateSelect,
            options: templateOptions.map((opt) => ({
                value: opt.value,
                label: opt.label,
            })),
            value: task?.template_id,
        },
    ];

    return (
        <>
            <SidePanelFieldsSection fields={fields} />
            <StadiumConfirmActionModal
                open={confirmTemplateModalOpen}
                onClose={handleCancelTemplate}
                onConfirm={handleConfirmTemplate}
                title="Apply Task Template?"
                description="This will override the current task with the template's values."
                confirmButtonText="Apply Template"
                cancelButtonText="Cancel"
                dangerConfirmButton={false}
                loadingMutation={isApplyingTemplate}
            />
            <StadiumModal
                open={rejectModalOpen}
                onClose={resetRejectState}
                header={{
                    title: 'Rejected',
                    description: 'Please write a brief reason for rejection.',
                }}
                primaryButton={{
                    text: 'Update',
                    onClick: handleConfirmReject,
                    variant: 'primary',
                }}
                secondaryButton={{
                    text: 'Cancel',
                    onClick: resetRejectState,
                }}
                padding="24px"
            >
                <StadiumInput
                    label="Reason"
                    name="rejection_comment"
                    value={rejectionComment}
                    onChange={(e) => setRejectionComment(e.target.value)}
                    placeholder="e.g. Reason for rejection"
                    type="textarea"
                />
            </StadiumModal>
        </>
    );
};

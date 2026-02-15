import { useRef } from 'react';
import { Formik, FormikProps } from 'formik';
import { Stack } from '@mantine/core';
import { StadiumModal } from '@/stadiumDS/sharedComponents/StadiumModal/StadiumModal';
import { StadiumInput } from '@/stadiumDS/sharedComponents/inputs/input';
import { StadiumSelect } from '@/stadiumDS/sharedComponents/dropdowns/select';
import { StadiumDateInput } from '@/stadiumDS/sharedComponents/inputs/dateInput';
import { useUserOptions } from '@/hooks/useUserOptions';
import { GenericTask } from '@/gql/genericTask';
import { useSubtaskOperations } from '@/pages/propertyPages/Taskflow/hooks/useSubtaskOperations';
import { stadiumToast } from '@/stadiumDS/applicationComponents/Toasts/StadiumToast.helpers';
import { formatDateForPostgres } from '@/utils/formatDateForPostgres';

interface EditSubtaskModalProps {
    open: boolean;
    onClose: () => void;
    subtask: GenericTask;
    onSuccess?: () => void;
}

interface SubtaskFormValues {
    description: string;
    assignee_id: string | null;
    priority: string | null;
    due_date: string | Date | null;
}

export const EditSubtaskModal = ({
    open,
    onClose,
    subtask,
    onSuccess,
}: EditSubtaskModalProps) => {
    const userOptions = useUserOptions();
    const formikRef = useRef<FormikProps<SubtaskFormValues>>(null);
    const { updateSubtask, updateSubtaskAssignments, updating } =
        useSubtaskOperations({
            onSuccess: () => {
                onSuccess?.();
                onClose();
            },
        });

    // Pre-populate with existing subtask data
    const initialValues: SubtaskFormValues = {
        description: subtask.description || subtask.task_title || '',
        assignee_id: subtask.assignments?.[0]?.user?.id || null,
        priority: subtask.priority || null,
        due_date: subtask.due_date || null,
    };

    const userOptionsForSelect = [
        { value: 'none', label: 'No Assignee' },
        ...userOptions.map((option) => ({
            value: String(option.value),
            label: option.text,
        })),
    ];

    const priorityOptions = [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'urgent', label: 'Urgent' },
    ];

    const handleSubmit = async (values: SubtaskFormValues) => {
        if (!values.description?.trim()) {
            stadiumToast.error('Description is required');
            return;
        }

        // Format the due date for PostgreSQL (handles null to clear the field)
        const formattedDueDate = formatDateForPostgres(values.due_date);

        try {
            await updateSubtask(subtask.id, {
                description: values.description.trim(),
                priority: values.priority as
                    | 'low'
                    | 'medium'
                    | 'high'
                    | 'urgent'
                    | undefined,
                due_date: formattedDueDate,
            });

            // Handle assignee update separately if changed
            const currentAssigneeId = subtask.assignments?.[0]?.user?.id;
            const newAssigneeId =
                values.assignee_id && values.assignee_id !== 'none'
                    ? values.assignee_id
                    : null;

            if (currentAssigneeId !== newAssigneeId) {
                const userIds = newAssigneeId ? [newAssigneeId] : [];
                await updateSubtaskAssignments(subtask.id, userIds);
            }
        } catch (error) {
            // Error handling is done in the hook
        }
    };

    return (
        <StadiumModal
            open={open}
            onClose={onClose}
            size="md"
            header={{
                title: 'Edit Subtask',
                description: 'Edit subtask details',
            }}
            includeButtons={true}
            primaryButton={{
                text: 'Save',
                disabled: updating,
                loading: updating,
                onClick: () => {
                    const description =
                        formikRef.current?.values?.description?.trim();
                    if (!description) {
                        stadiumToast.error('Description is required');
                        return;
                    }
                    formikRef.current?.submitForm();
                },
            }}
            secondaryButton={{
                text: 'Cancel',
                onClick: onClose,
            }}
        >
            <Formik
                innerRef={formikRef}
                initialValues={initialValues}
                onSubmit={handleSubmit}
                enableReinitialize={true}
            >
                {({ values, handleSubmit, setFieldValue, errors, touched }) => (
                    <form
                        id="edit-subtask-form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                    >
                        <Stack gap={16}>
                            <StadiumInput
                                label="Description"
                                required
                                placeholder="Description"
                                value={values.description}
                                onChange={(e) =>
                                    setFieldValue('description', e.target.value)
                                }
                                error={
                                    touched.description && errors.description
                                        ? errors.description
                                        : undefined
                                }
                            />
                            <StadiumSelect
                                label="Assign"
                                placeholder="Select assignee"
                                value={
                                    values.assignee_id === 'none'
                                        ? null
                                        : values.assignee_id
                                }
                                onChange={(value) =>
                                    setFieldValue(
                                        'assignee_id',
                                        value || 'none'
                                    )
                                }
                                data={userOptionsForSelect}
                                clearable
                                searchable
                            />
                            <StadiumSelect
                                label="Priority"
                                placeholder="Select priority"
                                value={values.priority}
                                onChange={(value) =>
                                    setFieldValue('priority', value)
                                }
                                data={priorityOptions}
                                clearable
                            />
                            <StadiumDateInput
                                label="Due Date"
                                placeholder="Due date"
                                value={
                                    values.due_date instanceof Date
                                        ? values.due_date
                                              .toISOString()
                                              .split('T')[0]
                                        : values.due_date
                                }
                                onChange={(value) =>
                                    setFieldValue('due_date', value)
                                }
                                clearable
                            />
                        </Stack>
                        {/* Form submission handled by modal primary button */}
                        <button
                            type="submit"
                            form="edit-subtask-form"
                            style={{ display: 'none' }}
                            id="edit-subtask-submit"
                        />
                    </form>
                )}
            </Formik>
        </StadiumModal>
    );
};

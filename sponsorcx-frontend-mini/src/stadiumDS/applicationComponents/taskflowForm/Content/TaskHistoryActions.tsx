import { formatDate } from '@/utils/helpers';
import { Avatar } from '@/components/UserInfo';
import { HistoryTextToken, HistoryTextUnknown } from './TaskHistory.styles';
import { DropdownOptionType } from '@/hooks/useAccountOptions';
import { RecordHistory } from '@/gql/recordHistoryGql';
import { CustomField } from '@/gql/customFieldGql';

interface TaskHistoryActionProps {
    item: RecordHistory;
    userOptions: DropdownOptionType[];
    propertyOptions: DropdownOptionType[];
    typeOptions: {
        key: string;
        text: string;
        value: string;
    }[];
    customFieldOptions: CustomField[];
    statusOptions: DropdownOptionType[];
    templateOptions: DropdownOptionType[];
}

export const TaskCreatedAction = () => 'created task';

export const TaskArchivedAction = () => 'archived task';

export const TaskTitleAction = ({ item }: TaskHistoryActionProps) => {
    const previousTitle = item.metadata?.previous_value as string;
    const newTitle = item.action_value;

    if (previousTitle && newTitle) {
        return (
            <>
                updated title from{' '}
                <HistoryTextToken>{previousTitle}</HistoryTextToken> to{' '}
                <HistoryTextToken>{newTitle}</HistoryTextToken>
            </>
        );
    }

    if (newTitle) {
        return (
            <>
                set title to <HistoryTextToken>{newTitle}</HistoryTextToken>
            </>
        );
    }

    return <>removed title</>;
};

export const TaskDescriptionAction = ({ item }: TaskHistoryActionProps) => {
    const previousDescription = item.metadata?.previous_value as string;
    const newDescription = item.action_value;

    if (previousDescription && newDescription) {
        return (
            <>
                updated description from{' '}
                <HistoryTextToken>{previousDescription}</HistoryTextToken> to{' '}
                <HistoryTextToken>{newDescription}</HistoryTextToken>
            </>
        );
    }

    if (newDescription) {
        return (
            <>
                set description to{' '}
                <HistoryTextToken>{newDescription}</HistoryTextToken>
            </>
        );
    }

    return <>removed description</>;
};

export const TaskFileUploadAction = ({ item }: TaskHistoryActionProps) => {
    const fileName = item.metadata?.file_name as string;

    if (!fileName) {
        return <>uploaded file</>;
    }

    return (
        <>
            uploaded file <HistoryTextToken>{fileName}</HistoryTextToken>
        </>
    );
};

export const TaskFileDeletedAction = ({ item }: TaskHistoryActionProps) => {
    const fileName = item.metadata?.file_name as string;

    if (!fileName) {
        return <>deleted file</>;
    }

    return (
        <>
            deleted file <HistoryTextToken>{fileName}</HistoryTextToken>
        </>
    );
};

export const TaskSubtaskAddedAction = ({ item }: TaskHistoryActionProps) => {
    const subtaskName = item.action_value as string;

    if (!subtaskName) {
        return <>added subtask</>;
    }

    return (
        <>
            added subtask <HistoryTextToken>{subtaskName}</HistoryTextToken>
        </>
    );
};

export const TaskSubtaskRemovedAction = ({ item }: TaskHistoryActionProps) => {
    const subtaskName = item.action_value as string;

    if (!subtaskName) {
        return <>removed subtask</>;
    }

    return (
        <>
            removed subtask <HistoryTextToken>{subtaskName}</HistoryTextToken>
        </>
    );
};
export const TaskStatusAction = ({
    item,
    statusOptions,
}: TaskHistoryActionProps) => {
    const previousStatusOption = statusOptions.find(
        (option) => option.value === item.metadata?.previous_value
    );
    const newStatusOption = statusOptions.find(
        (option) => option.value === item.action_value
    );

    if (previousStatusOption && newStatusOption) {
        return (
            <>
                updated status from{' '}
                <HistoryTextToken>{previousStatusOption.text}</HistoryTextToken>{' '}
                to <HistoryTextToken>{newStatusOption.text}</HistoryTextToken>
            </>
        );
    }

    if (newStatusOption) {
        return (
            <>
                set status to{' '}
                <HistoryTextToken>{newStatusOption.text}</HistoryTextToken>
            </>
        );
    }

    return <>removed status</>;
};

export const TaskPriorityAction = ({ item }: TaskHistoryActionProps) => {
    const previousPriority = item.metadata?.previous_value as string;
    const newPriority = item.action_value;

    if (!newPriority) {
        return <>removed priority</>;
    }

    if (previousPriority) {
        return (
            <>
                updated priority from{' '}
                <HistoryTextToken>{previousPriority}</HistoryTextToken> to{' '}
                <HistoryTextToken>{newPriority}</HistoryTextToken>
            </>
        );
    }

    return (
        <>
            set priority to <HistoryTextToken>{newPriority}</HistoryTextToken>
        </>
    );
};

export const TaskDueDateAction = ({ item }: TaskHistoryActionProps) => {
    const previousDueDate = item.metadata?.previous_value as string;
    const newDueDate = item.action_value;

    if (!newDueDate) {
        return <>removed due date</>;
    }

    if (previousDueDate) {
        return (
            <>
                updated due date from{' '}
                <HistoryTextToken>
                    {formatDate(previousDueDate)}
                </HistoryTextToken>{' '}
                to <HistoryTextToken>{formatDate(newDueDate)}</HistoryTextToken>
            </>
        );
    }

    return (
        <>
            set due date to{' '}
            <HistoryTextToken>{formatDate(newDueDate)}</HistoryTextToken>
        </>
    );
};

export const TaskTemplateAction = ({
    item,
    templateOptions,
}: TaskHistoryActionProps) => {
    const templateOption = templateOptions.find(
        (option) => option.value === item.action_value
    );

    const previousTemplateOption = templateOptions.find(
        (option) => option.value === item.metadata?.previous_value
    );

    if (previousTemplateOption && templateOption) {
        return (
            <>
                updated template from{' '}
                <HistoryTextToken>
                    {previousTemplateOption.text}
                </HistoryTextToken>{' '}
                to <HistoryTextToken>{templateOption.text}</HistoryTextToken>
            </>
        );
    }

    if (templateOption) {
        return (
            <>
                set template to{' '}
                <HistoryTextToken>{templateOption.text}</HistoryTextToken>
            </>
        );
    }

    return <>updated template</>;
};

export const TaskParentChangedAction = ({ item }: TaskHistoryActionProps) => {
    const previousParentName = item.metadata?.previous_parent_name as string;
    const newParentName = item.metadata?.new_parent_name as string;

    if (previousParentName && newParentName) {
        return (
            <>
                updated parent from{' '}
                <HistoryTextToken>{previousParentName}</HistoryTextToken> to{' '}
                <HistoryTextToken>{newParentName}</HistoryTextToken>
            </>
        );
    }

    if (newParentName) {
        return (
            <>
                set parent to{' '}
                <HistoryTextToken>{newParentName}</HistoryTextToken>
            </>
        );
    }

    if (previousParentName) {
        return (
            <>
                removed parent{' '}
                <HistoryTextToken>{previousParentName}</HistoryTextToken>
            </>
        );
    }

    return <>changed parent</>;
};

export const TaskRejectedAction = ({ item }: TaskHistoryActionProps) => {
    const rejectionReason = item.metadata?.comment as string;

    if (rejectionReason) {
        return (
            <>
                rejected task with comment:{' '}
                <HistoryTextToken>{rejectionReason}</HistoryTextToken>
            </>
        );
    }

    return <>rejected task</>;
};

export const TaskRelationshipAddedAction = ({
    item,
}: TaskHistoryActionProps) => {
    const relationshipType = item.metadata?.entity_type as string;
    const entityId = item.action_value as string;

    if (relationshipType && entityId) {
        return (
            <>
                added <HistoryTextToken>{relationshipType}</HistoryTextToken>{' '}
                relationship to entity id:{' '}
                <HistoryTextToken>{entityId}</HistoryTextToken>
            </>
        );
    }

    return <>added relationship</>;
};

export const TaskRelationshipRemovedAction = ({
    item,
}: TaskHistoryActionProps) => {
    const relationshipType = item.metadata?.entity_type as string;
    const entityId = item.action_value as string;

    if (relationshipType && entityId) {
        return (
            <>
                removed <HistoryTextToken>{relationshipType}</HistoryTextToken>{' '}
                relationship from entity id:{' '}
                <HistoryTextToken>{entityId}</HistoryTextToken>
            </>
        );
    }

    return <>removed relationship</>;
};

export const TaskAssignedAction = ({
    item,
    userOptions,
}: TaskHistoryActionProps) => {
    if (item.action_value === item.user_id) {
        return 'assigned the task to themself';
    }

    const userOption = userOptions.find(
        (option) => option.value === item.action_value
    );

    return (
        <>
            assigned{' '}
            {userOption ? (
                <HistoryTextToken>
                    <Avatar
                        size={16}
                        user={userOption.meta.user}
                        removeMargin
                    />
                    {userOption.text}
                </HistoryTextToken>
            ) : (
                <HistoryTextUnknown>unknown</HistoryTextUnknown>
            )}
        </>
    );
};

export const TaskStatusResetAction = () => {
    return <>reset status due to resubmission after rejection</>;
};

export const TaskUnassignedAction = ({
    item,
    userOptions,
}: TaskHistoryActionProps) => {
    if (item.action_value === item.user_id) {
        return 'unassigned the task from themself';
    }

    const userOption = userOptions.find(
        (option) => option.value === item.action_value
    );

    return (
        <>
            unassigned{' '}
            {userOption ? (
                <HistoryTextToken>
                    <Avatar
                        size={16}
                        user={userOption.meta.user}
                        removeMargin
                    />
                    {userOption.text}
                </HistoryTextToken>
            ) : (
                <HistoryTextUnknown>unknown</HistoryTextUnknown>
            )}
        </>
    );
};

export const TaskCustomFieldsAction = ({
    item,
    customFieldOptions,
}: TaskHistoryActionProps) => {
    const customFieldOption = customFieldOptions?.find(
        (option) => option.key === item.metadata?.custom_field_key
    );

    const customFieldLabel = customFieldOption?.label.toLowerCase() ?? (
        <HistoryTextUnknown>unknown custom field</HistoryTextUnknown>
    );

    if (customFieldOption && customFieldOption.value_type === 'boolean') {
        return (
            <>
                {item.action_value ? 'enabled' : 'disabled'} {customFieldLabel}
            </>
        );
    }

    if (!item.action_value) {
        return <>removed {customFieldLabel}</>;
    }

    if (item.metadata?.previous_value) {
        return (
            <>
                updated {customFieldLabel} from{' '}
                <HistoryTextToken>
                    {String(item.metadata.previous_value)}
                </HistoryTextToken>{' '}
                to <HistoryTextToken>{item.action_value}</HistoryTextToken>
            </>
        );
    }

    return (
        <>
            set {customFieldLabel} to{' '}
            <HistoryTextToken>{item.action_value}</HistoryTextToken>
        </>
    );
};

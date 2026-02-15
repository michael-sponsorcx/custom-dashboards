import { formatDate } from '@/utils/helpers';
import { liveMemoStatusIcons } from '@/pages/brandPages/LiveMemo/components/LiveMemoStatusIndicator/LiveMemoStatusIndicator';
import { BAssetStatus } from '@/gql/brandAssetsGql';
import { ComboboxItem } from '@mantine/core';
import { useS3Resource } from '@/hooks/useS3Resources';
import colors from '@/stadiumDS/foundations/colors';
import Circle from '@/stadiumDS/foundations/icons/Shapes/Circle';
import { priorityIcons } from './TaskPriorityIconMenu';
import { BAssetTaskPriorities } from '@/gql/bAssetTasksGql';
import { HistoryTextToken, HistoryTextUnknown } from './AssetHistory.styles';
import { Avatar } from '@/components/UserInfo';
import { useFiscalYearStore } from '@/stores/fiscalYearStore';
import { Tooltip } from '@/stadiumDS/sharedComponents/Tooltip';
import { RecordHistory } from '@/gql/recordHistoryGql';
import { useLexicon } from '@/hooks/useLexicon';
import { DropdownOptionType } from '@/hooks/useAccountOptions';
import { BrandPropertyOption } from '@/hooks/useBrandPropertyOptions';
import { CustomField } from '@/gql/customFieldGql';

interface AssetHistoryActionProps {
    item: RecordHistory;
    userOptions: DropdownOptionType[];
    propertyOptions: BrandPropertyOption[];
    typeOptions: {
        key: string;
        text: string;
        value: string;
    }[];
    customFieldOptions: CustomField[];
}

// Asset History Actions

export const AssetCreatedAction = () => 'created asset';

export const AssetArchivedAction = () => 'deleted asset';

export const AssetStatusAction = ({ item }: AssetHistoryActionProps) => {
    const statusName =
        liveMemoStatusIcons[item.action_value as BAssetStatus]?.name;
    return (
        <>
            set status to{' '}
            {statusName ? (
                <HistoryTextToken>{statusName}</HistoryTextToken>
            ) : (
                <HistoryTextUnknown>unknown</HistoryTextUnknown>
            )}
        </>
    );
};

export const AssetDescriptionAction = () => 'edited description';

export const AssetTitleAction = () => 'edited asset title';

export const AssetSpecsAction = () => 'edited specs';

export const AssetFileUploadAction = () => 'uploaded file';

export const AssetFileDeleteAction = () => 'removed file';

export const AssetDueDateAction = ({ item }: AssetHistoryActionProps) => {
    if (!item.action_value) {
        return 'removed due date';
    }

    return (
        <>
            set due date to{' '}
            <HistoryTextToken>{formatDate(item.action_value)}</HistoryTextToken>
        </>
    );
};

export const AssetSchedulerAction = ({ item }: AssetHistoryActionProps) =>
    item.action_value ? `enabled Scheduler` : 'disabled Scheduler';

export const AssetManualSchedulingAction = ({
    item,
}: AssetHistoryActionProps) =>
    item.action_value
        ? `enabled Manual Scheduling`
        : 'disabled Manual Scheduling';

export const AssetAutoScheduleAction = ({ item }: AssetHistoryActionProps) =>
    item.action_value ? `enabled Auto Schedule` : 'disabled Auto Schedule';

export const AssetQuantityAction = ({ item }: AssetHistoryActionProps) => {
    return (
        <>
            set quantity to{' '}
            <HistoryTextToken>{item.action_value}</HistoryTextToken>
        </>
    );
};

export const AssetAssignedAction = ({
    item,
    userOptions,
}: AssetHistoryActionProps) => {
    if (item.action_value === item.user_id) {
        return 'assigned the asset to themself';
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

export const AssetUnassignedAction = ({
    item,
    userOptions,
}: AssetHistoryActionProps) => {
    if (item.action_value === item.user_id) {
        return 'unassigned themself from the asset';
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

export const AssetPropertyAction = ({
    item,
    propertyOptions,
}: AssetHistoryActionProps) => {
    const lexicon = useLexicon();
    const propertyOption = propertyOptions.find(
        (option) => option.value === item.action_value
    );
    const s3Resource = useS3Resource(propertyOption?.logo);

    if (!propertyOption) {
        return (
            <>
                changed {lexicon.b_property.toLowerCase()} to{' '}
                <HistoryTextUnknown>unknown</HistoryTextUnknown>
            </>
        );
    }

    return (
        <>
            changed {lexicon.b_property.toLowerCase()} to{' '}
            <HistoryTextToken>
                {propertyOption.logo ? (
                    <img
                        src={s3Resource}
                        alt={propertyOption.label}
                        width={16}
                        height={16}
                    />
                ) : (
                    <Circle size={'16'} color={colors.Gray[500]} />
                )}
                {propertyOption.label}
            </HistoryTextToken>
        </>
    );
};

export const AssetTypeIdAction = ({
    item,
    typeOptions,
}: AssetHistoryActionProps) => {
    const typeOption = typeOptions.find(
        (option) => option.value === item.action_value
    );
    return (
        <>
            changed type to{' '}
            {typeOption ? (
                <HistoryTextToken>{typeOption.text}</HistoryTextToken>
            ) : (
                <HistoryTextUnknown>unknown</HistoryTextUnknown>
            )}
        </>
    );
};

export const AssetFiscalYearAction = ({ item }: AssetHistoryActionProps) => {
    const lexicon = useLexicon();
    const { fiscalYearOptions } = useFiscalYearStore();
    const fiscalYearOption = fiscalYearOptions.find(
        (option) => (option as ComboboxItem).value === item.action_value
    ) as ComboboxItem | undefined;
    return (
        <>
            changed {lexicon.b_budget_year.toLowerCase()} to{' '}
            {fiscalYearOption ? (
                <HistoryTextToken>{fiscalYearOption.label}</HistoryTextToken>
            ) : (
                <HistoryTextUnknown>unknown</HistoryTextUnknown>
            )}
        </>
    );
};

export const AssetCustomFieldsAction = ({
    item,
    customFieldOptions,
}: AssetHistoryActionProps) => {
    const customFieldOption = customFieldOptions.find(
        (option) => option.key === item.metadata?.custom_field_key
    );

    const customFieldLabel = customFieldOption?.label.toLowerCase() ?? (
        <HistoryTextUnknown>unknown</HistoryTextUnknown>
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

    return (
        <>
            changed {customFieldLabel} to{' '}
            <HistoryTextToken>{item.action_value}</HistoryTextToken>
        </>
    );
};

export const AssetsFulfilledAction = ({ item }: AssetHistoryActionProps) => {
    return (
        <>
            fulfilled <HistoryTextToken>{item.action_value}</HistoryTextToken>{' '}
            asset{item.action_value === '1' ? '' : 's'}
        </>
    );
};

export const AssetsRemoveFulfilledAction = ({
    item,
}: AssetHistoryActionProps) => {
    return (
        <>
            removed <HistoryTextToken>{item.action_value}</HistoryTextToken>{' '}
            asset{item.action_value === '1' ? '' : 's'}
        </>
    );
};

// Task History Actions

const TaskTitleToken = ({
    recordHistory,
}: {
    recordHistory: RecordHistory;
}) => {
    const taskTitle = recordHistory.metadata?.task_title as string | undefined;
    if (!taskTitle) {
        return '';
    }
    if (taskTitle.length > 40) {
        return (
            <Tooltip inline label={taskTitle} multiline w={300}>
                <HistoryTextToken>
                    &lsquo;{taskTitle.slice(0, 40)}...&rsquo;
                </HistoryTextToken>
            </Tooltip>
        );
    }
    return <HistoryTextToken>&lsquo;{taskTitle}&rsquo;</HistoryTextToken>;
};

export const TaskCreatedAction = ({ item }: AssetHistoryActionProps) => (
    <>
        added task <TaskTitleToken recordHistory={item} />
    </>
);

export const TaskArchivedAction = ({ item }: AssetHistoryActionProps) => (
    <>
        deleted task <TaskTitleToken recordHistory={item} />
    </>
);

export const TaskDueDateAction = ({ item }: AssetHistoryActionProps) => {
    if (!item.action_value) {
        return (
            <>
                removed task <TaskTitleToken recordHistory={item} /> due date
            </>
        );
    }
    return (
        <>
            set task <TaskTitleToken recordHistory={item} /> due date to{' '}
            <HistoryTextToken>{formatDate(item.action_value)}</HistoryTextToken>
        </>
    );
};

export const TaskPriorityAction = ({ item }: AssetHistoryActionProps) => {
    const priorityIcon =
        priorityIcons[item.action_value as BAssetTaskPriorities];

    if (!priorityIcon) {
        return (
            <>
                removed task <TaskTitleToken recordHistory={item} /> priority
            </>
        );
    }

    return (
        <>
            set task <TaskTitleToken recordHistory={item} /> priority to{' '}
            <HistoryTextToken>{priorityIcon.name}</HistoryTextToken>
        </>
    );
};

export const TaskAssignedAction = ({
    item,
    userOptions,
}: AssetHistoryActionProps) => {
    if (item.action_value === item.user_id) {
        return (
            <>
                assigned task <TaskTitleToken recordHistory={item} /> to
                themself
            </>
        );
    }
    const userOption = userOptions.find(
        (option) => option.value === item.action_value
    );
    return (
        <>
            assigned task <TaskTitleToken recordHistory={item} /> to{' '}
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

export const TaskUnassignedAction = ({
    item,
    userOptions,
}: AssetHistoryActionProps) => {
    if (item.action_value === item.user_id) {
        return (
            <>
                unassigned task <TaskTitleToken recordHistory={item} /> from
                themself
            </>
        );
    }
    const userOption = userOptions.find(
        (option) => option.value === item.action_value
    );
    return (
        <>
            unassigned task <TaskTitleToken recordHistory={item} /> from{' '}
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

export const TaskDeletedAction = ({ item }: AssetHistoryActionProps) => (
    <>
        deleted task <TaskTitleToken recordHistory={item} />
    </>
);

export const TaskStatusAction = ({ item }: AssetHistoryActionProps) => {
    const statusName =
        liveMemoStatusIcons[item.action_value as BAssetStatus]?.name;
    return (
        <>
            set task <TaskTitleToken recordHistory={item} /> status to{' '}
            {statusName ? (
                <HistoryTextToken>{statusName}</HistoryTextToken>
            ) : (
                <HistoryTextUnknown>unknown</HistoryTextUnknown>
            )}
        </>
    );
};

export const TaskTitleAction = ({ item }: AssetHistoryActionProps) => (
    <>
        edited task <TaskTitleToken recordHistory={item} /> title
    </>
);

export const TaskTypeAction = ({ item }: AssetHistoryActionProps) => {
    return (
        <>
            changed task <TaskTitleToken recordHistory={item} /> type to{' '}
            <HistoryTextToken>{item.action_value}</HistoryTextToken>
        </>
    );
};

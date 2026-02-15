import { RecordHistory, RecordHistoryActionType } from '@/gql/recordHistoryGql';
import {
    AssetCreatedAction,
    AssetArchivedAction,
    AssetStatusAction,
    AssetDescriptionAction,
    AssetTitleAction,
    AssetSpecsAction,
    AssetFileUploadAction,
    AssetDueDateAction,
    AssetSchedulerAction,
    AssetManualSchedulingAction,
    AssetAutoScheduleAction,
    AssetQuantityAction,
    AssetPropertyAction,
    AssetTypeIdAction,
    AssetFiscalYearAction,
    TaskCreatedAction as AssetTaskCreatedAction,
    TaskArchivedAction as AssetTaskArchivedAction,
    TaskDueDateAction as AssetTaskDueDateAction,
    TaskPriorityAction as AssetTaskPriorityAction,
    TaskDeletedAction as AssetTaskDeletedAction,
    TaskStatusAction as AssetTaskStatusAction,
    TaskTitleAction as AssetTaskTitleAction,
    TaskTypeAction as AssetTaskTypeAction,
    AssetAssignedAction,
    AssetUnassignedAction,
    TaskAssignedAction as AssetTaskAssignedAction,
    TaskUnassignedAction as AssetTaskUnassignedAction,
    AssetFileDeleteAction,
    AssetCustomFieldsAction,
    AssetsFulfilledAction,
    AssetsRemoveFulfilledAction,
} from '@/stadiumDS/applicationComponents/assetForm/Content/AssetHistoryActions';
import {
    TaskCreatedAction,
    TaskArchivedAction,
    TaskTitleAction,
    TaskDescriptionAction,
    TaskStatusAction,
    TaskPriorityAction,
    TaskDueDateAction,
    TaskTemplateAction,
    TaskParentChangedAction,
    TaskRejectedAction,
    TaskRelationshipAddedAction,
    TaskRelationshipRemovedAction,
    TaskAssignedAction,
    TaskUnassignedAction,
    TaskCustomFieldsAction,
    TaskFileUploadAction,
    TaskFileDeletedAction,
    TaskSubtaskAddedAction,
    TaskSubtaskRemovedAction,
    TaskStatusResetAction,
} from '@/stadiumDS/applicationComponents/taskflowForm/Content/TaskHistoryActions';
import {
    BrandAssetHistoryOptions,
    HistoryActionType,
    InventoryScheduledHistoryOptions,
    PropertyGenericTaskHistoryOptions,
} from './HistorySection.type';
import {
    InventoryScheduledAssigneeAddedAction,
    InventoryScheduledAssigneeRemovedAction,
    InventoryScheduledDueDateUpdatedAction,
    InventoryScheduledNotesUpdatedAction,
    InventoryScheduledSpecsUpdatedAction,
    InventoryScheduledStatusUpdatedAction,
} from '@/pages/propertyPages/Tasks/AssetOverview/AssetOverviewSlideOut/Tabs/OverviewTab/InventoryScheduledHistoryActions';
import {
    CustomFieldBooleanUpdatedAction,
    CustomFieldDateUpdatedAction,
    CustomFieldHyperlinkUpdatedAction,
    CustomFieldMultiSelectAddedAction,
    CustomFieldMultiSelectRemovedAction,
    CustomFieldNumberUpdatedAction,
    CustomFieldPercentageUpdatedAction,
    CustomFieldRichTextUpdatedAction,
    CustomFieldSelectUpdatedAction,
    CustomFieldStringUpdatedAction,
} from './CustomFieldActions';

const brandAssetActionComponentMap: Partial<
    Record<
        RecordHistoryActionType,
        React.ComponentType<BrandAssetHistoryOptions & { item: RecordHistory }>
    >
> = {
    // Asset fields
    [RecordHistoryActionType.B_ASSET_CREATED]: AssetCreatedAction,
    [RecordHistoryActionType.B_ASSET_ARCHIVED]: AssetArchivedAction,
    [RecordHistoryActionType.B_ASSET_STATUS]: AssetStatusAction,
    [RecordHistoryActionType.B_ASSET_DESCRIPTION]: AssetDescriptionAction,
    [RecordHistoryActionType.B_ASSET_TITLE]: AssetTitleAction,
    [RecordHistoryActionType.B_ASSET_SPECS]: AssetSpecsAction,
    [RecordHistoryActionType.B_ASSET_FILE_UPLOADED]: AssetFileUploadAction,
    [RecordHistoryActionType.B_ASSET_FILE_DELETED]: AssetFileDeleteAction,
    [RecordHistoryActionType.B_ASSET_DUE_AT]: AssetDueDateAction,
    [RecordHistoryActionType.B_ASSET_ENABLE_SCHEDULER]: AssetSchedulerAction,
    [RecordHistoryActionType.B_ASSET_ENABLE_MANUAL_SCHEDULING]:
        AssetManualSchedulingAction,
    [RecordHistoryActionType.B_ASSET_AUTO_SCHEDULE]: AssetAutoScheduleAction,
    [RecordHistoryActionType.B_ASSET_QUANTITY]: AssetQuantityAction,
    [RecordHistoryActionType.B_ASSET_ASSIGNED]: AssetAssignedAction,
    [RecordHistoryActionType.B_ASSET_UNASSIGNED]: AssetUnassignedAction,
    [RecordHistoryActionType.B_ASSET_B_PROPERTY_ID]: AssetPropertyAction,
    [RecordHistoryActionType.B_ASSET_TYPE_ID]: AssetTypeIdAction,
    [RecordHistoryActionType.B_ASSET_FISCAL_YEAR_ID]: AssetFiscalYearAction,
    [RecordHistoryActionType.B_ASSET_CUSTOM_FIELDS]: AssetCustomFieldsAction,
    [RecordHistoryActionType.B_ASSETS_FULFILLED]: AssetsFulfilledAction,
    [RecordHistoryActionType.B_ASSETS_REMOVE_FULFILLED]:
        AssetsRemoveFulfilledAction,

    // Task fields
    [RecordHistoryActionType.B_ASSET_TASK_CREATED]: AssetTaskCreatedAction,
    [RecordHistoryActionType.B_ASSET_TASK_ARCHIVED]: AssetTaskArchivedAction,
    [RecordHistoryActionType.B_ASSET_TASK_DUE_AT]: AssetTaskDueDateAction,
    [RecordHistoryActionType.B_ASSET_TASK_PRIORITY]: AssetTaskPriorityAction,
    [RecordHistoryActionType.B_ASSET_TASK_ASSIGNED]: AssetTaskAssignedAction,
    [RecordHistoryActionType.B_ASSET_TASK_UNASSIGNED]:
        AssetTaskUnassignedAction,
    [RecordHistoryActionType.B_ASSET_TASK_DELETED]: AssetTaskDeletedAction,
    [RecordHistoryActionType.B_ASSET_TASK_STATUS]: AssetTaskStatusAction,
    [RecordHistoryActionType.B_ASSET_TASK_TITLE]: AssetTaskTitleAction,
    [RecordHistoryActionType.B_ASSET_TASK_TYPE]: AssetTaskTypeAction,
};

const propertyGenericTaskActionComponentMap: Partial<
    Record<
        RecordHistoryActionType,
        React.ComponentType<
            PropertyGenericTaskHistoryOptions & { item: RecordHistory }
        >
    >
> = {
    [RecordHistoryActionType.GENERIC_TASK_CREATED]: TaskCreatedAction,
    [RecordHistoryActionType.GENERIC_TASK_ARCHIVED]: TaskArchivedAction,
    [RecordHistoryActionType.GENERIC_TASK_TITLE]: TaskTitleAction,
    [RecordHistoryActionType.GENERIC_TASK_DESCRIPTION]: TaskDescriptionAction,
    [RecordHistoryActionType.GENERIC_TASK_FILE_UPLOADED]: TaskFileUploadAction,
    [RecordHistoryActionType.GENERIC_TASK_FILE_DELETED]: TaskFileDeletedAction,
    [RecordHistoryActionType.GENERIC_TASK_SUBTASK_ADDED]:
        TaskSubtaskAddedAction,
    [RecordHistoryActionType.GENERIC_TASK_SUBTASK_REMOVED]:
        TaskSubtaskRemovedAction,
    [RecordHistoryActionType.GENERIC_TASK_STATUS]: TaskStatusAction,
    [RecordHistoryActionType.GENERIC_TASK_PRIORITY]: TaskPriorityAction,
    [RecordHistoryActionType.GENERIC_TASK_DUE_DATE]: TaskDueDateAction,
    [RecordHistoryActionType.GENERIC_TASK_TEMPLATE]: TaskTemplateAction,
    [RecordHistoryActionType.GENERIC_TASK_PARENT_CHANGED]:
        TaskParentChangedAction,
    [RecordHistoryActionType.GENERIC_TASK_REJECTED]: TaskRejectedAction,
    [RecordHistoryActionType.GENERIC_TASK_RELATIONSHIP_ADDED]:
        TaskRelationshipAddedAction,
    [RecordHistoryActionType.GENERIC_TASK_RELATIONSHIP_REMOVED]:
        TaskRelationshipRemovedAction,
    [RecordHistoryActionType.GENERIC_TASK_ASSIGNED]: TaskAssignedAction,
    [RecordHistoryActionType.GENERIC_TASK_UNASSIGNED]: TaskUnassignedAction,
    [RecordHistoryActionType.GENERIC_TASK_CUSTOM_FIELDS]:
        TaskCustomFieldsAction,
    [RecordHistoryActionType.GENERIC_TASK_STATUS_RESET]: TaskStatusResetAction,
};

const inventoryScheduledActionComponentMap: Partial<
    Record<
        RecordHistoryActionType,
        React.ComponentType<
            InventoryScheduledHistoryOptions & { item: RecordHistory }
        >
    >
> = {
    [RecordHistoryActionType.INVENTORY_SCHEDULED_STATUS_UPDATED]:
        InventoryScheduledStatusUpdatedAction,
    [RecordHistoryActionType.INVENTORY_SCHEDULED_DUE_DATE_UPDATED]:
        InventoryScheduledDueDateUpdatedAction,
    [RecordHistoryActionType.INVENTORY_SCHEDULED_ASSIGNEE_ADDED]:
        InventoryScheduledAssigneeAddedAction,
    [RecordHistoryActionType.INVENTORY_SCHEDULED_ASSIGNEE_REMOVED]:
        InventoryScheduledAssigneeRemovedAction,
    [RecordHistoryActionType.INVENTORY_SCHEDULED_NOTES_UPDATED]:
        InventoryScheduledNotesUpdatedAction,
    [RecordHistoryActionType.INVENTORY_SCHEDULED_SPECS_UPDATED]:
        InventoryScheduledSpecsUpdatedAction,
};

const customFieldActionComponentMap: Partial<
    Record<
        RecordHistoryActionType,
        React.ComponentType<{ item: RecordHistory }>
    >
> = {
    [RecordHistoryActionType.CUSTOM_FIELD_MULTI_SELECT_REMOVED]:
        CustomFieldMultiSelectRemovedAction,
    [RecordHistoryActionType.CUSTOM_FIELD_MULTI_SELECT_ADDED]:
        CustomFieldMultiSelectAddedAction,
    [RecordHistoryActionType.CUSTOM_FIELD_SELECT_UPDATED]:
        CustomFieldSelectUpdatedAction,
    [RecordHistoryActionType.CUSTOM_FIELD_NUMBER_UPDATED]:
        CustomFieldNumberUpdatedAction,
    [RecordHistoryActionType.CUSTOM_FIELD_DATE_UPDATED]:
        CustomFieldDateUpdatedAction,
    [RecordHistoryActionType.CUSTOM_FIELD_PERCENTAGE_UPDATED]:
        CustomFieldPercentageUpdatedAction,
    [RecordHistoryActionType.CUSTOM_FIELD_RICH_TEXT_UPDATED]:
        CustomFieldRichTextUpdatedAction,
    [RecordHistoryActionType.CUSTOM_FIELD_HYPERLINK_UPDATED]:
        CustomFieldHyperlinkUpdatedAction,
    [RecordHistoryActionType.CUSTOM_FIELD_BOOLEAN_UPDATED]:
        CustomFieldBooleanUpdatedAction,
    [RecordHistoryActionType.CUSTOM_FIELD_STRING_UPDATED]:
        CustomFieldStringUpdatedAction,
};

type HistoryActionProps = {
    item: RecordHistory;
    actionType: HistoryActionType;
};

export const HistoryAction = ({ item, actionType }: HistoryActionProps) => {
    const { type, options } = actionType;
    switch (type) {
        case 'brandAsset': {
            const ActionComponent =
                brandAssetActionComponentMap[
                    item.action as keyof typeof brandAssetActionComponentMap
                ];
            if (ActionComponent) {
                return (
                    <ActionComponent
                        item={item}
                        {...(options as BrandAssetHistoryOptions)}
                    />
                );
            }
            break;
        }
        case 'propertyGenericTask': {
            const ActionComponent =
                propertyGenericTaskActionComponentMap[
                    item.action as keyof typeof propertyGenericTaskActionComponentMap
                ];
            if (ActionComponent) {
                return (
                    <ActionComponent
                        item={item}
                        {...(options as PropertyGenericTaskHistoryOptions)}
                    />
                );
            }
            break;
        }
        case 'inventoryScheduled': {
            const ActionComponent =
                inventoryScheduledActionComponentMap[
                    item.action as keyof typeof inventoryScheduledActionComponentMap
                ];
            if (ActionComponent) {
                return (
                    <ActionComponent
                        item={item}
                        {...(options as InventoryScheduledHistoryOptions)}
                    />
                );
            }
            break;
        }
        case 'customField': {
            const ActionComponent =
                customFieldActionComponentMap[
                    item.action as keyof typeof customFieldActionComponentMap
                ];
            if (ActionComponent) {
                return <ActionComponent item={item} />;
            }
            break;
        }
        default:
            break;
    }
    return (
        <>
            performed an <i>unknown</i> action
        </>
    );
};

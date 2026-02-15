import { RecordHistory, RecordHistoryActionType } from '@/gql/recordHistoryGql';
import { BAssetStatus } from '@/gql/brandAssetsGql';
import { liveMemoStatusIcons } from '@/pages/brandPages/LiveMemo/components/LiveMemoStatusIndicator/LiveMemoStatusIndicator';
import { cloneElement } from 'react';
import Trash from '@/stadiumDS/foundations/icons/General/Trash';
import Paperclip from '@/stadiumDS/foundations/icons/General/Paperclip';
import { Avatar } from '@/components/UserInfo';
import colors from '@/stadiumDS/foundations/colors';
import { priorityIcons } from '@/stadiumDS/applicationComponents/assetForm/Content/TaskPriorityIconMenu';
import { BAssetTaskPriorities } from '@/gql/bAssetTasksGql';
import Flag from '@/stadiumDS/foundations/icons/Maps/Flag';
import FileCheck from '@/stadiumDS/foundations/icons/Files/FileCheck';
import { AgreementInventoryStatusMap } from '@/pages/propertyPages/Tasks/AssetOverview/AssetOverview.columns';
import Calendar from '@/stadiumDS/foundations/icons/Time/Calendar';
import UserCircle from '@/stadiumDS/foundations/icons/Users/UserCircle';

type IconMapType = Partial<
    Record<
        RecordHistoryActionType,
        React.ComponentType<{ item: RecordHistory }>
    >
>;

const iconComponentMap: IconMapType = {
    // Asset fields
    [RecordHistoryActionType.B_ASSET_ARCHIVED]: () => (
        <Trash size="16" variant="3" color={colors.Gray[600]} />
    ),
    [RecordHistoryActionType.B_ASSET_STATUS]: ({ item }) =>
        cloneElement(
            liveMemoStatusIcons[item.action_value as BAssetStatus]?.component,
            {
                size: '16',
            }
        ),
    [RecordHistoryActionType.B_ASSET_FILE_UPLOADED]: () => (
        <Paperclip size="16" color={colors.Gray[600]} />
    ),
    [RecordHistoryActionType.B_ASSET_FILE_DELETED]: () => (
        <Paperclip size="16" color={colors.Gray[600]} />
    ),

    // Task fields
    [RecordHistoryActionType.B_ASSET_TASK_ARCHIVED]: () => (
        <Trash size="16" variant="3" color={colors.Gray[600]} />
    ),
    [RecordHistoryActionType.B_ASSET_TASK_PRIORITY]: ({ item }) =>
        cloneElement(
            priorityIcons[item.action_value as BAssetTaskPriorities]
                ?.component ?? (
                <Flag color={colors.Gray[400]} size={'16'} variant={'2'} />
            ),
            {
                size: '16',
            }
        ),
    [RecordHistoryActionType.B_ASSET_TASK_DELETED]: () => (
        <Trash size="16" variant="3" color={colors.Gray[600]} />
    ),
    [RecordHistoryActionType.B_ASSET_TASK_STATUS]: ({ item }) =>
        cloneElement(
            liveMemoStatusIcons[item.action_value as BAssetStatus]?.component,
            {
                size: '16',
            }
        ),
    [RecordHistoryActionType.B_ASSETS_FULFILLED]: () => (
        <FileCheck variant="2" size="16" color={colors.Gray[600]} />
    ),
    [RecordHistoryActionType.B_ASSETS_REMOVE_FULFILLED]: () => (
        <FileCheck variant="2" size="16" color={colors.Gray[600]} />
    ),
    [RecordHistoryActionType.INVENTORY_SCHEDULED_STATUS_UPDATED]: ({
        item,
    }) => {
        const statusIcon =
            AgreementInventoryStatusMap[
                item.action_value as keyof typeof AgreementInventoryStatusMap
            ]?.icon;

        if (!statusIcon) {
            return undefined;
        }

        return cloneElement(statusIcon, {
            size: '16',
        });
    },
    [RecordHistoryActionType.INVENTORY_SCHEDULED_DUE_DATE_UPDATED]: () => (
        <Calendar size="16" color={colors.Gray[600]} />
    ),
    [RecordHistoryActionType.INVENTORY_SCHEDULED_ASSIGNEE_ADDED]: () => (
        <UserCircle size="16" color={colors.Gray[600]} />
    ),
    [RecordHistoryActionType.INVENTORY_SCHEDULED_ASSIGNEE_REMOVED]: () => (
        <UserCircle size="16" color={colors.Gray[600]} />
    ),
};

export interface HistoryIconProps {
    item: RecordHistory;
}

export const HistoryIcon = ({ item }: HistoryIconProps) => {
    const IconComponent = iconComponentMap[item.action];
    if (!IconComponent)
        return <Avatar size={16} user={item.user} removeMargin />;

    return <IconComponent item={item} />;
};

import { CustomField } from '@/gql/customFieldGql';
import { RecordHistory } from '@/gql/recordHistoryGql';
import { User } from '@/gql/types';
import { DropdownOptionType } from '@/hooks/useAccountOptions';
import { BrandPropertyOption } from '@/hooks/useBrandPropertyOptions';

export interface RecordHistoryGroup {
    items: RecordHistory[];
    user: User;
    userName: string;
    durationSeconds: number;
}

export interface PropertyGenericTaskHistoryOptions {
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

export interface BrandAssetHistoryOptions {
    userOptions: DropdownOptionType[];
    propertyOptions: BrandPropertyOption[];
    typeOptions: {
        key: string;
        text: string;
        value: string;
    }[];
    customFieldOptions: CustomField[];
}

export interface InventoryScheduledHistoryOptions {
    userOptions: DropdownOptionType[];
}

export enum HistoryType {
    BRAND_ASSET = 'brandAsset',
    PROPERTY_GENERIC_TASK = 'propertyGenericTask',
    INVENTORY_SCHEDULED = 'inventoryScheduled',
    CUSTOM_FIELD = 'customField',
}

export type HistoryActionType =
    | {
          type: HistoryType.BRAND_ASSET;
          options: BrandAssetHistoryOptions;
      }
    | {
          type: HistoryType.PROPERTY_GENERIC_TASK;
          options: PropertyGenericTaskHistoryOptions;
      }
    | {
          type: HistoryType.INVENTORY_SCHEDULED;
          options: InventoryScheduledHistoryOptions;
      }
    | {
          type: HistoryType.CUSTOM_FIELD;
          options: never;
      };

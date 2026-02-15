import colors from '@/stadiumDS/foundations/colors';
import { Item } from '@/stadiumDS/sharedComponents/menu/SelectMenu';
import { ReactNode } from 'react';

export enum SidePanelFieldTypes {
    TEXT = 'text',
    NUMBER = 'number',
    BOOLEAN = 'boolean',
    SELECT = 'select',
    MULTI_SELECT = 'multi-select',
    DATE = 'date',
    FILE = 'file',
    LINK = 'link',
    USER_MULTI_SELECT = 'user-multi-select',
    READ_ONLY = 'read-only',
    READ_ONLY_LINK = 'read-only-link',
}

type BaseFieldProps = {
    label: string;
    disabled?: boolean;
    required?: boolean;
    highlightRequiredFields?: boolean;
};

export type TextFieldProps = BaseFieldProps & {
    type: SidePanelFieldTypes.TEXT;
    value?: string | null;
    onChange: (value: string) => void;
    rightSection?: ReactNode;
    paddingRight?: string;
};

export type NumberFieldProps = BaseFieldProps & {
    type: SidePanelFieldTypes.NUMBER;
    value?: number | null;
    onChange: (value: number | null) => void;
    prefix?: string;
    suffix?: string;
};

export type BooleanFieldProps = BaseFieldProps & {
    type: SidePanelFieldTypes.BOOLEAN;
    value?: boolean | null;
    onChange: (value: boolean | null) => void;
    allowDeselect?: boolean;
};

export type SelectFieldProps = BaseFieldProps & {
    type: SidePanelFieldTypes.SELECT;
    value?: string | null;
    options: Omit<Item, 'onClick'>[];
    onChange: (value: string | null) => void;
    allowDeselect?: boolean;
    icon?: ReactNode;
};

export type MultiSelectFieldProps = BaseFieldProps & {
    type: SidePanelFieldTypes.MULTI_SELECT;
    value?: string[] | null;
    options: Omit<Item, 'onClick'>[];
    onChange: (value: string[]) => void;
    icon?: ReactNode;
};

export type DateFieldProps = BaseFieldProps & {
    type: SidePanelFieldTypes.DATE;
    value?: string | null;
    onChange: (value: string | null) => void;
    overdue?: boolean;
};

export type FileFieldProps = BaseFieldProps & {
    type: SidePanelFieldTypes.FILE;
    value?: string | null;
    onChange: (value: string | null) => void;
    allowDeselect?: boolean;
};

export type LinkFieldProps = BaseFieldProps & {
    type: SidePanelFieldTypes.LINK;
    value?: string | null;
    onChange: (value: string) => void;
};

export type UserMultiSelectFieldProps = BaseFieldProps & {
    type: SidePanelFieldTypes.USER_MULTI_SELECT;
    value?: string[] | null;
    onChange: (value: string[]) => void;
    options?: Omit<Item, 'onClick'>[];
};

export type ReadOnlyFieldProps = BaseFieldProps & {
    type: SidePanelFieldTypes.READ_ONLY;
    value: string;
    icon?: ReactNode;
    onClick?: () => void;
};

export type ReadOnlyLinkFieldProps = BaseFieldProps & {
    type: SidePanelFieldTypes.READ_ONLY_LINK;
    value: string;
    to: string;
    icon?: ReactNode;
};

export type SidePanelFieldProps =
    | TextFieldProps
    | NumberFieldProps
    | BooleanFieldProps
    | SelectFieldProps
    | MultiSelectFieldProps
    | DateFieldProps
    | FileFieldProps
    | LinkFieldProps
    | UserMultiSelectFieldProps
    | ReadOnlyFieldProps
    | ReadOnlyLinkFieldProps;

export const sidePanelFieldPlaceholderColor = colors.Gray[500];

export const sidePanelInputFieldStyles = {
    input: {
        fontSize: 12,
        lineHeight: 16,
        height: 32,
    },
};

export const sidePanelLabelIconSize = 20;

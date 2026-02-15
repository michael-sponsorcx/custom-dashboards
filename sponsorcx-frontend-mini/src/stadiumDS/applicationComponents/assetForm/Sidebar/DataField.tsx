import * as S from './DataFields.styles';
import { Text } from '@mantine/core';
import { primaryColors } from '@/stadiumDS/foundations/colors/primary';
import Chevron from '@/stadiumDS/foundations/icons/Arrows/Chevron';
import CalendarDate from '@/stadiumDS/foundations/icons/Time/CalendarDate';
import Hash from '@/stadiumDS/foundations/icons/General/Hash';
import Percent from '@/stadiumDS/foundations/icons/General/Percent';
import TextInput from '@/stadiumDS/foundations/icons/Editor/TextInput';
import { CustomField, ValueType } from '@/gql/customFieldGql';
import Paperclip from '@/stadiumDS/foundations/icons/General/Paperclip';
import Check from '@/stadiumDS/foundations/icons/General/Check';
import { StadiumRequiredIndicator } from '@/stadiumDS/sharedComponents/RequiredIndicator/StadiumRequiredIndicator';
import Circle from '@/stadiumDS/foundations/icons/Shapes/Circle';
import {
    DataFieldInputsBoolean,
    DataFieldInputsDate,
    DataFieldInputsNumber,
    DataFieldInputsPercentage,
    DataFieldInputsString,
    DataFieldInputsSelect,
    DataFieldInputsCurrency,
} from './DataFieldInputs';
import { AssetTextTruncate } from '../components/AssetTextTruncate';
import Currency from '@/stadiumDS/foundations/icons/Finance/Currency';
import Users from '@/stadiumDS/foundations/icons/Users/Users';
import Link from '@/stadiumDS/foundations/icons/General/Link';

const FieldIcons: Record<ValueType | 'currency', React.ReactNode> = {
    select: (
        <Chevron
            color={primaryColors.Gray[500]}
            size="20"
            variant="selector-vertical"
        />
    ),
    date: <CalendarDate color={primaryColors.Gray[500]} size="20" />,
    number: <Hash variant="2" color={primaryColors.Gray[500]} size="20" />,
    percentage: (
        <Percent variant="2" color={primaryColors.Gray[500]} size="20" />
    ),
    string: <TextInput color={primaryColors.Gray[500]} size="20" />,
    boolean: (
        <Check
            color={primaryColors.Gray[500]}
            size="20"
            variant="square-broken"
        />
    ),
    hyperlink: <Link color={primaryColors.Gray[500]} size="20" variant="1" />,
    file: <Paperclip color={primaryColors.Gray[500]} size="20" />,
    'multi-select': (
        <Chevron
            color={primaryColors.Gray[500]}
            size="20"
            variant="selector-vertical"
        />
    ),
    relationship: (
        <Link color={primaryColors.Gray[500]} size="20" variant="1" />
    ),
    'user-list': (
        <Users color={primaryColors.Gray[500]} size="20" variant="1" />
    ),
    'rich-text': <TextInput color={primaryColors.Gray[500]} size="20" />,
    currency: (
        <Currency variant="dollar" color={primaryColors.Gray[500]} size="20" />
    ),
};

type InputValueType = Exclude<
    ValueType,
    'file' | 'multi-select' | 'relationship' | 'user-list' | 'currency'
>;

const isInputValueType = (
    type: ValueType | 'currency'
): type is InputValueType => {
    return [
        'select',
        'string',
        'number',
        'boolean',
        'date',
        'percentage',
        'rich-text',
        'hyperlink',
        'currency',
    ].includes(type);
};

const FieldInput: Record<
    InputValueType | 'currency',
    (props: DataFieldProps) => React.ReactNode
> = {
    select: DataFieldInputsSelect,
    string: DataFieldInputsString,
    number: DataFieldInputsNumber,
    boolean: DataFieldInputsBoolean,
    date: DataFieldInputsDate,
    percentage: DataFieldInputsPercentage,
    'rich-text': DataFieldInputsString,
    currency: DataFieldInputsCurrency,
    hyperlink: DataFieldInputsString,
};

export interface DataFieldProps {
    customField: Omit<CustomField, 'value_type'> & {
        value_type: ValueType | 'currency';
    };
    onDataFieldUpdate: (
        field: Omit<CustomField, 'value_type'> & {
            value_type: ValueType | 'currency';
        },
        value?: string | number | boolean
    ) => void;
    selectOptions?: { value: string; label: string }[];
    required?: boolean;
    highlight?: boolean;
    value?: unknown;
    disabled?: boolean;
}

export const DataField = ({
    customField,
    required = false,
    onDataFieldUpdate,
    highlight,
    value,
    selectOptions,
    disabled = false,
}: DataFieldProps) => {
    const { label, value_type } = customField;
    const fieldInput = isInputValueType(value_type)
        ? FieldInput[value_type]
        : () => (
              <Text
                  truncate
                  style={{
                      color: primaryColors.Gray[500],
                      fontSize: '14px',
                      lineHeight: '20px',
                      fontWeight: 400,
                  }}
              >
                  {value ? String(value) : ''}
              </Text>
          );

    return (
        <S.Field>
            <S.FieldLabel $highlight={highlight}>
                {FieldIcons[value_type] || (
                    <Circle color={primaryColors.Gray[500]} size="20" />
                )}
                <AssetTextTruncate text={label} />
                {required && <StadiumRequiredIndicator />}
            </S.FieldLabel>
            <S.FieldValue>
                {fieldInput({
                    customField,
                    onDataFieldUpdate,
                    value,
                    selectOptions,
                    required,
                    disabled,
                })}
            </S.FieldValue>
        </S.Field>
    );
};

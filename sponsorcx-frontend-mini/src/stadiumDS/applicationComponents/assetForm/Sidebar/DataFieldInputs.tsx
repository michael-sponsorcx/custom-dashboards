import { DataFieldProps } from './DataField';
import { AssetCombobox } from '../components/AssetCombobox';
import { AssetTextInput } from '../components/AssetTextInput';
import { AssetNumberInput } from '../components/AssetNumberInput';
import { AssetSwitch } from '../components/AssetSwitch';
import { AssetDateInput } from '../components/AssetDateInput';
import * as SidebarStyles from './Sidebar.styles';
import { AssetTextTruncate } from '../components/AssetTextTruncate';

export const DataFieldInputsSelect = ({
    customField,
    onDataFieldUpdate,
    value,
    selectOptions,
    required = false,
    disabled,
}: DataFieldProps) => {
    const options =
        selectOptions ??
        customField.options?.map((option) => ({
            value: option,
            label: option,
        })) ??
        [];

    const unselectOption = {
        value: 'unselect',
        label: 'Unselect',
    };

    return (
        <AssetCombobox
            options={required ? options : [unselectOption, ...options]}
            onUpdate={(value) => {
                const valueToUpdate = value === 'unselect' ? null : value;
                onDataFieldUpdate(
                    customField,
                    valueToUpdate ? String(valueToUpdate) : undefined
                );
            }}
            value={value as string | null}
            disabled={disabled}
            renderOption={({ option, isTargetOption }) => (
                <SidebarStyles.OptionWrapper $isSelected={isTargetOption}>
                    {option.value === 'unselect' ? (
                        <SidebarStyles.OptionUnselect>
                            {option.label}
                        </SidebarStyles.OptionUnselect>
                    ) : (
                        <AssetTextTruncate text={option.label} />
                    )}
                </SidebarStyles.OptionWrapper>
            )}
        />
    );
};

export const DataFieldInputsString = ({
    value,
    onDataFieldUpdate,
    customField,
    disabled,
}: DataFieldProps) => {
    return (
        <AssetTextInput
            placeholder={customField.label}
            value={value ? String(value) : undefined}
            onChange={(newValue) =>
                onDataFieldUpdate(customField, newValue || undefined)
            }
            disabled={disabled}
        />
    );
};

export const DataFieldInputsNumber = ({
    value,
    onDataFieldUpdate,
    customField,
    disabled,
}: DataFieldProps) => (
    <AssetNumberInput
        placeholder={customField.label}
        value={value as string}
        onChange={(val) =>
            onDataFieldUpdate(
                customField,
                val === '' ? undefined : (val as string)
            )
        }
        disabled={disabled}
    />
);

export const DataFieldInputsBoolean = ({
    value,
    onDataFieldUpdate,
    customField,
    disabled,
}: DataFieldProps) => (
    <AssetSwitch
        checked={value as boolean}
        onChange={(event) =>
            onDataFieldUpdate(
                customField,
                event.target.checked ? true : undefined
            )
        }
        disabled={disabled}
    />
);

export const DataFieldInputsDate = ({
    value,
    onDataFieldUpdate,
    customField,
    required = false,
    disabled,
}: DataFieldProps) => (
    <AssetDateInput
        value={value as string}
        onChange={(date) => {
            onDataFieldUpdate(customField, date ? date : undefined);
        }}
        clearable={!required && !disabled}
        disabled={disabled}
    />
);

export const DataFieldInputsPercentage = ({
    value,
    onDataFieldUpdate,
    customField,
    disabled,
}: DataFieldProps) => (
    <AssetNumberInput
        placeholder={customField.label}
        value={value as string}
        onChange={(data) =>
            onDataFieldUpdate(
                customField,
                data === '' ? undefined : String(data)
            )
        }
        allowNegative={false}
        clampBehavior="strict"
        min={0}
        max={100}
        suffix="%"
        disabled={disabled}
    />
);

export const DataFieldInputsCurrency = ({
    value,
    onDataFieldUpdate,
    customField,
    disabled,
}: DataFieldProps) => {
    return (
        <AssetNumberInput
            placeholder={customField.label}
            value={value as string}
            onChange={(data) => {
                // Remove any non-numeric characters
                const dataString = data.toString().replace(/[^0-9]/g, '');
                onDataFieldUpdate(customField, Number(dataString));
            }}
            allowNegative={false}
            clampBehavior="strict"
            min={0}
            prefix="$"
            thousandSeparator=","
            decimalSeparator="."
            decimalScale={0}
            fixedDecimalScale
            disabled={disabled}
        />
    );
};

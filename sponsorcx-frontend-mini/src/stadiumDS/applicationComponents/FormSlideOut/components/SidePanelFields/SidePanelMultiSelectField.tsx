import { Group } from '@mantine/core';
import { SidePanelFieldLabel } from './SidePanelFieldLabel';
import { MultiSelectFieldProps } from './SidePanelFields.types';
import { SelectMenu } from '@/stadiumDS/sharedComponents/menu/SelectMenu';
import { SidePanelAddFieldButton } from './SidePanelAddFieldButton';
import { StadiumTag } from '@/stadiumDS/sharedComponents/StadiumTag';
import { useState } from 'react';
import { SidePanelFieldContainer } from './SidePanelFieldContainer';

export const SidePanelMultiSelectField = ({
    value,
    onChange,
    label,
    disabled,
    required,
    options,
    icon,
    highlightRequiredFields,
}: Omit<MultiSelectFieldProps, 'type'>) => {
    const safeValue: string[] = value && Array.isArray(value) ? value : [];

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const MenuAndTrigger = disabled ? null : (
        <SelectMenu
            trigger={<SidePanelAddFieldButton />}
            items={options.map((option) => ({
                ...option,
                onClick: () => {
                    safeValue.includes(option.value)
                        ? onChange(safeValue.filter((v) => v !== option.value))
                        : onChange([...safeValue, option.value]);
                },
            }))}
            value={safeValue}
            multiple
            opened={isMenuOpen}
            onChange={setIsMenuOpen}
            searchable
        />
    );

    const SelectedItems =
        safeValue
            .map((v) => options.find((o) => o.value === v))
            .filter((o) => o !== undefined) ?? [];

    return (
        <SidePanelFieldContainer
            groupedChildren={
                <>
                    <SidePanelFieldLabel
                        label={label}
                        required={required}
                        icon={icon}
                        highlight={
                            required &&
                            !safeValue.length &&
                            highlightRequiredFields
                        }
                    />
                    {SelectedItems.length ? null : MenuAndTrigger}
                </>
            }
            stackedChildren={
                SelectedItems.length ? (
                    <Group style={{ gap: '4px' }}>
                        {SelectedItems.map((item) => (
                            <StadiumTag
                                key={item.value}
                                label={item.label}
                                size="lg"
                            />
                        ))}
                        {MenuAndTrigger}
                    </Group>
                ) : null
            }
        />
    );
};

import { primaryColors } from '@/stadiumDS/foundations/colors/primary';
import {
    CloseButton,
    Combobox,
    ComboboxProps,
    InputBase,
    InputBaseProps,
    ScrollArea,
    useCombobox,
} from '@mantine/core';
import { useRef, useState } from 'react';
import PlusCircle from '@/stadiumDS/foundations/icons/General/PlusCircle';
import Search from '@/stadiumDS/foundations/icons/General/Search';
import React from 'react';
import classes from './StadiumCombobox.module.css';

export interface StadiumComboboxOption {
    value: string | number;
    label: string;
}

export interface StadiumComboboxProps<T extends StadiumComboboxOption> {
    options: T[];
    onUpdate: (value: string | number | null) => void;
    value?: string | number | null;
    zIndex?: number;
    withinPortal?: boolean;
    clearable?: boolean;
    renderOption?: React.ComponentType<{
        option: T;
        isSelected: boolean;
        isTargetOption: boolean;
    }>;
    classNames?: ComboboxProps['classNames'];
    inputClassNames?: InputBaseProps['classNames'];
    searchable?: boolean;
    width?: number;
    disabled?: boolean;
}

export const StadiumCombobox = <T extends StadiumComboboxOption>({
    options,
    onUpdate,
    value,
    zIndex,
    withinPortal = false,
    clearable = false,
    renderOption,
    classNames,
    inputClassNames,
    searchable = true,
    width = 189,
    disabled = false,
}: StadiumComboboxProps<T>) => {
    const viewportRef = useRef<HTMLDivElement>(null);
    const selectedOptionRef = useRef<HTMLDivElement>(null);

    const [search, setSearch] = useState('');
    const combobox = useCombobox({
        onDropdownClose: () => {
            combobox.resetSelectedOption();
            combobox.focusTarget();
            setSearch('');
        },
        onDropdownOpen: () => {
            combobox.focusSearchInput();
            setTimeout(() => {
                if (selectedOptionRef.current && viewportRef.current) {
                    selectedOptionRef.current.scrollIntoView({
                        behavior: 'auto',
                        block: 'center',
                    });
                }
            }, 1);
        },
    });

    const currentOption = options.find((option) => option.value === value);

    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(search.toLowerCase())
    );

    const renderedOptions = filteredOptions.map((option) => (
        <Combobox.Option
            key={option.value}
            value={option.value.toString()}
            ref={option.value === value ? selectedOptionRef : undefined}
            styles={{
                option: {
                    backgroundColor:
                        option.value === value
                            ? primaryColors.Gray[100]
                            : 'transparent',
                },
            }}
        >
            {renderOption
                ? React.createElement(renderOption, {
                      option,
                      isSelected: option.value === value,
                      isTargetOption: false,
                  })
                : option.label}
        </Combobox.Option>
    ));

    return (
        <Combobox
            width={width}
            position="bottom-start"
            zIndex={zIndex}
            withinPortal={withinPortal}
            store={combobox}
            onOptionSubmit={(val) => {
                if (val !== value) {
                    onUpdate(val);
                }
                combobox.closeDropdown();
            }}
            classNames={classNames}
        >
            <Combobox.Target>
                <InputBase
                    component="button"
                    type="button"
                    pointer
                    disabled={disabled}
                    onClick={() => combobox.toggleDropdown()}
                    rightSection={
                        clearable &&
                        value && (
                            <CloseButton
                                size="sm"
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => onUpdate(null)}
                                aria-label="Clear value"
                            />
                        )
                    }
                    rightSectionPointerEvents={
                        clearable && value === null ? 'none' : 'all'
                    }
                    classNames={{
                        root: classes.inputRoot,
                        input: classes.input,
                        ...inputClassNames,
                    }}
                >
                    {currentOption ? (
                        renderOption ? (
                            React.createElement(renderOption, {
                                option: currentOption,
                                isSelected: true,
                                isTargetOption: true,
                            })
                        ) : (
                            currentOption.label
                        )
                    ) : (
                        <PlusCircle
                            size={'20'}
                            color={primaryColors.Gray[300]}
                        />
                    )}
                </InputBase>
            </Combobox.Target>

            <Combobox.Dropdown>
                {searchable && (
                    <Combobox.Search
                        leftSection={
                            <Search
                                size={'16'}
                                variant="sm"
                                color={primaryColors.Gray[600]}
                            />
                        }
                        value={search}
                        onChange={(event) =>
                            setSearch(event.currentTarget.value)
                        }
                        placeholder="Search"
                        rightSection={
                            search && (
                                <CloseButton
                                    size="xs"
                                    onMouseDown={(event) =>
                                        event.preventDefault()
                                    }
                                    onClick={() => setSearch('')}
                                />
                            )
                        }
                        rightSectionPointerEvents={search ? 'all' : 'none'}
                    />
                )}
                <ScrollArea.Autosize
                    mah={300}
                    maw={400}
                    mx="auto"
                    ref={viewportRef}
                >
                    {renderedOptions.length ? (
                        renderedOptions
                    ) : (
                        <Combobox.Empty>Nothing found</Combobox.Empty>
                    )}
                </ScrollArea.Autosize>
            </Combobox.Dropdown>
        </Combobox>
    );
};

export default StadiumCombobox;

import {
    StadiumCombobox,
    StadiumComboboxOption,
    StadiumComboboxProps,
} from '@/stadiumDS/sharedComponents/dropdowns/StadiumCombobox';
import classes from './AssetCombobox.module.css';

export type AssetComboboxProps<T extends StadiumComboboxOption> =
    StadiumComboboxProps<T>;

export const AssetCombobox = <T extends StadiumComboboxOption>({
    classNames,
    inputClassNames,
    ...props
}: AssetComboboxProps<T>) => {
    return (
        <StadiumCombobox
            classNames={{
                dropdown: classes.dropdown,
                search: classes.search,
                options: classes.options,
                option: classes.option,
                ...classNames,
            }}
            inputClassNames={{
                input: classes.input,
                root: classes.inputRoot,
                ...inputClassNames,
            }}
            {...props}
        />
    );
};

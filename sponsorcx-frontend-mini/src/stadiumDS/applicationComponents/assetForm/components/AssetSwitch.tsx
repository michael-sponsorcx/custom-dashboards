import { SwitchProps, Switch } from '@mantine/core';

export type AssetSwitchProps = SwitchProps;

export const AssetSwitch = ({ styles, ...props }: AssetSwitchProps) => {
    return (
        <Switch
            styles={{
                root: {
                    padding: '0 10.5px',
                },
                ...styles,
            }}
            size="md"
            {...props}
        />
    );
};

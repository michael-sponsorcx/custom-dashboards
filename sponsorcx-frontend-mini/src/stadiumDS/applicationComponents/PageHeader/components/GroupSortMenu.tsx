import colors from '@/stadiumDS/foundations/colors';
import Check from '@/stadiumDS/foundations/icons/General/Check';
import LayersThree from '@/stadiumDS/foundations/icons/Layout/LayersThree';
import { ActionIcon, Menu, Tooltip } from '@mantine/core';

interface GroupSortMenuProps {
    selectedGroupByOption: string;
    groupByOptions: { key: string; label: string }[];
    onGroupBySelect: (key: string) => void;
}

const GroupSortMenu = ({
    selectedGroupByOption,
    groupByOptions,
    onGroupBySelect,
}: GroupSortMenuProps): JSX.Element => {
    return (
        <Menu width={200}>
            <Menu.Target>
                <Tooltip label="Group sorting">
                    <ActionIcon variant="subtle" size="lg">
                        <LayersThree />
                    </ActionIcon>
                </Tooltip>
            </Menu.Target>
            <Menu.Dropdown>
                {groupByOptions.map((option) => (
                    <Menu.Item
                        key={option.key}
                        onClick={() => {
                            onGroupBySelect(option.key);
                        }}
                        rightSection={
                            selectedGroupByOption === option.key ? (
                                <Check color={colors.Brand[400]} size={'20'} />
                            ) : null
                        }
                    >
                        {option.label}
                    </Menu.Item>
                ))}
            </Menu.Dropdown>
        </Menu>
    );
};

export default GroupSortMenu;
